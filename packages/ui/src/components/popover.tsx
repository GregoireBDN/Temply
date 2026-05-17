"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;
type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
>;
type PopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>;
type PopoverAnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>;
type PopoverHeaderProps = React.ComponentProps<"div">;
type PopoverTitleProps = React.ComponentProps<"h2">;
type PopoverDescriptionProps = React.ComponentProps<"p">;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Popover
 * Root component for popover functionality
 * Built on Radix UI Popover primitive
 */
function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Popover Trigger
 * Button or element that opens the popover on click
 */
function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * Popover Content
 * The popover panel that appears when triggered
 * Includes smooth animations and positioning logic
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          [
            // Layout & Positioning
            "z-50 flex w-72 flex-col",
            "origin-(--radix-popover-content-transform-origin)",

            // Spacing & Styling
            "gap-2.5 p-2.5",
            "rounded-lg bg-popover text-popover-foreground",

            // Shadows & Borders
            "shadow-md ring-1 ring-foreground/10",

            // Typography
            "text-sm",

            // Transitions
            "outline-hidden duration-100",

            // Slide-in animations based on side
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
    </PopoverPrimitive.Portal>
  );
}

/**
 * Popover Anchor
 * Custom positioning anchor for the popover
 * Alternative to using the trigger as the anchor point
 */
function PopoverAnchor({ ...props }: PopoverAnchorProps) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

/**
 * Popover Header
 * Container for title and description with consistent spacing
 */
function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      data-slot="popover-header"
      className={cn(
        [
          // Layout
          "flex flex-col gap-0.5",

          // Typography
          "text-sm",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Popover Title
 * Heading for the popover content
 */
function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

/**
 * Popover Description
 * Explanatory text below the title
 */
function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  type PopoverAnchorProps,
  type PopoverContentProps,
  type PopoverDescriptionProps,
  type PopoverHeaderProps,
  type PopoverProps,
  type PopoverTitleProps,
  type PopoverTriggerProps,
};
