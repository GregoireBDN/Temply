"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
};
type InputOTPGroupProps = React.ComponentProps<"div">;
type InputOTPSlotProps = React.ComponentProps<"div"> & {
  index: number;
};
type InputOTPSeparatorProps = React.ComponentProps<"div">;

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Input OTP (One-Time Password)
 * Root component for OTP input fields
 * Handles keyboard navigation and paste behavior automatically
 */
function InputOTP({ className, containerClassName, ...props }: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        [
          // Base Class (required by input-otp library)
          "cn-input-otp",

          // Layout
          "flex items-center",

          // Disabled State
          "has-disabled:opacity-50",
        ].join(" "),
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/**
 * Input OTP Group
 * Container for a group of OTP slots (usually 3-6 characters)
 * Handles validation states for the entire group
 */
function InputOTPGroup({ className, ...props }: InputOTPGroupProps) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        [
          // Layout
          "flex items-center",

          // Styling
          "rounded-lg",

          // Invalid States (Light)
          "has-aria-invalid:border-destructive",
          "has-aria-invalid:ring-3",
          "has-aria-invalid:ring-destructive/20",

          // Invalid States (Dark)
          "dark:has-aria-invalid:ring-destructive/40",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Input OTP Slot
 * Individual character slot within an OTP input
 * Shows active state with ring, displays fake caret during input
 */
function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        [
          // Layout
          "relative flex size-8 items-center justify-center",

          // Borders
          "border-y border-r border-input",
          "first:rounded-l-lg first:border-l",
          "last:rounded-r-lg",

          // Typography
          "text-sm",

          // Transitions
          "transition-all outline-none",

          // Background (Dark)
          "dark:bg-input/30",

          // Invalid States
          "aria-invalid:border-destructive",

          // Active State
          "data-[active=true]:z-10",
          "data-[active=true]:border-ring",
          "data-[active=true]:ring-3",
          "data-[active=true]:ring-ring/50",

          // Active + Invalid States (Light)
          "data-[active=true]:aria-invalid:border-destructive",
          "data-[active=true]:aria-invalid:ring-destructive/20",

          // Active + Invalid States (Dark)
          "dark:data-[active=true]:aria-invalid:ring-destructive/40",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

/**
 * Input OTP Separator
 * Visual separator between OTP groups (e.g., "123 - 456")
 * Uses a minus icon by default
 */
function InputOTPSeparator({ ...props }: InputOTPSeparatorProps) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(
        [
          // Layout
          "flex items-center",

          // Icon Styling
          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
      )}
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

/* ============================================================================
 * EXPORTS
 * ========================================================================= */

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPGroupProps,
  type InputOTPProps,
  type InputOTPSeparatorProps,
  type InputOTPSlotProps,
};
