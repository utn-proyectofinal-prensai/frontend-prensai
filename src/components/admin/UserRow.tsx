import React from 'react';
import type { User } from '../../types/auth';
import { Button } from '../ui/button';
interface UserRowProps {
  usuario: User;
  onView: (usuario: User) => void;
  onEdit: (usuario: User) => void;
  onChangePassword: (usuario: User) => void;
  onDelete: (id: number) => void;
  getRolInfo: (role: string) => { icon: string; label: string; color: string };
}

export const UserRow: React.FC<UserRowProps> = ({
  usuario,
  onView,
  onEdit,
  onChangePassword,
  onDelete,
  getRolInfo
}) => {
  const handleRowClick = () => onView(usuario);
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(usuario);
  };

  const handleChangePasswordClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangePassword(usuario);
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
        <span className={`inline-flex items-center px-6 py-3 text-sm font-bold rounded-full border ${getRolInfo(usuario.role).color}`}>
          <span className="mr-4 flex-shrink-0">{getRolInfo(usuario.role).icon}</span>
          <span>{getRolInfo(usuario.role).label}</span>
        </span>
      </td>
      
      {/* Acciones */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={handleEditClick}
            variant="ghost"
            size="icon"
            icon="Edit"
            title="Editar usuario"
          />
          <Button
            onClick={handleChangePasswordClick}
            variant="ghost"
            size="icon"
            icon="Key"
            title="Cambiar contraseña"
          />
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="icon"
            icon="Delete"
            title="Eliminar usuario"
          />
        </div>
      </td>
    </tr>
  );
};
