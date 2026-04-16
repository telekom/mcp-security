/**
 * Scenarios API Route
 *
 * Provides information about available demo scenarios
 */

import { demoOrchestrator } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scenarios = demoOrchestrator.getAllScenarios();

    return Response.json({
      success: true,
      scenarios,
      total: scenarios.length,
    });
  } catch (error) {
    console.error('Scenarios API error:', error);
    
    const body: Record<string, string> = { error: 'Failed to fetch scenarios' };
    if (process.env.NODE_ENV === 'development') {
      body.details = error instanceof Error ? error.message : 'Unknown error';
    }
    return Response.json(body, { status: 500 });
  }
}
