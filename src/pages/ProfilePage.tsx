import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types/auth';
import { AUTH_MESSAGES } from '../constants/messages';
import { getRoleInfo } from '../constants/admin/userRoles';
import { useAuth } from '../hooks/useAuth';
import Snackbar from '../components/common/Snackbar';
import PasswordChangeModal from '../components/admin/PasswordChangeModal';
import { Button } from '../components/ui/button';

const ProfilePage: React.FC = () => {
  const { updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    username: ''
  });
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
      // Inicializar el formulario de edición
      setEditForm({
        first_name: userWithAllProps.first_name,
        last_name: userWithAllProps.last_name,
        username: userWithAllProps.username
      });
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


  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar valores originales
    if (user) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Llamada real a la API para actualizar el perfil
      const response = await apiService.updateCurrentUser({
        username: editForm.username,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
      });

      // Actualizar el estado local con los datos del servidor
      const updatedUserInfo = response.user;
      const updatedUser: User = {
        ...user,
        username: updatedUserInfo.username,
        first_name: updatedUserInfo.first_name || '',
        last_name: updatedUserInfo.last_name || '',
        name: `${updatedUserInfo.first_name || ''} ${updatedUserInfo.last_name || ''}`.trim() || updatedUserInfo.username,
      };

      setUser(updatedUser);
      
      // Actualizar también el contexto global para que se refleje en el dropdown
      updateUser({
        username: updatedUserInfo.username,
        first_name: updatedUserInfo.first_name || '',
        last_name: updatedUserInfo.last_name || '',
      });
      
      setIsEditing(false);
      
      setSnackbar({
        message: 'Perfil actualizado correctamente',
        type: 'success',
        show: true
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setSnackbar({
        message: errorMessage,
        type: 'error',
        show: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChangeClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordChange = async (currentPassword?: string) => {
    try {
      // Para perfil personal, se requiere la contraseña actual
      if (!currentPassword) {
        throw new Error('La contraseña actual es requerida');
      }
      
      // NOTA TEMPORAL: El endpoint de cambio de contraseña no existe aún en el backend
      // Por ahora mostraremos un mensaje informativo
      setSnackbar({
        message: 'Funcionalidad de cambio de contraseña pendiente de implementación en el backend. Endpoint /api/v1/user/change_password requerido.',
        type: 'error',
        show: true
      });
      
      setShowPasswordModal(false);
      
      // Código para cuando se implemente el endpoint:
      // await apiService.changeCurrentUserPassword(currentPassword, newPassword);
      // setSnackbar({
      //   message: 'Contraseña cambiada correctamente',
      //   type: 'success',
      //   show: true
      // });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar la contraseña';
      setSnackbar({
        message: errorMessage,
        type: 'error',
        show: true
      });
      throw error; // Re-lanzar para que el modal maneje el error
    }
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
          <Button 
            variant="primary"
            size="lg"
            icon="Refresh"
            onClick={fetchUserProfile}
          >
            Intentar de nuevo
          </Button>
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

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="px-6 py-6 h-full">
      {/* Contenedor principal del perfil */}
      <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
        
        {/* Header del usuario - Avatar y información básica */}
        <div className="flex items-center justify-center" style={{ padding: '24px 32px' }}>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20">
              <span className="text-white text-2xl font-bold drop-shadow-lg">
                {user.first_name?.charAt(0) || user.username?.charAt(0) || '?'}
              </span>
            </div>
            
            <div className="flex flex-col" style={{ marginLeft: '32px' }}>
              <h2 className="text-2xl font-bold text-white/90 drop-shadow-lg mb-2">
                {isEditing ? 
                  `${editForm.first_name || 'Sin nombre'} ${editForm.last_name || 'Sin apellido'}` :
                  `${user.first_name || 'Sin nombre'} ${user.last_name || 'Sin apellido'}`
                }
              </h2>
              <span 
                className={`inline-flex items-center text-xs font-bold rounded-full border ${roleInfo.color} ${roleInfo.color.includes('bg-') ? '' : 'bg-white/10'}`}
                style={{ padding: '4px 16px' }}
              >
                <span style={{ marginRight: '8px' }}>{roleInfo.icon}</span>
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido del perfil */}
        <div 
          className="overflow-y-auto" 
          style={{ 
            padding: '32px', 
            paddingTop: '16px', 
            paddingBottom: '32px', 
            paddingLeft: '32px', 
            paddingRight: '32px' 
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              rowGap: '24px'
            }}
          >

            {/* Nombre completo */}
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">👤</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Nombre completo</div>
                </div>
                <div className="col-span-8 flex items-center">
                  {isEditing ? (
                    <div className="flex space-x-2 w-full">
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Nombre"
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      />
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Apellido"
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      />
                    </div>
                  ) : (
                    <div className="text-white/90 font-semibold text-sm">{user.first_name} {user.last_name}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">@</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Usuario</div>
                </div>
                <div className="col-span-8 flex items-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Nombre de usuario"
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                  ) : (
                    <div className="text-white/90 font-semibold text-sm">{user.username}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">📧</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Email</div>
                </div>
                <div className="col-span-8 flex items-center">
                  <div className="text-white/90 font-semibold text-sm">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Rol */}
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">👑</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Rol</div>
                </div>
                <div className="col-span-8 flex items-center">
                  <div className="text-white/90 font-semibold text-sm capitalize">
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </div>
                </div>
              </div>
            </div>

            {/* Fecha de creación */}
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">📅</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Creado</div>
                </div>
                <div className="col-span-8 flex items-center">
                  <div className="text-white/90 font-semibold text-sm">{formatDate(user.created_at)}</div>
                </div>
              </div>
            </div>

            {/* Fecha de modificación */}
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">✏️</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Modificado</div>
                </div>
                <div className="col-span-8 flex items-center">
                  <div className="text-white/90 font-semibold text-sm">{formatDate(user.updated_at)}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer con botones de acción */}
        <div 
          className="bg-black/30 border-t border-white/10" 
          style={{ 
            padding: '32px',
            paddingTop: '24px', 
            paddingBottom: '24px', 
            paddingLeft: '32px', 
            paddingRight: '32px',
            flexShrink: 0
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              rowGap: '16px'
            }}
          >
            <div 
              className="grid grid-cols-1 md:grid-cols-2" 
              style={{ 
                gap: '24px',
                columnGap: '24px'
              }}
            >
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    variant="secondary"
                    size="lg"
                    title="Cancelar Edición"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    variant="success"
                    size="lg"
                    icon="Save"
                    title="Guardar Cambios"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleEditClick}
                    variant="primary"
                    size="lg"
                    icon="Edit"
                    title="Editar Perfil"
                  >
                    Editar Perfil
                  </Button>
                  <Button
                    onClick={handlePasswordChangeClick}
                    variant="primary"
                    size="lg"
                    icon="Key"
                    title="Cambiar Contraseña"
                  >
                    Cambiar Contraseña
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.show}
        variant={snackbar.type}
        onClose={handleCloseSnackbar}
      />

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordChange}
        user={user}
        requireCurrentPassword={true}
      />
    </div>
  );
};

export default ProfilePage;
