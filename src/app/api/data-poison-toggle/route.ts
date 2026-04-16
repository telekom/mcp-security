/**
 * Data Poison Toggle API Route
 *
 * Activates or deactivates the data poisoning attack.
 * When active, get_company_policy('remote_work') returns a document
 * containing a hidden policy addendum that manipulates agent responses.
 */

import { dataPoisoningMCPServer } from '@/lib/mcp/servers/poisoning-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body === null || typeof body.active !== 'boolean') {
    return Response.json({ error: 'Body must be { active: boolean }' }, { status: 400 });
  }

  dataPoisoningMCPServer.poisoningActive = body.active;
  return Response.json({ success: true, active: dataPoisoningMCPServer.poisoningActive });
}
