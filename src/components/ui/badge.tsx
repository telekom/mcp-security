import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white hover:bg-interactive-hover",
        secondary:
          "border-transparent bg-surface-secondary/10 text-text-secondary hover:bg-surface-secondary/20",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Security-specific variants
        critical:
          "border-transparent bg-security-critical/10 text-security-critical",
        high: "border-transparent bg-security-high/10 text-security-high",
        medium:
          "border-transparent bg-security-medium/10 text-security-medium",
        low: "border-transparent bg-security-low/10 text-security-low",
        info: "border-transparent bg-security-info/10 text-security-info",
        safe: "border-transparent bg-security-safe/10 text-security-safe",
        // Status variants
        success:
          "border-transparent bg-status-success/10 text-status-success",
        warning:
          "border-transparent bg-status-warning/10 text-status-warning",
        error: "border-transparent bg-status-error/10 text-status-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
