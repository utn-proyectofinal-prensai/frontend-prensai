import React, { useState } from 'react';
import type { AdminUser } from '../../services/api';
import { USER_MESSAGES } from '../../constants/admin/userMessages';
import { getRoleInfo } from '../../constants/admin/userRoles';

interface UserSidePanelProps {
  usuario: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (usuario: AdminUser) => void;
  onDelete: (id: string) => void;
}

export const UserSidePanel: React.FC<UserSidePanelProps> = ({
  usuario,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });

  // Inicializar formulario de edición - MOVIDO ANTES DEL RETURN NULL
  React.useEffect(() => {
    if (usuario) {
      setEditForm({
        first_name: usuario.first_name || '',
        last_name: usuario.last_name || '',
        email: usuario.email || '',
        role: usuario.role
      });
    }
  }, [usuario]);

  if (!usuario) return null;

  const handleEdit = () => {
    if (isEditing) {
      // Guardar cambios
      onEdit({
        ...usuario,
        ...editForm
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    if (window.confirm(USER_MESSAGES.CONFIRMATIONS.DELETE_USER)) {
      onClose();
      onDelete(usuario.id);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Aquí iría la llamada a la API para cambiar la contraseña
      console.log('Cambiando contraseña para usuario:', usuario.id);
      setShowPasswordForm(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      // TODO: Implementar cambio de contraseña
    } catch (error) {
      setPasswordError('Error al cambiar la contraseña');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const roleInfo = getRoleInfo(usuario.role);

  return (
    <>
      {/* Overlay de fondo - solo en pantallas muy pequeñas */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel lateral */}
      <div className={`
        ${isOpen ? 'lg:relative lg:block' : 'lg:hidden'} 
        fixed lg:static top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-br from-black/95 to-black/85 backdrop-blur-xl 
        border-l border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header del panel */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Detalles del Usuario</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:scale-105 border border-white/20"
            title="Cerrar"
          >
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del panel */}
        <div className="p-6 overflow-y-auto h-full">
          {/* Avatar y información básica */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
              <span className="text-white text-2xl font-bold drop-shadow-lg">
                {usuario.first_name?.charAt(0) || usuario.username?.charAt(0) || '?'}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2 text-center">
              {usuario.first_name || 'Sin nombre'} {usuario.last_name || 'Sin apellido'}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full border ${roleInfo.color} ${roleInfo.color.includes('bg-') ? '' : 'bg-white/10'}`}>
              <span className="mr-2">{roleInfo.icon}</span>
              {roleInfo.label}
            </span>
          </div>

          {/* Formulario de edición o información de solo lectura */}
          <div className="space-y-4 mb-6">
            {/* Username (solo lectura) */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Username</label>
                  <div className="text-white font-semibold text-sm">@{usuario.username}</div>
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Nombre"
                    />
                  ) : (
                    <div className="text-white font-semibold text-sm">{usuario.first_name || 'No especificado'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Apellido */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Apellido"
                    />
                  ) : (
                    <div className="text-white font-semibold text-sm">{usuario.last_name || 'No especificado'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">📧</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Correo Electrónico</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Email"
                    />
                  ) : (
                    <div className="text-white font-semibold text-sm break-all">{usuario.email}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Rol */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">👑</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Rol</label>
                  {isEditing ? (
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full border ${roleInfo.color}`}>
                      <span className="mr-2">{roleInfo.icon}</span>
                      {roleInfo.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Fecha de creación */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">📅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Fecha de Creación</label>
                  <div className="text-white font-semibold text-sm">{formatDate(usuario.created_at)}</div>
                </div>
              </div>
            </div>

            {/* Fecha de modificación */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">✏️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Última Modificación</label>
                  <div className="text-white font-semibold text-sm">{formatDate(usuario.updated_at)}</div>
                </div>
              </div>
            </div>

            {/* Último inicio de sesión */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🕒</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider block">Último Inicio de Sesión</label>
                  <div className="text-white font-semibold text-sm">
                    {usuario.last_sign_in_at ? formatDate(usuario.last_sign_in_at) : 'Nunca'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de cambio de contraseña */}
          {showPasswordForm && (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="mr-2">🔑</span>
                Cambiar Contraseña
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="Nueva contraseña"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="Confirmar contraseña"
                  />
                </div>
                {passwordError && (
                  <div className="text-red-400 text-sm bg-red-500/20 p-2 rounded-lg border border-red-400/30">
                    {passwordError}
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    Cambiar Contraseña
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-3">
            {/* Botón para cambiar contraseña */}
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-yellow-400/30"
            >
              <span className="text-lg">🔑</span>
              <span>{showPasswordForm ? 'Ocultar Formulario' : 'Cambiar Contraseña'}</span>
            </button>

            {/* Botones de editar/guardar y eliminar */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400/30 text-sm"
                title={isEditing ? 'Guardar Cambios' : 'Editar Usuario'}
              >
                <span className="text-lg">{isEditing ? '💾' : '✏️'}</span>
                <span>{isEditing ? 'Guardar' : 'Editar'}</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-400/30 text-sm"
                title="Eliminar Usuario"
              >
                <span className="text-lg">🗑️</span>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
