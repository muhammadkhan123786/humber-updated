import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-sm focus-visible:ring-2 focus-visible:ring-[#4f46e5]/40",

        destructive:
          "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-sm focus-visible:ring-2 focus-visible:ring-[#ef4444]/40",

        outline:
          "border border-[#e5e7eb] bg-white text-[#1a1d3f] hover:bg-[#f3f4f6] hover:text-[#4f46e5] focus-visible:ring-2 focus-visible:ring-[#4f46e5]/20",

        secondary:
          "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/40",

        ghost: "text-[#1a1d3f] hover:bg-[#f3f4f6] hover:text-[#4f46e5]",

        link: "text-[#4f46e5] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
