import React, { useState } from 'react';
import { UserRow } from './UserRow';
import type { AdminUser } from '../../services/api';
import { USER_MESSAGES } from '../../constants/admin/userMessages';
import { getRoleInfo } from '../../constants/admin/userRoles';

interface UsersTableProps {
  usuarios: AdminUser[];
  onViewUser: (usuario: AdminUser) => void;
  onEditUser: (usuario: AdminUser) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  usuarios,
  onViewUser,
  onEditUser,
  onDeleteUser
}) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectUser = (userId: string) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
    setSelectAll(newSelectedUsers.size === usuarios.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
      setSelectAll(false);
    } else {
      setSelectedUsers(new Set(usuarios.map(u => u.id)));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) return;
    
    if (window.confirm(USER_MESSAGES.CONFIRMATIONS.BULK_DELETE)) {
      selectedUsers.forEach(id => onDeleteUser(id));
      setSelectedUsers(new Set());
      setSelectAll(false);
    }
  };

  const handleBulkEdit = () => {
    if (selectedUsers.size === 0) return;
    // Implementar edición en masa
    console.log('Editar usuarios seleccionados:', Array.from(selectedUsers));
  };

  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-xl">
      {/* Título de la sección */}
      <div className="bg-black/30 px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white/90 text-center">
          📋 Lista de Usuarios ({usuarios.length})
        </h3>
      </div>

      {/* Barra de acciones en masa */}
      {selectedUsers.size > 0 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-blue-300/30 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-6 py-3 bg-blue-500/30 text-blue-200 rounded-full text-sm font-semibold border border-blue-400/30">
                {selectedUsers.size} {USER_MESSAGES.STATES.USERS_COUNT}
              </span>
              <button
                onClick={() => {
                  setSelectedUsers(new Set());
                  setSelectAll(false);
                }}
                className="text-blue-300 hover:text-blue-200 text-sm underline"
              >
                {USER_MESSAGES.STATES.DESELECT_ALL}
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleBulkEdit}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">✏️</span>
                <span>{USER_MESSAGES.ACTIONS.EDIT} Seleccionados</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">🗑️</span>
                <span>{USER_MESSAGES.ACTIONS.DELETE} Seleccionados</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-black/30">
            <tr>
              <th className="px-6 py-6 text-left">
                <div className="flex items-center h-full" style={{ padding: '16px 0' }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer hover:border-blue-400 transition-colors"
                  />
                </div>
              </th>
              <th className="px-6 py-6 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                {USER_MESSAGES.FORMS.EMAIL}
              </th>
              <th className="px-6 py-6 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-6 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-6 text-left text-sm font-bold text-white/90 uppercase tracking-wider">
                {USER_MESSAGES.FORMS.ROLE}
              </th>
              <th className="px-6 py-6 text-center text-sm font-bold text-white/90 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {usuarios.map((usuario) => (
              <UserRow
                key={usuario.id}
                usuario={usuario}
                isSelected={selectedUsers.has(usuario.id)}
                onSelect={handleSelectUser}
                onView={onViewUser}
                onEdit={onEditUser}
                onDelete={onDeleteUser}
                getRolInfo={(role: string) => getRoleInfo(role as any)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
