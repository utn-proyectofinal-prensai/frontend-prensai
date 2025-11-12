import React from 'react';
import { Button } from '../ui/button';
import { Search, Crown, User as UserIcon, Users } from 'lucide-react';
import '../../styles/upload-news.css';

interface SearchFiltersProps {
  searchTerm: string;
  filterRol: 'todos' | 'admin' | 'user';
  onSearchChange: (value: string) => void;
  onRolChange: (value: 'todos' | 'admin' | 'user') => void;
  onClearFilters: () => void;
  onAddUser: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  filterRol,
  onSearchChange,
  onRolChange,
  onClearFilters,
  onAddUser
}) => {
  return (
    <div className="upload-news-panel history-filters-panel">
      {/* Sección de filtros */}
      <div className="space-y-6">
          {/* Título de la sección */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5 text-white/90" />
              <h3 className="text-lg font-semibold text-white/90 text-center">
                Filtros de Búsqueda
              </h3>
            </div>
          </div>

          {/* Vista Desktop - Layout horizontal */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-end" style={{ marginTop: '1.5rem' }}>
            {/* Campo de búsqueda - 5 columnas */}
            <div className="col-span-5 px-4 py-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none z-10">
                  <Search className="w-4 h-4" />
                </div>
                <div style={{ marginBottom: '0px' }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Nombre, usuario o email..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15"
                    style={{ 
                      padding: '12px 16px',
                      paddingLeft: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Filtro de rol - 3 columnas */}
            <div className="col-span-3 px-4 py-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none z-10">
                  {filterRol === 'admin' ? (
                    <Crown className="w-4 h-4" />
                  ) : filterRol === 'user' ? (
                    <UserIcon className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                </div>
                <div style={{ marginBottom: '0px' }}>
                  <select
                    value={filterRol}
                    onChange={(e) => onRolChange(e.target.value as 'todos' | 'admin' | 'user')}
                    className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15 appearance-none"
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      paddingLeft: '2.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <option value="todos" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Todos los roles</option>
                    <option value="admin" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Administradores</option>
                    <option value="user" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Usuarios</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Botón limpiar - 2 columnas */}
            <div className="col-span-2 px-4 py-2">
              <Button
                onClick={onClearFilters}
                variant="secondary"
                size="lg"
                icon="Refresh"
                className="w-full"
              >
                Limpiar
              </Button>
            </div>
            {/* Botón nuevo usuario - 2 columnas */}
            <div className="col-span-2 px-4 py-2">
              <Button
                onClick={onAddUser}
                variant="success"
                size="lg"
                icon="Plus"
                className="w-full"
              >
                Nuevo Usuario
              </Button>
            </div>
          </div>

          {/* Vista Mobile/Tablet - Layout vertical */}
          <div className="lg:hidden space-y-4 px-4" style={{ marginTop: '1.5rem' }}>
            {/* Campo de búsqueda */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none z-10">
                <Search className="w-5 h-5" />
              </div>
              <div style={{ marginBottom: '0px' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar usuarios..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15"
                  style={{ 
                    padding: '12px 16px',
                    paddingLeft: '3rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Filtro de rol */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none z-10">
                {filterRol === 'admin' ? (
                  <Crown className="w-5 h-5" />
                ) : filterRol === 'user' ? (
                  <UserIcon className="w-5 h-5" />
                ) : (
                  <Users className="w-5 h-5" />
                )}
              </div>
              <div style={{ marginBottom: '0px' }}>
                <select
                  value={filterRol}
                  onChange={(e) => onRolChange(e.target.value as 'todos' | 'admin' | 'user')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15 appearance-none"
                  style={{ 
                    width: '100%',
                    padding: '12px 16px',
                    paddingLeft: '3rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <option value="todos" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Todos</option>
                  <option value="admin" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Admins</option>
                  <option value="user" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Users</option>
                </select>
              </div>
            </div>

            {/* Botones en fila */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onClearFilters}
                variant="secondary"
                size="lg"
                icon="Refresh"
              >
                <span className="hidden sm:inline">Limpiar</span>
              </Button>
              <Button
                onClick={onAddUser}
                variant="success"
                size="lg"
                icon="Plus"
              >
                <span className="hidden sm:inline">Nuevo Usuario</span>
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
};
