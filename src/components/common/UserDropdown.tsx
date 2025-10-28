import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/useAuth';
import { Button } from '../ui/button';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

export default function UserDropdown({ isOpen, onClose, triggerRef }: UserDropdownProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen || !triggerRef.current) return null;

  // Obtener la posición del botón trigger
  const triggerRect = triggerRef.current.getBoundingClientRect();
  
  // Calcular la posición del dropdown
  const dropdownStyle = {
    position: 'fixed' as const,
    top: triggerRect.bottom + 12, // 12px de margen
    right: window.innerWidth - triggerRect.right,
    zIndex: 9999,
  };

  // Renderizar el dropdown usando un portal
  return createPortal(
    <div 
      ref={dropdownRef}
      className="w-80 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden user-dropdown transform transition-all duration-300 scale-100 opacity-100"
      style={dropdownStyle}
    >
      {/* Header del dropdown */}
      <div className="bg-slate-800/50 border-b border-white/10" style={{ padding: '20px 24px 20px 28px' }}>
        <div className="flex items-center" style={{ gap: '24px' }}>
          {/* Avatar del usuario */}
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20 flex-shrink-0">
            <span className="text-white text-lg font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Información del usuario */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate mb-1">{user?.username}</h3>
            <p className="text-sm text-white/70 truncate mb-2">{user?.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border border-red-300/30 bg-red-500/20 text-red-400">
                ADMINISTRADOR
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Opciones del usuario */}
      <div style={{ padding: '16px 16px 16px 12px' }}>
        {/* Mi Perfil */}
        <Button 
          onClick={() => handleNavigation('/profile')}
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group mb-3"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-blue-300/30 group-hover:scale-105 transition-transform duration-200" style={{ marginRight: '20px' }}>
            <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-base">Mi Perfil</span>
            <span className="text-xs text-white/60">Información personal</span>
          </div>
        </Button>

        {/* Temas y menciones */}
        <Button 
          onClick={() => handleNavigation('/settings')}
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group mb-3"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-green-300/30 group-hover:scale-105 transition-transform duration-200" style={{ marginRight: '20px' }}>
            <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-base">Temas y menciones</span>
            <span className="text-xs text-white/60">Temas y menciones</span>
          </div>
        </Button>

        {/* Gestión de Usuarios */}
        <Button 
          onClick={() => handleNavigation('/users')}
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group mb-3"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-purple-300/30 group-hover:scale-105 transition-transform duration-200" style={{ marginRight: '20px' }}>
            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-base">Gestión de Usuarios</span>
            <span className="text-xs text-white/60">Usuarios y permisos</span>
          </div>
        </Button>

        {/* Configuraciones de IA */}
        <Button 
          onClick={() => handleNavigation('/ai-configurations')}
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-orange-300/30 group-hover:scale-105 transition-transform duration-200" style={{ marginRight: '20px' }}>
            <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-base">Configuraciones de IA</span>
            <span className="text-xs text-white/60">Parámetros de IA</span>
          </div>
        </Button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10 mx-4"></div>

      {/* Cerrar Sesión */}
      <div style={{ padding: '16px' }}>
        <Button 
          onClick={handleLogout}
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
        >
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-red-300/30 group-hover:scale-105 transition-transform duration-200" style={{ marginRight: '20px' }}>
            <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-base">Cerrar Sesión</span>
            <span className="text-xs text-red-400/60">Salir de la cuenta</span>
          </div>
        </Button>
      </div>
    </div>,
    document.body
  );
}

// Estilos CSS personalizados para las animaciones
const dropdownStyles = `
  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .user-dropdown {
    animation: slideInFromTop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  }

  .user-dropdown::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(15, 23, 42, 0.95);
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.3));
  }

  .user-dropdown button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
  }

  .user-dropdown button:hover {
    transform: translateX(4px);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .user-dropdown button:active {
    transform: translateX(2px) scale(0.98);
  }

  .user-dropdown .group:hover .group-hover\\:scale-105 {
    transform: scale(1.05);
  }

  .user-dropdown .group:hover .group-hover\\:scale-105 svg {
    filter: brightness(1.2);
  }
`;

// Agregar estilos al documento solo una vez
if (typeof document !== 'undefined' && !document.getElementById('user-dropdown-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'user-dropdown-styles';
  styleElement.textContent = dropdownStyles;
  document.head.appendChild(styleElement);
}
