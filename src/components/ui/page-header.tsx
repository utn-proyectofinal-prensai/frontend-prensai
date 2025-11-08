import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-center", className)}
        {...props}
      >
        {icon && (
          <div className="flex justify-center mb-3">
            {icon}
          </div>
        )}
        <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-3">
          {title}
        </h1>
        {description && (
          <p className="text-white/70 text-base">
            {description}
          </p>
        )}
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"

export { PageHeader }

