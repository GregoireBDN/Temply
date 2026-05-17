"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import * as React from "react";

import { Button } from "./button";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SheetSide = "top" | "right" | "bottom" | "left";

type SheetProps = React.ComponentProps<typeof SheetPrimitive.Root>;
type SheetTriggerProps = React.ComponentProps<typeof SheetPrimitive.Trigger>;
type SheetCloseProps = React.ComponentProps<typeof SheetPrimitive.Close>;
type SheetPortalProps = React.ComponentProps<typeof SheetPrimitive.Portal>;
type SheetOverlayProps = React.ComponentProps<typeof SheetPrimitive.Overlay>;
type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide;
  showCloseButton?: boolean;
};
type SheetHeaderProps = React.ComponentProps<"div">;
type SheetFooterProps = React.ComponentProps<"div">;
type SheetTitleProps = React.ComponentProps<typeof SheetPrimitive.Title>;
type SheetDescriptionProps = React.ComponentProps<
  typeof SheetPrimitive.Description
>;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Sheet
 * Root component for sheet (drawer/slide-over) functionality
 * Built on Radix UI Dialog - provides modal drawer from screen edges
 */
function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Sheet Trigger
 * Button or element that opens the sheet on click
 */
function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

/**
 * Sheet Close
 * Programmatic close trigger for the sheet
 */
function SheetClose({ ...props }: SheetCloseProps) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/**
 * Sheet Portal
 * Renders sheet content in a portal (outside normal DOM hierarchy)
 */
function SheetPortal({ ...props }: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Sheet Overlay
 * Semi-transparent backdrop that covers the screen
 * Supports backdrop blur on compatible browsers
 */
function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        [
          // Positioning
          "fixed inset-0 z-50",

          // Styling
          "bg-black/10",

          // Backdrop Blur (when supported)
          "supports-backdrop-filter:backdrop-blur-xs",

          // Transitions
          "duration-100",

          // Open Animations
          "data-open:animate-in",
          "data-open:fade-in-0",

          // Close Animations
          "data-closed:animate-out",
          "data-closed:fade-out-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sheet Content
 * The sheet panel that slides in from the specified side
 * Includes optional close button and smooth slide animations
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          [
            // Positioning
            "fixed z-50",

            // Layout
            "flex flex-col gap-4",

            // Styling
            "bg-popover bg-clip-padding text-popover-foreground",
            "shadow-lg",

            // Typography
            "text-sm",

            // Transitions
            "transition duration-200 ease-in-out",

            // Side: Bottom
            "data-[side=bottom]:inset-x-0",
            "data-[side=bottom]:bottom-0",
            "data-[side=bottom]:h-auto",
            "data-[side=bottom]:border-t",

            // Side: Left
            "data-[side=left]:inset-y-0",
            "data-[side=left]:left-0",
            "data-[side=left]:h-full",
            "data-[side=left]:w-3/4",
            "data-[side=left]:border-r",
            "data-[side=left]:sm:max-w-sm",

            // Side: Right
            "data-[side=right]:inset-y-0",
            "data-[side=right]:right-0",
            "data-[side=right]:h-full",
            "data-[side=right]:w-3/4",
            "data-[side=right]:border-l",
            "data-[side=right]:sm:max-w-sm",

            // Side: Top
            "data-[side=top]:inset-x-0",
            "data-[side=top]:top-0",
            "data-[side=top]:h-auto",
            "data-[side=top]:border-b",

            // Open Animations
            "data-open:animate-in",
            "data-open:fade-in-0",
            "data-[side=bottom]:data-open:slide-in-from-bottom-10",
            "data-[side=left]:data-open:slide-in-from-left-10",
            "data-[side=right]:data-open:slide-in-from-right-10",
            "data-[side=top]:data-open:slide-in-from-top-10",

            // Close Animations
            "data-closed:animate-out",
            "data-closed:fade-out-0",
            "data-[side=bottom]:data-closed:slide-out-to-bottom-10",
            "data-[side=left]:data-closed:slide-out-to-left-10",
            "data-[side=right]:data-closed:slide-out-to-right-10",
            "data-[side=top]:data-closed:slide-out-to-top-10",
          ].join(" "),
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button ghost iconOnly size="sm" className="absolute top-3 right-3">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * Sheet Header
 * Container for sheet title and description with consistent spacing
 */
function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        [
          // Layout
          "flex flex-col gap-0.5",

          // Spacing
          "p-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sheet Footer
 * Container for sheet actions (buttons, etc.)
 * Automatically positioned at bottom with margin-top auto
 */
function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        [
          // Layout
          "mt-auto flex flex-col gap-2",

          // Spacing
          "p-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sheet Title
 * Heading for the sheet content
 * Uses heading font with medium weight
 */
function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        [
          // Typography
          "font-heading text-base font-medium text-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sheet Description
 * Explanatory text below the title
 */
function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetCloseProps,
  type SheetContentProps,
  type SheetDescriptionProps,
  type SheetFooterProps,
  type SheetHeaderProps,
  type SheetOverlayProps,
  type SheetPortalProps,
  type SheetProps,
  type SheetSide,
  type SheetTitleProps,
  type SheetTriggerProps,
};
