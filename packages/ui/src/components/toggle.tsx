"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;

/* ============================================================================
 * VARIANTS (CVA)
 * ========================================================================= */

/**
 * Toggle button variants
 * - default: Transparent background
 * - outline: Border with transparent background
 * Sizes: sm (7), default (8), lg (9)
 */
const toggleVariants = cva(
  [
    // Grouping
    "group/toggle",

    // Layout
    "inline-flex items-center justify-center gap-1",

    // Styling
    "rounded-lg",

    // Typography
    "text-sm font-medium whitespace-nowrap",

    // Transitions
    "transition-all outline-none",

    // Hover States
    "hover:bg-muted",
    "hover:text-foreground",

    // Focus States
    "focus-visible:border-ring",
    "focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50",

    // Disabled States
    "disabled:pointer-events-none",
    "disabled:opacity-50",

    // Invalid States (Light)
    "aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/20",

    // Invalid States (Dark)
    "dark:aria-invalid:ring-destructive/40",

    // Pressed/On States
    "aria-pressed:bg-muted",
    "data-[state=on]:bg-muted",

    // Icon Styling
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-transparent",

        outline: ["border border-input bg-transparent", "hover:bg-muted"].join(
          " ",
        ),
      },
      size: {
        default: [
          "h-8 min-w-8 px-2.5",
          "has-data-[icon=inline-end]:pr-2",
          "has-data-[icon=inline-start]:pl-2",
        ].join(" "),

        sm: [
          "h-7 min-w-7 px-2.5",
          "rounded-[min(var(--radius-md),12px)]",
          "text-[0.8rem]",
          "has-data-[icon=inline-end]:pr-1.5",
          "has-data-[icon=inline-start]:pl-1.5",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(" "),

        lg: [
          "h-9 min-w-9 px-2.5",
          "has-data-[icon=inline-end]:pr-2",
          "has-data-[icon=inline-start]:pl-2",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Toggle
 * Two-state button (on/off) with optional outline variant
 * Built on Radix UI Toggle - manages aria-pressed state automatically
 */
function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Toggle,
  toggleVariants,
  type ToggleProps,
  type ToggleSize,
  type ToggleVariant,
};
