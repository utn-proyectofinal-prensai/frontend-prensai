import React from 'react';
import { Users, Crown, User } from 'lucide-react';

interface AdminUsersHeaderProps {
  totalUsers: number;
  adminUsers: number;
}

export const AdminUsersHeader: React.FC<AdminUsersHeaderProps> = ({ 
  totalUsers,
  adminUsers
}) => {
  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl" style={{ padding: '32px' }}>
      <div className="flex flex-col space-y-8">
        {/* Título principal y descripción */}
        <div className="flex flex-col items-center space-y-6 px-4 py-4">
          <h2 className="text-4xl font-bold text-white text-center mb-6 tracking-tight drop-shadow-lg">
            Gestión de Usuarios
          </h2>
          <p className="text-white/70 text-lg text-center max-w-3xl mx-auto mb-8 leading-relaxed">
            Administra y controla el acceso de usuarios al sistema de manera eficiente y segura
          </p>
        </div>
        
        {/* Estadísticas en grid más equilibrado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-8">
          {/* Total de usuarios - más prominente */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="mb-4 flex items-center justify-center">
              <Users className="w-12 h-12 text-blue-300" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalUsers}</div>
              <div className="text-sm font-medium text-white/80">Total de Usuarios</div>
            </div>
          </div>
          
          {/* Administradores */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="mb-4 flex items-center justify-center">
              <Crown className="w-12 h-12 text-green-300" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{adminUsers}</div>
              <div className="text-sm font-medium text-white/80">Administradores</div>
            </div>
          </div>
          
          {/* Usuarios regulares */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl border border-purple-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
            <div className="mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-purple-300" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalUsers - adminUsers}</div>
              <div className="text-sm font-medium text-white/80">Usuarios Regulares</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
