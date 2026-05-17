"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Button, type ButtonProps } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";
type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";

type InputGroupProps = React.ComponentProps<"div">;
type InputGroupAddonProps = React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>;
type InputGroupButtonProps = Omit<ButtonProps, "size"> &
  VariantProps<typeof inputGroupButtonVariants>;
type InputGroupTextProps = React.ComponentProps<"span">;
type InputGroupInputProps = React.ComponentProps<"input">;
type InputGroupTextareaProps = React.ComponentProps<"textarea">;

/* ============================================================================
 * VARIANTS (CVA)
 * ========================================================================= */

/**
 * Input Group Addon alignment variants
 * - inline-start: Icon/text at the start (left) of input
 * - inline-end: Icon/text at the end (right) of input
 * - block-start: Content above input (full width)
 * - block-end: Content below input (full width)
 */
const inputGroupAddonVariants = cva(
  [
    // Layout
    "flex h-auto items-center justify-center gap-2",

    // Spacing
    "py-1.5",

    // Typography
    "text-sm font-medium text-muted-foreground",

    // Interactivity
    "cursor-text select-none",

    // Disabled State
    "group-data-[disabled=true]/input-group:opacity-50",

    // Child Element Styling
    "[&>kbd]:rounded-[calc(var(--radius)-5px)]",
    "[&>svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      align: {
        "inline-start": [
          "order-first pl-2",
          "has-[>button]:ml-[-0.3rem]",
          "has-[>kbd]:ml-[-0.15rem]",
        ].join(" "),

        "inline-end": [
          "order-last pr-2",
          "has-[>button]:mr-[-0.3rem]",
          "has-[>kbd]:mr-[-0.15rem]",
        ].join(" "),

        "block-start": [
          "order-first w-full justify-start",
          "px-2.5 pt-2",
          "group-has-[>input]/input-group:pt-2",
          "[.border-b]:pb-2",
        ].join(" "),

        "block-end": [
          "order-last w-full justify-start",
          "px-2.5 pb-2",
          "group-has-[>input]/input-group:pb-2",
          "[.border-t]:pt-2",
        ].join(" "),
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

/**
 * Input Group Button size variants
 * Smaller sizes optimized for use within input groups
 */
const inputGroupButtonVariants = cva(
  [
    // Layout
    "flex items-center gap-2",

    // Typography
    "text-sm",

    // Remove default button shadow
    "shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        xs: [
          "h-6 gap-1 px-1.5",
          "rounded-[calc(var(--radius)-3px)]",
          "[&>svg:not([class*='size-'])]:size-3.5",
        ].join(" "),

        sm: "",

        "icon-xs": [
          "size-6 p-0",
          "rounded-[calc(var(--radius)-3px)]",
          "has-[>svg]:p-0",
        ].join(" "),

        "icon-sm": ["size-8 p-0", "has-[>svg]:p-0"].join(" "),
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Input Group
 * Container that combines inputs with addons (icons, text, buttons)
 * Provides unified focus states and styling
 */
function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        [
          // Grouping & Layout
          "group/input-group relative flex items-center",
          "h-8 w-full min-w-0",

          // Styling
          "rounded-lg border border-input",

          // Background
          "dark:bg-input/30",

          // Transitions
          "transition-colors outline-none",

          // Combobox Integration
          "in-data-[slot=combobox-content]:focus-within:border-inherit",
          "in-data-[slot=combobox-content]:focus-within:ring-0",

          // Disabled States
          "has-disabled:bg-input/50",
          "has-disabled:opacity-50",
          "dark:has-disabled:bg-input/80",

          // Focus States
          "has-[[data-slot=input-group-control]:focus-visible]:border-ring",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-3",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",

          // Invalid States (Light)
          "has-[[data-slot][aria-invalid=true]]:border-destructive",
          "has-[[data-slot][aria-invalid=true]]:ring-3",
          "has-[[data-slot][aria-invalid=true]]:ring-destructive/20",

          // Invalid States (Dark)
          "dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

          // Block Alignment - Vertical Layout
          "has-[>[data-align=block-end]]:h-auto",
          "has-[>[data-align=block-end]]:flex-col",
          "has-[>[data-align=block-start]]:h-auto",
          "has-[>[data-align=block-start]]:flex-col",

          // Textarea Support
          "has-[>textarea]:h-auto",

          // Input Padding Adjustments
          "has-[>[data-align=block-end]]:[&>input]:pt-3",
          "has-[>[data-align=block-start]]:[&>input]:pb-3",
          "has-[>[data-align=inline-end]]:[&>input]:pr-1.5",
          "has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Input Group Addon
 * Container for icons, text, buttons, or keyboard shortcuts
 * Clicking focuses the associated input
 */
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        // Don't focus input if clicking on a button
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

/**
 * Input Group Button
 * Compact button optimized for use within input groups
 * Uses ghost style by default to blend with input
 */
function InputGroupButton({
  className,
  type = "button",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      type={type}
      ghost
      data-size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

/**
 * Input Group Text
 * Static text or icon display within input group
 */
function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return (
    <span
      className={cn(
        [
          // Layout
          "flex items-center gap-2",

          // Typography
          "text-sm text-muted-foreground",

          // Icon Styling
          "[&_svg]:pointer-events-none",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Input Group Input
 * Input element styled to integrate seamlessly within input group
 * Removes individual borders and focus rings (handled by container)
 */
function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        [
          // Layout
          "flex-1",

          // Remove Individual Styling (handled by container)
          "rounded-none border-0 shadow-none ring-0",
          "focus-visible:ring-0",
          "aria-invalid:ring-0",

          // Background
          "bg-transparent",
          "dark:bg-transparent",

          // Disabled States
          "disabled:bg-transparent",
          "dark:disabled:bg-transparent",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Input Group Textarea
 * Textarea element styled to integrate seamlessly within input group
 * Removes individual borders and focus rings (handled by container)
 */
function InputGroupTextarea({ className, ...props }: InputGroupTextareaProps) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        [
          // Layout
          "flex-1 resize-none",

          // Spacing
          "py-2",

          // Remove Individual Styling (handled by container)
          "rounded-none border-0 shadow-none ring-0",
          "focus-visible:ring-0",
          "aria-invalid:ring-0",

          // Background
          "bg-transparent",
          "dark:bg-transparent",

          // Disabled States
          "disabled:bg-transparent",
          "dark:disabled:bg-transparent",
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
  InputGroup,
  InputGroupAddon,
  inputGroupAddonVariants,
  InputGroupButton,
  inputGroupButtonVariants,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  type InputGroupAddonAlign,
  type InputGroupAddonProps,
  type InputGroupButtonProps,
  type InputGroupButtonSize,
  type InputGroupInputProps,
  type InputGroupProps,
  type InputGroupTextareaProps,
  type InputGroupTextProps,
};
