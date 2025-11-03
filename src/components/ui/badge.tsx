import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-blue-500/20 text-blue-400 border-blue-300/30",
        admin: "bg-red-500/20 text-red-400 border-red-300/30",
        user: "bg-blue-500/20 text-blue-400 border-blue-300/30",
        success: "bg-green-500/20 text-green-400 border-green-300/30",
        warning: "bg-amber-500/20 text-amber-400 border-amber-300/30",
        danger: "bg-red-500/20 text-red-400 border-red-300/30",
        info: "bg-blue-500/20 text-blue-400 border-blue-300/30",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        default: "px-4 py-2 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-sm",
        xl: "px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    const baseStyles = badgeVariants({ variant, size })
    
    // Extraer padding del className para forzar con estilos inline
    const getPadding = () => {
      if (size === 'xl') {
        return { 
          paddingLeft: '1.25rem', 
          paddingRight: '1.25rem', 
          paddingTop: '0.375rem', 
          paddingBottom: '0.375rem' 
        }
      }
      if (size === 'lg') {
        return { paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }
      }
      if (size === 'md') {
        return { paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }
      }
      if (size === 'default') {
        return { paddingLeft: '0.875rem', paddingRight: '0.875rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }
      }
      if (size === 'sm') {
        return { paddingLeft: '0.625rem', paddingRight: '0.625rem', paddingTop: '0.375rem', paddingBottom: '0.375rem' }
      }
      return {}
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, className)}
        style={{ ...getPadding(), ...props.style }}
        {...props}
      >
        {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }

