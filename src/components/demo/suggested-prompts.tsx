/**
 * Suggested Prompts Component
 *
 * Shows suggested prompts for a demo scenario
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Send } from 'lucide-react';

interface SuggestedPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({
  prompts,
  onSelectPrompt,
  disabled = false,
}: SuggestedPromptsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-text-secondary">Suggested Prompts</h4>
      <div className="grid grid-cols-1 gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-3 px-4"
            onClick={() => onSelectPrompt(prompt)}
            disabled={disabled}
          >
            <div className="flex items-start gap-3 w-full">
              <Send className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{prompt}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
