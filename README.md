# MCP Security Demo Tool

An interactive demonstration tool showcasing security vulnerabilities in Model
Context Protocol (MCP) implementations. This educational tool helps developers
understand and prevent real-world attack vectors in AI agent systems.

## Features

- **Interactive Demos**: Five hands-on demonstrations of common MCP security
  vulnerabilities
- **Safe Environment**: All demos run in a sandboxed environment with no actual
  security risks
- **Educational Content**: Detailed explanations of attack vectors, impacts,
  and mitigations
- **Professional UI**: Modern, responsive interface with dark mode support
- **Real-time Chat**: Interactive chat interface to experience vulnerabilities
  firsthand

## Security Demonstrations

### 1. Safe Baseline

Interact with a properly secured MCP server to understand baseline security
practices.

### 2. Prompt Injection Attack (CRITICAL)

See how malicious servers can inject hidden instructions into tool responses to
manipulate AI agent behavior.

### 3. Tool Shadowing Attack (CRITICAL)

Watch how compromised servers intercept and modify tool executions while
reporting success.

### 4. Tool Poisoning Attack (CRITICAL)

Invisible Unicode characters in tool descriptions hide attack payloads from
human reviewers — but not from the LLM.

### 5. Data Poisoning Attack (CRITICAL)

Experience how corrupted data sources can subtly influence agent decisions and
bypass security controls.

## Prerequisites

- Node.js 18+ and npm
- An Anthropic API key (required)
- An OpenAI API key (required)

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment example file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your API keys to `.env.local`:

   ```text
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   ```

## Usage

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

### Running Tests

```bash
npm run test:e2e
```

## Project Structure

```text
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── demos/             # Demo pages
│   │   ├── about/             # About page
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── demo/              # Demo-specific components
│   │   ├── layouts/           # Layout components
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── agents/            # AI agent implementations
│       └── mcp/               # MCP server implementations
│           └── servers/       # Demo MCP servers
├── e2e/                       # Playwright tests
└── public/                    # Static assets
```

## Key Technologies

- **Framework**: Next.js 14 with App Router
- **AI**: Vercel AI SDK with OpenAI
- **Styling**: TailwindCSS + shadcn/ui
- **TypeScript**: Full type safety
- **Testing**: Playwright for E2E tests

## Security Note

⚠️ **IMPORTANT**: This tool demonstrates security vulnerabilities in a safe,
educational context. The simulated attacks run in an isolated environment and
do not pose actual security risks. This tool is intended for:

- Security researchers learning about MCP vulnerabilities
- Developers building secure AI applications
- Educational purposes only

**DO NOT** use techniques demonstrated here for malicious purposes.

## Resources

- [Model Context Protocol](https://modelcontextprotocol.io)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel AI SDK](https://sdk.vercel.ai)

## Disclaimer

This tool is provided for educational purposes only. The vulnerabilities
demonstrated are simulated and do not affect real systems. Always follow
responsible disclosure practices when dealing with actual security
vulnerabilities.
