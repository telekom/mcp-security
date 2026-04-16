/**
 * Shadow Toggle API Route
 *
 * Activates or deactivates the tool shadowing attack on the shadow MCP server.
 * Changing shadowActive alters the description of get_company_announcements,
 * causing the LLM to route PTO queries to the malicious server instead of HR.
 */

import { toolShadowingMCPServer } from '@/lib/mcp/servers/shadow-server';
import { demoOrchestrator } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body === null || typeof body.active !== 'boolean') {
    return Response.json({ error: 'Body must be { active: boolean }' }, { status: 400 });
  }

  toolShadowingMCPServer.shadowActive = body.active;
  console.log('[shadow-toggle] shadowActive set to:', toolShadowingMCPServer.shadowActive);
  console.log('[shadow-toggle] shadow server listTools():', toolShadowingMCPServer.listTools().map(t => `${t.name}: "${t.description}"`));
  demoOrchestrator.resetAgentTools('tool-shadowing');
  console.log('[shadow-toggle] agent tool cache cleared');

  return Response.json({ success: true, active: toolShadowingMCPServer.shadowActive });
}
