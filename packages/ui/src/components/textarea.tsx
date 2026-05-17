import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type TextareaProps = React.ComponentProps<"textarea">;

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Textarea
 * Multi-line text input with auto-resizing capability
 * Uses field-sizing-content for automatic height adjustment
 */
function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          // Layout
          "flex field-sizing-content",
          "min-h-16 w-full",

          // Spacing
          "px-3 py-2",

          // Styling
          "rounded-lg border border-input bg-transparent",

          // Typography
          "text-base md:text-sm",

          // Transitions
          "transition-colors outline-none",

          // Placeholder
          "placeholder:text-muted-foreground",

          // Focus States
          "focus-visible:border-ring",
          "focus-visible:ring-3",
          "focus-visible:ring-ring/50",

          // Disabled States
          "disabled:cursor-not-allowed",
          "disabled:bg-input/50",
          "disabled:opacity-50",

          // Invalid States (Light)
          "aria-invalid:border-destructive",
          "aria-invalid:ring-3",
          "aria-invalid:ring-destructive/20",

          // Dark Mode - Background
          "dark:bg-input/30",

          // Dark Mode - Disabled
          "dark:disabled:bg-input/80",

          // Dark Mode - Invalid
          "dark:aria-invalid:border-destructive/50",
          "dark:aria-invalid:ring-destructive/40",
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

export { Textarea, type TextareaProps };
