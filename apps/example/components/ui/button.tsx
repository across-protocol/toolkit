import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center shrink-0 justify-center bg-background hover:bg-foreground whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 border",
  {
    variants: {
      variant: {
        default: "border-border",
        filled:
          "w-full shadow-md text-background hover:border-accent focus-visible:border-accent bg-text py-5 px-6 leading-6 rounded-lg",
        bordered:
          "rounded-2xl border-border text-sm font-normal text-text/75 hover:border-text/75",
        navigation: "rounded-full shadow-md bg-gradient-primary",
        accent:
          "text-background shadow-md hover:bg-accent/80 focus-visible:border-accent border-transparent bg-accent py-5 px-6 leading-6 rounded-lg",
        ghost:
          "border-transparent hover:border-border hover:text-text/75 text-text/75 font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "p-[10px] w-[20px] h-[20px]",
        none: "",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
