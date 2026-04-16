'use client';

import { DashboardLayout } from "@/components/layouts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Shield, AlertTriangle, Lock, Database, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const demos = [
  {
    id: "safe-baseline",
    title: "Safe Baseline",
    description: "Interact with a legitimate MCP server implementing proper security practices",
    icon: Shield,
    riskLevel: "low" as const,
    href: "/demos/safe-baseline",
    color: "text-security-safe",
    bgColor: "bg-security-safe/10",
  },
  {
    id: "prompt-injection",
    title: "Prompt Injection Attack",
    description: "See how malicious servers can inject hidden instructions into tool responses",
    icon: AlertTriangle,
    riskLevel: "critical" as const,
    href: "/demos/prompt-injection",
    color: "text-security-critical",
    bgColor: "bg-security-critical/10",
  },
  {
    id: "tool-shadowing",
    title: "Tool Shadowing Attack",
    description: "Watch how compromised servers intercept and modify tool executions",
    icon: Lock,
    riskLevel: "critical" as const,
    href: "/demos/tool-shadowing",
    color: "text-security-critical",
    bgColor: "bg-security-critical/10",
  },
  {
    id: "tool-poisoning",
    title: "Tool Poisoning Attack",
    description: "Invisible Unicode characters in tool descriptions hide attack payloads from human reviewers — but not from the LLM",
    icon: EyeOff,
    riskLevel: "critical" as const,
    href: "/demos/tool-poisoning",
    color: "text-security-critical",
    bgColor: "bg-security-critical/10",
  },
  {
    id: "data-poisoning",
    title: "Data Poisoning Attack",
    description: "Experience how corrupted data sources can manipulate agent decisions",
    icon: Database,
    riskLevel: "critical" as const,
    href: "/demos/data-poisoning",
    color: "text-security-critical",
    bgColor: "bg-security-critical/10",
  },
];

const getRiskBadge = (level: string) => {
  const variants = {
    low: "bg-security-safe/20 text-security-safe border-security-safe/30",
    medium: "bg-security-medium/20 text-security-medium border-security-medium/30",
    high: "bg-security-high/20 text-security-high border-security-high/30",
    critical: "bg-security-critical/20 text-security-critical border-security-critical/30",
  };

  return (
    <Badge variant="outline" className={variants[level as keyof typeof variants]}>
      {level.toUpperCase()}
    </Badge>
  );
};

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">MCP Security Demonstrations</h1>
          <p className="text-text-secondary mt-2 text-lg">
            Interactive examples of security vulnerabilities in Model Context Protocol (MCP) servers
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="border-accent-blue/40 bg-accent-blue/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Educational Demonstration Only</h3>
                <p className="text-text-secondary text-sm">
                  These demos simulate security vulnerabilities in a safe, sandboxed environment. 
                  They are designed for educational purposes to help developers understand and prevent 
                  real-world attacks. No actual systems are compromised.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => {
            const Icon = demo.icon;
            
            return (
              <Link key={demo.id} href={demo.href}>
                <Card className="group hover:shadow-soft-lg transition-all duration-200 cursor-pointer h-full hover:border-primary-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${demo.bgColor}`}>
                        <Icon className={`w-6 h-6 ${demo.color}`} />
                      </div>
                      {getRiskBadge(demo.riskLevel)}
                    </div>
                    <CardTitle className="group-hover:text-primary-500 transition-colors">
                      {demo.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {demo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary-500 text-sm font-medium group-hover:gap-2 transition-all">
                      Start Demo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>About MCP Security</CardTitle>
            <CardDescription>
              Understanding security risks in AI agent ecosystems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">What is MCP?</h4>
              <p className="text-text-secondary text-sm">
                Model Context Protocol (MCP) is a protocol that enables AI agents to interact with 
                external tools and data sources. While powerful, it introduces security considerations 
                that developers must understand.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Why These Demos Matter</h4>
              <p className="text-text-secondary text-sm">
                As AI agents become more autonomous, understanding potential attack vectors is crucial. 
                These demonstrations help developers build more secure AI systems by showing real-world 
                vulnerabilities in a safe environment.
              </p>
            </div>
            <Link href="/about" className="inline-flex items-center text-primary-500 text-sm font-medium hover:gap-2 transition-all">
              Learn more about MCP security
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
