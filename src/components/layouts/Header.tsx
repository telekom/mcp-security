"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Theme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  getEffectiveTheme,
  subscribeToSystemTheme,
} from "@/lib/theme";
import { Button } from "@/components/ui";

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const [theme, setTheme] = React.useState<Theme>("system");
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const themeMenuRef = React.useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage
  React.useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
    }
  }, []);

  // Subscribe to system theme changes
  React.useEffect(() => {
    if (theme === "system") {
      const unsubscribe = subscribeToSystemTheme(() => {
        applyTheme("system");
      });
      return unsubscribe;
    }
  }, [theme]);

  // Close menu when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
    setShowThemeMenu(false);
  };

  const getThemeIcon = () => {
    const effectiveTheme = getEffectiveTheme(theme);
    if (theme === "system") {
      return <Monitor className="w-5 h-5" />;
    }
    return effectiveTheme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />;
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-surface border-b border-border/20",
        "flex items-center justify-end px-6 transition-all duration-300",
        sidebarCollapsed ? "left-[68px]" : "left-64"
      )}
    >
      {/* Theme Toggle */}
      <div className="relative" ref={themeMenuRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          aria-label="Toggle theme"
          aria-expanded={showThemeMenu}
          aria-haspopup="true"
          className="text-text-secondary"
        >
          {getThemeIcon()}
        </Button>

        {showThemeMenu && (
          <div className="absolute right-0 top-full mt-2 w-36 py-1 bg-surface border border-border/20 rounded-lg shadow-soft-lg" role="menu">
            <button
              onClick={() => handleThemeChange("light")}
              role="menuitem"
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm",
                "hover:bg-surface-secondary/10 transition-colors",
                theme === "light" ? "text-primary-500" : "text-text-secondary"
              )}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              role="menuitem"
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm",
                "hover:bg-surface-secondary/10 transition-colors",
                theme === "dark" ? "text-primary-500" : "text-text-secondary"
              )}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              role="menuitem"
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm",
                "hover:bg-surface-secondary/10 transition-colors",
                theme === "system" ? "text-primary-500" : "text-text-secondary"
              )}
            >
              <Monitor className="w-4 h-4" />
              System
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export type { HeaderProps };
