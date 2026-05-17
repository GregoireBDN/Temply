"use client";

import { type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

import { toggleVariants } from "./toggle";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type ToggleGroupOrientation = "horizontal" | "vertical";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing?: number;
  orientation?: ToggleGroupOrientation;
};

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: ToggleGroupOrientation;
  };

type ToggleGroupItemProps = React.ComponentProps<
  typeof ToggleGroupPrimitive.Item
> &
  VariantProps<typeof toggleVariants>;

/* ============================================================================
 * CONTEXT
 * ========================================================================= */

/**
 * Toggle Group Context
 * Provides variant, size, spacing, and orientation to all items
 */
const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
});

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Toggle Group
 * Container for multiple toggle items with shared styling
 * Built on Radix UI ToggleGroup - supports horizontal/vertical orientation
 * Set spacing to 0 for segmented control style (joined buttons)
 */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        [
          // Grouping
          "group/toggle-group",

          // Layout
          "flex w-fit flex-row items-center",

          // Spacing
          "gap-[--spacing(var(--gap))]",

          // Styling
          "rounded-lg",

          // Size Variants
          "data-[size=sm]:rounded-[min(var(--radius-md),10px)]",

          // Vertical Orientation
          "data-vertical:flex-col",
          "data-vertical:items-stretch",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

/**
 * Toggle Group Item
 * Individual toggle button within a ToggleGroup
 * Inherits variant and size from parent context
 * When spacing=0, buttons are joined together (segmented control style)
 */
function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        [
          // Layout
          "shrink-0",

          // Focus States
          "focus:z-10",
          "focus-visible:z-10",

          // Spacing=0: Segmented Control Style
          "group-data-[spacing=0]/toggle-group:rounded-none",
          "group-data-[spacing=0]/toggle-group:px-2",

          // Spacing=0: Icon Padding Adjustments
          "group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5",
          "group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5",

          // Spacing=0: First/Last Border Radius (Horizontal)
          "group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg",
          "group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg",

          // Spacing=0: First/Last Border Radius (Vertical)
          "group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg",
          "group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg",

          // Spacing=0: Border Removal (Horizontal Outline)
          "group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0",
          "group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l",

          // Spacing=0: Border Removal (Vertical Outline)
          "group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0",
          "group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        ].join(" "),
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupItemProps,
  type ToggleGroupOrientation,
  type ToggleGroupProps,
};
