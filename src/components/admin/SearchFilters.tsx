import React from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  filterRol: 'todos' | 'admin' | 'user';
  onSearchChange: (value: string) => void;
  onRolChange: (value: 'todos' | 'admin' | 'user') => void;
  onClearFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  filterRol,
  onSearchChange,
  onRolChange,
  onClearFilters
}) => {
  return (
    <div className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-white">Filtros de Búsqueda</h3>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 items-end">
        {/* Campo de búsqueda */}
        <div className="flex-1 space-y-3">
          <label className="block text-white/90 text-sm font-semibold">
            🔍 Búsqueda
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, usuario o email..."
              className="w-full px-5 py-4 bg-black/40 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Filtro de rol */}
        <div className="w-64 space-y-3">
          <label className="block text-white/90 text-sm font-semibold">
            🏷️ Rol
          </label>
          <select
            value={filterRol}
            onChange={(e) => onRolChange(e.target.value as 'todos' | 'admin' | 'user')}
            className="w-full px-5 py-4 bg-black/40 border border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 appearance-none cursor-pointer"
          >
            <option value="todos">🎯 Todos los roles</option>
            <option value="admin">👑 Administrador</option>
            <option value="user">👤 Usuario</option>
          </select>
        </div>

        {/* Botón limpiar */}
        <div className="w-auto">
          <button
            onClick={onClearFilters}
            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
          >
            <span>✨</span>
            <span>Limpiar Filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
