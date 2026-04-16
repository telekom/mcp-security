"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Server,
  FileWarning,
  Activity,
  Info,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Bot,
} from "lucide-react";
import { AVAILABLE_MODELS, DEFAULT_MODEL, getSelectedModel, setSelectedModel } from "@/lib/selected-model";
import { cn } from "@/lib/utils";
import {
  Theme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  getEffectiveTheme,
  subscribeToSystemTheme,
} from "@/lib/theme";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Safe Baseline",
    href: "/demos/safe-baseline",
    icon: Shield,
  },
  {
    title: "Prompt Injection",
    href: "/demos/prompt-injection",
    icon: FileWarning,
  },
  {
    title: "Tool Shadowing",
    href: "/demos/tool-shadowing",
    icon: Server,
  },
  {
    title: "Tool Poisoning",
    href: "/demos/tool-poisoning",
    icon: EyeOff,
  },
  {
    title: "Data Poisoning",
    href: "/demos/data-poisoning",
    icon: Activity,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<Theme>("system");
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showModelMenu, setShowModelMenu] = React.useState(false);
  const [selectedModel, setSelectedModelState] = React.useState(DEFAULT_MODEL);
  const themeMenuRef = React.useRef<HTMLDivElement>(null);
  const modelMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedModelState(getSelectedModel());
    const handler = (e: Event) => setSelectedModelState((e as CustomEvent).detail);
    window.addEventListener('mcpModelChange', handler);
    return () => window.removeEventListener('mcpModelChange', handler);
  }, []);

  React.useEffect(() => {
    const stored = getStoredTheme();
    if (stored) setTheme(stored);
  }, []);

  React.useEffect(() => {
    if (theme === "system") {
      return subscribeToSystemTheme(() => applyTheme("system"));
    }
  }, [theme]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setShowModelMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setShowThemeMenu(false); setShowModelMenu(false); }
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

  const ThemeIcon =
    theme === "system" ? Monitor : getEffectiveTheme(theme) === "dark" ? Moon : Sun;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-surface border-r border-border/20",
        "flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-border/20",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/10">
          <Shield className="w-6 h-6 text-primary-500" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">MCP Security</span>
            <span className="text-xs text-text-tertiary">Demo Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-200",
                    "hover:bg-surface-secondary/10",
                    isActive
                      ? "bg-primary-500/10 text-primary-500 font-medium border-l-2 border-primary-500"
                      : "text-text-secondary hover:text-text-primary border-l-2 border-transparent",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary-500")} />
                  {!collapsed && (
                    <span className="flex-1">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Controls */}
      <div className="border-t border-border/20 p-3 space-y-1">
        {/* Model Selector */}
        <div className="relative" ref={modelMenuRef}>
          <button
            onClick={() => setShowModelMenu(!showModelMenu)}
            aria-label="Select model"
            aria-expanded={showModelMenu}
            aria-haspopup="true"
            className={cn(
              "flex items-center w-full py-2 rounded-md",
              "text-text-secondary hover:text-text-primary",
              "hover:bg-surface-secondary/10 transition-colors duration-200",
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            )}
          >
            <Bot className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm truncate flex-1 text-left">
                {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.label ?? 'Model'}
              </span>
            )}
          </button>

          {showModelMenu && (
            <div
              className="absolute bottom-full left-full ml-2 mb-0 w-52 py-1 bg-surface border border-border/20 rounded-lg shadow-soft-lg z-50"
              role="menu"
            >
              {AVAILABLE_MODELS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedModel(id);
                    setSelectedModelState(id);
                    setShowModelMenu(false);
                  }}
                  role="menuitem"
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left",
                    "hover:bg-surface-secondary/10 transition-colors",
                    selectedModel === id ? "text-primary-500" : "text-text-secondary"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            aria-label="Toggle theme"
            aria-expanded={showThemeMenu}
            aria-haspopup="true"
            className={cn(
              "flex items-center w-full py-2 rounded-md",
              "text-text-secondary hover:text-text-primary",
              "hover:bg-surface-secondary/10 transition-colors duration-200",
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            )}
          >
            <ThemeIcon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Theme</span>}
          </button>

          {showThemeMenu && (
            <div
              className="absolute bottom-full left-full ml-2 mb-0 w-36 py-1 bg-surface border border-border/20 rounded-lg shadow-soft-lg z-50"
              role="menu"
            >
              {(
                [
                  { value: "light" as Theme, Icon: Sun, label: "Light" },
                  { value: "dark" as Theme, Icon: Moon, label: "Dark" },
                  { value: "system" as Theme, Icon: Monitor, label: "System" },
                ] as const
              ).map(({ value, Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  role="menuitem"
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm",
                    "hover:bg-surface-secondary/10 transition-colors",
                    theme === value ? "text-primary-500" : "text-text-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className={cn(
            "flex items-center w-full py-2 rounded-md",
            "text-text-secondary hover:text-text-primary",
            "hover:bg-surface-secondary/10 transition-colors duration-200",
            collapsed ? "justify-center" : "justify-end px-3"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}

export type { NavItem, SidebarProps };
