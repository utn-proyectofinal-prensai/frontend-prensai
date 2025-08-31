import React, { useState } from 'react';
import type { User } from '../../types/auth';
import { USER_MESSAGES } from '../../constants/admin/userMessages';
import { getRoleInfo } from '../../constants/admin/userRoles';

interface UserSidePanelProps {
  usuario: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (usuario: User) => void;
  onDelete: (id: number) => void;
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

  // Inicializar formulario de edición
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

  if (!usuario || !isOpen) return null;

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
      {/* Overlay de fondo semi-transparente */}
      <div 
        className="fixed inset-0 z-50 backdrop-blur-[2px]"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1), transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 204, 112, 0.1), transparent 50%),
            linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(30, 64, 175, 0.3) 50%, rgba(30, 58, 138, 0.3) 75%, rgba(30, 64, 175, 0.3) 100%),
            rgba(0, 0, 0, 0.2)
          `,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <div 
          className="w-[600px] max-w-[90vw] max-h-[85vh] overflow-hidden bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 scale-100"
        >
          
          {/* Header del modal */}
          <div className="bg-black/30 border-b border-white/10" style={{ padding: '16px 24px' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">Detalles del Usuario</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:scale-105 border border-white/20 flex-shrink-0"
                title="Cerrar"
              >
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

                    {/* Header del usuario - Avatar y información básica */}
          <div className="flex items-center justify-center" style={{ padding: '12px 24px' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-xl border-2 border-white/20">
                <span className="text-white text-lg font-bold drop-shadow-lg">
                  {usuario.first_name?.charAt(0) || usuario.username?.charAt(0) || '?'}
                </span>
              </div>

              <div className="flex flex-col" style={{ marginLeft: '32px' }}>
                <h3 className="text-lg font-bold text-white/90 drop-shadow-lg mb-2">
                  {usuario.first_name || 'Sin nombre'} {usuario.last_name || 'Sin apellido'}
                </h3>
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

          {/* Contenido del modal */}
          <div 
            className="overflow-y-auto max-h-[calc(85vh-280px)]" 
            style={{ 
              padding: '32px', 
              paddingTop: '16px', 
              paddingBottom: '24px', 
              paddingLeft: '32px', 
              paddingRight: '32px' 
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px',
                rowGap: '4px'
              }}
            >

              {/* Username (solo lectura) */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                  <div className="col-span-1 flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-base">👤</span>
                    </div>
                  </div>
                  <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                    <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Username</div>
                  </div>
                  <div className="col-span-8 flex items-center">
                    <div className="text-white/90 font-semibold text-sm">@{usuario.username}</div>
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                  <div className="col-span-1 flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-base">📝</span>
                    </div>
                  </div>
                  <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                    <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Nombre</div>
                  </div>
                  <div className="col-span-8 flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="Nombre"
                      />
                    ) : (
                      <div className="text-white/90 font-semibold text-sm">{usuario.first_name || 'No especificado'}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Apellido */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                  <div className="col-span-1 flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-base">📝</span>
                    </div>
                  </div>
                  <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                    <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Apellido</div>
                  </div>
                  <div className="col-span-8 flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="Apellido"
                      />
                    ) : (
                      <div className="text-white/90 font-semibold text-sm">{usuario.last_name || 'No especificado'}</div>
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
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="Email"
                      />
                    ) : (
                      <div className="text-white/90 font-semibold text-sm break-all">{usuario.email}</div>
                    )}
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
                    <div className="text-white/90 font-semibold text-sm">{formatDate(usuario.created_at)}</div>
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
                    <div className="text-white/90 font-semibold text-sm">{formatDate(usuario.updated_at)}</div>
                  </div>
                </div>
              </div>



              {/* Formulario de cambio de contraseña */}
              {showPasswordForm && (
                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                  <h4 className="text-lg font-bold text-white/90 mb-4 flex items-center">
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
              {/* Botón para cambiar contraseña */}
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-yellow-400/30"
              >
                <span className="text-lg">🔑</span>
                <span>{showPasswordForm ? 'Ocultar' : 'Cambiar Contraseña'}</span>
              </button>

              {/* Botones de editar/guardar y eliminar */}
              <div 
                className="grid grid-cols-2" 
                style={{ 
                  gap: '24px',
                  columnGap: '24px'
                }}
              >
                <button
                  onClick={handleEdit}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400/30 text-sm"
                  title={isEditing ? 'Guardar Cambios' : 'Editar Usuario'}
                >
                  <span className="text-lg">{isEditing ? '💾' : '✏️'}</span>
                  <span>{isEditing ? 'Guardar' : 'Editar'}</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-400/30 text-sm"
                  title="Eliminar Usuario"
                >
                  <span className="text-lg">🗑️</span>
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
