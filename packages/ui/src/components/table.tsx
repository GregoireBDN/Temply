"use client";

import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type TableProps = React.ComponentProps<"table">;
type TableHeaderProps = React.ComponentProps<"thead">;
type TableBodyProps = React.ComponentProps<"tbody">;
type TableFooterProps = React.ComponentProps<"tfoot">;
type TableRowProps = React.ComponentProps<"tr">;
type TableHeadProps = React.ComponentProps<"th">;
type TableCellProps = React.ComponentProps<"td">;
type TableCaptionProps = React.ComponentProps<"caption">;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Table
 * Responsive table container with horizontal scroll on overflow
 * Wraps the native table element in a scrollable container
 */
function Table({ className, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          [
            // Layout
            "w-full",

            // Typography
            "caption-bottom text-sm",
          ].join(" "),
          className,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Table Header
 * Semantic table header (thead) with bottom borders on rows
 */
function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

/**
 * Table Body
 * Main content area of the table
 * Removes border from last row
 */
function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/**
 * Table Footer
 * Footer section with subtle background and top border
 */
function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        [
          // Styling
          "border-t bg-muted/50",

          // Typography
          "font-medium",

          // Remove border from last row
          "[&>tr]:last:border-b-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Table Row
 * Individual table row with hover and selection states
 */
function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        [
          // Styling
          "border-b",

          // Transitions
          "transition-colors",

          // Hover State
          "hover:bg-muted/50",

          // Expanded State (for expandable rows)
          "has-aria-expanded:bg-muted/50",

          // Selected State
          "data-[state=selected]:bg-muted",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Table Head
 * Header cell with left alignment and medium weight
 * Adjusts padding for checkbox cells
 */
function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        [
          // Layout
          "h-10 px-2",

          // Typography
          "text-left align-middle font-medium whitespace-nowrap text-foreground",

          // Checkbox cell adjustment
          "[&:has([role=checkbox])]:pr-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Table Cell
 * Standard table data cell
 * Adjusts padding for checkbox cells
 */
function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        [
          // Spacing
          "p-2",

          // Typography
          "align-middle whitespace-nowrap",

          // Checkbox cell adjustment
          "[&:has([role=checkbox])]:pr-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Table Caption
 * Accessible caption for the table (appears below by default)
 */
function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        [
          // Spacing
          "mt-4",

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableBodyProps,
  type TableCaptionProps,
  type TableCellProps,
  type TableFooterProps,
  type TableHeaderProps,
  type TableHeadProps,
  type TableProps,
  type TableRowProps,
};
