import React from 'react';

interface UsersInsightsProps {
  totalUsers: number;
  adminUsers: number;
}

export const UsersInsights: React.FC<UsersInsightsProps> = ({ 
  totalUsers,
  adminUsers
}) => {
  return (
    <div className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-5 shadow-xl">
      <div className="flex flex-col space-y-5">
        {/* Estadísticas en grid más equilibrado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total de usuarios - más prominente */}
          <div className="flex flex-col items-center justify-center space-y-3 px-5 py-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl border border-blue-300/30 hover:bg-blue-500/25 transition-all duration-300 transform hover:scale-105">
            <span className="text-4xl">👥</span>
            <div className="text-center">
              <div className="text-white font-bold text-3xl">{totalUsers}</div>
              <div className="text-blue-200 text-sm font-medium">Total de Usuarios</div>
            </div>
          </div>
          
          {/* Administradores */}
          <div className="flex flex-col items-center justify-center space-y-3 px-5 py-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-300/30 hover:bg-green-500/25 transition-all duration-300 transform hover:scale-105">
            <span className="text-4xl">👑</span>
            <div className="text-center">
              <div className="text-green-300 font-bold text-3xl">{adminUsers}</div>
              <div className="text-green-200 text-sm font-medium">Administradores</div>
            </div>
          </div>
          
          {/* Usuarios regulares */}
          <div className="flex flex-col items-center justify-center space-y-3 px-5 py-4 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-xl border border-purple-300/30 hover:bg-purple-500/25 transition-all duration-300 transform hover:scale-105">
            <span className="text-4xl">👤</span>
            <div className="text-center">
              <div className="text-purple-300 font-bold text-3xl">{totalUsers - adminUsers}</div>
              <div className="text-purple-200 text-sm font-medium">Usuarios Regulares</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
