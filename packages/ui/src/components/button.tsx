import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { Spinner } from "./spinner";
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
type VisualStyle = "solid" | "outline" | "ghost" | "link";
type ButtonSize = "xs" | "sm" | "default" | "lg" | "xl";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonBase> & {
    /** Semantic variant - defines the intent/meaning of the button */
    variant?: SemanticVariant;
    /** Visual style modifiers (priority: link > ghost > outline > solid) */
    outline?: boolean;
    ghost?: boolean;
    link?: boolean;
    /** Icon configuration */
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    iconOnly?: boolean;
    /** Loading state - shows spinner and disables button */
    loading?: boolean;
    /** Full width button */
    fullWidth?: boolean;
    /** Pill-shaped button (fully rounded) */
    pill?: boolean;
    /** Render as a different component using Radix Slot */
    asChild?: boolean;
  };

/* ============================================================================
 * BASE STYLES (CVA)
 * ========================================================================= */

const buttonBase = cva(
  [
    // Layout & Display
    "group/button inline-flex shrink-0 items-center justify-center",

    // Spacing & Sizing
    "rounded-lg border border-transparent bg-clip-padding",

    // Typography
    "text-sm font-medium whitespace-nowrap",

    // Transitions & Interactivity
    "transition-all outline-none select-none",

    // Focus States
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",

    // Active States
    "active:not-aria-[haspopup]:translate-y-px",

    // Disabled States
    "disabled:pointer-events-none disabled:opacity-50",

    // Invalid States (Light)
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",

    // Invalid States (Dark)
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",

    // Icon Styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      size: {
        xs: [
          "h-6 gap-1 px-2 text-xs",
          "rounded-[min(var(--radius-md),10px)]",
          "in-data-[slot=button-group]:rounded-lg",
          "[&_svg]:size-3",
        ].join(" "),

        sm: [
          "h-7 gap-1 px-2.5 text-[0.8rem]",
          "rounded-[min(var(--radius-md),12px)]",
          "in-data-[slot=button-group]:rounded-lg",
          "[&_svg]:size-3.5",
        ].join(" "),

        default: ["h-8 gap-1.5 px-2.5", "[&_svg]:size-4"].join(" "),

        lg: ["h-9 gap-1.5 px-2.5 font-medium", "[&_svg]:size-4"].join(" "),
        xl: ["h-12 gap-2 px-4 font-medium", "[&_svg]:size-6"].join(" "),
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

/* ============================================================================
 * VARIANT STYLES
 * Each visual style (solid, outline, ghost, link) has styles for each
 * semantic variant (primary, secondary, success, warning, danger, info)
 * ========================================================================= */

// Solid (filled background)
const solidStyles: Record<SemanticVariant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "hover:bg-primary/90",
    "aria-expanded:bg-primary/90",
  ].join(" "),

  secondary: [
    "bg-secondary text-secondary-foreground",
    "hover:bg-secondary/80",
    "aria-expanded:bg-secondary/80",
  ].join(" "),

  success: [
    "bg-success text-success-foreground",
    "hover:bg-success/90",
    "aria-expanded:bg-success/90",
  ].join(" "),

  warning: [
    "bg-warning text-warning-foreground",
    "hover:bg-warning/90",
    "aria-expanded:bg-warning/90",
  ].join(" "),

  danger: [
    "bg-destructive text-destructive-foreground",
    "hover:bg-destructive/90",
    "aria-expanded:bg-destructive/90",
  ].join(" "),

  info: [
    "bg-info text-info-foreground",
    "hover:bg-info/90",
    "aria-expanded:bg-info/90",
  ].join(" "),
};

// Outline (border with transparent background)
const outlineStyles: Record<SemanticVariant, string> = {
  primary: [
    "border-primary text-primary bg-background",
    "hover:bg-primary/10",
    "aria-expanded:bg-primary/10",
  ].join(" "),

  secondary: [
    "border-secondary-foreground/40 text-secondary-foreground bg-background",
    "hover:bg-secondary",
    "aria-expanded:bg-secondary",
  ].join(" "),

  success: [
    "border-success/60 text-success-foreground bg-background",
    "hover:bg-success/10",
    "aria-expanded:bg-success/10",
    "dark:border-success/50 dark:text-success",
  ].join(" "),

  warning: [
    "border-warning/60 text-warning-foreground bg-background",
    "hover:bg-warning/10",
    "aria-expanded:bg-warning/10",
    "dark:border-warning/50 dark:text-warning",
  ].join(" "),

  danger: [
    "border-destructive/60 text-destructive bg-background",
    "hover:bg-destructive/10",
    "aria-expanded:bg-destructive/10",
    "dark:border-destructive/50",
  ].join(" "),

  info: [
    "border-info/60 text-info-foreground bg-background",
    "hover:bg-info/10",
    "aria-expanded:bg-info/10",
    "dark:border-info/50 dark:text-info",
  ].join(" "),
};

