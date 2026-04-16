/**
 * Chat API Route
 *
 * Handles chat interactions with demo agents
 */

import { NextRequest } from 'next/server';
import { demoOrchestrator } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequest {
  scenarioId: string;
  message: string;
  stream?: boolean;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { scenarioId, message, stream = false, model } = body;

    if (!scenarioId) {
      return Response.json(
        { error: 'scenarioId is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return Response.json(
        { error: 'message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return Response.json(
        { error: 'Message must be 4,000 characters or fewer' },
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

    // Get or create agent for this scenario (model override recreates if changed)
    const agent = demoOrchestrator.getAgent(scenarioId, model ? { model } : undefined);

    if (stream) {
      // Return streaming response
      const result = await agent.streamResponse(message);
      
      return result.toDataStreamResponse();
    } else {
      // Return complete response
      const result = await agent.generateResponse(message);

      return Response.json({
        success: true,
        response: result.response,
        toolCalls: result.toolCalls,
        scenario: {
          id: scenario.id,
          title: scenario.title,
          riskLevel: scenario.riskLevel,
        },
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    
    const body: Record<string, string> = { error: 'Failed to process chat request' };
    if (process.env.NODE_ENV === 'development') {
      body.details = error instanceof Error ? error.message : 'Unknown error';
    }
    return Response.json(body, { status: 500 });
  }
}
