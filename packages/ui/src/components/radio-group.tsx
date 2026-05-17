"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root>;
type RadioGroupItemProps = React.ComponentProps<
  typeof RadioGroupPrimitive.Item
>;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Radio Group
 * Container for radio button options
 * Built on Radix UI RadioGroup - ensures only one option is selected
 */
function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        [
          // Layout
          "grid w-full gap-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Radio Group Item
 * Individual radio button with custom styling
 * Shows checked state with filled circle indicator
 */
function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        [
          // Grouping & Peering
          "group/radio-group-item peer",

          // Layout
          "relative flex aspect-square size-4 shrink-0",

          // Styling
          "rounded-full border border-input",

          // Interactivity
          "outline-none",

          // Expanded clickable area
          "after:absolute after:-inset-x-3 after:-inset-y-2",

          // Focus States
          "focus-visible:border-ring",
          "focus-visible:ring-3",
          "focus-visible:ring-ring/50",

          // Disabled States
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",

          // Invalid States (Light)
          "aria-invalid:border-destructive",
          "aria-invalid:ring-3",
          "aria-invalid:ring-destructive/20",
          "aria-invalid:data-[state=checked]:border-primary",

          // Checked States
          "data-[state=checked]:border-primary",
          "data-[state=checked]:bg-primary",
          "data-[state=checked]:text-primary-foreground",

          // Dark Mode - Background
          "dark:bg-input/30",

          // Dark Mode - Checked
          "dark:data-[state=checked]:bg-primary",

          // Dark Mode - Invalid
          "dark:aria-invalid:border-destructive/50",
          "dark:aria-invalid:ring-destructive/40",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
};
