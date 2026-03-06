"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Root ---------------------------------- */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

/* -------------------------------- Overlay --------------------------------- */

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fadeIn",
      className
    )}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/* ------------------------------ Content Props ------------------------------ */

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  isDarkMode?: boolean;
}

/* -------------------------------- Content -------------------------------- */

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, isDarkMode = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        `
        fixed z-50 left-1/2 top-1/2 w-full max-w-lg
        -translate-x-1/2 -translate-y-1/2
        rounded-2xl p-6 shadow-lg focus:outline-none
        data-[state=open]:animate-scaleIn
        data-[state=closed]:animate-scaleOut
        ${isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900"
        }
        `,
        className
      )}
      {...props}
    >
      {children}

      <DialogPrimitive.Close
        className={cn(
          `
          absolute right-4 top-4 rounded-full p-1
          focus:outline-none
          ${isDarkMode
            ? "text-gray-400 hover:bg-gray-800"
            : "text-gray-500 hover:bg-gray-200"
          }
          `
        )}
      >
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

/* -------------------------------- Header --------------------------------- */

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

/* --------------------------------- Title --------------------------------- */

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

/* ------------------------------- Description ------------------------------ */

interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  isDarkMode?: boolean;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, isDarkMode = false, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      isDarkMode ? "text-gray-400" : "text-gray-600",
      className
    )}
    {...props}
  />
));

DialogDescription.displayName =
  DialogPrimitive.Description.displayName;

/* -------------------------------- Exports -------------------------------- */

export {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
