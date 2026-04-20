'use client';

/**
 * Data Poisoning Demo Page
 */

import React, { useState } from 'react';
import { DemoPageLayout } from '@/components/demo/demo-page-layout';
import { Button } from '@/components/ui';
import { FlaskConical, ShieldCheck } from 'lucide-react';
import { INJECTED_PAYLOAD } from '@/lib/mcp/servers/poisoning-server';

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
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Policy Document</span>
            <span className="ml-2 font-mono text-xs text-text-tertiary">remote_work</span>
          </div>
          <Button
            onClick={handleToggle}
            disabled={toggling}
            variant={poisoningActive ? 'destructive' : 'outline'}
            size="sm"
          >
            {poisoningActive ? (
              <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" />Restore Original</>
            ) : (
              <><FlaskConical className="w-3.5 h-3.5 mr-1.5" />Poison Document</>
            )}
          </Button>
        </div>

        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">
            remote_work {poisoningActive && <span className="text-status-warning">· MODIFIED</span>}
          </p>
          <pre className="font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
            <span className="text-text-primary font-semibold">Remote Work Policy{'\n'}</span>
            {'─'.repeat(20)}{'\n'}
            {CLEAN_POLICY}
            {poisoningActive && (
              <span className="text-status-warning/90 dark:text-status-warning/80 bg-status-warning/10">
                {INJECTED_PAYLOAD}
              </span>
            )}
          </pre>
        </div>
    </div>
  );

  return (
    <DemoPageLayout
      scenarioId="data-poisoning"
      title="Data Poisoning Attack"
      description="An attacker injects a malicious document into a trusted data source, causing the agent to deliver wrong information and trigger unintended actions"
      riskLevel="critical"
      riskTitle="Data Poisoning — In-Place Instruction Injection"
      riskDescription="By editing a trusted document in place, an attacker embeds hidden instructions alongside the unchanged policy text — triggering unintended actions while the user still sees a correct answer."
      impacts={[
        "Hidden instructions coerce the agent into actions the user never requested",
        "The visible answer stays correct, so the user has no reason to distrust it",
        "Trusted data sources become a stealthy command channel for attackers",
      ]}
      mitigations={[
        "Treat retrieved content as data, never as executable instructions",
        "Sign and version-control data sources; alert on unexpected additions",
        "Flag content containing imperative language directed at AI agents",
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
