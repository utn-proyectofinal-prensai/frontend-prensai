import React from 'react';
import type { User } from '../../types/auth';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip } from '../ui/tooltip';
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
      className="cursor-pointer group"
      onClick={handleRowClick}
    >
      {/* Email */}
      <td>
        <Tooltip content={usuario.email} position="top" onlyIfTruncated={true}>
          <div className="history-table-cell-content font-semibold">
            {usuario.email}
          </div>
        </Tooltip>
      </td>
      
      {/* Nombre */}
      <td>
        <Tooltip content={usuario.first_name || 'Sin nombre'} position="top" onlyIfTruncated={true}>
          <div className="history-table-cell-content">
            {usuario.first_name || 'Sin nombre'}
          </div>
        </Tooltip>
      </td>
      
      {/* Apellido */}
      <td>
        <Tooltip content={usuario.last_name || 'Sin apellido'} position="top" onlyIfTruncated={true}>
          <div className="history-table-cell-content">
            {usuario.last_name || 'Sin apellido'}
          </div>
        </Tooltip>
      </td>
      
      {/* Username */}
      <td>
        <div className="history-table-cell-content">
          {usuario.username || '-'}
        </div>
      </td>
      
      {/* Rol */}
      <td>
        <div className="history-table-cell-content">
          <Badge 
            variant={usuario.role === 'admin' ? 'admin' : 'user'} 
            size="default"
          >
            {getRolInfo(usuario.role).label}
          </Badge>
        </div>
      </td>
      
      {/* Creación */}
      <td>
        <div className="history-table-cell-content">
          {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString() : '-'}
        </div>
      </td>
      
      {/* Acciones */}
      <td>
        <div className="history-actions" style={{ display: 'flex', gap: '2px', flexWrap: 'nowrap', justifyContent: 'center' }}>
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
