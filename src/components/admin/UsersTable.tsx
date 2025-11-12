import React from 'react';
import { UserRow } from './UserRow';
import type { User } from '../../types/auth';
import { getRoleInfo } from '../../constants/admin/userRoles';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import '../../styles/history.css';

interface UsersTableProps {
  usuarios: User[];
  onViewUser: (usuario: User) => void;
  onEditUser: (usuario: User) => void;
  onChangePassword: (usuario: User) => void;
  onDeleteUser: (id: number) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  usuarios,
  onViewUser,
  onEditUser,
  onChangePassword,
  onDeleteUser
}) => {

  return (
    <>
      {/* Vista Desktop - Tabla mejorada */}
      <div className="hidden lg:block">
        <div className="history-table-container" style={{ overflowX: 'auto', width: '100%' }}>
          <table className="history-table" style={{ width: '100%', tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Username</th>
                <th>Rol</th>
                <th>Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <UserRow
                  key={usuario.id}
                  usuario={usuario}
                  onView={onViewUser}
                  onEdit={onEditUser}
                  onChangePassword={onChangePassword}
                  onDelete={onDeleteUser}
                  getRolInfo={(role: string) => getRoleInfo(role as any)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile/Tablet - Tarjetas */}
      <div className="lg:hidden space-y-4 p-4 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl">
        {usuarios.map((usuario) => {
          const roleInfo = getRoleInfo(usuario.role as any);
          return (
            <div
              key={usuario.id}
              className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm rounded-xl border border-white/20 px-4 pb-4 pt-8 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
              onClick={() => onViewUser(usuario)}
            >
              {/* Información principal */}
              <div className="space-y-3">
                {/* Avatar, Nombre y email */}
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-xl border-2 border-white/20 mb-3">
                    <span className="text-white text-xl font-bold drop-shadow-lg">
                      {usuario.first_name?.charAt(0)?.toUpperCase() || usuario.username?.charAt(0)?.toUpperCase() || '?'}
                      {usuario.last_name?.charAt(0)?.toUpperCase() || ''}
                    </span>
                  </div>
                  {/* Nombre y email */}
                  <div>
                    <div className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {usuario.first_name || 'Sin nombre'} {usuario.last_name || 'Sin apellido'}
                    </div>
                    <div className="text-sm text-white/70 mt-1">{usuario.email}</div>
                  </div>
                </div>

                {/* Rol */}
                <div className="flex justify-center">
                  <Badge 
                    variant={usuario.role === 'admin' ? 'admin' : 'user'} 
                    size="sm"
                  >
                    {roleInfo.label}
                  </Badge>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-center space-x-2 pt-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditUser(usuario);
                    }}
                    variant="ghost"
                    size="icon"
                    icon="Edit"
                    title="Editar usuario"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangePassword(usuario);
                    }}
                    variant="ghost"
                    size="icon"
                    icon="Key"
                    title="Cambiar contraseña"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteUser(usuario.id);
                    }}
                    variant="ghost"
                    size="icon"
                    icon="Delete"
                    title="Eliminar usuario"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
