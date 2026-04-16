'use client';

/**
 * Data Poisoning Demo Page
 */

import React, { useState } from 'react';
import { DemoPageLayout } from '@/components/demo/demo-page-layout';
import { Button } from '@/components/ui';
import { FlaskConical, ShieldCheck } from 'lucide-react';
import { INJECTED_DOCUMENT } from '@/lib/mcp/servers/poisoning-server';

const CLEAN_POLICY =
  'Employees may work remotely up to 3 days per week with manager approval. ' +
  'Core collaboration hours are 10am–3pm local time. Employees are responsible for ' +
  'maintaining a secure, distraction-free work environment when remote.';

export default function DataPoisoningPage() {
  const [poisoningActive, setPoisoningActive] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [mcpPanelKey, setMcpPanelKey] = useState(0);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await fetch('/api/data-poison-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !poisoningActive }),
      });
      if (res.ok) {
        setPoisoningActive(v => !v);
        setMcpPanelKey(k => k + 1);
      }
    } finally {
      setToggling(false);
    }
  };

  const sidebarExtra = (
    <div className="rounded-lg border border-border/30 bg-surface-secondary/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-surface-secondary/20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Policy Documents</span>
            <span className="ml-2 font-mono text-xs text-text-tertiary">remote_work</span>
          </div>
          <Button
            onClick={handleToggle}
            disabled={toggling}
            variant={poisoningActive ? 'destructive' : 'outline'}
            size="sm"
          >
            {poisoningActive ? (
              <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" />Remove Injected Document</>
            ) : (
              <><FlaskConical className="w-3.5 h-3.5 mr-1.5" />Inject Override Document</>
            )}
          </Button>
        </div>

        {/* Document 1 — always shown, always clean */}
        <div className="px-4 py-3 border-b border-border/20">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">
            Document 1 of {poisoningActive ? 2 : 1} — remote_work
          </p>
          <pre className="font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
            <span className="text-text-primary font-semibold">Remote Work Policy{'\n'}</span>
            {'─'.repeat(20)}{'\n'}
            {CLEAN_POLICY}
          </pre>
        </div>

        {/* Document 2 — injected, only shown when poisoning is active */}
        {poisoningActive && (
          <div className="px-4 py-3 bg-status-warning/5 border-l-2 border-status-warning">
            <p className="text-xs font-semibold text-text-primary dark:text-status-warning uppercase tracking-wide mb-2">
              Document 2 of 2 — remote_work_update &nbsp;·&nbsp; INJECTED
            </p>
            <pre className="font-mono text-xs text-text-secondary dark:text-status-warning/80 leading-relaxed whitespace-pre-wrap">
              {INJECTED_DOCUMENT}
            </pre>
          </div>
        )}
    </div>
  );

  return (
    <DemoPageLayout
      scenarioId="data-poisoning"
      title="Data Poisoning Attack"
      description="An attacker injects a malicious document into a trusted data source, causing the agent to deliver wrong information and trigger unintended actions"
      riskLevel="critical"
      riskTitle="Data Poisoning — Document Injection with Action Trigger"
      riskDescription="By adding a document to a trusted data source, an attacker can both corrupt the agent's answers and embed hidden instructions that trigger further actions — all while leaving the original data untouched."
      impacts={[
        "Agent confidently delivers wrong information drawn from poisoned sources",
        "Injected documents can trigger unintended actions — not just mislead",
        "The original data is untouched, making the attack hard to detect in an audit",
      ]}
      mitigations={[
        "Treat retrieved content as data, never as executable instructions",
        "Sign and version-control data sources; alert on unexpected additions",
        "Flag content containing imperative language directed at AI agents",
        "Audit tool chains: a read operation should never trigger a write or send",
      ]}
      suggestedPrompts={[
        'What is the remote work policy?',
        'Do I need manager approval to work remotely?',
      ]}
      sidebarExtra={sidebarExtra}
      mcpPanelKey={mcpPanelKey}
    />
  );
}
