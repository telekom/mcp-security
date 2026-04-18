/**
 * Demo Agent with MCP Integration
 *
 * An AI agent that can interact with MCP servers to demonstrate
 * security vulnerabilities.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
function modelClient(modelId: string): LanguageModelV1 {
  if (modelId.startsWith('gpt-') || modelId.startsWith('o1') || modelId.startsWith('o3')) {
    return openai(modelId) as unknown as LanguageModelV1;
  }
  if (modelId.startsWith('gemini-')) {
    return google(modelId) as unknown as LanguageModelV1;
  }
  return anthropic(modelId) as unknown as LanguageModelV1;
}
import { generateText, streamText, CoreMessage, CoreTool, jsonSchema, LanguageModelV1 } from 'ai';
import { BaseMCPServer } from '../mcp/servers/base-server';
import { getDemoServer } from '../mcp/servers';
import { DemoServerType } from '../mcp/demo-types';

export interface DemoAgentConfig {
  model?: string;
  systemPrompt?: string;
  serverTypes: DemoServerType[];
  temperature?: number;
  maxTokens?: number;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: string;
  }>;
}

/**
 * Produce a stable cache key from a tool name and its arguments.
 * Object keys are sorted so that equivalent calls always match.
 */
function stableCallKey(toolName: string, args: Record<string, any>): string {
  try {
    const sortedArgs = JSON.stringify(args, Object.keys(args).sort());
    return `${toolName}-${sortedArgs}`;
  } catch {
    return `${toolName}-${Date.now()}`;
  }
}

export class DemoAgent {
  private servers: BaseMCPServer[];
  private toolServerMap = new Map<string, BaseMCPServer>();
  private config: Required<DemoAgentConfig>;
  private conversationHistory: CoreMessage[] = [];
  private lastToolResults = new Map<string, string>();
  private cachedTools: Record<string, CoreTool> | null = null;

  constructor(config: DemoAgentConfig) {
    this.config = {
      model: config.model || 'claude-haiku-4-5-20251001',
      systemPrompt: config.systemPrompt || this.getDefaultSystemPrompt(),
      serverTypes: config.serverTypes,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens || 2000,
    };

    this.servers = config.serverTypes.map(getDemoServer);
  }

  private getDefaultSystemPrompt(): string {
    return `You are a helpful AI assistant with access to various tools through an MCP (Model Context Protocol) server.

Your role is to:
1. Help users by using the available tools when appropriate
2. Provide clear and accurate responses
3. Execute tool calls as needed to fulfill user requests
4. Summarize tool results in a user-friendly way

Be proactive in using tools when they can help answer user questions.`;
  }

  /**
   * Convert MCP tools from all connected servers to AI SDK tool format (cached after first call).
   * Tools are routed to the owning server at execution time.
   */
  private getMCPToolsAsAITools(): Record<string, CoreTool> {
    if (this.cachedTools) return this.cachedTools;

    const tools: Record<string, CoreTool> = {};

    for (const server of this.servers) {
      for (const mcpTool of server.listTools()) {
        this.toolServerMap.set(mcpTool.name, server);
        tools[mcpTool.name] = {
          description: mcpTool.description,
          parameters: jsonSchema(mcpTool.inputSchema),
          execute: async (args: Record<string, any>) => {
            const result = await server.executeTool({
              name: mcpTool.name,
              arguments: args,
            });

            const resultText = result.content.map(c => c.text).join('\n');
            this.lastToolResults.set(stableCallKey(mcpTool.name, args), resultText);
            return resultText;
          },
        };
      }
    }

    this.cachedTools = tools;
    return tools;
  }

  /**
   * Prune conversation history to prevent unbounded growth.
   */
  private pruneHistory(maxMessages: number = 20): void {
    if (this.conversationHistory.length > maxMessages) {
      this.conversationHistory = this.conversationHistory.slice(-maxMessages);
    }
  }

  /**
   * Generate a single response (non-streaming)
   */
  async generateResponse(userMessage: string): Promise<{
    response: string;
    toolCalls: Array<{ name: string; arguments: Record<string, any>; result: string }>;
    promptSnapshot: object;
  }> {
    // Clear previous tool results
    this.lastToolResults.clear();

    const tools = this.getMCPToolsAsAITools();

    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    this.pruneHistory();

    const result = await generateText({
      model: modelClient(this.config.model),
      system: this.config.systemPrompt,
      messages: this.conversationHistory,
      tools,
      maxSteps: 5,
      maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
      abortSignal: AbortSignal.timeout(30_000),
    });

    // Build snapshot reflecting the full ping-pong context window:
    // conversationHistory = all prior turns + current user message (sent as initial context)
    // result.response.messages = all assistant/tool-call/tool-result messages generated across all steps
    const promptSnapshot = {
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: this.config.systemPrompt,
      tools: this.getAvailableTools().map(t => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema,
      })),
      messages: [
        ...this.conversationHistory,
        ...result.response.messages,
      ],
    };

    // Collect tool calls from all steps (result.toolCalls only has the last step)
    const toolCalls: Array<{ name: string; arguments: Record<string, any>; result: string; serverName: string }> = [];
    const allToolCalls = result.steps.flatMap(step => step.toolCalls ?? []);

    for (const toolCall of allToolCalls) {
      const callKey = stableCallKey(toolCall.toolName, toolCall.args);
      const toolResult = this.lastToolResults.get(callKey) || '';
      const serverName = this.toolServerMap.get(toolCall.toolName)?.name ?? 'Unknown server';

      toolCalls.push({
        name: toolCall.toolName,
        arguments: toolCall.args,
        result: toolResult,
        serverName,
      });
    }

    // Add assistant's response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: result.text,
    });

    return {
      response: result.text,
      toolCalls,
      promptSnapshot,
    };
  }

  /**
   * Stream a response (for real-time UI updates)
   */
  async streamResponse(userMessage: string) {
    const tools = this.getMCPToolsAsAITools();

    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    this.pruneHistory();

    const result = await streamText({
      model: modelClient(this.config.model),
      system: this.config.systemPrompt,
      messages: this.conversationHistory,
      tools,
      maxSteps: 5,
      maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
      abortSignal: AbortSignal.timeout(30_000),
      onFinish: ({ text }) => {
        this.conversationHistory.push({
          role: 'assistant',
          content: text,
        });
      },
    });

    return result;
  }

  /**
   * Get conversation history
   */
  getHistory(): CoreMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Invalidate the tool cache so the next request rebuilds it from the servers.
   * Does NOT clear conversation history — use when server tool definitions change at runtime.
   */
  resetTools(): void {
    this.cachedTools = null;
    this.toolServerMap.clear();
  }

  getModel(): string {
    return this.config.model;
  }

  /**
   * Get information about all connected MCP servers
   */
  getServerInfos() {
    return this.servers.map(s => s.getInfo());
  }

  /**
   * Get available tools across all connected MCP servers
   */
  getAvailableTools() {
    return this.servers.flatMap(s => s.listTools());
  }
}
