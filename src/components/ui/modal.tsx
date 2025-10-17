import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8",
  {
    variants: {
      size: {
        sm: "",
        default: "", 
        lg: "",
        xl: "",
        full: ""
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

const modalContentVariants = cva(
  "w-full max-h-[98vh] overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-300 scale-100",
  {
    variants: {
      size: {
        sm: "w-[400px]",
        default: "w-[500px]", 
        lg: "w-[600px]",
        xl: "w-[800px]",
        full: "w-[95vw]"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, icon, children, footer, size, className }, ref) => {
    if (!isOpen) return null

    return (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={cn(modalVariants({ size }))}>
          <div 
            ref={ref}
            className={cn(
              modalContentVariants({ size }),
              className
            )}
          >
            
            {/* Header */}
            {title && (
              <div className="bg-slate-800/50 border-b border-white/10" style={{ padding: '16px 24px' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white/90 flex items-center gap-3">
                    {icon}
                    {title}
                  </h2>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    icon="X"
                    title="Cerrar"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div 
              className="overflow-y-auto max-h-[calc(98vh-280px)]" 
              style={{ 
                padding: '32px', 
                paddingTop: '16px', 
                paddingBottom: '0px', 
                paddingLeft: '32px', 
                paddingRight: '32px' 
              }}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="bg-slate-800/50 border-t border-white/10 py-6" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
)
Modal.displayName = "Modal"

// Componentes auxiliares para el contenido del modal
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
))
ModalHeader.displayName = "ModalHeader"

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
    {...props}
  />
))
ModalTitle.displayName = "ModalTitle"

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/70", className)}
    {...props}
  />
))
ModalDescription.displayName = "ModalDescription"

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-6", className)}
    {...props}
  />
))
ModalContent.displayName = "ModalContent"

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-4 [&>button]:flex-1", className)}
      {...props}
    >
      {children}
    </div>
  );
})
ModalFooter.displayName = "ModalFooter"

export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  modalVariants,
  modalContentVariants 
}