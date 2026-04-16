/**
 * MCP Server Module
 *
 * Central export for MCP demo server functionality.
 */

// Demo types
export type {
  DemoServerType,
  MCPTool,
  MCPToolCall,
  MCPToolResult,
  MCPResource,
  MCPPrompt,
  DemoMCPServer,
} from './demo-types';

// Demo servers
export {
  BaseMCPServer,
  SafeMCPServer,
  safeMCPServer,
  PromptInjectionMCPServer,
  promptInjectionMCPServer,
  ToolShadowingMCPServer,
  toolShadowingMCPServer,
  DataPoisoningMCPServer,
  dataPoisoningMCPServer,
  getDemoServer,
  getAllDemoServers,
} from './servers';
