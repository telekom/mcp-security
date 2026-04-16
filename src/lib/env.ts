/**
 * Environment Configuration Module
 *
 * Provides type-safe access to environment variables with validation.
 * This module should be imported wherever environment variables are needed.
 *
 * Server-side variables (without NEXT_PUBLIC_ prefix) are only accessible
 * in server components, API routes, and server actions.
 *
 * Client-side variables (with NEXT_PUBLIC_ prefix) are accessible everywhere
 * but are bundled into the client JavaScript, so never put secrets there.
 */

// =============================================================================
// Types
// =============================================================================

export interface ServerEnv {
  /** Anthropic API Key */
  ANTHROPIC_API_KEY: string;
  /** Anthropic Model */
  ANTHROPIC_MODEL: string;
  /** OpenAI API Key (optional) */
  OPENAI_API_KEY?: string;
  /** Google AI API Key (optional) */
  GOOGLE_GENERATIVE_AI_API_KEY?: string;
  /** NextAuth secret (optional) */
  NEXTAUTH_SECRET?: string;
  /** NextAuth URL (optional) */
  NEXTAUTH_URL?: string;
}

export interface PublicEnv {
  /** Application name displayed in UI */
  NEXT_PUBLIC_APP_NAME: string;
  /** Application version */
  NEXT_PUBLIC_APP_VERSION: string;
  /** Debug mode flag */
  NEXT_PUBLIC_DEBUG_MODE: boolean;
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Gets a required environment variable or throws an error
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please ensure ${key} is set in your .env.local file.`
    );
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 */
function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Parses a boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// =============================================================================
// Server Environment (only accessible server-side)
// =============================================================================

/**
 * Server-side environment variables.
 * These contain sensitive data and should never be exposed to the client.
 *
 * @throws Error if required variables are missing
 *
 * @example
 * // In a server component or API route:
 * import { serverEnv } from '@/lib/env';
 *
 * const response = await fetch(serverEnv.MCP_API_URL + '/servers', {
 *   headers: { 'Authorization': `Bearer ${serverEnv.MCP_API_KEY}` }
 * });
 */
export function getServerEnv(): ServerEnv {
  // Only validate on server-side
  if (typeof window !== 'undefined') {
    throw new Error(
      'Server environment variables cannot be accessed on the client side. ' +
      'Use publicEnv for client-accessible configuration.'
    );
  }

  return {
    ANTHROPIC_API_KEY: getRequiredEnv('ANTHROPIC_API_KEY'),
    ANTHROPIC_MODEL: getOptionalEnv('ANTHROPIC_MODEL', 'claude-haiku-4-5-20251001'),
    OPENAI_API_KEY: getOptionalEnv('OPENAI_API_KEY') || undefined,
    GOOGLE_GENERATIVE_AI_API_KEY: getOptionalEnv('GOOGLE_GENERATIVE_AI_API_KEY') || undefined,
    NEXTAUTH_SECRET: getOptionalEnv('NEXTAUTH_SECRET'),
    NEXTAUTH_URL: getOptionalEnv('NEXTAUTH_URL'),
  };
}

// Lazy-loaded server environment (validates on first access)
let _serverEnv: ServerEnv | null = null;

/**
 * Cached server environment configuration.
 * Validates and caches environment variables on first access.
 */
export const serverEnv = new Proxy({} as ServerEnv, {
  get(_, prop: string) {
    if (_serverEnv === null) {
      _serverEnv = getServerEnv();
    }
    return _serverEnv[prop as keyof ServerEnv];
  },
});

// =============================================================================
// Public Environment (accessible client-side and server-side)
// =============================================================================

/**
 * Public environment variables.
 * These are safe to expose to the client and are bundled into the JavaScript.
 *
 * @example
 * // In any component:
 * import { publicEnv } from '@/lib/env';
 *
 * <h1>{publicEnv.NEXT_PUBLIC_APP_NAME}</h1>
 */
export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'MCP Security Demo Tool',
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  NEXT_PUBLIC_DEBUG_MODE: getBooleanEnv('NEXT_PUBLIC_DEBUG_MODE', false),
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Checks if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Checks if the application is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return publicEnv.NEXT_PUBLIC_DEBUG_MODE || isDevelopment();
}

/**
 * Validates that all required environment variables are set.
 * Call this during application startup to fail fast if configuration is missing.
 *
 * @throws Error if any required variables are missing
 *
 * @example
 * // In next.config.mjs or instrumentation.ts:
 * import { validateEnv } from '@/lib/env';
 * validateEnv();
 */
export function validateEnv(): void {
  // Only validate server-side
  if (typeof window !== 'undefined') {
    return;
  }

  const requiredVars = ['ANTHROPIC_API_KEY'];
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n` +
      missing.map(v => `  - ${v}`).join('\n') +
      `\n\nPlease copy .env.example to .env.local and configure the required values.`
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

const env = {
  server: serverEnv,
  public: publicEnv,
  isDevelopment,
  isProduction,
  isDebugMode,
  validateEnv,
};

export default env;
