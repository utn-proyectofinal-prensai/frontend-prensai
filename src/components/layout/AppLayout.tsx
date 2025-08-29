import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useRef, useState } from 'react';
import UserDropdown from '../common/UserDropdown';
import PageBackground from '../common/PageBackground';

interface AppLayoutProps {
  children?: React.ReactNode;
}

// Interfaz para configuración de rutas
interface RouteConfig {
  title: string;
  showBackButton: boolean;
  backTo?: string;
  hideHeader?: boolean;
}

// Configuración de rutas y sus metadatos
const routeConfig: Record<string, RouteConfig> = {
  '/': { 
    title: 'Dashboard de análisis inteligente',
    showBackButton: false
  },
  '/dashboard': { 
    title: 'Dashboard de análisis inteligente',
    showBackButton: false
  },
  '/login': { 
    title: 'Iniciar sesión',
    showBackButton: false,
    hideHeader: true
  },
  '/profile': { 
    title: 'Mi Perfil - Información personal y detalles de la cuenta',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/upload-news': { 
    title: 'Subir Noticias - Carga nuevos contenidos para procesar',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/history': { 
    title: 'Historial - Explora todas las noticias procesadas',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/create-clipping': { 
    title: 'Crear Clipping - Genera reportes personalizados',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/admin': { 
    title: 'Panel de Administración - Gestiona el sistema',
    showBackButton: false
  },
  '/admin-users': { 
    title: 'Gestión de Usuarios - Administra cuentas del sistema',
    showBackButton: true,
    backTo: '/admin'
  }
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  // Estado para el dropdown del usuario
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userButtonRef = useRef<HTMLDivElement>(null);

  // Obtener configuración de la ruta actual
  const getCurrentRouteConfig = (): RouteConfig => {
    const currentPath = location.pathname;
    
    // Buscar configuración exacta
    if (routeConfig[currentPath]) {
      return routeConfig[currentPath];
    }
    
    // Configuración por defecto para rutas no configuradas
    return {
      title: 'PrensAI',
      showBackButton: true,
      backTo: '/dashboard'
    };
  };

  const config = getCurrentRouteConfig();

  // Si la ruta debe ocultar el header (como login)
  if (config.hideHeader) {
    return (
      <PageBackground>
        {children || <Outlet />}
      </PageBackground>
    );
  }

  const handleBackClick = () => {
    if (config.backTo) {
      navigate(config.backTo);
    } else {
      navigate(-1); // Volver atrás en el historial
    }
  };

  return (
    <PageBackground>
      {/* Header Global */}
      <div className="bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10 w-full">
        <div className="w-full py-2 px-6">
          <div className="flex justify-between items-center">
            {/* Lado izquierdo: Navegación y logo */}
            <div className="flex items-center space-x-6">
              {config.showBackButton && (
                <button 
                  onClick={handleBackClick}
                  className="text-white/80 hover:text-blue-300 transition-all duration-300 p-3 rounded-xl hover:bg-white/10 hover:shadow-lg"
                  title={`Volver ${config.backTo === '/admin' ? 'al Panel Admin' : 'al Dashboard'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              
              <div className="w-32 h-32 flex items-center justify-center">
                <img 
                  src="/images/fondoblanco.png" 
                  alt="PrensAI Logo" 
                  className="w-28 h-28 object-contain"
                  onError={(e) => {
                    console.log('Error loading logo:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                  PrensAI
                </h1>
                <p className="text-white/90 text-sm font-medium">
                  {config.title}
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

      {/* Contenido de la página */}
      <div className="w-full px-6 h-full content-main" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        {children || <Outlet />}
      </div>
    </PageBackground>
  );
};

export default AppLayout;