// Ghost (text only, subtle background on hover)
const ghostStyles: Record<SemanticVariant, string> = {
  primary: [
    "text-primary",
    "hover:bg-primary/10",
    "aria-expanded:bg-primary/10",
  ].join(" "),

  secondary: [
    "text-muted-foreground",
    "hover:bg-secondary hover:text-foreground",
    "aria-expanded:bg-secondary aria-expanded:text-foreground",
  ].join(" "),

  success: [
    "text-success",
    "hover:bg-success/10",
    "aria-expanded:bg-success/10",
  ].join(" "),

  warning: [
    "text-warning",
    "hover:bg-warning/10",
    "aria-expanded:bg-warning/10",
  ].join(" "),

  danger: [
    "text-destructive",
    "hover:bg-destructive/10",
    "aria-expanded:bg-destructive/10",
  ].join(" "),

  info: ["text-info", "hover:bg-info/10", "aria-expanded:bg-info/10"].join(" "),
};

// Link (text with underline on hover)
const linkStyles: Record<SemanticVariant, string> = {
  primary: "text-primary underline-offset-4 hover:underline",
  secondary: "text-muted-foreground underline-offset-4 hover:underline hover:text-foreground",
  success: "text-success underline-offset-4 hover:underline",
  warning: "text-warning underline-offset-4 hover:underline",
  danger: "text-destructive underline-offset-4 hover:underline",
  info: "text-info underline-offset-4 hover:underline",
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
    case "ghost":
      return ghostStyles[variant];
    case "link":
      return linkStyles[variant];
    case "solid":
    default:
      return solidStyles[variant];
  }
}

/**
 * Calculate dynamic padding based on icon configuration
 * - Icon-only buttons become square with no padding
 * - Buttons with icons have reduced padding on the icon side
 */
function getIconPaddingClasses(
  size: ButtonSize | null | undefined,
  iconOnly: boolean,
  iconStart?: React.ReactNode,
  iconEnd?: React.ReactNode,
): string {
  const currentSize = size || "default";

  // Icon-only: make button square
  if (iconOnly) {
    const sizes: Record<ButtonSize, string> = {
      xs: "size-6 p-0",
      sm: "size-7 p-0",
      default: "size-8 p-0",
      lg: "size-9 p-0",
      xl: "size-12 p-0",
    };
    return sizes[currentSize];
  }

  // Icon on left: reduce left padding
  if (iconStart && !iconEnd) {
    return currentSize === "xs" || currentSize === "sm" ? "pl-1.5" : "pl-2";
  }

  // Icon on right: reduce right padding
  if (!iconStart && iconEnd) {
    return currentSize === "xs" || currentSize === "sm" ? "pr-1.5" : "pr-2";
  }

  // Icons on both sides: reduce both paddings
  if (iconStart && iconEnd) {
    return currentSize === "xs" || currentSize === "sm" ? "px-1.5" : "px-2";
  }

  // No icons: use default padding from buttonBase
  return "";
}

/**
 * Determine visual style based on boolean props
 * Priority: link > ghost > outline > solid (default)
 */
function getVisualStyle(
  outline: boolean,
  ghost: boolean,
  link: boolean,
): VisualStyle {
  if (link) return "link";
  if (ghost) return "ghost";
  if (outline) return "outline";
  return "solid";
}

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

function Button({
  className,
  variant = "primary",
  size = "default",
  outline = false,
  ghost = false,
  link = false,
  iconStart,
  iconEnd,
  iconOnly = false,
  loading = false,
  fullWidth = false,
  pill = false,
  asChild = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  const visualStyle = getVisualStyle(outline, ghost, link);
  const variantClasses = getVariantClasses(variant, visualStyle);
  const paddingClasses = getIconPaddingClasses(
    size,
    iconOnly,
    iconStart,
    iconEnd,
  );

  // Additional utility classes
  const utilityClasses = cn(fullWidth && "w-full", pill && "rounded-full");

  // When loading, replace iconStart with spinner (or add it if no iconStart)
  const displayIconStart = loading ? <Spinner /> : iconStart;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-visual-style={visualStyle}
      data-size={size}
      disabled={disabled || loading}
      className={cn(
        buttonBase({ size }),
        variantClasses,
        paddingClasses,
        utilityClasses,
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {displayIconStart && (
            <span className="inline-flex">{displayIconStart}</span>
          )}
          {children}
          {iconEnd && <span className="inline-flex">{iconEnd}</span>}
        </>
      )}
    </Comp>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Button,
  buttonBase,
  getVariantClasses,
  getVisualStyle,
  type ButtonProps,
  type ButtonSize,
  type SemanticVariant as ButtonVariant,
  type VisualStyle as ButtonVisualStyle
};

