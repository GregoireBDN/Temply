"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type DropdownMenuProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Root
>;
type DropdownMenuPortalProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Portal
>;
type DropdownMenuTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Trigger
>;
type DropdownMenuContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
>;
type DropdownMenuGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Group
>;
type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  /** Indent the label (for use with inset items) */
  inset?: boolean;
};
type DropdownMenuItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  /** Indent the item */
  inset?: boolean;
  /** Variant style (default: default, destructive for dangerous actions) */
  variant?: "default" | "destructive";
};
type DropdownMenuCheckboxItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
> & {
  /** Indent the checkbox item */
  inset?: boolean;
};
type DropdownMenuRadioGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioGroup
>;
type DropdownMenuRadioItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
> & {
  /** Indent the radio item */
  inset?: boolean;
};
type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>;
type DropdownMenuShortcutProps = React.ComponentProps<"span">;
type DropdownMenuSubProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Sub
>;
type DropdownMenuSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  /** Indent the sub trigger */
  inset?: boolean;
};
type DropdownMenuSubContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
>;

/* ============================================================================
 * DROPDOWN MENU (ROOT COMPONENT)
 * ========================================================================= */

function DropdownMenu({ ...props }: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/* ============================================================================
 * DROPDOWN MENU PORTAL
 * ========================================================================= */

function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

/* ============================================================================
 * DROPDOWN MENU TRIGGER
 * ========================================================================= */

function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

/* ============================================================================
 * DROPDOWN MENU CONTENT
 * ========================================================================= */

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          [
            // Z-index
            "z-50",

            // Layout & Sizing
            "max-h-(--radix-dropdown-menu-content-available-height)",
            "w-(--radix-dropdown-menu-trigger-width)",
            "min-w-32",

            // Transform origin for animations
            "origin-(--radix-dropdown-menu-content-transform-origin)",

            // Overflow
            "overflow-x-hidden overflow-y-auto",

            // Styling
            "rounded-lg bg-popover p-1",
            "text-popover-foreground",
            "shadow-md ring-1 ring-foreground/10",

            // Transitions
            "duration-100",

            // Slide animations based on side
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",

            // Overflow management for closed state
            "data-[state=closed]:overflow-hidden",

            // Open animations
            "data-open:animate-in",
            "data-open:fade-in-0",
            "data-open:zoom-in-95",

            // Close animations
            "data-closed:animate-out",
            "data-closed:fade-out-0",
            "data-closed:zoom-out-95",
          ].join(" "),
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/* ============================================================================
 * DROPDOWN MENU GROUP
 * ========================================================================= */

function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

/* ============================================================================
 * DROPDOWN MENU ITEM
 * ========================================================================= */

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        [
          // Group marker
          "group/dropdown-menu-item relative",

          // Layout
          "flex items-center gap-1.5",

          // Spacing
          "px-1.5 py-1",

          // Styling
          "rounded-md",

          // Typography
          "text-sm",

          // Interactivity
          "cursor-default outline-hidden select-none",

          // Focus states (default variant)
          "focus:bg-accent focus:text-accent-foreground",
          "not-data-[variant=destructive]:focus:**:text-accent-foreground",

          // Inset variant
          "data-inset:pl-7",

          // Destructive variant
          "data-[variant=destructive]:text-destructive",
          "data-[variant=destructive]:focus:bg-destructive/10",
          "data-[variant=destructive]:focus:text-destructive",
          "dark:data-[variant=destructive]:focus:bg-destructive/20",

          // Disabled states
          "data-disabled:pointer-events-none data-disabled:opacity-50",

          // Icon styling
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
          "data-[variant=destructive]:*:[svg]:text-destructive",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DROPDOWN MENU CHECKBOX ITEM
 * ========================================================================= */

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        [
          // Layout
          "relative flex items-center gap-1.5",

          // Spacing
          "py-1 pr-8 pl-1.5",

          // Styling
          "rounded-md",

          // Typography
          "text-sm",

          // Interactivity
          "cursor-default outline-hidden select-none",

          // Focus states
          "focus:bg-accent focus:text-accent-foreground",
          "focus:**:text-accent-foreground",

          // Inset variant
          "data-inset:pl-7",

          // Disabled states
          "data-disabled:pointer-events-none data-disabled:opacity-50",

          // Icon styling
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className={cn(
          [
            // Positioning
            "pointer-events-none absolute right-2",

            // Layout
            "flex items-center justify-center",
          ].join(" "),
        )}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/* ============================================================================
 * DROPDOWN MENU RADIO GROUP
 * ========================================================================= */

function DropdownMenuRadioGroup({ ...props }: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/* ============================================================================
 * DROPDOWN MENU RADIO ITEM
 * ========================================================================= */

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        [
          // Layout
          "relative flex items-center gap-1.5",

          // Spacing
          "py-1 pr-8 pl-1.5",

          // Styling
          "rounded-md",

          // Typography
          "text-sm",

          // Interactivity
          "cursor-default outline-hidden select-none",

          // Focus states
          "focus:bg-accent focus:text-accent-foreground",
          "focus:**:text-accent-foreground",

          // Inset variant
          "data-inset:pl-7",

          // Disabled states
          "data-disabled:pointer-events-none data-disabled:opacity-50",

          // Icon styling
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          [
            // Positioning
            "pointer-events-none absolute right-2",

            // Layout
            "flex items-center justify-center",
          ].join(" "),
        )}
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/* ============================================================================
 * DROPDOWN MENU LABEL
 * ========================================================================= */

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        [
          // Spacing
          "px-1.5 py-1",

          // Typography
          "text-xs font-medium text-muted-foreground",

          // Inset variant
          "data-inset:pl-7",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DROPDOWN MENU SEPARATOR
 * ========================================================================= */

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        [
          // Spacing
          "-mx-1 my-1",

          // Styling
          "h-px bg-border",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DROPDOWN MENU SHORTCUT
 * ========================================================================= */

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        [
          // Alignment
          "ml-auto",

          // Typography
          "text-xs tracking-widest text-muted-foreground",

          // Focus states
          "group-focus/dropdown-menu-item:text-accent-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DROPDOWN MENU SUB
 * ========================================================================= */

function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/* ============================================================================
 * DROPDOWN MENU SUB TRIGGER
 * ========================================================================= */

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        [
          // Layout
          "flex items-center gap-1.5",

          // Spacing
          "px-1.5 py-1",

          // Styling
          "rounded-md",

          // Typography
          "text-sm",

          // Interactivity
          "cursor-default outline-hidden select-none",

          // Focus states
          "focus:bg-accent focus:text-accent-foreground",
          "not-data-[variant=destructive]:focus:**:text-accent-foreground",

          // Inset variant
          "data-inset:pl-7",

          // Open state
          "data-open:bg-accent data-open:text-accent-foreground",

          // Icon styling
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/* ============================================================================
 * DROPDOWN MENU SUB CONTENT
 * ========================================================================= */

function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        [
          // Z-index
          "z-50",

          // Sizing
          "min-w-[96px]",

          // Transform origin for animations
          "origin-(--radix-dropdown-menu-content-transform-origin)",

          // Overflow
          "overflow-hidden",

          // Styling
          "rounded-lg bg-popover p-1",
          "text-popover-foreground",
          "shadow-lg ring-1 ring-foreground/10",

          // Transitions
          "duration-100",

          // Slide animations based on side
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",

          // Open animations
          "data-open:animate-in",
          "data-open:fade-in-0",
          "data-open:zoom-in-95",

          // Close animations
          "data-closed:animate-out",
          "data-closed:fade-out-0",
          "data-closed:zoom-out-95",
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps,
  type DropdownMenuGroupProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuPortalProps,
  type DropdownMenuProps,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuShortcutProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuSubProps,
  type DropdownMenuSubTriggerProps,
  type DropdownMenuTriggerProps,
};
