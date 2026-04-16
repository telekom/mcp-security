/**
 * Theme utilities for managing dark/light mode
 *
 * This module provides functions for:
 * - Detecting system color scheme preference
 * - Managing theme state in localStorage
 * - Applying theme classes to the document
 */

export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "mcp-security-theme";

/**
 * Get the system's preferred color scheme
 */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Get the stored theme preference from localStorage
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return null;
}

/**
 * Store the theme preference in localStorage
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Get the effective theme (resolving "system" to actual value)
 */
export function getEffectiveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply the theme class to the document element
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const effectiveTheme = getEffectiveTheme(theme);
  const root = document.documentElement;

  if (effectiveTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Initialize the theme on page load
 * Call this in a useEffect or script tag to avoid flash of incorrect theme
 */
export function initializeTheme(): Theme {
  const storedTheme = getStoredTheme();
  const theme = storedTheme ?? "system";
  applyTheme(theme);
  return theme;
}

/**
 * Subscribe to system theme changes
 * Returns an unsubscribe function
 */
export function subscribeToSystemTheme(
  callback: (isDark: boolean) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

/**
 * Inline script to prevent theme flash
 * Include this in the <head> of your document
 */
export const themeInitScript = `
(function() {
  const stored = localStorage.getItem('${THEME_STORAGE_KEY}');
  const theme = stored || 'system';
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
})();
`;
