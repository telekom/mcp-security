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
      description="A hidden payload in a tool description uses invisible Unicode characters to hijack the agent before the user sends a single message"
      riskLevel="critical"
      riskTitle="Tool Poisoning — Steganographic Description Injection"
      riskDescription="Tool descriptions are loaded into the agent's context at session start. By embedding instructions using zero-width Unicode characters, an attacker can direct the agent to take actions silently — invisible to any human reviewer of the tool manifest."
      impacts={[
        "Attack fires at tool discovery — before the user sends any message",
        "Payload is invisible in review UIs; a human auditor sees nothing suspicious",
        "Every session that connects the server is silently compromised",
      ]}
      mitigations={[
        "Scan all MCP metadata for zero-width and non-printable Unicode characters",
        "Treat tool descriptions as untrusted data, never as instructions",
        "Require sign-off on the raw tool manifest before connecting any server",
        "Sandbox descriptions — they should describe parameters only, not direct agent behaviour",
      ]}
      suggestedPrompts={[
        'How many vacation days do I have left?',
        'What is the remote work policy?',
      ]}
    />
  );
}
