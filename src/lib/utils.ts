import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 * This utility allows for conditional class names and proper
 * Tailwind CSS class merging (last class wins for conflicting utilities).
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * cn("text-sm", { "text-red-500": hasError })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
