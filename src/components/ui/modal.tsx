import * as React from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <div 
          className={cn(
            "w-[600px] max-w-[90vw] max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-300 scale-100",
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}

const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-black/20 overflow-y-auto flex-1", className)}>
      {children}
    </div>
  )
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-slate-800/50 border-b border-white/10", className)} style={{ padding: '16px 24px' }}>
      {children}
    </div>
  )
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div 
      className={cn("overflow-y-auto max-h-[calc(95vh-280px)]", className)}
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
  )
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div 
      className={cn("bg-slate-800/30 border-t border-white/10", className)}
      style={{ padding: '20px 32px' }}
    >
      {children}
    </div>
  )
}

export { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter }
