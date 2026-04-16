/**
 * Server Info API Route
 *
 * Returns MCP server info (tools, capabilities) for a given scenario
 */

import { demoOrchestrator } from '@/lib/agents';
import { getDemoServer } from '@/lib/mcp/servers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scenarioId = searchParams.get('scenarioId');

  if (!scenarioId) {
    return Response.json({ error: 'scenarioId required' }, { status: 400 });
  }

  const scenario = demoOrchestrator.getScenario(scenarioId);
  if (!scenario) {
    return Response.json({ error: 'Scenario not found' }, { status: 404 });
  }

  const servers = scenario.serverTypes.map(t => getDemoServer(t).getInfo());
  return Response.json({ success: true, servers });
}
