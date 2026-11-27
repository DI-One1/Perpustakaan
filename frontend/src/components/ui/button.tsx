import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out cursor-pointer select-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px] active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-4px_rgba(19,43,109,0.32)] active:shadow-xs active:bg-primary-active",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-4px_rgba(228,0,20,0.35)] active:shadow-xs",
        outline:
          "border border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary-soft hover:text-primary hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-4px_rgba(19,43,109,0.12)] active:shadow-none",
        secondary:
          "bg-muted text-foreground hover:bg-muted/80 hover:-translate-y-0.5 hover:shadow-xs",
        ghost:
          "hover:bg-muted hover:text-foreground active:bg-muted/80",
        link:
          "text-primary underline-offset-4 hover:underline min-h-0 min-w-0 p-0",
        soft:
          "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/80 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-4px_rgba(19,43,109,0.12)]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs min-h-[36px]",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
