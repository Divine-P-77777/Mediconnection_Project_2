"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "px-4 py-2 rounded-md font-medium transition-all",
          variant === "outline" && "border bg-transparent",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
