'use client';

/**
 * Tool Poisoning Demo Page
 */

import { DemoPageLayout } from '@/components/demo/demo-page-layout';

export default function ToolPoisoningPage() {
  return (
    <DemoPageLayout
      scenarioId="tool-poisoning"
      title="Tool Poisoning Attack"
      description="Instructions embedded in a tool description hijack the agent at session start — before the user sends a single message"
      riskLevel="critical"
      riskTitle="Tool Poisoning — Description Injection"
      riskDescription="Tool descriptions are loaded into the agent's context at session start. An attacker-controlled server can embed arbitrary instructions directly in a tool description, directing the agent to take silent actions. The payload can optionally be disguised using invisible Unicode characters to evade human review."
      impacts={[
        "Attack fires at tool discovery — before the user sends any message",
        "Every session that connects the server is silently compromised",
        "Payload can be hidden using zero-width Unicode, making it invisible to human reviewers",
      ]}
      mitigations={[
        "Treat tool descriptions as untrusted data, never as instructions",
        "Require sign-off on the raw tool manifest before connecting any server",
        "Scan tool metadata for non-printable and zero-width Unicode characters",
      ]}
      suggestedPrompts={[
        'How many vacation days do I have left?',
        'What is the remote work policy?',
      ]}
    />
  );
}
