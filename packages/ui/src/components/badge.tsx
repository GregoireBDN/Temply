import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SemanticVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type VisualStyle = "solid" | "outline";

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeBase> & {
    /** Semantic variant - defines the intent/meaning of the badge */
    variant?: SemanticVariant;
    /** Visual style modifiers (priority:  ghost > outline > solid) */
    outline?: boolean;
    /** Render as a different component using Radix Slot */
    asChild?: boolean;
  };

/* ============================================================================
 * BASE STYLES (CVA)
 * ========================================================================= */

const badgeBase = cva(
  [
    // Layout & Display
    "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center",

    // Spacing
    "gap-1 px-2 py-0.5",

    // Styling
    "overflow-hidden rounded-4xl border border-transparent",

    // Typography
    "text-xs font-medium whitespace-nowrap",

    // Transitions
    "transition-all",

    // Focus States
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",

    // Icon padding adjustments
    "has-data-[icon=inline-end]:pr-1.5",
    "has-data-[icon=inline-start]:pl-1.5",

    // Invalid States (Light)
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",

    // Invalid States (Dark)
    "dark:aria-invalid:ring-destructive/40",

    // Icon Styling
    "[&>svg]:pointer-events-none [&>svg]:size-3!",
  ].join(" "),
);

/* ============================================================================
 * VARIANT STYLES
 * Each visual style (solid, outline, ghost) has styles for each
 * semantic variant (primary, secondary, success, warning, danger, info)
 * ========================================================================= */

// Solid (filled background)
const solidStyles: Record<SemanticVariant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "[a]:hover:bg-primary/80",
  ].join(" "),

  secondary: [
    "bg-secondary text-secondary-foreground",
    "[a]:hover:bg-secondary/80",
  ].join(" "),

  success: [
    "bg-success text-success-foreground",
    "[a]:hover:bg-success/80",
  ].join(" "),

  warning: [
    "bg-warning text-warning-foreground",
    "[a]:hover:bg-warning/80",
  ].join(" "),

  danger: [
    "bg-destructive text-destructive-foreground",
    "[a]:hover:bg-destructive/80",
  ].join(" "),

  info: ["bg-info text-info-foreground", "[a]:hover:bg-info/80"].join(" "),
};

// Outline (border with transparent background)
const outlineStyles: Record<SemanticVariant, string> = {
  primary: [
    "border-primary text-primary bg-background",
    "[a]:hover:bg-primary/10",
  ].join(" "),

  secondary: [
    "border-secondary-foreground/40 text-secondary-foreground bg-background",
    "[a]:hover:bg-secondary",
  ].join(" "),

  success: [
    "border-success/60 text-success-foreground bg-background",
    "[a]:hover:bg-success/10",
    "dark:border-success/50 dark:text-success",
  ].join(" "),

  warning: [
    "border-warning/60 text-warning-foreground bg-background",
    "[a]:hover:bg-warning/10",
    "dark:border-warning/50 dark:text-warning",
  ].join(" "),

  danger: [
    "border-destructive/60 text-destructive bg-background",
    "[a]:hover:bg-destructive/10",
    "dark:border-destructive/50",
  ].join(" "),

  info: [
    "border-info/60 text-info-foreground bg-background",
    "[a]:hover:bg-info/10",
    "dark:border-info/50 dark:text-info",
  ].join(" "),
};

/* ============================================================================
 * HELPER FUNCTIONS
 * ========================================================================= */

/**
 * Get the appropriate style classes based on variant and visual style
 */
function getVariantClasses(
  variant: SemanticVariant,
  visualStyle: VisualStyle,
): string {
  switch (visualStyle) {
    case "outline":
      return outlineStyles[variant];
    case "solid":
    default:
      return solidStyles[variant];
  }
}

/**
 * Determine visual style based on boolean props
 * Priority: ghost > outline > solid (default)
 */
function getVisualStyle(outline: boolean): VisualStyle {
  if (outline) return "outline";
  return "solid";
}

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

function Badge({
  className,
  variant = "primary",
  outline = false,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  const visualStyle = getVisualStyle(outline);
  const variantClasses = getVariantClasses(variant, visualStyle);

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-visual-style={visualStyle}
      className={cn(badgeBase(), variantClasses, className)}
      {...props}
    />
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Badge,
  badgeBase,
  type BadgeProps,
  type SemanticVariant as BadgeVariant,
  type VisualStyle as BadgeVisualStyle
};

