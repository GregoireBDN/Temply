import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SpinnerProps = React.ComponentProps<"svg">;

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Spinner
 * Animated loading indicator using Lucide's Loader2 icon
 * Includes proper accessibility attributes (role and aria-label)
 */
function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        [
          // Size
          "size-4",

          // Animation
          "animate-spin",
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

export { Spinner, type SpinnerProps };
