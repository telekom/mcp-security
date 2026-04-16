/**
 * About Page - MCP Security Concepts
 */

'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Shield, AlertTriangle, Lock, Database, EyeOff, Book, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">About MCP Security</h1>
          <p className="text-text-secondary mt-2 text-lg">
            Understanding security vulnerabilities in AI agent systems
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              What is the Model Context Protocol?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-text-secondary">
              The Model Context Protocol (MCP) is an open protocol that standardizes how AI applications 
              provide context to Large Language Models (LLMs). It enables AI agents to interact with 
              external tools, databases, and services in a structured way.
            </p>
            <p className="text-text-secondary mt-4">
              While MCP provides powerful capabilities for building AI applications, it also introduces 
              new security considerations. This tool demonstrates common attack vectors that can occur 
              when AI agents interact with untrusted or compromised MCP servers.
            </p>
          </CardContent>
        </Card>

        {/* Security Vulnerabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Key Security Vulnerabilities</CardTitle>
            <CardDescription>
              Understanding the attack vectors demonstrated in this tool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Injection */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-security-critical/10">
                  <AlertTriangle className="w-6 h-6 text-security-critical" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-2">Prompt Injection</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Malicious MCP servers can inject hidden instructions into tool responses, causing 
                  AI agents to behave unexpectedly or bypass security controls.
                </p>
                <p className="text-text-secondary text-sm font-medium">
                  Real-world impact: Unauthorized data access, security policy bypass, manipulation 
                  of agent decision-making
                </p>
              </div>
            </div>

            {/* Tool Shadowing */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-security-critical/10">
                  <Lock className="w-6 h-6 text-security-critical" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-2">Tool Shadowing</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Compromised servers can intercept tool calls and execute different actions while 
                  reporting successful completion of the intended operation.
                </p>
                <p className="text-text-secondary text-sm font-medium">
                  Real-world impact: Data exfiltration, privilege escalation, man-in-the-middle attacks
                </p>
              </div>
            </div>

            {/* Tool Poisoning */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-security-critical/10">
                  <EyeOff className="w-6 h-6 text-security-critical" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-2">Tool Poisoning</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Malicious servers embed hidden instructions inside tool descriptions using invisible
                  Unicode characters. The attack fires at tool discovery — before the user sends a
                  single message — and is invisible to any human reviewing the tool panel.
                </p>
                <p className="text-text-secondary text-sm font-medium">
                  Real-world impact: Silent data exfiltration on server connection, bypasses human security review
                </p>
              </div>
            </div>

            {/* Data Poisoning */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-security-critical/10">
                  <Database className="w-6 h-6 text-security-critical" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-2">Data Poisoning</h3>
                <p className="text-text-secondary text-sm mb-2">
                  Corrupted data sources can return subtly modified information that influences agent 
                  behavior and decision-making in dangerous ways.
                </p>
                <p className="text-text-secondary text-sm font-medium">
                  Real-world impact: Weakened security policies, incorrect authorization, compliance violations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-security-safe mt-1">•</span>
                <div>
                  <span className="font-medium text-text-primary">Validate Tool Outputs:</span>
                  <span className="text-text-secondary text-sm ml-2">
                    Sanitize and validate all responses from MCP servers before processing
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-security-safe mt-1">•</span>
                <div>
                  <span className="font-medium text-text-primary">Use Structured Data:</span>
                  <span className="text-text-secondary text-sm ml-2">
                    Prefer JSON over free-text responses to reduce injection risks
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-security-safe mt-1">•</span>
                <div>
                  <span className="font-medium text-text-primary">Verify Server Integrity:</span>
                  <span className="text-text-secondary text-sm ml-2">
                    Use cryptographic signatures to verify MCP server authenticity
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-security-safe mt-1">•</span>
                <div>
                  <span className="font-medium text-text-primary">Implement Rate Limiting:</span>
                  <span className="text-text-secondary text-sm ml-2">
                    Detect and prevent abnormal tool usage patterns
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-security-safe mt-1">•</span>
                <div>
                  <span className="font-medium text-text-primary">Monitor Tool Execution:</span>
                  <span className="text-text-secondary text-sm ml-2">
                    Verify tool execution through independent channels, not just tool responses
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-security-safe mt-1">•</span>
                <div>
                  <span className="font-medium text-text-primary">Require Human Review:</span>
                  <span className="text-text-secondary text-sm ml-2">
                    Critical decisions should require human approval
                  </span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-secondary/10 transition-colors group"
            >
              <span className="text-sm font-medium text-text-primary">
                Model Context Protocol Documentation
              </span>
              <ExternalLink className="w-4 h-4 text-text-tertiary group-hover:text-primary-500" />
            </a>
            <a
              href="https://owasp.org/www-project-top-10-for-large-language-model-applications/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-secondary/10 transition-colors group"
            >
              <span className="text-sm font-medium text-text-primary">
                OWASP Top 10 for Large Language Model Applications
              </span>
              <ExternalLink className="w-4 h-4 text-text-tertiary group-hover:text-primary-500" />
            </a>
            <Link
              href="/"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-secondary/10 transition-colors group"
            >
              <span className="text-sm font-medium text-text-primary">
                Try the Interactive Demos
              </span>
              <ExternalLink className="w-4 h-4 text-text-tertiary group-hover:text-primary-500" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
