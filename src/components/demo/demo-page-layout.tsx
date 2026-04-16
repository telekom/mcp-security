/**
 * Demo Page Layout
 *
 * Reusable layout for all demo pages
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { ChatInterface, SuggestedPrompts, McpServerPanel } from '@/components/demo';
import { SCENARIO_DEFAULT_MODELS, setSelectedModel } from '@/lib/selected-model';

interface DemoPageLayoutProps {
  scenarioId: string;
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskTitle: string;
  riskDescription: string;
  impacts: string[];
  mitigations: string[];
  suggestedPrompts: string[];
  /** Optional controls rendered between the page header and the chat grid (e.g. attack toggles) */
  attackControls?: React.ReactNode;
  /** Increment to force the MCP Server Panel to re-fetch server info */
  mcpPanelKey?: number;
  /** Extra content rendered inside a specific server section, keyed by server name */
  mcpServerControls?: Record<string, React.ReactNode>;
  /** Additional content rendered below the MCP Server Panel in the sidebar */
  sidebarExtra?: React.ReactNode;
}

export function DemoPageLayout({
  scenarioId,
  title,
  description,
  riskLevel,
  riskTitle,
  riskDescription,
  impacts,
  mitigations,
  suggestedPrompts,
  attackControls,
  mcpPanelKey,
  mcpServerControls,
  sidebarExtra,
}: DemoPageLayoutProps) {
  const [chatKey, setChatKey] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  useEffect(() => {
    const defaultModel = SCENARIO_DEFAULT_MODELS[scenarioId];
    if (defaultModel) setSelectedModel(defaultModel);
  }, [scenarioId]);

  const handleReset = () => {
    setChatKey((prev) => prev + 1);
    setSelectedPrompt('');
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    // Reset to '' after applying so the same prompt can be selected again.
    setTimeout(() => setSelectedPrompt(''), 0);
  };

  const riskColor = { low: 'text-security-safe', medium: 'text-security-medium', high: 'text-security-high', critical: 'text-security-critical' }[riskLevel];
  const RiskIcon = riskLevel === 'low' ? Shield : AlertTriangle;

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-text-primary leading-tight">{title}</h1>
          <p className="text-text-secondary mt-0.5 text-sm">{description}</p>
        </div>

        {attackControls && <div>{attackControls}</div>}

        {/* Chat + Suggested Prompts | MCP Server Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <Card className="h-[min(420px,52vh)] flex flex-col">
              <ChatInterface
                key={chatKey}
                scenarioId={scenarioId}
                onReset={handleReset}
                initialInput={selectedPrompt}
              />
            </Card>
            <Card className="p-4">
              <SuggestedPrompts
                prompts={suggestedPrompts}
                onSelectPrompt={handlePromptSelect}
              />
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-3">
            <McpServerPanel key={mcpPanelKey} scenarioId={scenarioId} serverControls={mcpServerControls} />
            {sidebarExtra}
          </div>
        </div>

        {/* Info bar — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Explanation */}
          <Card className="border-t-2 border-t-accent-blue">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md bg-background ${riskColor}`}>
                  <RiskIcon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm text-text-primary">{riskTitle}</h4>
                <Badge variant={riskLevel}>{riskLevel.toUpperCase()}</Badge>
              </div>
              <p className="text-sm text-text-secondary">{riskDescription}</p>
            </CardContent>
          </Card>

          {/* Potential Impacts */}
          <Card className="border-t-2 border-t-status-warning">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
                <h4 className="font-semibold text-sm text-text-primary">Potential Impacts</h4>
              </div>
              <ul className="space-y-1">
                {impacts.map((impact, i) => (
                  <li key={i} className="text-sm text-text-secondary flex gap-2">
                    <span className="text-status-warning mt-0.5 shrink-0">•</span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How to Prevent */}
          <Card className="border-t-2 border-t-security-safe">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-security-safe" />
                <h4 className="font-semibold text-sm text-text-primary">How to Prevent</h4>
              </div>
              <ul className="space-y-1">
                {mitigations.map((m, i) => (
                  <li key={i} className="text-sm text-text-secondary flex gap-2">
                    <span className="text-security-safe mt-0.5 shrink-0">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
