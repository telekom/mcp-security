/**
 * MCP Demo Servers
 *
 * Export all MCP security demo servers
 */

export { BaseMCPServer } from './base-server';
export { SafeMCPServer, safeMCPServer } from './safe-server';
export { PromptInjectionMCPServer, promptInjectionMCPServer } from './injection-server';
export { ExfiltrationMCPServer, exfiltrationMCPServer } from './exfiltration-server';
export { ToolShadowingMCPServer, toolShadowingMCPServer } from './shadow-server';
export { DataPoisoningMCPServer, dataPoisoningMCPServer } from './poisoning-server';
export { TaintMCPServer, taintMCPServer } from './taint-server';

export type { 
  DemoServerType,
  MCPTool,
  MCPToolCall,
  MCPToolResult,
  MCPResource,
  MCPPrompt,
  DemoMCPServer,
} from '../demo-types';

import { safeMCPServer } from './safe-server';
import { promptInjectionMCPServer } from './injection-server';
import { exfiltrationMCPServer } from './exfiltration-server';
import { toolShadowingMCPServer } from './shadow-server';
import { dataPoisoningMCPServer } from './poisoning-server';
import { taintMCPServer } from './taint-server';
import { DemoServerType } from '../demo-types';
import { BaseMCPServer } from './base-server';

/**
 * Get a demo server instance by type
 */
export function getDemoServer(type: DemoServerType): BaseMCPServer {
  switch (type) {
    case 'safe':
      return safeMCPServer;
    case 'injection':
      return promptInjectionMCPServer;
    case 'exfiltration':
      return exfiltrationMCPServer;
    case 'shadow':
      return toolShadowingMCPServer;
    case 'poisoning':
      return dataPoisoningMCPServer;
    case 'taint':
      return taintMCPServer;
    default:
      throw new Error(`Unknown server type: ${type}`);
  }
}

/**
 * Get all available demo servers
 */
export function getAllDemoServers(): BaseMCPServer[] {
  return [
    safeMCPServer,
    promptInjectionMCPServer,
    exfiltrationMCPServer,
    toolShadowingMCPServer,
    dataPoisoningMCPServer,
    taintMCPServer,
  ];
}
