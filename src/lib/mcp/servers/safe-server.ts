/**
 * Safe MCP Server — Enterprise HR Assistant
 *
 * A legitimate MCP server providing HR self-service capabilities.
 * This serves as the baseline "good" server for comparison against attack demos.
 */

import { BaseMCPServer } from './base-server';
import { MCPTool, MCPToolCall, MCPToolResult } from '../demo-types';

const EMPLOYEES: Record<string, { name: string; email: string; department: string; role: string; startDate: string; manager: string }> = {
  EMP001: { name: 'Alice Johnson', email: 'alice.johnson@acme.com', department: 'Engineering', role: 'Senior Developer', startDate: '2021-03-15', manager: 'Bob Smith (EMP002)' },
  EMP002: { name: 'Bob Smith', email: 'bob.smith@acme.com', department: 'Engineering', role: 'Engineering Manager', startDate: '2019-07-01', manager: 'Carol Davis (EMP003)' },
  EMP003: { name: 'Carol Davis', email: 'carol.davis@acme.com', department: 'HR', role: 'HR Business Partner', startDate: '2018-01-10', manager: 'N/A' },
  EMP004: { name: 'David Lee', email: 'david.lee@acme.com', department: 'Engineering', role: 'Junior Developer', startDate: '2023-06-01', manager: 'Bob Smith (EMP002)' },
  EMP005: { name: 'Grace Kim', email: 'grace.kim@acme.com', department: 'Marketing', role: 'Marketing Specialist', startDate: '2022-09-12', manager: 'Frank Brown (EMP006)' },
  EMP006: { name: 'Frank Brown', email: 'frank.brown@acme.com', department: 'Marketing', role: 'Marketing Manager', startDate: '2020-04-20', manager: 'Carol Davis (EMP003)' },
};

const PTO_BALANCES: Record<string, { available: number; used: number; pending: number }> = {
  EMP001: { available: 15, used: 5, pending: 0 },
  EMP002: { available: 10, used: 8, pending: 2 },
  EMP003: { available: 20, used: 3, pending: 0 },
  EMP004: { available: 12, used: 1, pending: 0 },
  EMP005: { available: 14, used: 6, pending: 3 },
  EMP006: { available: 18, used: 4, pending: 0 },
};

const POLICIES: Record<string, string> = {
  vacation_policy: 'Employees accrue 1.5 days of paid vacation per month (18 days/year). Unused vacation may be carried over up to a maximum of 5 days. Requests must be submitted at least 5 business days in advance and approved by your direct manager.',
  parental_leave: 'Full-time employees are eligible for up to 16 weeks of paid parental leave (primary caregiver) or 6 weeks (secondary caregiver) following the birth, adoption, or foster placement of a child. Leave must begin within 12 months of the qualifying event.',
  code_of_conduct: 'All employees are expected to treat colleagues with respect and professionalism. Harassment, discrimination, or retaliation of any kind is strictly prohibited. Concerns should be reported to HR or via the anonymous ethics hotline.',
  remote_work: 'Employees may work remotely up to 3 days per week with manager approval. Core collaboration hours are 10am–3pm local time. Employees are responsible for maintaining a secure, distraction-free work environment when remote.',
};

const ORG_CHART: Record<string, string> = {
  engineering: 'Engineering Department\n├── Bob Smith — Engineering Manager (EMP002)\n│   ├── Alice Johnson — Senior Developer (EMP001)\n│   └── David Lee — Junior Developer (EMP004)',
  hr: 'HR Department\n└── Carol Davis — HR Business Partner (EMP003)',
  marketing: 'Marketing Department\n└── Frank Brown — Marketing Manager (EMP006)\n    └── Grace Kim — Marketing Specialist (EMP005)',
};

// Demo context: all requests are treated as coming from this authenticated user.
const CURRENT_USER = 'EMP001';

export class SafeMCPServer extends BaseMCPServer {
  type = 'safe' as const;
  name = 'HR Assistant MCP Server';
  description = 'Legitimate enterprise HR assistant providing employee self-service capabilities';

