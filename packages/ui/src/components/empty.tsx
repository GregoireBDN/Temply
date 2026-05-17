import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type EmptyMediaVariant = "default" | "icon";

type EmptyProps = React.ComponentProps<"div">;
type EmptyHeaderProps = React.ComponentProps<"div">;
type EmptyTitleProps = React.ComponentProps<"div">;
type EmptyDescriptionProps = React.ComponentProps<"p">;
type EmptyContentProps = React.ComponentProps<"div">;
type EmptyMediaProps = React.ComponentProps<"div"> &
  VariantProps<typeof emptyMediaVariants>;

/* ============================================================================
 * VARIANTS (CVA)
 * ========================================================================= */

/**
 * Media/Icon container variants
 * - default: Transparent background for images or custom illustrations
 * - icon: Small rounded container with muted background for icons
 */
const emptyMediaVariants = cva(
  [
    // Layout
    "mb-2 flex shrink-0 items-center justify-center",

    // Icon Styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-transparent",

        icon: [
          "flex size-8 shrink-0 items-center justify-center",
          "rounded-lg bg-muted text-foreground",
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Empty State Container
 * Root component that centers and spaces all empty state content
 */
function Empty({ className, ...props }: EmptyProps) {
  return (
    <div
      data-slot="empty"
      className={cn(
        [
          // Layout
          "flex w-full min-w-0 flex-1 flex-col items-center justify-center",

          // Spacing & Styling
          "gap-4 rounded-xl border-dashed p-6",

          // Typography
          "text-center text-balance",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Empty State Header
 * Contains the media (icon/illustration) and title
 */
function EmptyHeader({ className, ...props }: EmptyHeaderProps) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  );
}

/**
 * Empty State Media
 * Container for icons or illustrations with optional background styling
 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: EmptyMediaProps) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

/**
 * Empty State Title
 * Main heading for the empty state
 */
function EmptyTitle({ className, ...props }: EmptyTitleProps) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-heading text-sm font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Empty State Description
 * Explanatory text with support for styled links
 */
function EmptyDescription({ className, ...props }: EmptyDescriptionProps) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        [
          // Typography
          "text-sm/relaxed text-muted-foreground",

          // Link Styling
          "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Empty State Content
 * Container for actions or additional content (buttons, forms, etc.)
 */
function EmptyContent({ className, ...props }: EmptyContentProps) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        [
          // Layout
          "flex w-full max-w-sm min-w-0 flex-col items-center",

          // Spacing & Typography
          "gap-2.5 text-sm text-balance",
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  emptyMediaVariants,
  EmptyTitle,
  type EmptyContentProps,
  type EmptyDescriptionProps,
  type EmptyHeaderProps,
  type EmptyMediaProps,
  type EmptyMediaVariant,
  type EmptyProps,
  type EmptyTitleProps,
};
