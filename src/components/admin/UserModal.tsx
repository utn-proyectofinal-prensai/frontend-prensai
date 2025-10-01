import React, { useState } from 'react';
import type { User } from '../../types/auth';
import { USER_MESSAGES } from '../../constants/admin/userMessages';
import { getRoleInfo } from '../../constants/admin/userRoles';
import { validatePassword } from '../../utils/validation';
import { Button } from '../ui/button';

interface UserModalProps {
  usuario: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (usuario: User) => void;
  onDelete: (id: number) => void;
  onCreateUser?: (userData: any) => void;
  initialEditMode?: boolean;
  isCreateMode?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  usuario,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onCreateUser,
  initialEditMode = false,
  isCreateMode = false
}) => {
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode || isCreateMode);
  const [editForm, setEditForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    password: ''
  });

  // Inicializar formulario de edición
  React.useEffect(() => {
    if (isCreateMode) {
      // Modo creación: formulario vacío
      setEditForm({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'user',
        password: ''
      });
    } else if (usuario) {
      // Modo edición: cargar datos del usuario
      setEditForm({
        username: usuario.username || '',
        first_name: usuario.first_name || '',
        last_name: usuario.last_name || '',
        email: usuario.email || '',
        role: usuario.role,
        password: ''
      });
    }
  }, [usuario, isCreateMode]);

  // Actualizar modo de edición cuando cambie initialEditMode o isCreateMode
  React.useEffect(() => {
    setIsEditing(initialEditMode || isCreateMode);
  }, [initialEditMode, isCreateMode]);

  // Validar contraseña en tiempo real
  React.useEffect(() => {
    if (isCreateMode && editForm.password) {
      const error = validatePassword(editForm.password);
      if (error) {
        setPasswordValidationMessage(error);
      } else {
        setPasswordValidationMessage('Contraseña válida');
      }
    } else {
      setPasswordValidationMessage('');
    }
  }, [editForm.password, isCreateMode]);


  // Función para obtener el mensaje de validación (para creación de usuarios)
  const getPasswordValidationMessage = () => {
    if (passwordValidationMessage) {
      return { 
        message: passwordValidationMessage, 
        type: passwordValidationMessage === 'Contraseña válida' ? 'success' : 'error'
      };
    }
    return null;
  };


  if (!isOpen || (!usuario && !isCreateMode)) return null;

  // Datos del usuario para mostrar (con valores por defecto en modo creación)
  const displayUser = usuario || {
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    created_at: '',
    updated_at: '',
    name: ''
  };

  const handleEdit = async () => {
    if (isEditing) {
      if (isCreateMode) {
        // Crear nuevo usuario
        // Validar contraseña
        const passwordValidationError = validatePassword(editForm.password);
        if (passwordValidationError) {
          setPasswordError(passwordValidationError);
          return;
        }
        
        // Limpiar error si llegamos aquí
        setPasswordError('');
        
        if (onCreateUser) {
          onCreateUser(editForm);
          onClose();
        }
      } else {
        // Editar usuario existente (sin contraseña)
        const updatedUser = {
          ...displayUser,
          ...editForm
        };
        await onEdit(updatedUser);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    if (window.confirm(USER_MESSAGES.CONFIRMATIONS.DELETE_USER)) {
      onClose();
      onDelete(displayUser.id);
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

  const roleInfo = getRoleInfo(displayUser.role);

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
                <h2 className="text-lg font-semibold text-white/90">
                  {isCreateMode ? 'Crear Nuevo Usuario' : 'Detalles del Usuario'}
                </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            icon="X"
            title="Cerrar"
          />
            </div>
        </div>

          {!isCreateMode && (
            <>
              {/* Header del usuario - Avatar y información básica */}
              <div className="flex items-center justify-center" style={{ padding: '12px 24px' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-xl border-2 border-white/20">
                <span className="text-white text-lg font-bold drop-shadow-lg">
                                  {displayUser.first_name?.charAt(0) || displayUser.username?.charAt(0) || '?'}
              </span>
            </div>
            
              <div className="flex flex-col" style={{ marginLeft: '32px' }}>
                <h3 className="text-lg font-bold text-white/90 drop-shadow-lg mb-2">
                                {displayUser.first_name || 'Sin nombre'} {displayUser.last_name || 'Sin apellido'}
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
            </>
          )}

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
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          outline: 'none',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                                                     backgroundColor: 'rgba(30, 41, 59, 0.8)',
                           backgroundImage: 'none',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                                                 onFocus={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(147, 51, 234, 0.4)';
                         }}
                         onBlur={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                         }}
                        placeholder="Username"
                      />
                    ) : (
                      <div className="text-white/90 font-semibold text-sm">@{displayUser.username}</div>
                    )}
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
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          outline: 'none',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                                                     backgroundColor: 'rgba(30, 41, 59, 0.8)',
                           backgroundImage: 'none',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                                                 onFocus={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(147, 51, 234, 0.4)';
                         }}
                         onBlur={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                         }}
                      placeholder="Nombre"
                    />
                  ) : (
                      <div className="text-white/90 font-semibold text-sm">{displayUser.first_name || 'No especificado'}</div>
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
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          outline: 'none',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                                                     backgroundColor: 'rgba(30, 41, 59, 0.8)',
                           backgroundImage: 'none',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                                                 onFocus={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(147, 51, 234, 0.4)';
                         }}
                         onBlur={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                         }}
                      placeholder="Apellido"
                    />
                  ) : (
                      <div className="text-white/90 font-semibold text-sm">{displayUser.last_name || 'No especificado'}</div>
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
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          outline: 'none',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                                                     backgroundColor: 'rgba(30, 41, 59, 0.8)',
                           backgroundImage: 'none',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none'
                        }}
                                                 onFocus={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(147, 51, 234, 0.4)';
                         }}
                         onBlur={(e) => {
                           e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                           e.target.style.backgroundImage = 'none';
                           e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                         }}
                      placeholder="Email"
                    />
                  ) : (
                      <div className="text-white/90 font-semibold text-sm break-all">{displayUser.email}</div>
                  )}
                </div>
              </div>
            </div>


              {/* Campo Rol */}
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
                    {isEditing ? (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            paddingRight: '40px',
                            borderRadius: '12px',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backgroundColor: 'rgba(30, 41, 59, 0.8)',
                            backgroundImage: 'none',
                            backdropFilter: 'blur(10px)',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                          }}
                          onFocus={(e) => {
                            e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                            e.target.style.backgroundImage = 'none';
                            e.target.style.border = '1px solid rgba(147, 51, 234, 0.4)';
                          }}
                          onBlur={(e) => {
                            e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                            e.target.style.backgroundImage = 'none';
                            e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                          }}
                        >
                          <option value="admin" style={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', color: '#ffffff' }}>Administrador</option>
                          <option value="user" style={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', color: '#ffffff' }}>Usuario</option>
                        </select>
                        <div style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          ▼
                        </div>
                      </div>
                    ) : (
                      <div className="text-white/90 font-semibold text-sm capitalize">
                        {displayUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Campos de contraseña (solo en modo creación) */}
              {isCreateMode && (
                <>
                  {/* Contraseña */}
                  <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                    <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                      <div className="col-span-1 flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-base">🔒</span>
              </div>
            </div>
                      <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                        <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Contraseña</div>
                </div>
                      <div className="col-span-8 flex items-center">
                        <div className="relative w-full">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={editForm.password}
                            onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '12px 50px 12px 16px',
                              borderRadius: '12px',
                              outline: 'none',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              backgroundColor: 'rgba(30, 41, 59, 0.8)',
                              backgroundImage: 'none',
                              backdropFilter: 'blur(10px)',
                              color: '#ffffff',
                              fontSize: '14px',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              boxSizing: 'border-box',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none'
                            }}
                            onFocus={(e) => {
                              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                              e.target.style.backgroundImage = 'none';
                              e.target.style.border = '1px solid rgba(147, 51, 234, 0.4)';
                            }}
                            onBlur={(e) => {
                              e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                              e.target.style.backgroundImage = 'none';
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                            }}
                            placeholder="Contraseña"
                          />
                          <Button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 text-white/80 hover:text-white"
                            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? '⚫' : '👁'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Mensaje de validación prioritario */}
                  {(() => {
                    const validation = getPasswordValidationMessage();
                    if (!validation) return null;
                    
                    return (
                      <div className={`text-xs px-4 ${
                        validation.type === 'success' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {validation.message}
                      </div>
                    );
                  })()}
                </>
              )}


              {!isCreateMode && (
                <>
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
                    <div className="text-white/90 font-semibold text-sm">{formatDate(displayUser.created_at)}</div>
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
                    <div className="text-white/90 font-semibold text-sm">{formatDate(displayUser.updated_at)}</div>
            </div>
                </div>
                  </div>

                </>
              )}

              {/* Mostrar error de contraseña en modo creación */}
              {isCreateMode && passwordError && (
                <div className="text-red-400 text-sm bg-red-500/20 p-4 rounded-lg border border-red-400/30">
                  {passwordError}
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

            {/* Botones de editar/guardar y eliminar */}
              {(isEditing || isCreateMode) ? (
                <div 
                  className="grid grid-cols-2" 
                  style={{ 
                    gap: '16px',
                    columnGap: '16px'
                  }}
                >
                  <Button
                    onClick={() => {
                      if (isCreateMode) {
                        onClose();
                      } else {
                        // En modo edición, cerrar el modal completamente
                        onClose();
                      }
                    }}
                    variant="secondary"
                    size="default"
                    title={isCreateMode ? "Cancelar Creación" : "Cancelar Edición"}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="success"
                    size="default"
                    icon={isCreateMode ? "Plus" : "Save"}
                    title={isCreateMode ? "Crear Usuario" : "Guardar Cambios"}
                  >
                    {isCreateMode ? 'Crear' : 'Guardar'}
                  </Button>
                </div>
              ) : !isCreateMode ? (
                <div 
                  className="grid grid-cols-2" 
                  style={{ 
                    gap: '24px',
                    columnGap: '24px'
                  }}
                >
              <Button
                onClick={handleDelete}
                variant="danger"
                size="default"
                icon="Delete"
                title="Eliminar Usuario"
              >
                Eliminar
              </Button>
              <Button
                onClick={handleEdit}
                variant="primary"
                size="default"
                icon="Edit"
                title="Editar Usuario"
              >
                Editar
              </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
