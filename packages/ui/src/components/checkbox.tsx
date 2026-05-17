"use client";

import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

/* ============================================================================
 * CHECKBOX (ROOT COMPONENT)
 * ========================================================================= */

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        [
          // Peer marker for label states
          "peer relative",

          // Layout
          "flex size-4 shrink-0 items-center justify-center",

          // Styling
          "rounded-[4px] border border-input",
          "dark:bg-input/30",

          // Transitions
          "transition-colors outline-none",

          // Click area expansion
          "after:absolute after:-inset-x-3 after:-inset-y-2",

          // Focus states
          "focus-visible:border-ring",
          "focus-visible:ring-3 focus-visible:ring-ring/50",

          // Disabled states
          "disabled:cursor-not-allowed disabled:opacity-50",
          "group-has-disabled/field:opacity-50",

          // Invalid states (Light)
          "aria-invalid:border-destructive",
          "aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          "aria-invalid:aria-checked:border-primary",

          // Invalid states (Dark)
          "dark:aria-invalid:border-destructive/50",
          "dark:aria-invalid:ring-destructive/40",

          // Checked states
          "data-[state=checked]:border-primary",
          "data-[state=checked]:bg-primary",
          "data-[state=checked]:text-primary-foreground",
          "dark:data-[state=checked]:bg-primary",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          [
            // Layout
            "grid place-content-center",

            // Text
            "text-current",

            // Transitions
            "transition-none",

            // Icon sizing
            "[&>svg]:size-3.5",
          ].join(" "),
        )}
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { Checkbox, type CheckboxProps };
