import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types/auth';
import { AUTH_MESSAGES } from '../constants/messages';
import { useAuth } from '../hooks/useAuth';
import Snackbar from '../components/common/Snackbar';
import PasswordChangeModal from '../components/admin/PasswordChangeModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PageHeader } from '../components/ui/page-header';

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
        created_at: (userInfo as any).created_at || new Date().toISOString(),
        updated_at: (userInfo as any).updated_at || new Date().toISOString()
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
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
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

  const handlePasswordChange = async (newPassword: string, currentPassword?: string) => {
    try {
      // Para perfil personal, se requiere la contraseña actual (validación de seguridad)
      // Aunque el backend no la requiere técnicamente, la validamos en el frontend por seguridad UX
      if (!currentPassword) {
        throw new Error('La contraseña actual es requerida');
      }
      
      // Cambiar la contraseña usando el endpoint del backend
      await apiService.changeCurrentUserPassword(newPassword);
      
      setShowPasswordModal(false);
      
      setSnackbar({
        message: 'Contraseña cambiada correctamente',
        type: 'success',
        show: true
      });
      
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

  return (
    <div className="flex justify-center px-4 py-6 sm:px-6 profile-page-container">
      <div className="profile-page-content" style={{ maxWidth: '650px', width: '100%' }}>
        {/* Header de la página */}
        <PageHeader
          title="Mi Perfil"
          description="Gestioná tu información personal y configuración de cuenta"
        />

        {/* Contenedor principal estilo modal */}
        <div className="w-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Header con avatar */}
        <div className="bg-slate-800/50 border-b border-white/10" style={{ padding: '16px 32px' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20 mb-4">
              <span className="text-white text-2xl font-bold drop-shadow-lg">
                {user.first_name?.charAt(0) || user.username?.charAt(0) || '?'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white/90 drop-shadow-lg">
              {isEditing ? 
                `${editForm.first_name || 'Sin nombre'} ${editForm.last_name || 'Sin apellido'}` :
                `${user.first_name || 'Sin nombre'} ${user.last_name || 'Sin apellido'}`
              }
            </h2>
          </div>
        </div>

        {/* Contenido estilo modal */}
        <div 
          className="overflow-y-auto" 
          style={{ 
            padding: '32px', 
            paddingTop: '16px', 
            paddingBottom: '16px', 
            paddingLeft: '32px', 
            paddingRight: '32px' 
          }}
        >
          <div className="space-y-6">
            {/* Nombre completo */}
            <div className="flex gap-3 w-full" style={{ width: '100%', marginBottom: 0 }}>
              <div className="flex-1" style={{ minWidth: 0, marginBottom: 0 }}>
                <Input
                  label="Nombre"
                  type="text"
                  value={isEditing ? editForm.first_name : user.first_name}
                  onChange={isEditing ? (e) => handleInputChange('first_name', e.target.value) : undefined}
                  placeholder="Nombre"
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex-1" style={{ minWidth: 0, marginBottom: 0 }}>
                <Input
                  label="Apellido"
                  type="text"
                  value={isEditing ? editForm.last_name : user.last_name}
                  onChange={isEditing ? (e) => handleInputChange('last_name', e.target.value) : undefined}
                  placeholder="Apellido"
                  readOnly={!isEditing}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Username y Rol */}
            <div className="flex gap-3 w-full" style={{ width: '100%', marginBottom: 0 }}>
              <div className="flex-1" style={{ minWidth: 0, marginBottom: 0 }}>
                {isEditing ? (
                  <Input
                    label="Username"
                    type="text"
                    value={editForm.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Nombre de usuario"
                  />
                ) : (
                  <Input
                    label="Username"
                    type="text"
                    value={`@${user.username}`}
                    readOnly
                    disabled
                  />
                )}
              </div>
              <div className="flex-1" style={{ minWidth: 0, marginBottom: 0 }}>
                <Input
                  label="Rol"
                  type="text"
                  value={user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Email */}
            <Input
              label="Email"
              type="email"
              value={user.email}
              readOnly
              disabled
            />

            {/* Fecha de creación */}
            <Input
              label="Creado"
              type="text"
              value={formatDate(user.created_at)}
              readOnly
              disabled
            />

            {/* Fecha de modificación */}
            <div style={{ marginBottom: 0 }}>
              <Input
                label="Modificado"
                type="text"
                value={formatDate(user.updated_at)}
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        {/* Footer estilo modal */}
        <div className="bg-slate-800/50 border-t border-white/10 py-6" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
          <div className="flex gap-4 justify-end flex-wrap">
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
                  iconPosition="left"
                  title="Guardar Cambios"
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handlePasswordChangeClick}
                  variant="primary"
                  size="lg"
                  icon="Key"
                  iconPosition="left"
                  title="Cambiar Contraseña"
                >
                  Cambiar Contraseña
                </Button>
                <Button
                  onClick={handleEditClick}
                  variant="primary"
                  size="lg"
                  icon="Edit"
                  iconPosition="left"
                  title="Editar Perfil"
                >
                  Editar Perfil
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
