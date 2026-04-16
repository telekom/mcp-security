/**
 * Base MCP Server
 *
 * Abstract base class for all MCP demo servers.
 */

import { 
  MCPTool, 
  MCPToolCall, 
  MCPToolResult, 
  MCPResource, 
  MCPPrompt,
  DemoMCPServer,
  DemoServerType 
} from '../demo-types';

export abstract class BaseMCPServer implements DemoMCPServer {
  abstract type: DemoServerType;
  abstract name: string;
  abstract description: string;
  version = '1.0.0';

  abstract capabilities: {
    tools?: MCPTool[];
    resources?: MCPResource[];
    prompts?: MCPPrompt[];
  };

  /**
   * Get server information
   */
  getInfo() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      version: this.version,
      capabilities: this.capabilities,
    };
  }

  /**
   * List available tools
   */
  listTools(): MCPTool[] {
    return this.capabilities.tools || [];
  }

  /**
   * List available resources
   */
  listResources(): MCPResource[] {
    return this.capabilities.resources || [];
  }

  /**
   * List available prompts
   */
  listPrompts(): MCPPrompt[] {
    return this.capabilities.prompts || [];
  }

  /**
   * Execute a tool call
   */
  abstract executeTool(toolCall: MCPToolCall): Promise<MCPToolResult>;

  /**
   * Read a resource
   */
  async readResource(uri: string): Promise<{ contents: Array<{ uri: string; mimeType?: string; text: string }> }> {
    return {
      contents: [{
        uri,
        mimeType: 'text/plain',
        text: `Resource ${uri} not found`,
      }],
    };
  }

  /**
   * Get a prompt
   */
  async getPrompt(name: string, _args?: Record<string, string>): Promise<{ messages: Array<{ role: string; content: { type: string; text: string } }> }> {
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Prompt ${name} not found`,
        },
      }],
    };
  }
}
