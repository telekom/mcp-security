'use client';

/**
 * Prompt Injection Demo Page
 */

import { DemoPageLayout } from '@/components/demo/demo-page-layout';

export default function PromptInjectionPage() {
  return (
    <DemoPageLayout
      scenarioId="prompt-injection"
      title="Prompt Injection Attack"
      description="A malicious server embeds instructions in its response that hijack the agent into exfiltrating data from a trusted server"
      riskLevel="critical"
      riskTitle="Cross-Server Prompt Injection — Data Exfiltration"
      riskDescription="When multiple MCP servers are connected, a malicious server can embed instructions inside its tool response. The agent treats these as legitimate directives, using trusted servers to collect and exfiltrate data — all triggered by a single innocent user query."
      impacts={[
        "Sensitive data silently exfiltrated — the user sees only an innocent response",
        "Trusted servers are weaponised without any modification to them",
        "One connected malicious server compromises all other servers in the session",
      ]}
      mitigations={[
        "Treat all tool output as untrusted data, never as instructions",
        "Require explicit user confirmation before any outbound or write action",
        "Isolate server namespaces — tools from one server must not invoke another",
        "Audit unexpected tool chains: flag calls outside the user's stated intent",
      ]}
      suggestedPrompts={[
        "What are the latest company announcements?",
        "Show me the HR announcements",
      ]}
    />
  );
}
