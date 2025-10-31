import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50",
  {
    variants: {
      variant: {
        default: "focus:border-blue-500/50 focus:bg-white/15",
        error: "border-red-400 focus:border-red-500 focus:bg-red-500/10",
        success: "border-green-400 focus:border-green-500 focus:bg-green-500/10",
      },
      size: {
        sm: "px-3 py-2 text-sm mt-1",
        default: "px-4 py-3 text-sm mt-1", 
        lg: "px-4 py-4 text-base mt-1",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helperText, ...props }, ref) => {
    const inputVariant = error ? "error" : variant

    return (
      <div style={{ marginBottom: '16px' }}>
        {label && (
          <div className="text-sm font-medium text-white mb-2">
            {label}
          </div>
        )}
        <input
          className={cn(inputVariants({ variant: inputVariant, size, className }))}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginTop: '0px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-white/60">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Select component
export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, label, error, helperText, options, placeholder, ...props }, ref) => {
    const selectVariant = error ? "error" : variant

    return (
      <div style={{ marginBottom: '0px' }}>
        {label && (
          <div className="text-sm font-medium text-white mb-2">
            {label}
          </div>
        )}
        <select
          className={cn(inputVariants({ variant: selectVariant, size, className }))}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginTop: '0px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-400 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-white/60 mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

// Textarea component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, label, error, helperText, ...props }, ref) => {
    const textareaVariant = error ? "error" : variant

    return (
      <div style={{ marginBottom: '16px' }}>
        {label && (
          <div className="text-sm font-medium text-white mb-2">
            {label}
          </div>
        )}
        <textarea
          className={cn(
            inputVariants({ variant: textareaVariant, size }),
            "min-h-[80px] resize-y",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-white/60">{helperText}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Select, Textarea, inputVariants }