import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { 
  Edit, 
  Trash2, 
  Zap, 
  AlertTriangle, 
  Search, 
  Plus, 
  Check, 
  X, 
  Eye, 
  Save, 
  RefreshCw,
  Key,
  ArrowLeft,
  ChevronDown,
  Tag,
  FileText,
  Sparkles,
  Info
} from "lucide-react"

// Mapeo de iconos disponibles
const iconMap = {
  Edit,
  Delete: Trash2,
  Generate: Zap,
  Warning: AlertTriangle,
  AlertTriangle,
  Info,
  Search,
  Plus,
  Check,
  X,
  Eye,
  Save,
  Refresh: RefreshCw,
  Key,
  ArrowLeft,
  ChevronDown,
  Tag,
  FileText,
  Sparkles,
} as const;

export type IconName = keyof typeof iconMap;

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
      variants: {
        variant: {
          // 1. PRIMARY - Acción principal (gradiente sutil)
          primary: "bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600/90 hover:to-blue-700/90 text-white shadow-md hover:shadow-lg",
          
          // 2. SUCCESS - Acciones exitosas (gradiente sutil)
          success: "bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 hover:from-emerald-600/90 hover:to-emerald-700/90 text-white shadow-md hover:shadow-lg",
          
          // 3. DANGER - Acciones destructivas (gradiente sutil)
          danger: "bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600/90 hover:to-red-700/90 text-white shadow-md hover:shadow-lg",
          
          // 4. SECONDARY - Acciones secundarias (gradiente sutil)
          secondary: "bg-gradient-to-r from-gray-500/90 to-gray-600/90 hover:from-gray-600/90 hover:to-gray-700/90 text-white shadow-md hover:shadow-lg",
          
          // 5. OUTLINE - Acciones sutiles (con gradiente sutil en hover)
          outline: "border border-white/30 bg-transparent hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 text-white hover:border-white/50 shadow-sm hover:shadow-md",
          
          // 6. GHOST - Acciones mínimas (con gradiente sutil en hover)
          ghost: "!bg-transparent !border-0 hover:!bg-gradient-to-r hover:!from-white/10 hover:!to-white/5 !text-white/70 hover:!text-white !shadow-sm hover:!shadow-md",
          
          // 7. LOGIN - Botón de inicio de sesión (gradiente sutil pero prominente)
          login: "bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600/90 hover:to-blue-700/90 text-white shadow-lg hover:shadow-xl font-semibold",
          
          // 8. STEPPER - Pestañas de stepper/wizard
          stepper: "flex-1 min-h-14 min-w-48 flex-shrink-0 bg-transparent text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:shadow-lg disabled:text-white/30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/30 flex-col gap-1",
          
          // 9. STEPPER DROPDOWN - Botón dropdown para stepper móvil
          "stepper-dropdown": "w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 hover:border-white/30 data-[active=true]:bg-blue-600 data-[active=true]:border-blue-600 transition-all duration-300 justify-between",
        },
        size: {
          // Tamaño normal para botones principales
          default: "h-10 px-4 py-2",
          // Tamaño pequeño para botones secundarios
          sm: "h-8 px-3 py-1.5 text-sm",
          // Tamaño grande para acciones importantes
          lg: "h-11 px-6 py-2.5",
          // Tamaño para iconos en tablas
          icon: "!h-9 !w-9 !min-w-9 !min-h-9",
          // Tamaño especial para botón de login
          login: "h-12 px-6 py-3 text-lg font-semibold",
          // Tamaño para steppers
          stepper: "px-3 py-4",
          // Tamaño para botones de footer de modales
          "modal-footer": "h-11 px-6 py-2.5 min-w-[120px]",
        },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: IconName
  iconPosition?: 'left' | 'right'
  active?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, iconPosition = 'left', active, children, ...props }, ref) => {
    const IconComponent = icon ? iconMap[icon] : null;
    
    const renderIcon = () => {
      if (!IconComponent) return null;
      
      // Determinar el tamaño del ícono basado en el tamaño del botón
      let iconSize = 16; // tamaño por defecto
      if (size === 'sm') iconSize = 14;
      else if (size === 'lg') iconSize = 20;
      else if (size === 'icon') iconSize = 16;
      
      return <IconComponent size={iconSize} className="flex-shrink-0" />;
    };

    const content = (
      <>
        {icon && iconPosition === 'left' && (
          <span className="mr-2">
            {renderIcon()}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">
            {renderIcon()}
          </span>
        )}
      </>
    );

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          data-active={active}
          ref={ref}
          {...props}
        >
          {content}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        data-active={active}
        ref={ref}
        {...props}
      >
        {content}
      </button>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
