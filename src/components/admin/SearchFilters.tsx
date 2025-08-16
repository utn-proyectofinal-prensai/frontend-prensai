import React from 'react';
import { UsersTable } from './UsersTable';
import type { AdminUser } from '../../services/api';

interface SearchFiltersProps {
  searchTerm: string;
  filterRol: 'todos' | 'admin' | 'user';
  onSearchChange: (value: string) => void;
  onRolChange: (value: 'todos' | 'admin' | 'user') => void;
  onClearFilters: () => void;
  onAddUser: () => void;
  usuarios: AdminUser[];
  onViewUser: (usuario: AdminUser) => void;
  onEditUser: (usuario: AdminUser) => void;
  onDeleteUser: (id: string) => void;
  getRolInfo: (role: string) => { icon: string; label: string; color: string };
  loading?: boolean;
  error?: string | null;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  filterRol,
  onSearchChange,
  onRolChange,
  onClearFilters,
  onAddUser,
  usuarios,
  onViewUser,
  onEditUser,
  onDeleteUser,
  getRolInfo,
  loading = false,
  error = null
}) => {
  return (
    <div className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl" style={{ padding: '24px' }}>
      <div className="space-y-8">
        {/* Sección de filtros */}
        <div className="grid grid-cols-12 gap-4 items-end">
          {/* Título de la sección */}
          <div className="col-span-12 mb-4 px-4 py-4">
            <h3 className="text-lg font-semibold text-white/90 text-center">
              🔍 Filtros de Búsqueda
            </h3>
          </div>
          {/* Campo de búsqueda - ocupa 5 columnas */}
          <div className="col-span-5 px-4 py-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Nombre, usuario o email..."
                className="w-full h-11 px-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          {/* Filtro de rol - ocupa 3 columnas */}
          <div className="col-span-3 px-4 py-2">
            <select
              value={filterRol}
              onChange={(e) => onRolChange(e.target.value as 'todos' | 'admin' | 'user')}
              className="w-full h-11 px-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            >
              <option value="todos">🎯 Todos los roles</option>
              <option value="admin">👑 Administrador</option>
              <option value="user">👤 Usuario</option>
            </select>
          </div>
          {/* Botón limpiar - ocupa 2 columnas */}
          <div className="col-span-2 px-4 py-2">
            <button
              onClick={onClearFilters}
              className="w-full h-11 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>✨</span>
              <span>Limpiar</span>
            </button>
          </div>
          {/* Botón agregar usuario - ocupa 2 columnas */}
          <div className="col-span-2 px-4 py-2">
            <button
              onClick={onAddUser}
              className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-white font-bold mr-1">+</span>
              <span>Agregar</span>
            </button>
          </div>
        </div>

        {/* Espacio entre filtros y tabla */}
        <div className="h-8"></div>

        {/* Contenido de usuarios */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-500 mx-auto mb-5"></div>
            <p className="text-white/80 text-lg">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-4xl mb-5">⚠️</div>
            <p className="text-white/80 mb-5 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : (
          /* Tabla de usuarios */
          <div className="px-4">
            <UsersTable
              usuarios={usuarios}
              onViewUser={onViewUser}
              onEditUser={onEditUser}
              onDeleteUser={onDeleteUser}
              getRolInfo={getRolInfo}
            />
          </div>
        )}
      </div>
    </div>
  );
};
