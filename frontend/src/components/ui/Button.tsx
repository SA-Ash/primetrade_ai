import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils.js"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg hover:shadow-primary-500/30",
        gradient: "bg-gradient-trading text-white hover:opacity-90 shadow-lg hover:shadow-glow-md",
        destructive: "bg-danger-600 text-white hover:bg-danger-700 shadow-md hover:shadow-lg hover:shadow-danger-500/30",
        outline: "border-2 border-primary-500 bg-transparent text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950",
        secondary: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600",
        ghost: "hover:bg-primary-50 dark:hover:bg-primary-950 text-primary-700 dark:text-primary-300",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700",
        success: "bg-success-600 text-white hover:bg-success-700 shadow-md hover:shadow-lg hover:shadow-success-500/30",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
