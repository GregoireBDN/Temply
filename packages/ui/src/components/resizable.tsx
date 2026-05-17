"use client";

import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type ResizablePanelGroupProps = ResizablePrimitive.GroupProps;
type ResizablePanelProps = ResizablePrimitive.PanelProps;
type ResizableHandleProps = ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
};

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Resizable Panel Group
 * Container for resizable panels with drag-to-resize functionality
 * Built on react-resizable-panels - supports both horizontal and vertical layouts
 */
function ResizablePanelGroup({
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        [
          // Layout
          "flex h-full w-full",

          // Vertical Orientation
          "aria-[orientation=vertical]:flex-col",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Resizable Panel
 * Individual panel within a resizable group
 * Can be resized by dragging the handles between panels
 */
function ResizablePanel({ ...props }: ResizablePanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/**
 * Resizable Handle
 * Draggable separator between resizable panels
 * Optionally shows a visual handle indicator
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        [
          // Layout
          "relative flex items-center justify-center",
          "w-px",

          // Styling
          "bg-border ring-offset-background",

          // Expanded draggable area (vertical)
          "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",

          // Focus States
          "focus-visible:ring-1",
          "focus-visible:ring-ring",
          "focus-visible:outline-hidden",

          // Horizontal Orientation
          "aria-[orientation=horizontal]:h-px",
          "aria-[orientation=horizontal]:w-full",
          "aria-[orientation=horizontal]:after:left-0",
          "aria-[orientation=horizontal]:after:h-1",
          "aria-[orientation=horizontal]:after:w-full",
          "aria-[orientation=horizontal]:after:translate-x-0",
          "aria-[orientation=horizontal]:after:-translate-y-1/2",

          // Rotate handle indicator for horizontal orientation
          "[&[aria-orientation=horizontal]>div]:rotate-90",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
    </ResizablePrimitive.Separator>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  type ResizableHandleProps,
  type ResizablePanelGroupProps,
  type ResizablePanelProps,
};
