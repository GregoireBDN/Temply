"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type TooltipProviderProps = React.ComponentProps<
  typeof TooltipPrimitive.Provider
>;
type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;
type TooltipTriggerProps = React.ComponentProps<
  typeof TooltipPrimitive.Trigger
>;
type TooltipContentProps = React.ComponentProps<
  typeof TooltipPrimitive.Content
>;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Tooltip Provider
 * Root provider for tooltip functionality
 * Set delayDuration to 0 for instant tooltips (default)
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * Tooltip
 * Root tooltip component
 * Built on Radix UI Tooltip primitive
 */
function Tooltip({ ...props }: TooltipProps) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/**
 * Tooltip Trigger
 * Element that triggers the tooltip on hover/focus
 */
function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Tooltip Content
 * The tooltip popover content with arrow
 * Inverted colors (foreground bg, background text) for contrast
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          [
            // Positioning
            "z-50",
            "origin-(--radix-tooltip-content-transform-origin)",

            // Layout
            "inline-flex w-fit max-w-xs items-center gap-1.5",

            // Styling
            "rounded-md border bg-popover text-popover-foreground shadow-md",

            // Spacing
            "px-3 py-1.5",

            // Typography
            "text-xs",

            // Kbd Integration
            "has-data-[slot=kbd]:pr-1.5",
            "**:data-[slot=kbd]:relative",
            "**:data-[slot=kbd]:isolate",
            "**:data-[slot=kbd]:z-50",
            "**:data-[slot=kbd]:rounded-sm",

            // Slide-in animations based on side
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",

            // Delayed open animations
            "data-[state=delayed-open]:animate-in",
            "data-[state=delayed-open]:fade-in-0",
            "data-[state=delayed-open]:zoom-in-95",

            // Open animations
            "data-open:animate-in",
            "data-open:fade-in-0",
            "data-open:zoom-in-95",

            // Close animations
            "data-closed:animate-out",
            "data-closed:fade-out-0",
            "data-closed:zoom-out-95",
          ].join(" "),
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] border bg-popover fill-popover" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
  type TooltipProps,
  type TooltipProviderProps,
  type TooltipTriggerProps,
};
