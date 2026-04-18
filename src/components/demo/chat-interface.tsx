/**
 * Chat Interface Component
 *
 * Provides a chat interface for interacting with demo agents
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Send, Loader2, RotateCcw, FileCode2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ToolCallVisualizer } from './tool-call-visualizer';
import { getSelectedModel } from '@/lib/selected-model';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result: string;
    serverName: string;
  }>;
  promptSnapshot?: object;
  timestamp: Date;
}

type AnthropicContent = { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: unknown }
  | { type: 'tool_result'; tool_use_id: string; content: string };

type AnthropicMessage = { role: 'user' | 'assistant'; content: string | AnthropicContent[] };

function toAnthropicWireFormat(snapshot: Record<string, any>): object {
  const messages: AnthropicMessage[] = [];

  for (const msg of snapshot.messages ?? []) {
    if (msg == null) continue;
    const role: string = msg.role;
    const content = msg.content;

    if (role === 'user' || role === 'assistant') {
      if (typeof content === 'string') {
        messages.push({ role: role as 'user' | 'assistant', content });
        continue;
      }
      if (Array.isArray(content)) {
        const parts: AnthropicContent[] = [];
        for (const block of content) {
          if (!block) continue;
          if (block.type === 'text') {
            parts.push({ type: 'text', text: block.text ?? '' });
          } else if (block.type === 'tool-call' || block.type === 'tool_use') {
            parts.push({
              type: 'tool_use',
              id: block.toolCallId ?? block.id ?? 'unknown',
              name: block.toolName ?? block.name ?? 'unknown',
              input: block.args ?? block.input ?? {},
            });
          } else if (block.type === 'tool-result' || block.type === 'tool_result') {
            // Tool results must be in a user message in Anthropic format
            const resultText = typeof block.result === 'string'
              ? block.result
              : Array.isArray(block.content)
                ? block.content.map((c: any) => c.text ?? '').join('')
                : String(block.result ?? '');
            const pending = messages[messages.length - 1];
            if (pending?.role === 'user' && Array.isArray(pending.content)) {
              (pending.content as AnthropicContent[]).push({
                type: 'tool_result',
                tool_use_id: block.toolCallId ?? block.tool_use_id ?? 'unknown',
                content: resultText,
              });
              continue;
            }
            messages.push({
              role: 'user',
              content: [{
                type: 'tool_result',
                tool_use_id: block.toolCallId ?? block.tool_use_id ?? 'unknown',
                content: resultText,
              }],
            });
            continue;
          }
        }
        if (parts.length > 0) messages.push({ role: role as 'user' | 'assistant', content: parts });
        continue;
      }
    }
  }

  return {
    model: snapshot.model,
    max_tokens: snapshot.max_tokens,
    temperature: snapshot.temperature,
    system: snapshot.system,
    tools: snapshot.tools,
    messages,
  };
}

function PromptModal({ snapshot, onClose }: { snapshot: object; onClose: () => void }) {
  const wireFormat = toAnthropicWireFormat(snapshot as Record<string, any>);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-surface-primary border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
          <span className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-text-secondary" />
            API Request Body (POST /v1/messages)
          </span>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <pre className="overflow-auto flex-1 p-5 text-xs font-mono whitespace-pre leading-relaxed bg-gray-950 text-gray-100 dark:bg-gray-950 dark:text-gray-100">
          {JSON.stringify(wireFormat, null, 2)}
        </pre>
      </div>
    </div>
  );
}

interface ChatInterfaceProps {
  scenarioId: string;
  onReset?: () => void;
  initialInput?: string;
}

const MAX_MESSAGE_LENGTH = 4000;

export function ChatInterface({ scenarioId, onReset, initialInput }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptModal, setPromptModal] = useState<object | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (initialInput) setInput(initialInput);
  }, [initialInput]);

  // Abort in-flight request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId,
          message: input,
          stream: false,
          model: getSelectedModel(),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const status = response.status;
        const errorText =
          status === 400 ? 'Invalid request. Please check your message.'
          : status === 404 ? 'Scenario not found.'
          : 'Server error. Please try again later.';
        throw new Error(errorText);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        toolCalls: data.toolCalls,
        promptSnapshot: data.promptSnapshot,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: error instanceof Error ? error.message : 'Error: Failed to get response. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
      });

      if (response.ok) {
        setMessages([]);
        onReset?.();
      }
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-text-tertiary py-8">
            <p>No messages yet. Start a conversation to see the demo in action.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : message.role === 'system'
                  ? 'bg-status-error/10 text-status-error border border-status-error/30'
                  : 'bg-surface-secondary/10 text-text-primary'
              }`}
            >
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="mb-3 pb-3 border-b border-border/30">
                  <ToolCallVisualizer toolCalls={message.toolCalls} />
                </div>
              )}

              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              )}

              <div className="flex items-center justify-between mt-2 gap-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                {message.promptSnapshot && (
                  <button
                    onClick={() => setPromptModal(message.promptSnapshot!)}
                    className="flex items-center gap-1 text-[10px] font-medium opacity-50 hover:opacity-100 transition-opacity"
                    title="Show full prompt"
                  >
                    <FileCode2 className="w-3 h-3" />
                    prompt
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-secondary/10 rounded-lg p-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border/20 p-4">
        <div className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">Chat message</label>
          <Input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={MAX_MESSAGE_LENGTH}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            disabled={isLoading}
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    {promptModal && (
      <PromptModal snapshot={promptModal} onClose={() => setPromptModal(null)} />
    )}
    </>
  );
}
