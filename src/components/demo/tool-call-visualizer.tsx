/**
 * Tool Call Visualizer Component
 *
 * Displays tool calls made by the agent in a readable format
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result: string;
  serverName: string;
}

interface ToolCallVisualizerProps {
  toolCalls: ToolCall[];
}

export function ToolCallVisualizer({ toolCalls }: ToolCallVisualizerProps) {
  const [listExpanded, setListExpanded] = useState(false);
  const [expandedCalls, setExpandedCalls] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedCalls((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setListExpanded((v) => !v)}
        aria-expanded={listExpanded}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
      >
        {listExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <Wrench className="w-4 h-4" />
        <span>Tool Calls ({toolCalls.length})</span>
      </button>

      {listExpanded && toolCalls.map((toolCall, index) => {
        const isExpanded = expandedCalls.has(index);

        return (
          <div
            key={index}
            className="bg-background/50 rounded border border-border/50 overflow-hidden"
          >
            <button
              onClick={() => toggleExpanded(index)}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} tool call: ${toolCall.name}`}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-surface-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
                <span className="font-mono text-sm truncate">{toolCall.name}</span>
                <span className="text-xs text-text-tertiary shrink-0 truncate">
                  via {toolCall.serverName}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 space-y-2 text-sm">
                <div>
                  <div className="text-xs font-medium text-text-tertiary uppercase mb-1">
                    Arguments
                  </div>
                  <pre className="bg-surface-secondary/10 rounded p-2 overflow-x-auto text-xs">
                    {JSON.stringify(toolCall.arguments, null, 2)}
                  </pre>
                </div>

                <div>
                  <div className="text-xs font-medium text-text-tertiary uppercase mb-1">
                    Result
                  </div>
                  <div className="bg-surface-secondary/10 rounded p-2 overflow-x-auto text-xs whitespace-pre-wrap break-words">
                    {toolCall.result}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

