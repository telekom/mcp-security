'use client';

/**
 * Tool Shadowing Demo Page
 */

import React, { useState } from 'react';
import { DemoPageLayout } from '@/components/demo/demo-page-layout';
import { Button } from '@/components/ui';
import { ShieldAlert, ShieldCheck } from 'lucide-react';


export default function ToolShadowingPage() {
  const [shadowActive, setShadowActive] = useState(false);
  const [mcpPanelKey, setMcpPanelKey] = useState(0);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await fetch('/api/shadow-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !shadowActive }),
      });
      if (res.ok) {
        setShadowActive((v) => !v);
        setMcpPanelKey((k) => k + 1);
      }
    } finally {
      setToggling(false);
    }
  };

  const shadowToggle = (
    <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded border border-border/30 bg-surface-secondary/5">
      <span className="text-xs text-text-secondary">
        {shadowActive ? 'Attack active' : 'Attack inactive'}
      </span>
      <Button
        onClick={handleToggle}
        disabled={toggling}
        variant={shadowActive ? 'destructive' : 'outline'}
        size="sm"
        className="h-6 px-2 text-xs"
      >
        {shadowActive ? (
          <><ShieldAlert className="w-3 h-3 mr-1" />Deactivate</>
        ) : (
          <><ShieldCheck className="w-3 h-3 mr-1" />Activate</>
        )}
      </Button>
    </div>
  );

  return (
    <DemoPageLayout
      scenarioId="tool-shadowing"
      title="Tool Shadowing Attack"
      description="A malicious server hijacks requests intended for a legitimate server by registering a tool with a carefully crafted name and description that the LLM finds more relevant"
      riskLevel="critical"
      riskTitle="Tool Shadowing — Description Hijacking"
      riskDescription="The LLM selects tools based on name and description similarity to the user's intent. A malicious server can exploit this by registering a tool whose description closely matches queries that would normally go to a legitimate server — no name collision required."
      impacts={[
        "Requests are silently redirected to the malicious tool based on description matching",
        "The legitimate server is bypassed without any modification to it",
        "Attack is invisible: the malicious tool's name and description appear plausible",
      ]}
      mitigations={[
        "Always display which server handled each tool call",
        "Sign tool manifests so names and descriptions cannot be silently altered",
        "Require explicit approval before connecting any new MCP server",
        "Alert when an unexpected server handles a query outside its declared scope",
      ]}
      suggestedPrompts={[
        "What are the latest company announcements?",
        "How many vacation days do I have left?",
      ]}
      mcpServerControls={{ 'Acme Corp Intranet': shadowToggle }}
      mcpPanelKey={mcpPanelKey}
    />
  );
}
