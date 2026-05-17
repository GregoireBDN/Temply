"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SwitchSize = "sm" | "default";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: SwitchSize;
};

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Switch
 * Toggle switch for boolean input
 * Built on Radix UI Switch - supports two sizes (sm, default)
 */
function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        [
          // Grouping & Peering
          "peer group/switch",

          // Layout
          "relative inline-flex shrink-0 items-center",

          // Styling
          "rounded-full border border-transparent",

          // Transitions
          "transition-all outline-none",

          // Expanded clickable area
          "after:absolute after:-inset-x-3 after:-inset-y-2",

          // Focus States
          "focus-visible:border-ring",
          "focus-visible:ring-3",
          "focus-visible:ring-ring/50",

          // Invalid States (Light)
          "aria-invalid:border-destructive",
          "aria-invalid:ring-3",
          "aria-invalid:ring-destructive/20",

          // Invalid States (Dark)
          "dark:aria-invalid:border-destructive/50",
          "dark:aria-invalid:ring-destructive/40",

          // Size: Default
          "data-[size=default]:h-[18.4px]",
          "data-[size=default]:w-[32px]",

          // Size: Small
          "data-[size=sm]:h-[14px]",
          "data-[size=sm]:w-[24px]",

          // Checked State
          "data-[state=checked]:bg-primary",

          // Unchecked State (Light)
          "data-[state=unchecked]:bg-input",

          // Unchecked State (Dark)
          "dark:data-[state=unchecked]:bg-input/80",

          // Disabled State
          "data-[disabled]:cursor-not-allowed",
          "data-[disabled]:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          [
            // Layout
            "block",

            // Interactivity
            "pointer-events-none",

            // Styling
            "rounded-full bg-background shadow-md ring-1 ring-border/25",

            // Transitions
            "transition-transform",

            // Size: Default
            "group-data-[size=default]/switch:size-3.5",

            // Size: Small
            "group-data-[size=sm]/switch:size-2.5",

            // Checked - Default Size
            "group-data-[size=default]/switch:data-[state=checked]:translate-x-[15px]",

            // Checked - Small Size
            "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[11px]",

            // Checked - Dark Mode
            "dark:data-[state=checked]:bg-primary-foreground",

            // Unchecked - Default Size
            "group-data-[size=default]/switch:data-[state=unchecked]:-translate-x-[1px]",

            // Unchecked - Small Size
            "group-data-[size=sm]/switch:data-[state=unchecked]:-translate-x-[1px]",

            // Unchecked - Dark Mode
            "dark:data-[state=unchecked]:bg-foreground",
          ].join(" "),
        )}
      />
    </SwitchPrimitive.Root>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { Switch, type SwitchProps, type SwitchSize };
