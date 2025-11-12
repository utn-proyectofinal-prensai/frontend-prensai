import React from 'react';
import { Users, Crown, User } from 'lucide-react';
import MetricCard from '../common/MetricCard';
import { PageHeader } from '../ui/page-header';

interface AdminUsersHeaderProps {
  totalUsers: number;
  adminUsers: number;
}

export const AdminUsersHeader: React.FC<AdminUsersHeaderProps> = ({ 
  totalUsers,
  adminUsers
}) => {
  return (
    <>
      {/* Header de la página */}
      <div style={{ marginBottom: '0.75rem' }}>
        <PageHeader
          title="Gestión de Usuarios"
          description="Administra y controla el acceso de usuarios al sistema de manera eficiente y segura"
        />
      </div>

      {/* Estadísticas en grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '1rem' }}>
        {/* Total de usuarios */}
        <MetricCard
          title="Total de Usuarios"
          value={totalUsers}
          iconColor="blue"
          icon={<Users className="w-5 h-5" />}
        />
        
        {/* Administradores */}
        <MetricCard
          title="Administradores"
          value={adminUsers}
          iconColor="green"
          icon={<Crown className="w-5 h-5" />}
        />
        
        {/* Usuarios regulares */}
        <MetricCard
          title="Usuarios Regulares"
          value={totalUsers - adminUsers}
          iconColor="purple"
          icon={<User className="w-5 h-5" />}
        />
      </div>
    </>
  );
};
