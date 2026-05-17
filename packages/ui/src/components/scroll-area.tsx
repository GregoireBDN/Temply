"use client";

import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root>;
type ScrollBarProps = React.ComponentProps<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Scroll Area
 * Custom scrollable container with styled scrollbars
 * Built on Radix UI ScrollArea - provides consistent cross-browser scrolling
 */
function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          [
            // Layout
            "size-full",

            // Styling
            "rounded-[inherit]",

            // Transitions
            "transition-[color,box-shadow]",

            // Focus States
            "outline-none",
            "focus-visible:ring-[3px]",
            "focus-visible:ring-ring/50",
            "focus-visible:outline-1",
          ].join(" "),
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * Scroll Bar
 * Styled scrollbar for ScrollArea
 * Supports both vertical and horizontal orientations
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        [
          // Layout
          "flex",

          // Spacing
          "p-px",

          // Interactivity
          "touch-none select-none",

          // Transitions
          "transition-colors",

          // Horizontal Orientation
          "data-horizontal:h-2.5",
          "data-horizontal:flex-col",
          "data-horizontal:border-t",
          "data-horizontal:border-t-transparent",

          // Vertical Orientation
          "data-vertical:h-full",
          "data-vertical:w-2.5",
          "data-vertical:border-l",
          "data-vertical:border-l-transparent",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { ScrollArea, ScrollBar, type ScrollAreaProps, type ScrollBarProps };
