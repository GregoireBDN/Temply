"use client";

import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root>;

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Label
 * Accessible label component built on Radix UI
 * Automatically associates with form controls and handles disabled states
 */
function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        [
          // Layout
          "flex items-center gap-2",

          // Typography
          "text-sm leading-none font-medium",

          // Interactivity
          "select-none",

          // Group Disabled States
          "group-data-[disabled=true]:pointer-events-none",
          "group-data-[disabled=true]:opacity-50",

          // Peer Disabled States
          "peer-disabled:cursor-not-allowed",
          "peer-disabled:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { Label, type LabelProps };
