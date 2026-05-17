"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>;

/* ============================================================================
 * COMPONENT
 * ========================================================================= */

/**
 * Slider
 * Range input slider with support for single or multiple thumbs
 * Built on Radix UI Slider - supports horizontal and vertical orientations
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  // Calculate number of thumbs needed based on value/defaultValue
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        [
          // Layout
          "relative flex items-center",
          "w-full",

          // Interactivity
          "touch-none select-none",

          // Disabled State
          "data-[disabled]:opacity-50",

          // Vertical Orientation
          "data-[orientation=vertical]:h-full",
          "data-[orientation=vertical]:min-h-40",
          "data-[orientation=vertical]:w-auto",
          "data-[orientation=vertical]:flex-col",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          [
            // Layout
            "relative grow",

            // Styling
            "overflow-hidden rounded-full bg-muted",

            // Horizontal Orientation
            "data-[orientation=horizontal]:h-1",
            "data-[orientation=horizontal]:w-full",

            // Vertical Orientation
            "data-[orientation=vertical]:h-full",
            "data-[orientation=vertical]:w-1",
          ].join(" "),
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            [
              // Layout
              "absolute",

              // Styling
              "bg-primary",

              // Interactivity
              "select-none",

              // Horizontal Orientation
              "data-[orientation=horizontal]:h-full",

              // Vertical Orientation
              "data-[orientation=vertical]:w-full",
            ].join(" "),
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            [
              // Layout
              "relative block shrink-0",
              "size-3",

              // Styling
              "rounded-full border border-ring bg-white",

              // Ring
              "ring-ring/50",

              // Transitions
              "transition-[color,box-shadow]",

              // Interactivity
              "select-none",

              // Expanded clickable area
              "after:absolute after:-inset-2",

              // Hover & Focus States
              "hover:ring-3",
              "focus-visible:ring-3",
              "focus-visible:outline-hidden",

              // Active State
              "active:ring-3",

              // Disabled State
              "disabled:pointer-events-none",
              "disabled:opacity-50",
            ].join(" "),
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export { Slider, type SliderProps };
