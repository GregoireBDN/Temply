import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type NativeSelectSize = "sm" | "default";

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: NativeSelectSize;
};
type NativeSelectOptionProps = React.ComponentProps<"option">;
type NativeSelectOptGroupProps = React.ComponentProps<"optgroup">;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Native Select
 * Styled native HTML select element with custom chevron icon
 * Preferred for mobile devices and simple use cases
 */
function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        [
          // Grouping
          "group/native-select",

          // Layout
          "relative w-fit",

          // Disabled State
          "has-[select:disabled]:opacity-50",
        ].join(" "),
        className,
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          [
            // Layout & Sizing
            "h-8 w-full min-w-0",

            // Spacing
            "py-1 pr-8 pl-2.5",

            // Styling
            "appearance-none rounded-lg border border-input bg-transparent",

            // Typography
            "text-sm",

            // Transitions
            "transition-colors outline-none",

            // Selection
            "select-none",
            "selection:bg-primary",
            "selection:text-primary-foreground",

            // Placeholder
            "placeholder:text-muted-foreground",

            // Focus States
            "focus-visible:border-ring",
            "focus-visible:ring-3",
            "focus-visible:ring-ring/50",

            // Disabled States
            "disabled:pointer-events-none",
            "disabled:cursor-not-allowed",

            // Invalid States (Light)
            "aria-invalid:border-destructive",
            "aria-invalid:ring-3",
            "aria-invalid:ring-destructive/20",

            // Small Size Variant
            "data-[size=sm]:h-7",
            "data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
            "data-[size=sm]:py-0.5",

            // Dark Mode - Background
            "dark:bg-input/30",
            "dark:hover:bg-input/50",

            // Dark Mode - Invalid
            "dark:aria-invalid:border-destructive/50",
            "dark:aria-invalid:ring-destructive/40",
          ].join(" "),
        )}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

/**
 * Native Select Option
 * Individual option within a native select
 * Uses system colors for proper OS integration
 */
function NativeSelectOption({ className, ...props }: NativeSelectOptionProps) {
  return (
    <option
      data-slot="native-select-option"
      className={cn(
        [
          // System Colors (adapts to OS theme)
          "bg-[Canvas] text-[CanvasText]",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Native Select OptGroup
 * Semantic grouping of related options
 * Uses system colors for proper OS integration
 */
function NativeSelectOptGroup({
  className,
  ...props
}: NativeSelectOptGroupProps) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(
        [
          // System Colors (adapts to OS theme)
          "bg-[Canvas] text-[CanvasText]",
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

export {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  type NativeSelectOptGroupProps,
  type NativeSelectOptionProps,
  type NativeSelectProps,
  type NativeSelectSize,
};
