import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/* ============================================================================
 * UTILITY FUNCTIONS
 * ========================================================================= */

/**
 * cn (classNames)
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * Features:
 * - Handles conditional classes via clsx (objects, arrays, etc.)
 * - Resolves Tailwind class conflicts (e.g., "px-2 px-4" → "px-4")
 * - Removes duplicate classes
 * - Preserves class priority (last class wins)
 *
 * @param {...ClassValue[]} inputs - Any number of class values (strings, objects, arrays, etc.)
 * @returns {string} Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn("px-2 py-1", "px-4") // → "py-1 px-4"
 *
 * // Conditional classes
 * cn("btn", isActive && "btn-active", { "btn-disabled": isDisabled })
 *
 * // Array of classes
 * cn(["flex", "items-center"], "gap-2")
 *
 * // Component with className prop
 * function Button({ className, ...props }) {
 *   return (
 *     <button
 *       className={cn("btn btn-primary", className)}
 *       {...props}
 *     />
 *   )
 * }
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
