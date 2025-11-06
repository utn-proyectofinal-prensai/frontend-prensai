import * as React from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import UserDropdown from "../common/UserDropdown"
import { Badge } from "./badge"

export interface GlobalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  showBackButton?: boolean
  backTo?: string
  onBackClick?: () => void
  user?: {
    username?: string
    first_name?: string
    last_name?: string
  }
  isAdmin?: boolean
  logoUrl?: string
  logoAlt?: string
}

const GlobalHeader = React.forwardRef<HTMLDivElement, GlobalHeaderProps>(
  ({ 
    className, 
    title, 
    showBackButton = false, 
    backTo, 
    onBackClick,
    user,
    isAdmin = false,
    logoUrl = "/images/fondoblanco copia.png",
    logoAlt = "PrensAI Logo",
    ...props 
  }, ref) => {
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
    const userButtonRef = React.useRef<HTMLDivElement>(null)

    const handleBackClick = () => {
      if (onBackClick) {
        onBackClick()
      } else if (backTo) {
        navigate(backTo)
      } else {
        navigate(-1)
      }
    }

    const backButtonTitle = backTo === '/settings' 
      ? 'Volver a Configuración' 
      : backTo 
        ? `Volver ${backTo}` 
        : 'Volver'

    return (
      <div
        ref={ref}
        className={cn("bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10 w-full", className)}
        {...props}
      >
        <div className="w-full py-1 px-6">
          <div className="flex justify-between items-center gap-2 sm:gap-3">
            {/* Lado izquierdo: Navegación y logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1 max-w-[calc(100%-200px)]">
              {/* Spacer o botón de retroceso - mantiene el espacio consistente */}
              {showBackButton ? (
                <button 
                  onClick={handleBackClick}
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 text-white/80 hover:text-blue-300 transition-all duration-300 p-1 sm:p-1 md:p-1.5 rounded-xl hover:bg-white/10 hover:shadow-lg flex items-center justify-center flex-shrink-0"
                  title={backButtonTitle}
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 flex-shrink-0" />
              )}
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center flex-shrink-0 self-end" style={{ marginBottom: '6px', marginRight: '0.5rem' }}>
                <img 
                  src={logoUrl}
                  alt={logoAlt}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.log('Error loading logo:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              <div className="space-y-0.5">
                <h1 className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight drop-shadow-lg text-left">
                  PrensAI
                </h1>
                <p className="text-white/90 text-xs sm:text-sm font-medium text-left hidden sm:block">
                  {title}
                </p>
              </div>
            </div>
            
            {/* Lado derecho: Información del usuario */}
            {user && (
              <div className="flex items-center relative user-section flex-shrink-0 mr-3 sm:mr-5" style={{ gap: '0.5rem' }}>
                {/* Texto y badge - solo visible desde sm (tablet en adelante) */}
                <div className="text-right hidden sm:block" style={{ marginRight: '0.5rem' }}>
                  <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-md mb-1 truncate max-w-[120px] sm:max-w-none">
                    Bienvenido, {user.username}
                  </p>
                  {isAdmin && (
                    <Badge variant="admin" size="xl">
                      ADMIN
                    </Badge>
                  )}
                </div>
                {/* Avatar - visible en todos los tamaños */}
                <div className="relative" ref={userButtonRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:shadow-2xl border-2 border-white/20 transition-all duration-300 cursor-pointer"
                    title={user.username ? `Usuario: ${user.username}${isAdmin ? ' (Admin)' : ''}` : 'Usuario'}
                  >
                    <span className="text-white text-xs sm:text-sm md:text-base font-bold drop-shadow-lg">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </button>
                  {/* Badge ADMIN en móvil - solo icono si es admin */}
                  {isAdmin && (
                    <div className="sm:hidden absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white/20 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">A</span>
                    </div>
                  )}
                  <svg 
                    className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 md:-bottom-1 md:-right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white bg-gray-800 rounded-full p-0.5 sm:p-0.5 transition-all duration-300 shadow-lg border border-gray-700 ${isDropdownOpen ? 'rotate-180 scale-110' : 'hover:scale-110'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown del usuario */}
                <UserDropdown 
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  triggerRef={userButtonRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
GlobalHeader.displayName = "GlobalHeader"

export { GlobalHeader }

