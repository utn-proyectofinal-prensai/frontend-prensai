import React from 'react';
import type { AdminUser } from '../../services/api';
import { UserRow } from './UserRow';

interface UsersTableProps {
  usuarios: AdminUser[];
  onViewUser: (usuario: AdminUser) => void;
  onEditUser: (usuario: AdminUser) => void;
  onDeleteUser: (id: string) => void;
  getRolInfo: (role: string) => { icon: string; label: string; color: string };
}

export const UsersTable: React.FC<UsersTableProps> = ({
  usuarios,
  onViewUser,
  onEditUser,
  onDeleteUser,
  getRolInfo
}) => {
  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-black/30">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-white/90 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {usuarios.map((usuario) => (
              <UserRow
                key={usuario.id}
                usuario={usuario}
                onView={onViewUser}
                onEdit={onEditUser}
                onDelete={onDeleteUser}
                getRolInfo={getRolInfo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
