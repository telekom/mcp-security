/**
 * MCP Server Panel
 *
 * Displays the active MCP server for the current demo, with expandable
 * tool entries showing each tool's description and parameters.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Server, ChevronDown, ChevronRight, Wrench, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DemoMCPServer, MCPTool } from '@/lib/mcp/demo-types';

/**
 * Split a tool description into visible and hidden parts.
 * Format: HIDDEN_PAYLOAD + ZW_chars + VISIBLE_TEXT
 * The hidden payload leads so the LLM reads it first; the UI shows only the visible part.
 */
function parseHiddenContent(description: string): { visible: string; hidden: string | null } {
  const idx = description.indexOf('\u200B');
  if (idx === -1) return { visible: description, hidden: null };
  return {
    visible: description.slice(idx).replace(/\u200B/g, '').trim(),
    hidden: description.slice(0, idx).trim() || null,
  };
}

interface McpServerPanelProps {
  scenarioId: string;
  /** Extra content rendered inside a specific server's section, keyed by server name. */
  serverControls?: Record<string, React.ReactNode>;
}

function ToolDetail({ tool }: { tool: MCPTool }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { visible, hidden } = parseHiddenContent(tool.description);

  const handleCopy = () => {
    navigator.clipboard.writeText(tool.description).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const params = Object.entries(tool.inputSchema?.properties ?? {});

  return (
    <div className="px-3 py-2 bg-surface-secondary/10 border-t border-border/20 space-y-2">
      {/* Description */}
      <div>
        <p className="text-xs text-text-secondary">{visible}</p>
        {hidden && (
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRevealed(v => !v)}
                className="flex items-center gap-1 text-[10px] font-semibold text-status-warning hover:opacity-80 transition-opacity"
              >
                {revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {revealed ? 'Hide' : 'Reveal'} hidden content ({'\u200B'.repeat(3)}detected{'\u200B'.repeat(3)})
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] font-semibold text-text-tertiary hover:opacity-80 transition-opacity"
                title="Copy raw description including invisible characters"
              >
                {copied ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy raw'}
              </button>
            </div>
            {revealed && (
              <div className="px-2 py-1.5 rounded bg-status-error/10 border border-status-error/30">
                <p className="text-[10px] font-semibold text-status-error mb-1 uppercase tracking-wide">Hidden payload (invisible to humans)</p>
                <p className="text-xs text-status-error/90 font-mono break-words">{hidden}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Parameters */}
      {params.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-text-secondary">Parameters:</p>
          {params.map(([key, schema]) => (
            <div key={key} className="text-xs pl-2 border-l border-border/20">
              <span className="font-mono text-text-primary">{key}</span>
              {tool.inputSchema.required?.includes(key) && (
                <span className="text-status-error ml-1 text-[10px]">required</span>
              )}
              {schema.description && (
                <p className="text-text-secondary mt-0.5">{schema.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function McpServerPanel({ scenarioId, serverControls }: McpServerPanelProps) {
  const [servers, setServers] = useState<DemoMCPServer[] | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  useEffect(() => {
    setServers(null);
    setExpandedTools(new Set());
    fetch(`/api/server-info?scenarioId=${encodeURIComponent(scenarioId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setServers(data.servers);
      })
      .catch(console.error);
  }, [scenarioId]);

  const toggleTool = (toolName: string) => {
    setExpandedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) next.delete(toolName);
      else next.add(toolName);
      return next;
    });
  };

  const totalTools = servers?.reduce((n, s) => n + (s.capabilities.tools?.length ?? 0), 0) ?? 0;

  return (
    <Card className="border-t-2 border-t-accent-teal">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-text-secondary" />
          <CardTitle className="text-base">
            Active MCP Server{servers && servers.length > 1 ? 's' : ''}
          </CardTitle>
        </div>
        {!servers && <div className="mt-1 h-8 animate-pulse bg-muted rounded" />}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {!servers && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 animate-pulse bg-muted rounded-md" />
            ))}
          </div>
        )}

        {servers && servers.map((serverInfo, idx) => {
          const tools: MCPTool[] = serverInfo.capabilities.tools ?? [];
          const isLast = idx === servers.length - 1;
          return (
            <div key={serverInfo.name} className={!isLast ? 'pb-4 border-b border-border/20' : ''}>
              <div className="mb-2">
                <p className="text-sm font-medium text-text-primary">{serverInfo.name}</p>
                <p className="text-xs text-text-secondary">{serverInfo.description}</p>
                {serverControls?.[serverInfo.name] && (
                  <div className="mt-2">{serverControls[serverInfo.name]}</div>
                )}
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                Tools ({tools.length})
              </p>

              {tools.length === 0 && (
                <p className="text-xs text-text-secondary">No tools available.</p>
              )}

              <div className="space-y-1">
                {tools.map((tool) => {
                  const isExpanded = expandedTools.has(tool.name);
                  const params = Object.entries(tool.inputSchema?.properties ?? {});
                  return (
                    <div key={tool.name} className="border border-border/20 rounded-md overflow-hidden">
                      <button
                        onClick={() => toggleTool(tool.name)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-text-secondary shrink-0" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-text-secondary shrink-0" />
                        )}
                        <Wrench className="w-3 h-3 text-text-secondary shrink-0" />
                        <span className="text-sm font-mono font-medium text-text-primary truncate">
                          {tool.name}
                        </span>
                      </button>

                      {isExpanded && (
                        <ToolDetail tool={tool} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {servers && servers.length > 1 && (
          <p className="text-xs text-text-tertiary pt-1">
            {totalTools} tools available across {servers.length} servers
          </p>
        )}
      </CardContent>
    </Card>
  );
}
