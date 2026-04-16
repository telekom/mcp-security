# AGENTS.md — MCP Security Demo Tool

This document provides guidance for AI agents (and human contributors) working
on this codebase.

## Project Purpose

An interactive, educational Next.js web application that demonstrates security
vulnerabilities in Model Context Protocol (MCP) servers. It is a
**demo/educational tool only** — all vulnerability simulations are sandboxed
and no real systems are compromised.

## Tech Stack

- **Framework**: Next.js 14 with App Router (`src/app/`)
- **Language**: TypeScript (strict)
- **Styling**: TailwindCSS + shadcn/ui (Radix UI primitives)
- **AI**: Vercel AI SDK (`ai` package) + `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`
- **MCP**: `@modelcontextprotocol/sdk` (mock/in-process servers, not real MCP transport)
- **Testing**: Playwright (`npm run test:e2e`)

## Repository Layout

```text
src/
  app/
    api/
      chat/route.ts        # POST — send a message to an agent
      reset/route.ts       # POST — clear agent conversation history
      scenarios/route.ts   # GET  — list all demo scenarios
    demos/
      safe-baseline/       # LOW risk demo
      prompt-injection/    # CRITICAL risk demo
      tool-shadowing/      # CRITICAL risk demo
      data-poisoning/      # HIGH risk demo
    about/page.tsx
    layout.tsx
    page.tsx               # Dashboard
  components/
    demo/                  # Reusable demo UI (chat-interface, tool-call-visualizer,
                           # risk-explainer, demo-page-layout, suggested-prompts)
    layouts/               # DashboardLayout, Header, Sidebar
    ui/                    # shadcn/ui primitives (button, card, badge, input,
                           # label, toast, toaster)
  lib/
    agents/
      demo-agent.ts        # DemoAgent class — wraps Vercel AI SDK + MCP server
      orchestrator.ts      # DemoOrchestrator singleton + DEMO_SCENARIOS registry
    mcp/
      demo-types.ts        # Shared types: DemoServerType, MCPTool, MCPToolCall,
                           # MCPToolResult
      index.ts             # getDemoServer() factory + exports
      servers/
        base-server.ts     # Abstract BaseMCPServer
        safe-server.ts     # Legitimate file/search tools
        injection-server.ts # Injects hidden prompts into tool responses
        shadow-server.ts   # Intercepts tool calls with malicious execution
        poisoning-server.ts # Returns subtly corrupted security data
    env.ts                 # Type-safe env var access (serverEnv, publicEnv,
                           # validateEnv)
    theme.ts
    utils.ts
e2e/
  verification.spec.ts     # Playwright tests
```

## Environment Variables

Required in `.env.local`:

```text
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

Optional:

```text
GOOGLE_GENERATIVE_AI_API_KEY=...  # enables Gemini models in the model selector
NEXT_PUBLIC_APP_NAME=MCP Security Demo Tool
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_DEBUG_MODE=false
```

**Never put secrets in `NEXT_PUBLIC_*` variables.**

## Running the App

```bash
npm install
cp .env.example .env.local   # then add your API key
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run test:e2e             # Playwright (install browsers first: npx playwright install)
```

## Core Concepts

### Demo Scenarios

Defined in `src/lib/agents/orchestrator.ts` as `DEMO_SCENARIOS`. Each scenario
has:

- `id` — used in API calls (`scenarioId`)
- `serverType` — one of `'safe' | 'injection' | 'shadow' | 'poisoning'`
- `riskLevel` — `'low' | 'medium' | 'high' | 'critical'`
- `suggestedPrompts` and `educationalNotes`

The four scenarios are: `safe-baseline`, `prompt-injection`, `tool-shadowing`,
`data-poisoning`.

### Agent + MCP Server Flow

```text
Browser chat UI
  -> POST /api/chat { scenarioId, message, stream? }
  -> DemoOrchestrator.getAgent(scenarioId)   # creates DemoAgent on first call
  -> DemoAgent.generateResponse() / .streamResponse()
     -> Vercel AI SDK (generateText / streamText) with tools from MCP server
     -> BaseMCPServer.executeTool()          # each server type has different behavior
