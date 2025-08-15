import React from 'react';

interface AdminUsersHeaderProps {
  onAddUser: () => void;
}

export const AdminUsersHeader: React.FC<AdminUsersHeaderProps> = ({ 
  onAddUser
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
        <p className="text-white/70 text-sm">
          Administra y controla el acceso de usuarios al sistema
        </p>
      </div>
      <button
        onClick={onAddUser}
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span className="text-xl">➕</span>
        <span>Agregar Usuario</span>
      </button>
    </div>
  );
};
