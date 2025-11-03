import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import PageBackground from '../common/PageBackground';
import { GlobalHeader } from '../ui/global-header';

interface AppLayoutProps {
  children?: React.ReactNode;
}

// Interfaz para configuración de rutas
interface RouteConfig {
  title: string;
  showBackButton: boolean;
  backTo?: string;
  useCustomLayout?: boolean; // Páginas que manejan su propio layout completo
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
    useCustomLayout: true // Login maneja su propio background y layout
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
  '/clippings-history': { 
    title: 'Historial de Clippings - Explora todos los clippings generados',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/settings': { 
    title: 'Configuración del Sistema',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/users': { 
    title: 'Gestión de Usuarios - Administra cuentas del sistema',
    showBackButton: true,
    backTo: '/dashboard'
  },
  '/ai-configurations': { 
    title: 'Configuraciones de IA - Parámetros del módulo de inteligencia artificial',
    showBackButton: true,
    backTo: '/dashboard'
  }
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

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

  // Si la página maneja su propio layout completo (como login)
  if (config.useCustomLayout) {
    return children || <Outlet />;
  }

  return (
    <PageBackground>
      {/* Header Global */}
      <GlobalHeader
        title={config.title}
        showBackButton={config.showBackButton}
        backTo={config.backTo}
        user={user ? {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        } : undefined}
        isAdmin={isAdmin}
      />

      {/* Contenido de la página */}
      <div className="w-full px-6 h-full content-main" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        {children || <Outlet />}
      </div>
    </PageBackground>
  );
};

export default AppLayout;
