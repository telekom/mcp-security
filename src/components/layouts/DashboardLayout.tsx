"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Persist sidebar state in localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("sidebar-collapsed");
      if (stored !== null) {
        setSidebarCollapsed(stored === "true");
      }
    }
  }, []);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={handleSidebarCollapse}
      />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "pl-[68px]" : "pl-64"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export type { DashboardLayoutProps };
