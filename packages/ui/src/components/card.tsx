import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type CardSize = "default" | "sm";

type CardProps = React.ComponentProps<"div"> & {
  /** Size variant of the card */
  size?: CardSize;
};

type CardHeaderProps = React.ComponentProps<"div">;
type CardTitleProps = React.ComponentProps<"div">;
type CardDescriptionProps = React.ComponentProps<"div">;
type CardActionProps = React.ComponentProps<"div">;
type CardContentProps = React.ComponentProps<"div">;
type CardFooterProps = React.ComponentProps<"div">;

/* ============================================================================
 * CARD (ROOT COMPONENT)
 * ========================================================================= */

function Card({ className, size = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        [
          // Layout
          "group/card flex flex-col overflow-hidden",

          // Spacing
          "gap-4 py-4",
          "data-[size=sm]:gap-3 data-[size=sm]:py-3",

          // Styling
          "rounded-xl bg-card text-sm text-card-foreground",
          "ring-1 ring-foreground/10",

          // Footer spacing adjustment
          "has-data-[slot=card-footer]:pb-0",
          "data-[size=sm]:has-data-[slot=card-footer]:pb-0",

          // Image handling (first/last child)
          "has-[>img:first-child]:pt-0",
          "*:[img:first-child]:rounded-t-xl",
          "*:[img:last-child]:rounded-b-xl",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * CARD HEADER
 * ========================================================================= */

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          // Container
          "group/card-header @container/card-header",

          // Layout
          "grid auto-rows-min items-start",

          // Spacing
          "gap-1 rounded-t-xl px-4",
          "group-data-[size=sm]/card:px-3",

          // Grid configuration
          "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
          "has-data-[slot=card-description]:grid-rows-[auto_auto]",

          // Border bottom spacing (when border-b class is applied)
          "[.border-b]:pb-4",
          "group-data-[size=sm]/card:[.border-b]:pb-3",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * CARD TITLE
 * ========================================================================= */

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        [
          // Typography
          "font-heading text-base leading-snug font-medium",
          "group-data-[size=sm]/card:text-sm",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * CARD DESCRIPTION
 * ========================================================================= */

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ============================================================================
 * CARD ACTION
 * ========================================================================= */

function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        [
          // Grid positioning (top-right corner of header)
          "col-start-2 row-span-2 row-start-1",
          "self-start justify-self-end",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * CARD CONTENT
 * ========================================================================= */

function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        [
          // Spacing
          "px-4",
          "group-data-[size=sm]/card:px-3",
          "mb-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * CARD FOOTER
 * ========================================================================= */

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        [
          // Layout
          "flex items-center",

          // Spacing
          "p-4",
          "group-data-[size=sm]/card:p-3",

          // Styling
          "rounded-b-xl border-t bg-muted/50",
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
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
