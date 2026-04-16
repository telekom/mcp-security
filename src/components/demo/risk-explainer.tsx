/**
 * Risk Explainer Component
 *
 * Educational component explaining security risks for each demo
 */

'use client';

import React from 'react';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/badge';

interface RiskExplainerProps {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impacts: string[];
  mitigations: string[];
}

export function RiskExplainer({
  riskLevel,
  title,
  description,
  impacts,
  mitigations,
}: RiskExplainerProps) {
  const getRiskIcon = () => {
    if (riskLevel === 'low') return Shield;
    return AlertTriangle;
  };

  const getRiskColor = () => {
    const colors = {
      low: 'text-security-safe',
      medium: 'text-security-medium',
      high: 'text-security-high',
      critical: 'text-security-critical',
    };
    return colors[riskLevel];
  };

  const RiskIcon = getRiskIcon();

  return (
    <Card className="border-t-2 border-t-accent-blue">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-background ${getRiskColor()}`}>
            <RiskIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <Badge variant={riskLevel}>{riskLevel.toUpperCase()}</Badge>
            </div>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Potential Impacts */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-status-warning" />
            <h4 className="font-semibold text-sm text-text-primary">Potential Impacts</h4>
          </div>
          <ul className="space-y-1">
            {impacts.map((impact, index) => (
              <li key={index} className="text-sm text-text-secondary flex gap-2">
                <span className="text-status-warning mt-1">•</span>
                <span>{impact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mitigations */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-security-safe" />
            <h4 className="font-semibold text-sm text-text-primary">How to Prevent</h4>
          </div>
          <ul className="space-y-1">
            {mitigations.map((mitigation, index) => (
              <li key={index} className="text-sm text-text-secondary flex gap-2">
                <span className="text-security-safe mt-1">•</span>
                <span>{mitigation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-accent-teal/10 rounded border border-accent-teal/30">
          <Info className="w-4 h-4 text-accent-teal mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            This demo runs in a safe, sandboxed environment. No actual systems are affected.
            The vulnerabilities shown are for educational purposes only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
