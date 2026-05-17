"use client";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";

import { Button } from "./button";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
type DialogDescriptionProps = React.ComponentProps<
  typeof DialogPrimitive.Description
>;

type DialogContentProps = React.ComponentProps<
  typeof DialogPrimitive.Content
> & {
  /** Show the close button in the top-right corner (default: true) */
  showCloseButton?: boolean;
};

type DialogHeaderProps = React.ComponentProps<"div">;

type DialogFooterProps = React.ComponentProps<"div"> & {
  /** Show a close button in the footer (default: false) */
  showCloseButton?: boolean;
};

/* ============================================================================
 * DIALOG (ROOT COMPONENT)
 * ========================================================================= */

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/* ============================================================================
 * DIALOG TRIGGER
 * ========================================================================= */

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/* ============================================================================
 * DIALOG PORTAL
 * ========================================================================= */

function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/* ============================================================================
 * DIALOG CLOSE
 * ========================================================================= */

function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/* ============================================================================
 * DIALOG OVERLAY
 * ========================================================================= */

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        [
          // Positioning
          "fixed inset-0 isolate z-50",

          // Styling
          "bg-black/10",
          "supports-backdrop-filter:backdrop-blur-xs",

          // Animations
          "duration-100",
          "data-open:animate-in data-open:fade-in-0",
          "data-closed:animate-out data-closed:fade-out-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DIALOG CONTENT
 * ========================================================================= */

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          [
            // Positioning
            "fixed top-1/2 left-1/2 z-50",
            "-translate-x-1/2 -translate-y-1/2",

            // Layout
            "grid w-full max-w-[calc(100%-2rem)]",
            "sm:max-w-sm",

            // Spacing
            "gap-4 p-4",

            // Styling
            "rounded-xl bg-popover text-sm text-popover-foreground",
            "ring-1 ring-foreground/10",

            // Interactivity
            "duration-100 outline-none",

            // Animations
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          ].join(" "),
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="secondary"
              ghost
              className="absolute top-2 right-2"
              iconOnly
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/* ============================================================================
 * DIALOG HEADER
 * ========================================================================= */

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        [
          // Layout
          "flex flex-col",

          // Spacing
          "gap-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DIALOG FOOTER
 * ========================================================================= */

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        [
          // Layout
          "flex flex-col-reverse gap-2",
          "sm:flex-row sm:justify-end",

          // Spacing
          "-mx-4 -mb-4 p-4",

          // Styling
          "rounded-b-xl border-t bg-muted/50",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="secondary" outline>
            Close
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/* ============================================================================
 * DIALOG TITLE
 * ========================================================================= */

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        [
          // Typography
          "font-heading text-base leading-none font-medium",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * DIALOG DESCRIPTION
 * ========================================================================= */

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        [
          // Typography
          "text-sm text-muted-foreground",

          // Link styling
          "*:[a]:underline *:[a]:underline-offset-3",
          "*:[a]:hover:text-foreground",
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogProps,
  type DialogTitleProps,
  type DialogTriggerProps,
};
