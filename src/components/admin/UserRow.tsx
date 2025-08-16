import React from 'react';
import type { AdminUser } from '../../services/api';

interface UserRowProps {
  usuario: AdminUser;
  isSelected: boolean;
  onSelect: (userId: string) => void;
  onView: (usuario: AdminUser) => void;
  onEdit: (usuario: AdminUser) => void;
  onDelete: (id: string) => void;
  getRolInfo: (role: string) => { icon: string; label: string; color: string };
}

export const UserRow: React.FC<UserRowProps> = ({
  usuario,
  isSelected,
  onSelect,
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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(usuario.id);
  };

  return (
    <tr 
      className="hover:bg-white/5 transition-all duration-300 cursor-pointer group"
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      <td className="px-6 py-4 text-left">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(usuario.id)}
          onClick={handleCheckboxClick}
          className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer hover:border-blue-400 transition-colors"
        />
      </td>
      
      {/* Email */}
      <td className="px-6 py-4 text-left">
        <div className="text-sm text-white/90 font-medium">{usuario.email}</div>
      </td>
      
      {/* Nombre Completo */}
      <td className="px-6 py-4 text-left">
        <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
          {usuario.first_name || 'Sin nombre'} {usuario.last_name || 'Sin apellido'}
        </div>
      </td>
      
      {/* Username */}
      <td className="px-6 py-4 text-left">
        <div className="text-sm text-white/70">@{usuario.username}</div>
      </td>
      
      {/* Rol */}
      <td className="px-6 py-4 text-left">
        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getRolInfo(usuario.role).color}`}>
          <span className="mr-1">{getRolInfo(usuario.role).icon}</span>
          {getRolInfo(usuario.role).label}
        </span>
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
