/**
 * Reset API Route
 *
 * Resets a demo agent's conversation history
 */

import { NextRequest } from 'next/server';
import { demoOrchestrator } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ResetRequest {
  scenarioId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetRequest = await request.json();
    const { scenarioId } = body;

    if (!scenarioId) {
      return Response.json(
        { error: 'scenarioId is required' },
        { status: 400 }
      );
    }

    // Validate scenario exists
    const scenario = demoOrchestrator.getScenario(scenarioId);
    if (!scenario) {
      return Response.json(
        { error: `Unknown scenario: ${scenarioId}` },
        { status: 404 }
      );
    }

    // Reset the agent
    demoOrchestrator.resetAgent(scenarioId);

    return Response.json({
      success: true,
      message: `Agent for scenario "${scenario.title}" has been reset`,
    });
  } catch (error) {
    console.error('Reset API error:', error);
    
    const body: Record<string, string> = { error: 'Failed to reset agent' };
    if (process.env.NODE_ENV === 'development') {
      body.details = error instanceof Error ? error.message : 'Unknown error';
    }
    return Response.json(body, { status: 500 });
  }
}