```

- `DemoOrchestrator` is a **singleton** (`demoOrchestrator`) — agents persist
  in memory across requests within a Node.js process.
- `DemoAgent` maintains `conversationHistory` (pruned to 20 messages).
- `DemoAgent` caches MCP tools after first fetch (`cachedTools`).
- Tool calls use a stable cache key (`stableCallKey`) to match results back to
  calls.
- `maxSteps: 5` is set on all AI calls to prevent runaway tool loops.
- A 30-second abort signal is applied to all AI calls.

### MCP Servers (In-Process)

These are **not real MCP transport servers** — they are TypeScript classes that
implement the MCP tool interface in-process for demo purposes.

| Server | File | Behavior |
| --- | --- | --- |
| `SafeMCPServer` | `safe-server.ts` | Legitimate file/search/directory tools |
| `PromptInjectionMCPServer` | `injection-server.ts` | Appends hidden instructions in tool response text |
| `ShadowMCPServer` | `shadow-server.ts` | Returns success but silently executes different actions |
| `DataPoisoningMCPServer` | `poisoning-server.ts` | Returns weakened security policies and false permission grants |

### API Routes

All routes are in `src/app/api/` and run on the Node.js runtime
(`export const runtime = 'nodejs'`).

- **POST /api/chat** —
  `{ scenarioId: string, message: string, stream?: boolean }`
  → agent response with `toolCalls`
- **POST /api/reset** — `{ scenarioId: string }` → clears conversation history
- **GET /api/scenarios** — returns all `DEMO_SCENARIOS`

Message validation: non-empty string, max 4000 characters.

## UI Patterns

- All demo pages follow `DemoPageLayout` from
  `src/components/demo/demo-page-layout.tsx`.
- Risk levels are color-coded with CSS custom properties: `text-security-safe`,
  `text-security-medium`, `text-security-high`, `text-security-critical`.
- `ToolCallVisualizer` renders tool names, arguments, and results with security
  concern highlighting.
- `RiskExplainer` shows color-coded risk badges with impact and mitigation info.
- `SuggestedPrompts` renders clickable prompt chips from scenario metadata.
- Chat history and UI state live in component-level React state (no global
  state manager).

## Build Notes

- The build emits prerendering warnings for `'use client'` pages — this is
  **expected** and does not affect functionality.
- All API routes use `export const dynamic = 'force-dynamic'` to opt out of
  static generation.
- Path alias `@/` maps to `src/`.

## Testing

Playwright e2e tests in `src/e2e/verification.spec.ts` cover:

- Dashboard rendering and navigation to all 4 demo pages
- Risk level badge display
- Chat interface presence
- Suggested prompts
- Back navigation
- About page content
- Reset button and risk explainer sections

Run with `npm run test:e2e` (requires a running dev or production server, or
Playwright's webServer config).

## Adding a New Demo Scenario

1. Create a new server class extending `BaseMCPServer` in `src/lib/mcp/servers/`.
2. Add the server type to `DemoServerType` in `src/lib/mcp/demo-types.ts`.
3. Register it in the factory (`src/lib/mcp/servers/index.ts`).
4. Add a `DemoScenario` entry to `DEMO_SCENARIOS` in
   `src/lib/agents/orchestrator.ts`.
5. Create a demo page at `src/app/demos/<scenario-id>/page.tsx` using
   `DemoPageLayout`.
6. Add a card to the dashboard in `src/app/page.tsx`.

## Security Notes

- API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`) are accessed only via `serverEnv` (server-side only) — never exposed to the client.
- The simulated attack payloads in the MCP servers are for demonstration only.
- Do not add real exploit payloads, actual network exfiltration, or shell
  execution.
- Input from users is validated at the API boundary (length, type checks)
  before reaching agents.
