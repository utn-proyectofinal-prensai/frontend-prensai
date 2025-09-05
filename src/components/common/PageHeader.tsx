import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import UserDropdown from './UserDropdown';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backButtonPath?: string;
  backButtonLabel?: string;
  variant?: 'transparent' | 'gradient' | 'solid';
  className?: string;
}

export default function PageHeader({
  title,
  showBackButton = false,
  backButtonPath = '/dashboard',
  backButtonLabel = 'Volver al Dashboard',
  variant = 'transparent',
  className = ''
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  // Estado para el dropdown del usuario
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userButtonRef = useRef<HTMLDivElement>(null);

  const getHeaderStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-slate-900/90 via-blue-900/70 to-indigo-900/90 backdrop-blur-xl shadow-2xl border-b border-white/20';
      case 'solid':
        return 'bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10';
      default:
        return 'bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10';
    }
  };

  const getLogoSize = () => {
    return variant === 'gradient' ? 'w-20 h-20' : 'w-32 h-32';
  };

  const getTitleSize = () => {
    return variant === 'gradient' ? 'text-3xl' : 'text-2xl';
  };

  const getSubtitleSize = () => {
    return variant === 'gradient' ? 'text-lg' : 'text-sm';
  };

  const getPadding = () => {
    return variant === 'gradient' ? 'py-6 px-12' : 'py-2 px-6';
  };

  // Detectar automáticamente si debe mostrar el botón de volver atrás
  const shouldShowBackButton = () => {
    // Si se especifica explícitamente, usar esa configuración
    if (showBackButton !== undefined) {
      return showBackButton;
    }
    
    // Mostrar botón de volver en todas las páginas excepto dashboard y login
    const currentPath = location.pathname;
    console.log('Current path:', currentPath); // Debug
    
    // Lógica simplificada y más robusta
    if (currentPath === '/' || currentPath === '/dashboard') {
      console.log('Dashboard detected - no back button');
      return false;
    }
    
    if (currentPath === '/login') {
      console.log('Login detected - no back button');
      return false;
    }
    
    console.log('Other page detected - showing back button');
    return true;
  };

  // Determinar la ruta de destino del botón de volver
  const getBackButtonPath = () => {
    // Si se especifica explícitamente, usar esa configuración
    if (showBackButton && backButtonPath !== '/dashboard') {
      return backButtonPath;
    }
    
    // Lógica automática para determinar la ruta de destino
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/admin')) {
      return '/admin';
    } else if (currentPath === '/profile') {
      return '/dashboard';
    } else if (currentPath === '/upload-news' || currentPath === '/history' || currentPath === '/create-clipping') {
      return '/dashboard';
    }
    
    return '/dashboard';
  };

  // Determinar el texto del botón de volver
  const getBackButtonLabel = () => {
    // Si se especifica explícitamente, usar esa configuración
    if (showBackButton && backButtonLabel !== 'Volver al Dashboard') {
      return backButtonLabel;
    }
    
    // Lógica automática para determinar el texto
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/settings') || currentPath.startsWith('/users')) {
      return 'Volver a Configuración';
    } else if (currentPath === '/profile') {
      return 'Volver al Dashboard';
    } else if (currentPath === '/upload-news') {
      return 'Volver al Dashboard';
    } else if (currentPath === '/history') {
      return 'Volver al Dashboard';
    } else if (currentPath === '/create-clipping') {
      return 'Volver al Dashboard';
    }
    
    return 'Volver al Dashboard';
  };

  return (
    <div className={`${getHeaderStyles()} w-full ${className}`}>
      <div className={`w-full ${getPadding()}`}>
        <div className="flex justify-between items-center">
          {/* Lado izquierdo: Navegación y logo */}
          <div className="flex items-center space-x-6">
            {shouldShowBackButton() && (
              <button 
                onClick={() => navigate(getBackButtonPath())}
                className="text-white/80 hover:text-blue-300 transition-all duration-300 p-3 rounded-xl hover:bg-white/10 hover:shadow-lg border border-white/20"
                title={getBackButtonLabel()}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            
            <div className={`${getLogoSize()} flex items-center justify-center`}>
              <img 
                src="/images/fondoblanco.png" 
                alt="PrensAI Logo" 
                className={`${variant === 'gradient' ? 'w-16 h-16' : 'w-28 h-28'} object-contain`}
                onError={(e) => {
                  console.log('Error loading logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            <div className="space-y-2">
              <h1 className={`${getTitleSize()} font-bold text-white tracking-tight drop-shadow-lg`}>
                PrensAI
              </h1>
              <p className={`text-white/90 ${getSubtitleSize()} font-medium`}>
                {title}
              </p>
            </div>
          </div>
          
          {/* Lado derecho: Información del usuario */}
          <div className="flex items-center space-x-6 relative user-section">
            <div className="text-right mr-3">
              <p className="text-sm font-semibold text-white drop-shadow-md mb-2">
                Bienvenido, {user?.username}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center px-8 py-4 text-sm font-bold rounded-full border border-red-300/30 bg-red-500/20 text-red-400">
                  ADMIN
                </span>
              )}
            </div>
            <div className="relative" ref={userButtonRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-white/20"
              >
                <span className="text-white text-xl font-bold drop-shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </button>
              <svg 
                className={`absolute -bottom-2 -right-2 w-6 h-6 text-white bg-gray-800 rounded-full p-1.5 transition-all duration-300 shadow-lg border border-gray-700 ${isDropdownOpen ? 'rotate-180 scale-110' : 'hover:scale-110'}`} 
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
        </div>
      </div>
    </div>
  );
}
