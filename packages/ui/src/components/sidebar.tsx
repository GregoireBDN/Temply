"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";
import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../lib/utils";
import { PanelLeftIcon } from "lucide-react";

/* ============================================================================
 * CONSTANTS
 * ========================================================================= */

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

/* ============================================================================
 * TYPES
 * ========================================================================= */

type SidebarState = "expanded" | "collapsed";
type SidebarSide = "left" | "right";
type SidebarVariant = "sidebar" | "floating" | "inset";
type SidebarCollapsible = "offcanvas" | "icon" | "none";

type SidebarContextProps = {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type SidebarProps = React.ComponentProps<"div"> & {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
};

type SidebarTriggerProps = React.ComponentProps<typeof Button>;
type SidebarRailProps = React.ComponentProps<"button">;
type SidebarInsetProps = React.ComponentProps<"main">;
type SidebarInputProps = React.ComponentProps<typeof Input>;
type SidebarHeaderProps = React.ComponentProps<"div">;
type SidebarFooterProps = React.ComponentProps<"div">;
type SidebarSeparatorProps = React.ComponentProps<typeof Separator>;
type SidebarContentProps = React.ComponentProps<"div">;
type SidebarGroupProps = React.ComponentProps<"div">;

type SidebarGroupLabelProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
};

type SidebarGroupActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

type SidebarGroupContentProps = React.ComponentProps<"div">;
type SidebarMenuProps = React.ComponentProps<"ul">;
type SidebarMenuItemProps = React.ComponentProps<"li">;

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>;

type SidebarMenuActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
};

type SidebarMenuBadgeProps = React.ComponentProps<"div">;

type SidebarMenuSkeletonProps = React.ComponentProps<"div"> & {
  showIcon?: boolean;
};

type SidebarMenuSubProps = React.ComponentProps<"ul">;
type SidebarMenuSubItemProps = React.ComponentProps<"li">;

type SidebarMenuSubButtonProps = React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
};

/* ============================================================================
 * CONTEXT
 * ========================================================================= */

/**
 * Sidebar Context
 * Provides sidebar state and controls to all child components
 */
const SidebarContext = React.createContext<SidebarContextProps | null>(null);

/**
 * useSidebar Hook
 * Access sidebar state and controls
 * Must be used within a SidebarProvider
 */
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

/* ============================================================================
 * VARIANTS (CVA)
 * ========================================================================= */

/**
 * Sidebar Menu Button Variants
 * Styles for sidebar navigation buttons
 * - default: Standard sidebar item
 * - outline: Item with border and shadow
 */