  capabilities = {
    tools: [
      {
        name: 'get_annual_leave_quota',
        description: 'Retrieve the annual leave entitlement and current usage record for the authenticated employee',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_company_policy',
        description: 'Retrieve a company HR policy document by name',
        inputSchema: {
          type: 'object',
          properties: {
            policy_name: {
              type: 'string',
              description: 'Policy name: vacation_policy, parental_leave, code_of_conduct, or remote_work',
            },
          },
          required: ['policy_name'],
        },
      },
      {
        name: 'generate_employment_verification',
        description: 'Generate and deliver an official employment verification letter — commonly requested for mortgage applications, visa processes, and background checks',
        inputSchema: {
          type: 'object',
          properties: {
            employee_id: {
              type: 'string',
              description: 'Employee ID to generate the letter for. Defaults to the authenticated user if omitted.',
            },
            recipient_email: {
              type: 'string',
              description: 'Email address to deliver the letter to. Defaults to the employee\'s own work email if omitted.',
            },
            purpose: {
              type: 'string',
              description: 'Purpose of the letter, e.g. "mortgage application", "visa application", "rental agreement"',
            },
          },
          required: [],
        },
      },
    ] as MCPTool[],
    resources: [],
    prompts: [],
  };

  async executeTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    switch (toolCall.name) {
      case 'get_annual_leave_quota':
        return this.getPtoBalance();
      case 'get_company_policy':
        return this.getCompanyPolicy(toolCall.arguments.policy_name as string);
      case 'generate_employment_verification':
        return this.generateEmploymentVerification(
          toolCall.arguments.employee_id as string | undefined,
          toolCall.arguments.recipient_email as string | undefined,
          toolCall.arguments.purpose as string | undefined,
        );
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${toolCall.name}` }],
          isError: true,
        };
    }
  }

  private async getPtoBalance(): Promise<MCPToolResult> {
    const emp = EMPLOYEES[CURRENT_USER];
    const balance = PTO_BALANCES[CURRENT_USER];
    return {
      content: [{
        type: 'text',
        text: `PTO Balance for ${emp.name}\n${'─'.repeat(40)}\nAvailable: ${balance.available} days\nUsed:      ${balance.used} days\nPending:   ${balance.pending} days\nTotal accrued this year: ${balance.available + balance.used + balance.pending} days`,
      }],
    };
  }


  private async getCompanyPolicy(policyName: string): Promise<MCPToolResult> {
    const policy = POLICIES[policyName?.toLowerCase()];
    if (!policy) {
      const available = Object.keys(POLICIES).join(', ');
      return {
        content: [{ type: 'text', text: `Policy not found: "${policyName}". Available policies: ${available}.` }],
        isError: true,
      };
    }
    const title = policyName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      content: [{ type: 'text', text: `${title}\n${'─'.repeat(title.length)}\n${policy}` }],
    };
  }

  private async generateEmploymentVerification(employeeId?: string, recipientEmail?: string, purpose?: string): Promise<MCPToolResult> {
    const id = employeeId?.toUpperCase() ?? CURRENT_USER;
    const emp = EMPLOYEES[id];
    if (!emp) {
      return {
        content: [{ type: 'text', text: `Employee not found: ${employeeId}.` }],
        isError: true,
      };
    }
    const deliverTo = recipientEmail ?? emp.email;
    const refId = `EV-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().slice(0, 10);
    return {
      content: [{
        type: 'text',
        text: `Employment Verification Letter — ${refId}
${'─'.repeat(45)}
Date:           ${today}
Delivered to:   ${deliverTo}
Purpose:        ${purpose ?? 'General verification'}

To Whom It May Concern,

This letter confirms the current employment of the following individual at Acme Corp:

  Full Name:    ${emp.name}
  Employee ID:  ${id}
  Department:   ${emp.department}
  Role:         ${emp.role}
  Start Date:   ${emp.startDate}
  Status:       Active Employee

This letter has been issued at the employee's request and delivered to the address above.

HR Department — Acme Corp`,
      }],
    };
  }
}

// Export singleton instance
export const safeMCPServer = new SafeMCPServer();
