"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Label } from "./label";
import { Separator } from "./separator";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type FieldOrientation = "vertical" | "horizontal" | "responsive";
type FieldLegendVariant = "legend" | "label";

type FieldSetProps = React.ComponentProps<"fieldset">;
type FieldLegendProps = React.ComponentProps<"legend"> & {
  variant?: FieldLegendVariant;
};
type FieldGroupProps = React.ComponentProps<"div">;
type FieldProps = React.ComponentProps<"div"> &
  VariantProps<typeof fieldVariants>;
type FieldContentProps = React.ComponentProps<"div">;
type FieldLabelProps = React.ComponentProps<typeof Label>;
type FieldTitleProps = React.ComponentProps<"div">;
type FieldDescriptionProps = React.ComponentProps<"p">;
type FieldSeparatorProps = React.ComponentProps<"div"> & {
  children?: React.ReactNode;
};
type FieldErrorProps = React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
};

/* ============================================================================
 * VARIANTS (CVA)
 * ========================================================================= */

/**
 * Field orientation variants
 * - vertical: Label above input (default for mobile-first)
 * - horizontal: Label beside input (for desktop layouts)
 * - responsive: Vertical on mobile, horizontal on larger screens
 */
const fieldVariants = cva(
  [
    // Layout & Grouping
    "group/field flex w-full",

    // Invalid State
    "data-[invalid=true]:text-destructive",
  ].join(" "),
  {
    variants: {
      orientation: {
        vertical: ["flex-col *:w-full", "[&>.sr-only]:w-auto"].join(" "),

        horizontal: [
          "flex-row items-center gap-2",
          "has-[>[data-slot=field-content]]:items-start",
          "*:data-[slot=field-label]:flex-auto",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ].join(" "),

        responsive: [
          // Mobile (default)
          "flex-col *:w-full",
          "[&>.sr-only]:w-auto",

          // Desktop (@md breakpoint)
          "@md/field-group:flex-row",
          "@md/field-group:items-center",
          "@md/field-group:*:w-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start",
          "@md/field-group:*:data-[slot=field-label]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ].join(" "),
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Field Set
 * Semantic container for grouping related fields (e.g., form sections)
 */
function FieldSet({ className, ...props }: FieldSetProps) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        [
          // Layout
          "flex flex-col gap-4",

          // Checkbox/Radio Groups - Reduced spacing
          "has-[>[data-slot=checkbox-group]]:gap-3",
          "has-[>[data-slot=radio-group]]:gap-3",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field Legend
 * Title/heading for a fieldset with two visual variants
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        [
          // Spacing & Typography
          "mb-1.5 font-medium",

          // Variant Styles
          "data-[variant=label]:text-sm",
          "data-[variant=legend]:text-base",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field Group
 * Container for multiple fields with container query support
 */
function FieldGroup({ className, ...props }: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        [
          // Grouping & Container Queries
          "group/field-group @container/field-group",

          // Layout
          "flex w-full flex-col gap-5",

          // Checkbox/Radio Groups - Reduced spacing
          "data-[slot=checkbox-group]:gap-3",

          // Nested Field Groups
          "*:data-[slot=field-group]:gap-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field
 * Root field component with responsive orientation support
 */
function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * Field Content
 * Container for field label and description
 */
function FieldContent({ className, ...props }: FieldContentProps) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        [
          // Grouping
          "group/field-content",

          // Layout
          "flex flex-1 flex-col gap-0.5",

          // Typography
          "leading-snug",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field Label
 * Enhanced label with support for checkable fields and nested content
 */
function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        [
          // Grouping & Peering
          "group/field-label peer/field-label",

          // Layout
          "my-1 flex w-fit gap-2",

          // Typography
          "leading-snug",

          // Disabled State
          "group-data-[disabled=true]/field:opacity-50",

          // Invalid State
          "group-data-[invalid=true]/field:text-destructive",

          // Checked State (Light)
          "has-data-checked:border-primary/30",
          "has-data-checked:bg-primary/5",

          // Checked State (Dark)
          "dark:has-data-checked:border-primary/20",
          "dark:has-data-checked:bg-primary/10",

          // Nested Field Styling
          "has-[>[data-slot=field]]:w-full",
          "has-[>[data-slot=field]]:flex-col",
          "has-[>[data-slot=field]]:rounded-lg",
          "has-[>[data-slot=field]]:border",
          "*:data-[slot=field]:p-2.5",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field Title
 * Alternative to FieldLabel for non-interactive headings
 */
function FieldTitle({ className, ...props }: FieldTitleProps) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        [
          // Layout
          "flex w-fit items-center gap-2",

          // Typography
          "text-sm font-medium",

          // Disabled State
          "group-data-[disabled=true]/field:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field Description
 * Helper text with support for links and adaptive spacing
 */
function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        [
          // Typography
          "text-left text-sm leading-normal font-normal text-muted-foreground",

          // Responsive Text
          "group-has-data-horizontal/field:text-balance",

          // Spacing Adjustments
          "[[data-variant=legend]+&]:-mt-1.5",
          "last:mt-0",
          "nth-last-2:-mt-1",

          // Link Styling
          "[&>a]:underline",
          "[&>a]:underline-offset-4",
          "[&>a:hover]:text-primary",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Field Separator
 * Visual divider with optional centered label
 */
function FieldSeparator({
  children,
  className,
  ...props
}: FieldSeparatorProps) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        [
          // Layout
          "relative h-5",

          // Spacing
          "-my-2",
          "group-data-[variant=outline]/field-group:-mb-2",

          // Typography
          "text-sm",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * Field Error
 * Displays validation errors with automatic deduplication
 * Supports both manual children and error array from form libraries
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: FieldErrorProps) {
  const content = React.useMemo(() => {
    // Manual content takes precedence
    if (children) {
      return children;
    }

    // No errors to display
    if (!errors?.length) {
      return null;
    }

    // Deduplicate errors by message
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    // Single error - display as text
    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    // Multiple errors - display as list
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      data-slot="field-error"
      className={cn(
        "mt-0.5 min-h-[1rem] text-xs font-normal text-destructive",
        className,
      )}
      {...props}
    >
      {content}
    </div>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  fieldVariants,
  type FieldContentProps,
  type FieldDescriptionProps,
  type FieldErrorProps,
  type FieldGroupProps,
  type FieldLabelProps,
  type FieldLegendProps,
  type FieldLegendVariant,
  type FieldOrientation,
  type FieldProps,
  type FieldSeparatorProps,
  type FieldSetProps,
  type FieldTitleProps,
};
