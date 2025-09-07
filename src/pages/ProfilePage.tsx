import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types/auth';
import { AUTH_MESSAGES } from '../constants/messages';
import Snackbar from '../components/common/Snackbar';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  }>({ message: '', type: 'info', show: false });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCurrentUser();
      // Convertir UserInfo a User para compatibilidad
      const userInfo = response.user;
      const userWithAllProps: User = {
        id: parseInt(userInfo.id),
        username: userInfo.username,
        email: userInfo.email,
        name: `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || userInfo.username,
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        role: userInfo.role as 'admin' | 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(userWithAllProps);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.VALIDATION.USER_FETCH_ERROR;
      setError(errorMessage);
      setSnackbar({
        message: errorMessage,
        type: 'error',
        show: true
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'editor': 'Editor'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      'admin': 'text-red-400',
      'user': 'text-blue-400',
      'editor': 'text-purple-400'
    };
    return roleColors[role] || 'text-white';
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/90 text-xl font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-red-300/30">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Error al cargar el perfil</h3>
          <p className="text-white/70 mb-8 max-w-md">{error}</p>
          <button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            onClick={fetchUserProfile}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-white/70 text-xl">No se pudo cargar la información del perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <>
        {/* Header del perfil */}
        <div className="profile-header-section mb-16">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                <span className="text-white text-3xl font-bold drop-shadow-lg">
                  {user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                                 <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{user.name}</h2>
                <p className="text-white/80 text-lg mb-3">@{user.username}</p>
                <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full border border-white/20 bg-white/10 backdrop-blur-sm ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información del perfil */}
        <div className="profile-details-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Información Personal
              </h3>
              <div className="space-y-4">
                                 <div className="flex justify-between items-center py-3 border-b border-white/10">
                   <span className="text-white/70 font-medium">Nombre completo:</span>
                   <span className="text-white font-semibold">{user.name}</span>
                 </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Primer nombre:</span>
                  <span className="text-white font-semibold">{user.first_name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Apellido:</span>
                  <span className="text-white font-semibold">{user.last_name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Nombre de usuario:</span>
                  <span className="text-white font-semibold">{user.username}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Email:</span>
                  <span className="text-white font-semibold">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/70 font-medium">Rol:</span>
                  <span className={`font-semibold ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de la Cuenta */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4 border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                Información de la Cuenta
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">ID de usuario:</span>
                  <span className="text-white font-semibold">{user.id}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Fecha de creación:</span>
                  <span className="text-white font-semibold">{formatDate(user.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/70 font-medium">Última actualización:</span>
                  <span className="text-white font-semibold">{formatDate(user.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.show}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default ProfilePage;
