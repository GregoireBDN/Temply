"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Progress
 * Visual progress indicator with smooth transitions
 * Built on Radix UI Progress - provides accessible progress semantics
 *
 * @example
 * <Progress value={60} /> // 60% progress
 */
function Progress({ className, value, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        [
          // Layout
          "relative flex items-center",
          "h-1 w-full",

          // Overflow & Styling
          "overflow-x-hidden rounded-full bg-muted",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          [
            // Layout
            "size-full flex-1",

            // Styling
            "bg-primary",

            // Transitions
            "transition-all",
          ].join(" "),
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { Progress, type ProgressProps };
