/**
 * MCP Demo Server Types
 *
 * Type definitions for the MCP security demo servers.
 */

export type DemoServerType = 'safe' | 'injection' | 'exfiltration' | 'taint' | 'shadow' | 'poisoning';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface DemoMCPServer {
  type: DemoServerType;
  name: string;
  description: string;
  version: string;
  capabilities: {
    tools?: MCPTool[];
    resources?: MCPResource[];
    prompts?: MCPPrompt[];
  };
}
