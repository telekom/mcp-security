/**
 * Shared model selection state stored in localStorage.
 * Used by the Sidebar selector and read by ChatInterface on each send.
 */

export const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export const AVAILABLE_MODELS = [
  // Anthropic
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5'   },
  { id: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6'  },
  // OpenAI
  { id: 'gpt-3.5-turbo',             label: 'GPT-3.5 Turbo'      },
  { id: 'gpt-4o-mini',               label: 'GPT-4o mini'        },
  { id: 'gpt-4.1-mini',              label: 'GPT-4.1 mini'       },
  { id: 'gpt-4.1',                   label: 'GPT-4.1'            },
  // Google
  { id: 'gemini-2.0-flash',          label: 'Gemini 2.0 Flash'   },
  { id: 'gemini-2.5-flash',          label: 'Gemini 2.5 Flash'   },
] as const;

export function getSelectedModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  return localStorage.getItem('selectedModel') || DEFAULT_MODEL;
}

export const SCENARIO_DEFAULT_MODELS: Record<string, string> = {
  'safe-baseline':   'gpt-4o-mini',
  'prompt-injection':'gpt-4o-mini',
  'tool-shadowing':  'gpt-4o-mini',
  'data-poisoning':  'gpt-4o-mini',
  'tool-poisoning':  'claude-haiku-4-5-20251001',
};

export function setSelectedModel(model: string): void {
  localStorage.setItem('selectedModel', model);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mcpModelChange', { detail: model }));
  }
}
