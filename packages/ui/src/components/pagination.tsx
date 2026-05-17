import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import { Button, type ButtonSize } from "./button";
import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type PaginationProps = React.ComponentProps<"nav">;
type PaginationContentProps = React.ComponentProps<"ul">;
type PaginationItemProps = React.ComponentProps<"li">;
type PaginationLinkProps = {
  isActive?: boolean;
  size?: ButtonSize;
} & React.ComponentProps<"a">;
type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
  text?: string;
};
type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  text?: string;
};
type PaginationEllipsisProps = React.ComponentProps<"span">;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Pagination
 * Root navigation container for pagination controls
 * Provides semantic markup and centering
 */
function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/**
 * Pagination Content
 * List container for pagination items
 * Handles spacing between page numbers and controls
 */
function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  );
}

/**
 * Pagination Item
 * Individual list item wrapper for pagination elements
 */
function PaginationItem({ ...props }: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />;
}

/**
 * Pagination Link
 * Clickable page number or navigation link
 * Shows active state for current page with outline style
 */
function PaginationLink({
  className,
  isActive,
  size = "default",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      outline={isActive}
      ghost={!isActive}
      size={size}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  );
}

/**
 * Pagination Previous
 * Navigation button to go to previous page
 * Shows chevron icon with optional "Previous" text (hidden on mobile)
 */
function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

/**
 * Pagination Next
 * Navigation button to go to next page
 * Shows chevron icon with optional "Next" text (hidden on mobile)
 */
function PaginationNext({
  className,
  text = "Next",
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

/**
 * Pagination Ellipsis
 * Visual indicator for omitted page numbers
 * Shows three dots with screen reader text "More pages"
 */
function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        [
          // Layout
          "flex size-8 items-center justify-center",

          // Icon Styling
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationContentProps,
  type PaginationEllipsisProps,
  type PaginationItemProps,
  type PaginationLinkProps,
  type PaginationNextProps,
  type PaginationPreviousProps,
  type PaginationProps,
};
