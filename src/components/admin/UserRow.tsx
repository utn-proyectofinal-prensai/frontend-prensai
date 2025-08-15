import React from 'react';
import type { AdminUser } from '../../services/api';

interface UserRowProps {
  usuario: AdminUser;
  onView: (usuario: AdminUser) => void;
  onEdit: (usuario: AdminUser) => void;
  onDelete: (id: string) => void;
  getRolInfo: (role: string) => { icon: string; label: string; color: string };
}

export const UserRow: React.FC<UserRowProps> = ({
  usuario,
  onView,
  onEdit,
  onDelete,
  getRolInfo
}) => {
  const handleRowClick = () => onView(usuario);
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(usuario);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(usuario.id);
  };

  return (
    <tr 
      className="hover:bg-white/5 transition-all duration-300 cursor-pointer group"
      onClick={handleRowClick}
    >
      {/* Usuario */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">
              {usuario.first_name?.charAt(0) || usuario.username?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
              {usuario.first_name || 'Sin nombre'} {usuario.last_name || 'Sin apellido'}
            </div>
            <div className="text-sm text-white/70">@{usuario.username}</div>
          </div>
        </div>
      </td>
      
      {/* Email */}
      <td className="px-6 py-4">
        <div className="text-sm text-white/90">{usuario.email}</div>
      </td>
      
      {/* Rol */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getRolInfo(usuario.role).color}`}>
          <span className="mr-1">{getRolInfo(usuario.role).icon}</span>
          {getRolInfo(usuario.role).label}
        </span>
      </td>
      
      {/* Actividad */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="text-sm text-white/70">
            <span className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              {usuario.sign_in_count || 0} logins
            </span>
          </div>
          <div className="text-xs text-white/60">
            {usuario.last_sign_in_at ? new Date(usuario.last_sign_in_at).toLocaleDateString('es-ES') : 'Nunca'}
          </div>
        </div>
      </td>
      
      {/* Estado */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          {usuario.current_sign_in_at && (
            <span className="inline-flex px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-300/30">
              🟢 Sesión activa
            </span>
          )}
          {usuario.allow_password_change && (
            <span className="inline-flex px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-300/30">
              🔑 Cambio pendiente
            </span>
          )}
        </div>
      </td>
      
      {/* Acciones */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={handleEditClick}
            className="text-blue-400 hover:text-blue-300 transition-all duration-300 p-2 hover:bg-blue-500/20 rounded-lg hover:scale-110"
            title="Editar usuario"
          >
            ✏️
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-red-400 hover:text-red-300 transition-all duration-300 p-2 hover:bg-red-500/20 rounded-lg hover:scale-110"
            title="Eliminar usuario"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};
