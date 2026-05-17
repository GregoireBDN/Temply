import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type TypographyH1Props = React.ComponentProps<"h1">;
type TypographyH2Props = React.ComponentProps<"h2">;
type TypographyH3Props = React.ComponentProps<"h3">;
type TypographyH4Props = React.ComponentProps<"h4">;
type TypographyPProps = React.ComponentProps<"p">;
type TypographyBlockquoteProps = React.ComponentProps<"blockquote">;
type TypographyListProps = React.ComponentProps<"ul">;
type TypographyInlineCodeProps = React.ComponentProps<"code">;
type TypographyLeadProps = React.ComponentProps<"p">;
type TypographyLargeProps = React.ComponentProps<"div">;
type TypographySmallProps = React.ComponentProps<"small">;
type TypographyMutedProps = React.ComponentProps<"p">;

/* ============================================================================
 * H1 - Main heading
 * ========================================================================= */

function TypographyH1({ className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        [
          // Typography
          "font-heading text-4xl font-bold tracking-tight",

          // Responsive
          "lg:text-5xl",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * H2 - Section heading
 * ========================================================================= */

function TypographyH2({ className, ...props }: TypographyH2Props) {
  return (
    <h2
      className={cn(
        [
          // Typography
          "font-heading text-3xl font-semibold tracking-tight",

          // Spacing
          "scroll-m-20",

          // State
          "first:mt-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * H3 - Subsection heading
 * ========================================================================= */

function TypographyH3({ className, ...props }: TypographyH3Props) {
  return (
    <h3
      className={cn(
        [
          // Typography
          "font-heading text-2xl font-semibold tracking-tight",

          // Spacing
          "scroll-m-20",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * H4 - Subsection heading
 * ========================================================================= */

function TypographyH4({ className, ...props }: TypographyH4Props) {
  return (
    <h4
      className={cn(
        [
          // Typography
          "font-heading text-xl font-semibold tracking-tight",

          // Spacing
          "scroll-m-20",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * P - Paragraph
 * ========================================================================= */

function TypographyP({ className, ...props }: TypographyPProps) {
  return (
    <p
      className={cn(
        [
          // Typography
          "leading-7",

          // Spacing
          "[&:not(:first-child)]:mt-6",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * BLOCKQUOTE
 * ========================================================================= */

function TypographyBlockquote({
  className,
  ...props
}: TypographyBlockquoteProps) {
  return (
    <blockquote
      className={cn(
        [
          // Spacing
          "mt-6 pl-6",

          // Border
          "border-l-2",

          // Typography
          "italic",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * LIST
 * ========================================================================= */

function TypographyList({ className, ...props }: TypographyListProps) {
  return (
    <ul
      className={cn(
        [
          // Spacing
          "my-6 ml-6",

          // List style
          "list-disc",

          // Children spacing
          "[&>li]:mt-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * INLINE CODE
 * ========================================================================= */

function TypographyInlineCode({
  className,
  ...props
}: TypographyInlineCodeProps) {
  return (
    <code
      className={cn(
        [
          // Position
          "relative",

          // Spacing
          "px-[0.3rem] py-[0.2rem]",

          // Styling
          "rounded bg-muted",

          // Typography
          "font-mono text-sm font-semibold",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * LEAD - Larger paragraph for introductions
 * ========================================================================= */

function TypographyLead({ className, ...props }: TypographyLeadProps) {
  return (
    <p
      className={cn(
        [
          // Typography
          "text-xl text-muted-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * LARGE - Emphasized text
 * ========================================================================= */

function TypographyLarge({ className, ...props }: TypographyLargeProps) {
  return (
    <div
      className={cn(
        [
          // Typography
          "text-lg font-semibold",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * SMALL - Small text
 * ========================================================================= */

function TypographySmall({ className, ...props }: TypographySmallProps) {
  return (
    <small
      className={cn(
        [
          // Typography
          "text-sm leading-none font-medium",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * MUTED - Muted/secondary text
 * ========================================================================= */

function TypographyMuted({ className, ...props }: TypographyMutedProps) {
  return (
    <p
      className={cn(
        [
          // Typography
          "text-sm text-muted-foreground",
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
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  type TypographyBlockquoteProps,
  type TypographyH1Props,
  type TypographyH2Props,
  type TypographyH3Props,
  type TypographyH4Props,
  type TypographyInlineCodeProps,
  type TypographyLargeProps,
  type TypographyLeadProps,
  type TypographyListProps,
  type TypographyMutedProps,
  type TypographyPProps,
  type TypographySmallProps
};

