import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { Separator, type SeparatorProps } from "./separator";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type ButtonGroupOrientation = "horizontal" | "vertical";

type ButtonGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants> & {
    /** Orientation of the button group (default: horizontal) */
    orientation?: ButtonGroupOrientation;
  };

type ButtonGroupTextProps = React.ComponentProps<"div"> & {
  /** Render as a different component using Radix Slot */
  asChild?: boolean;
};

type ButtonGroupSeparatorProps = SeparatorProps;

/* ============================================================================
 * BASE STYLES (CVA)
 * ========================================================================= */

const buttonGroupVariants = cva(
  [
    // Layout
    "group/button-group flex w-fit items-stretch",

    // Focus management
    "*:focus-visible:relative *:focus-visible:z-10",

    // Nested button group spacing
    "has-[>[data-slot=button-group]]:gap-2",

    // Select trigger handling
    "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg",
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",

    // Input handling
    "[&>input]:flex-1",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: [
          // Remove left border radius and border for non-first children
          "[&>*:not(:first-child)]:rounded-l-none",
          "[&>*:not(:first-child)]:border-l-0",

          // Remove right border radius for non-last children
          "[&>*:not(:last-child)]:rounded-r-none",

          // Ensure last data-slot has rounded right
          "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
        ].join(" "),

        vertical: [
          // Vertical layout
          "flex-col",

          // Remove top border radius and border for non-first children
          "[&>*:not(:first-child)]:rounded-t-none",
          "[&>*:not(:first-child)]:border-t-0",

          // Remove bottom border radius for non-last children
          "[&>*:not(:last-child)]:rounded-b-none",

          // Ensure last data-slot has rounded bottom
          "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
        ].join(" "),
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

/* ============================================================================
 * BUTTON GROUP (ROOT COMPONENT)
 * ========================================================================= */

function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

/* ============================================================================
 * BUTTON GROUP TEXT
 * ========================================================================= */

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: ButtonGroupTextProps) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn(
        [
          // Layout
          "flex items-center",

          // Spacing
          "gap-2 px-2.5",

          // Styling
          "rounded-lg border bg-muted",

          // Typography
          "text-sm font-medium",

          // Icon styling
          "[&_svg]:pointer-events-none",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * BUTTON GROUP SEPARATOR
 * ========================================================================= */

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: ButtonGroupSeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        [
          // Layout
          "relative self-stretch",

          // Styling
          "bg-input",

          // Horizontal orientation spacing
          "data-horizontal:mx-px data-horizontal:w-auto",

          // Vertical orientation spacing
          "data-vertical:my-px data-vertical:h-auto",
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
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
  type ButtonGroupOrientation,
  type ButtonGroupProps,
  type ButtonGroupSeparatorProps,
  type ButtonGroupTextProps,
};
