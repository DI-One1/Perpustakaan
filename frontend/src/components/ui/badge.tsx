import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-muted text-foreground hover:bg-muted/80",
        outline: "border border-border text-foreground",
        soft: "border-transparent bg-primary-soft text-primary-soft-foreground",
        tersedia:
          "border-transparent bg-success-bg text-success-fg",
        perhatian:
          "border-transparent bg-warning-bg text-warning-fg",
        bahaya:
          "border-transparent bg-danger-bg text-danger-fg",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        dibooking:
          "border-transparent bg-warning-bg text-warning-fg",
        antre:
          "border-transparent bg-warning-bg text-warning-fg",
        penuh:
          "border-transparent bg-danger-bg text-danger-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
