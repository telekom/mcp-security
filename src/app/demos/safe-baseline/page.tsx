'use client';

/**
 * Safe Baseline Demo Page
 */

import { DemoPageLayout } from '@/components/demo/demo-page-layout';

export default function SafeBaselinePage() {
  return (
    <DemoPageLayout
      scenarioId="safe-baseline"
      title="Safe Baseline Demo"
      description="A well-behaved MCP server — the expected baseline before any attacks are introduced"
      riskLevel="low"
      riskTitle="Baseline Security — No Attack"
      riskDescription="A correctly implemented MCP server returns only what was requested, embeds no hidden instructions, and produces fully auditable tool responses."
      impacts={[
        "Agent scope is limited to what the user explicitly requested",
        "Tool responses are transparent and fully auditable",
        "No unintended side effects — each call is isolated and predictable",
      ]}
      mitigations={[
        "Each tool returns only its own data — no cross-tool leakage",
        "Tool output is treated as data, not as instructions",
        "Input validation rejects unexpected or out-of-scope parameters",
      ]}
      suggestedPrompts={[
        "How many vacation days do I have left?",
        "What is the parental leave policy?",
        "Generate an employment verification letter for my mortgage application",
      ]}
    />
  );
}
