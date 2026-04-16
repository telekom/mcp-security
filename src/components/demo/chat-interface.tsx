/**
 * Chat Interface Component
 *
 * Provides a chat interface for interacting with demo agents
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Send, Loader2, RotateCcw } from 'lucide-react';
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
  timestamp: Date;
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

              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
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
  );
}
