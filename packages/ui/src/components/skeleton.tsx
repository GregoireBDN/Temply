import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SkeletonProps = React.ComponentProps<"div">;

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Skeleton
 * Placeholder loading state with pulse animation
 * Used to indicate content that is currently loading
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        [
          // Animation
          "animate-pulse",

          // Styling
          "rounded-md bg-muted",
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

export { Skeleton, type SkeletonProps };
