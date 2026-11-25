---
name: shadcn-ui
description: |
  Component architecture, Radix UI primitive integration, and Class Variance Authority (CVA) conventions from shadcn-ui/ui.
  Use when designing, extending, or refactoring reusable UI primitives in src/components/ui/ (Button, Dialog, DropdownMenu, Badge, Popover, Tabs).
---

# shadcn/ui Component Architecture & Design Patterns

Reference guidelines adapted from `shadcn-ui/ui` for high-quality, composable, and accessible React components.

## 1. Core Architectural Principles

- **Copy-Paste Ownership**: Components live inside the codebase (`src/components/ui/`), giving full ownership without opaque package dependencies.
- **Headless Accessible Primitives**: Built on top of Radix UI or native browser APIs to ensure zero-effort WCAG AA accessibility, keyboard navigation, and ARIA compliance.
- **Composition over Configuration**: Prefer small, composable sub-components over monolithic components with dozens of boolean props.

## 2. Component Structure Pattern

Every reusable primitive in `src/components/ui/` must follow this structure:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. Define CVA Variants
const componentVariants = cva(
  "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-card hover:bg-muted text-foreground",
        secondary: "bg-muted text-secondary-foreground hover:bg-muted/80",
        ghost: "hover:bg-muted text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs sm:text-sm rounded-lg",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-11 px-6 text-sm rounded-lg",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 2. TypeScript Props extending HTML attributes & CVA variants
export interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean;
}

// 3. React forwardRef Component
export const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Component.displayName = "Component";
```

## 3. Styling Rules & Token Alignment

- **Never Hardcode Hex Values**: Always use the semantic tokens defined in `globals.css` (`bg-primary`, `text-heading`, `border-border`, `bg-card`, etc.).
- **Always Pass `className` through `cn()`**: Allows parent components to append or override styles without CSS specificity conflicts.
- **Accessible Focus Indicators**: Every interactive control must provide `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
