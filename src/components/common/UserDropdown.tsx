import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/useAuth';

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
      className="w-96 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden user-dropdown"
      style={dropdownStyle}
    >
      {/* Header del dropdown */}
      <div className="border-b border-white/20" style={{ padding: '24px 32px 24px 32px' }}>
        <div className="flex flex-col space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-3">{user?.username}</h3>
            <p className="text-white/70 text-base mb-4">{user?.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center px-8 py-4 text-sm font-bold rounded-full border border-red-300/30 bg-red-500/20 text-red-400">
                ADMINISTRADOR
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Opciones del usuario */}
      <div className="p-8">
        <button 
          onClick={() => handleNavigation('/profile')}
          className="w-full flex items-center px-6 py-5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-semibold text-lg" style={{ marginLeft: '20px' }}>Mi Perfil</span>
        </button>
      </div>

      {/* Sección de Administración - Solo para admins */}
      {isAdmin && (
        <>
          <div className="px-8 py-6">
            <div className="h-px bg-white/20"></div>
          </div>
          
          <div className="p-8">
            <div className="px-6 py-4">
              <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-6 text-center">
                ADMINISTRACIÓN
              </h4>
            </div>

            <button 
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center px-6 py-5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group mb-4"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1 text-left" style={{ marginLeft: '20px' }}>
                <span className="font-semibold text-lg">Temas y menciones</span>
                <p className="text-sm text-white/60 mt-1">Gestiona temas y menciones de personas</p>
              </div>
            </button>

            <button 
              onClick={() => handleNavigation('/users')}
              className="w-full flex items-center px-6 py-5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group mb-4"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left" style={{ marginLeft: '20px' }}>
                <span className="font-semibold text-lg">Gestión de Usuarios</span>
                <p className="text-sm text-white/60 mt-1">Administra usuarios y permisos</p>
              </div>
            </button>

            <button 
              onClick={() => handleNavigation('/ai-configurations')}
              className="w-full flex items-center px-6 py-5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left" style={{ marginLeft: '20px' }}>
                <span className="font-semibold text-lg">Configuraciones de IA</span>
                <p className="text-sm text-white/60 mt-1">Parámetros del módulo de inteligencia artificial</p>
              </div>
            </button>
          </div>
        </>
      )}

      {/* Separador */}
      <div className="px-8 py-6">
        <div className="h-px bg-white/20"></div>
      </div>

      {/* Cerrar sesión */}
      <div className="p-8">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="font-semibold text-lg" style={{ marginLeft: '20px' }}>Cerrar Sesión</span>
        </button>
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
    animation: slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
    border-bottom: 8px solid rgba(0, 0, 0, 0.4);
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.3));
  }

  .user-dropdown button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-dropdown button:hover {
    transform: translateX(6px);
    background-color: rgba(255, 255, 255, 0.15);
  }

  .user-dropdown button:active {
    transform: translateX(3px) scale(0.98);
  }

  .user-dropdown .bg-white\\/20 {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-dropdown button:hover .bg-white\\/20 {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

// Agregar estilos al documento solo una vez
if (typeof document !== 'undefined' && !document.getElementById('user-dropdown-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'user-dropdown-styles';
  styleElement.textContent = dropdownStyles;
  document.head.appendChild(styleElement);
}
