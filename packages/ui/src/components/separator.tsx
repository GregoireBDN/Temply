"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SeparatorOrientation = "horizontal" | "vertical";

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  /** Orientation of the separator (default: horizontal) */
  orientation?: SeparatorOrientation;
  /** Whether the separator is purely decorative (default: true) */
  decorative?: boolean;
};

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        [
          // Layout
          "shrink-0",

          // Styling
          "bg-border",

          // Horizontal orientation
          "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",

          // Vertical orientation
          "data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
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

export { Separator, type SeparatorOrientation, type SeparatorProps };
