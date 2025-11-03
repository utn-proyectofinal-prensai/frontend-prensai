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
    logoUrl = "/images/fondoblanco.png",
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
        <div className="w-full py-2 px-6">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            {/* Lado izquierdo: Navegación y logo */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 min-w-0 flex-1 max-w-[calc(100%-200px)]">
              {/* Spacer o botón de retroceso - mantiene el espacio consistente */}
              {showBackButton ? (
                <button 
                  onClick={handleBackClick}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white/80 hover:text-blue-300 transition-all duration-300 p-2 sm:p-2.5 md:p-3 rounded-xl hover:bg-white/10 hover:shadow-lg flex items-center justify-center flex-shrink-0"
                  title={backButtonTitle}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0" />
              )}
              
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center flex-shrink-0">
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
              
              <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-lg text-left">
                  PrensAI
                </h1>
                <p className="text-white/90 text-xs sm:text-sm font-medium text-left hidden sm:block">
                  {title}
                </p>
              </div>
            </div>
            
            {/* Lado derecho: Información del usuario */}
            {user && (
              <div className="flex items-center relative user-section flex-shrink-0 mr-4 sm:mr-6" style={{ gap: '0.5rem' }}>
                {/* Texto y badge - solo visible desde sm (tablet en adelante) */}
                <div className="text-right hidden sm:block" style={{ marginRight: '0.5rem' }}>
                  <p className="text-sm sm:text-base font-semibold text-white drop-shadow-md mb-1 sm:mb-2 truncate max-w-[120px] sm:max-w-none">
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
                    className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:shadow-2xl border-2 border-white/20 transition-all duration-300 cursor-pointer"
                    title={user.username ? `Usuario: ${user.username}${isAdmin ? ' (Admin)' : ''}` : 'Usuario'}
                  >
                    <span className="text-white text-base sm:text-lg md:text-xl font-bold drop-shadow-lg">
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
                    className={`absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 md:-bottom-2 md:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white bg-gray-800 rounded-full p-1 sm:p-1.5 transition-all duration-300 shadow-lg border border-gray-700 ${isDropdownOpen ? 'rotate-180 scale-110' : 'hover:scale-110'}`} 
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

