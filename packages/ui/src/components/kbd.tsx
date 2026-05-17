import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type KbdProps = React.ComponentProps<"kbd">;
type KbdGroupProps = React.ComponentProps<"div">;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Kbd (Keyboard Key)
 * Displays keyboard shortcuts in a styled badge
 * Commonly used in tooltips, documentation, and UI hints
 */
function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        [
          // Layout
          "inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1",

          // Styling
          "rounded-sm bg-muted",

          // Spacing
          "px-1",

          // Typography
          "font-sans text-xs font-medium text-muted-foreground",

          // Interactivity
          "pointer-events-none select-none",

          // Tooltip Integration (Light)
          "in-data-[slot=tooltip-content]:bg-background/20",
          "in-data-[slot=tooltip-content]:text-background",

          // Tooltip Integration (Dark)
          "dark:in-data-[slot=tooltip-content]:bg-background/10",

          // Icon Styling
          "[&_svg:not([class*='size-'])]:size-3",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Kbd Group
 * Container for multiple keyboard keys (e.g., "Cmd + K")
 * Automatically handles spacing between keys
 */
function KbdGroup({ className, ...props }: KbdGroupProps) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { Kbd, KbdGroup, type KbdGroupProps, type KbdProps };
