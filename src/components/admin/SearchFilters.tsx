import React from 'react';
import { UsersTable } from './UsersTable';
import type { User } from '../../types/auth';
import { Button } from '../ui/button';

interface SearchFiltersProps {
  searchTerm: string;
  filterRol: 'todos' | 'admin' | 'user';
  onSearchChange: (value: string) => void;
  onRolChange: (value: 'todos' | 'admin' | 'user') => void;
  onClearFilters: () => void;
  onAddUser: () => void;
  usuarios: User[];
  onViewUser: (usuario: User) => void;
  onEditUser: (usuario: User) => void;
  onChangePassword: (usuario: User) => void;
  onDeleteUser: (id: number) => void;
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
  onChangePassword,
  onDeleteUser,
  loading = false,
  error = null
}) => {
  return (
    <div className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl" style={{ padding: '24px' }}>
      <div className="space-y-8">
        {/* Sección de filtros */}
        <div className="space-y-6">
          {/* Título de la sección */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-semibold text-white/90 text-center">
              🔍 Filtros de Búsqueda
            </h3>
          </div>

          {/* Vista Desktop - Layout horizontal */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-end">
            {/* Campo de búsqueda - 5 columnas */}
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
            {/* Filtro de rol - 3 columnas */}
            <div className="col-span-3 px-4 py-2">
              <select
                value={filterRol}
                onChange={(e) => onRolChange(e.target.value as 'todos' | 'admin' | 'user')}
                className="w-full h-11 px-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              >
                <option value="todos">🔥 Todos los roles</option>
                <option value="admin">👑 Administradores</option>
                <option value="user">👤 Usuarios</option>
              </select>
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
            {/* Botón agregar - 2 columnas */}
            <div className="col-span-2 px-4 py-2">
              <Button
                onClick={onAddUser}
                variant="success"
                size="lg"
                icon="Plus"
                className="w-full"
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Vista Mobile/Tablet - Layout vertical */}
          <div className="lg:hidden space-y-4 px-4">
            {/* Campo de búsqueda */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar usuarios..."
                className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro de rol */}
            <select
              value={filterRol}
              onChange={(e) => onRolChange(e.target.value as 'todos' | 'admin' | 'user')}
              className="w-full h-12 px-4 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            >
              <option value="todos">🔥 Todos</option>
              <option value="admin">👑 Admins</option>
              <option value="user">👤 Users</option>
            </select>

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
                <span className="hidden sm:inline">Agregar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        {!loading && !error && (
          <UsersTable
            usuarios={usuarios}
            onViewUser={onViewUser}
            onEditUser={onEditUser}
            onChangePassword={onChangePassword}
            onDeleteUser={onDeleteUser}
          />
        )}

        {/* Estados de carga y error */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-white/70 text-lg">Cargando...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        )}

        {!loading && !error && usuarios.length === 0 && (
          <div className="text-center py-8">
            <div className="text-white/70 text-lg">No hay usuarios disponibles</div>
          </div>
        )}
      </div>
    </div>
  );
};