const sidebarMenuButtonVariants = cva(
  [
    // Grouping & Peering
    "peer/menu-button group/menu-button",

    // Layout
    "flex w-full items-center gap-2 overflow-hidden",

    // Styling
    "rounded-md",

    // Spacing
    "p-2",

    // Typography
    "text-left text-sm",

    // Focus States
    "ring-sidebar-ring outline-hidden",
    "focus-visible:ring-2",

    // Transitions
    "transition-[width,height,padding]",

    // Hover States
    "hover:bg-sidebar-accent",
    "hover:text-sidebar-accent-foreground",

    // Active States
    "active:bg-sidebar-accent",
    "active:text-sidebar-accent-foreground",

    // Data States
    "data-open:hover:bg-sidebar-accent",
    "data-open:hover:text-sidebar-accent-foreground",
    "data-active:bg-sidebar-accent",
    "data-active:font-medium",
    "data-active:text-sidebar-accent-foreground",

    // Disabled States
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "aria-disabled:pointer-events-none",
    "aria-disabled:opacity-50",

    // Group Data States (Collapsed Icon Mode)
    "group-data-[collapsible=icon]:size-8!",
    "group-data-[collapsible=icon]:p-2!",

    // Group Has Data States (Menu Action)
    "group-has-data-[sidebar=menu-action]/menu-item:pr-8",

    // Icon Styling
    "[&_svg]:size-4",
    "[&_svg]:shrink-0",

    // Text Truncation
    "[&>span:last-child]:truncate",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "hover:bg-sidebar-accent",
          "hover:text-sidebar-accent-foreground",
        ].join(" "),

        outline: [
          "bg-background",
          "shadow-[0_0_0_1px_hsl(var(--sidebar-border))]",
          "hover:bg-sidebar-accent",
          "hover:text-sidebar-accent-foreground",
          "hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
        ].join(" "),
      },
      size: {
        default: "h-8 text-sm",

        sm: "h-7 text-xs",

        lg: ["h-12 text-sm", "group-data-[collapsible=icon]:p-0!"].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/* ============================================================================
 * COMPONENTS
 * ========================================================================= */

/**
 * Sidebar Provider
 * Root provider for sidebar functionality
 * Manages sidebar state (open/collapsed) and mobile responsiveness
 * Persists state to cookies and provides keyboard shortcut (Cmd/Ctrl+B)
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // Internal state management with external control support
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // Persist sidebar state to cookies
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Toggle sidebar (mobile or desktop)
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Keyboard shortcut to toggle sidebar
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          [
            // Grouping
            "group/sidebar-wrapper",

            // Layout
            "flex min-h-svh w-full",

            // Has Data States
            "has-data-[variant=inset]:bg-sidebar",
          ].join(" "),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

/**
 * Sidebar
 * Main sidebar container with responsive behavior
 * Supports three collapsible modes: offcanvas, icon, none
 * Renders as Sheet on mobile, fixed positioned sidebar on desktop
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // Non-collapsible sidebar
  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          [
            // Layout
            "flex h-full w-(--sidebar-width) flex-col",

            // Styling
            "bg-sidebar text-sidebar-foreground",
          ].join(" "),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Mobile sidebar (Sheet)
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className={cn(
            [
              // Layout
              "w-(--sidebar-width)",

              // Styling
              "bg-sidebar text-sidebar-foreground",

              // Spacing
              "p-0",

              // Hide close button
              "[&>button]:hidden",
            ].join(" "),
          )}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        [
          // Grouping & Peering
          "group peer",

          // Visibility
          "hidden md:block",

          // Styling
          "text-sidebar-foreground",
        ].join(" "),
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Sidebar gap spacer */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          [
            // Layout
            "relative",
            "w-(--sidebar-width)",

            // Styling
            "bg-transparent",

            // Transitions
            "transition-[width] duration-200 ease-linear",

            // Collapsible States (Offcanvas)
            "group-data-[collapsible=offcanvas]:w-0",

            // Collapsible States (Icon)
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
              : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",

            // Side States
            "group-data-[side=right]:rotate-180",
          ].join(" "),
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          [
            // Positioning
            "fixed inset-y-0 z-10",

            // Visibility
            "hidden md:flex",

            // Layout
            "h-svh w-(--sidebar-width)",

            // Transitions
            "transition-[left,right,width] duration-200 ease-linear",

            // Side: Left
            "data-[side=left]:left-0",
            "data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",

            // Side: Right
            "data-[side=right]:right-0",
            "data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",

            // Variant: Floating/Inset
            variant === "floating" || variant === "inset"
              ? [
                  "p-2",
                  "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
                ].join(" ")
              : [
                  "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
                  "group-data-[side=left]:border-r",
                  "group-data-[side=right]:border-l",
                ].join(" "),
          ].join(" "),
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            [
              // Layout
              "flex size-full flex-col",

              // Styling
              "bg-sidebar",

              // Variant: Floating
              "group-data-[variant=floating]:rounded-lg",
              "group-data-[variant=floating]:shadow-sm",
              "group-data-[variant=floating]:ring-1",
              "group-data-[variant=floating]:ring-sidebar-border",
            ].join(" "),
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar Trigger
 * Button to toggle sidebar visibility
 * Uses ghost icon-only button with PanelLeft icon
 */
function SidebarTrigger({ className, onClick, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      ghost
      iconOnly
      size="sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * Sidebar Rail
 * Invisible rail element for hover-to-expand interaction
 * Appears on the edge of collapsed sidebar for easy re-expansion
 */
function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        [
          // Positioning
          "absolute inset-y-0 z-20",

          // Layout
          "w-4",

          // Visibility
          "hidden sm:flex",

          // Side Positioning
          "group-data-[side=left]:-right-4",
          "group-data-[side=right]:left-0",

          // Cursor
          "in-data-[side=left]:cursor-w-resize",
          "in-data-[side=right]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize",
          "[[data-side=right][data-state=collapsed]_&]:cursor-w-resize",

          // Transitions
          "transition-all ease-linear",

          // Text Direction
          "ltr:-translate-x-1/2",
          "rtl:-translate-x-1/2",

          // Visual Indicator (After)
          "after:absolute after:inset-y-0",
          "after:start-1/2",
          "after:w-[2px]",
          "hover:after:bg-sidebar-border",

          // Offcanvas Mode
          "group-data-[collapsible=offcanvas]:translate-x-0",
          "group-data-[collapsible=offcanvas]:after:left-full",
          "hover:group-data-[collapsible=offcanvas]:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Inset
 * Main content area that adjusts based on sidebar state
 * Automatically handles responsive margins for inset variant
 */
function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        [
          // Positioning
          "relative",

          // Layout
          "flex w-full flex-1 flex-col",

          // Styling
          "bg-background",

          // Inset Variant (Desktop)
          "md:peer-data-[variant=inset]:m-2",
          "md:peer-data-[variant=inset]:ml-0",
          "md:peer-data-[variant=inset]:rounded-xl",
          "md:peer-data-[variant=inset]:shadow-sm",

          // Inset Variant (Collapsed State)
          "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Input
 * Styled input field for sidebar (e.g., search)
 * Compact height and transparent shadow
 */
function SidebarInput({ className, ...props }: SidebarInputProps) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        [
          // Layout
          "h-8 w-full",

          // Styling
          "bg-background shadow-none",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Header
 * Header section for sidebar (e.g., logo, title)
 */
function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        [
          // Layout
          "flex flex-col",

          // Spacing
          "gap-2 p-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Footer
 * Footer section for sidebar (e.g., user profile, settings)
 */
function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        [
          // Layout
          "flex flex-col",

          // Spacing
          "gap-2 p-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Separator
 * Horizontal separator line within sidebar
 */
function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn(
        [
          // Layout
          "mx-2 w-auto",

          // Styling
          "bg-sidebar-border",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Content
 * Scrollable content area of sidebar
 * Automatically hides overflow in collapsed icon mode
 */
function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        [
          // Layout
          "flex min-h-0 flex-1 flex-col",

          // Spacing
          "gap-0",

          // Scrolling
          "no-scrollbar overflow-auto",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:overflow-hidden",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Group
 * Container for related sidebar items
 */
function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(
        [
          // Positioning
          "relative",

          // Layout
          "flex w-full min-w-0 flex-col",

          // Spacing
          "p-2",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Group Label
 * Header label for a sidebar group
 * Hides in collapsed icon mode with opacity/margin animation
 */
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: SidebarGroupLabelProps) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        [
          // Layout
          "flex h-8 shrink-0 items-center",

          // Styling
          "rounded-md",

          // Spacing
          "px-2",

          // Typography
          "text-xs font-medium text-sidebar-foreground/70",

          // Focus States
          "ring-sidebar-ring outline-hidden",
          "focus-visible:ring-2",

          // Transitions
          "transition-[margin,opacity] duration-200 ease-linear",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:-mt-8",
          "group-data-[collapsible=icon]:opacity-0",

          // Icon Styling
          "[&>svg]:size-4",
          "[&>svg]:shrink-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Group Action
 * Action button for a sidebar group (e.g., add, collapse)
 * Positioned absolutely in top-right corner
 */
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: SidebarGroupActionProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        [
          // Positioning
          "absolute top-3.5 right-3",

          // Layout
          "flex aspect-square w-5 items-center justify-center",

          // Styling
          "rounded-md",

          // Spacing
          "p-0",

          // Typography
          "text-sidebar-foreground",

          // Focus States
          "ring-sidebar-ring outline-hidden",
          "focus-visible:ring-2",

          // Hover States
          "hover:bg-sidebar-accent",
          "hover:text-sidebar-accent-foreground",

          // Expanded Clickable Area
          "after:absolute after:-inset-2",
          "md:after:hidden",

          // Transitions
          "transition-transform",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:hidden",

          // Icon Styling
          "[&>svg]:size-4",
          "[&>svg]:shrink-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Group Content
 * Content wrapper for sidebar group items
 */
function SidebarGroupContent({
  className,
  ...props
}: SidebarGroupContentProps) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn(
        [
          // Layout
          "w-full",

          // Typography
          "text-sm",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu
 * List container for sidebar menu items
 */
function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        [
          // Layout
          "flex w-full min-w-0 flex-col",

          // Spacing
          "gap-0",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu Item
 * Individual menu item wrapper
 * Groups menu button, actions, and badges
 */
function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn(
        [
          // Grouping & Positioning
          "group/menu-item relative",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu Button
 * Clickable menu item button
 * Supports tooltip in collapsed icon mode
 * Can be rendered as any element via asChild prop
 */
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

/**
 * Sidebar Menu Action
 * Action button for a menu item (e.g., settings, delete)
 * Positioned absolutely in top-right corner
 * Optional showOnHover for cleaner UI
 */
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        [
          // Positioning
          "absolute top-1.5 right-1",

          // Layout
          "flex aspect-square w-5 items-center justify-center",

          // Styling
          "rounded-md",

          // Spacing
          "p-0",

          // Typography
          "text-sidebar-foreground",

          // Focus States
          "ring-sidebar-ring outline-hidden",
          "focus-visible:ring-2",

          // Hover States
          "hover:bg-sidebar-accent",
          "hover:text-sidebar-accent-foreground",

          // Peer States
          "peer-hover/menu-button:text-sidebar-accent-foreground",
          "peer-data-active/menu-button:text-sidebar-accent-foreground",

          // Peer Size States (Top Positioning)
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "peer-data-[size=sm]/menu-button:top-1",

          // Expanded Clickable Area
          "after:absolute after:-inset-2",
          "md:after:hidden",

          // Transitions
          "transition-transform",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:hidden",

          // Icon Styling
          "[&>svg]:size-4",
          "[&>svg]:shrink-0",

          // Show on Hover
          showOnHover &&
            [
              "md:opacity-0",
              "group-hover/menu-item:opacity-100",
              "group-focus-within/menu-item:opacity-100",
              "aria-expanded:opacity-100",
            ].join(" "),
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu Badge
 * Badge indicator for menu items (e.g., count, status)
 * Positioned absolutely in top-right corner
 */
function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        [
          // Positioning
          "absolute right-1",

          // Layout
          "flex h-5 min-w-5 items-center justify-center",

          // Interactivity
          "pointer-events-none",

          // Styling
          "rounded-md",

          // Spacing
          "px-1",

          // Typography
          "text-xs font-medium text-sidebar-foreground tabular-nums",

          // User Selection
          "select-none",

          // Peer States
          "peer-hover/menu-button:text-sidebar-accent-foreground",
          "peer-data-active/menu-button:text-sidebar-accent-foreground",

          // Peer Size States (Top Positioning)
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "peer-data-[size=sm]/menu-button:top-1",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:hidden",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu Skeleton
 * Loading placeholder for menu items
 * Random width between 50-90% for realistic effect
 */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonProps) {
  // Random width between 50 to 90%
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  });

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        [
          // Layout
          "flex h-8 items-center gap-2",

          // Styling
          "rounded-md",

          // Spacing
          "px-2",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/**
 * Sidebar Menu Sub
 * Nested submenu container
 * Indented with left border indicator
 */
function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        [
          // Layout
          "flex min-w-0 translate-x-px flex-col",

          // Spacing
          "mx-3.5 gap-1",
          "px-2.5 py-0.5",

          // Styling
          "border-l border-sidebar-border",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:hidden",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu Sub Item
 * Individual submenu item wrapper
 */
function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn(
        [
          // Grouping & Positioning
          "group/menu-sub-item relative",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Sidebar Menu Sub Button
 * Clickable submenu item button
 * Slightly smaller than main menu buttons
 */
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        [
          // Layout
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden",

          // Styling
          "rounded-md",

          // Spacing
          "px-2",

          // Typography
          "text-sidebar-foreground",

          // Focus States
          "ring-sidebar-ring outline-hidden",
          "focus-visible:ring-2",

          // Hover States
          "hover:bg-sidebar-accent",
          "hover:text-sidebar-accent-foreground",

          // Active States
          "active:bg-sidebar-accent",
          "active:text-sidebar-accent-foreground",

          // Data States
          "data-active:bg-sidebar-accent",
          "data-active:text-sidebar-accent-foreground",

          // Disabled States
          "disabled:pointer-events-none",
          "disabled:opacity-50",
          "aria-disabled:pointer-events-none",
          "aria-disabled:opacity-50",

          // Size Variants
          "data-[size=md]:text-sm",
          "data-[size=sm]:text-xs",

          // Collapsed Icon Mode
          "group-data-[collapsible=icon]:hidden",

          // Text Truncation
          "[&>span:last-child]:truncate",

          // Icon Styling
          "[&>svg]:size-4",
          "[&>svg]:shrink-0",
          "[&>svg]:text-sidebar-accent-foreground",
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  type SidebarCollapsible,
  type SidebarContentProps,
  type SidebarFooterProps,
  type SidebarGroupActionProps,
  type SidebarGroupContentProps,
  type SidebarGroupLabelProps,
  type SidebarGroupProps,
  type SidebarHeaderProps,
  type SidebarInputProps,
  type SidebarInsetProps,
  type SidebarMenuActionProps,
  type SidebarMenuBadgeProps,
  type SidebarMenuButtonProps,
  type SidebarMenuItemProps,
  type SidebarMenuProps,
  type SidebarMenuSkeletonProps,
  type SidebarMenuSubButtonProps,
  type SidebarMenuSubItemProps,
  type SidebarMenuSubProps,
  type SidebarProps,
  type SidebarProviderProps,
  type SidebarRailProps,
  type SidebarSeparatorProps,
  type SidebarSide,
  type SidebarState,
  type SidebarTriggerProps,
  type SidebarVariant,
};
