import React, { useState } from 'react';
import type { User } from '../../types/auth';
import { USER_MESSAGES } from '../../constants/admin/userMessages';
import { validatePassword } from '../../utils/validation';
import { Button } from '../ui/button';
import { Modal, ModalFooter } from '../ui/modal';
import { Input, Select } from '../ui/input';

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


  // Icono del modal
  const modalIcon = (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // Footer del modal
  const footer = (
    <ModalFooter>
      {(isEditing || isCreateMode) ? (
        <>
          <Button
            onClick={() => {
              if (isCreateMode) {
                onClose();
              } else {
                onClose();
              }
            }}
            variant="secondary"
            size="lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEdit}
            variant="success"
            size="lg"
            icon={isCreateMode ? "Plus" : "Save"}
          >
            {isCreateMode ? 'Crear' : 'Guardar'}
          </Button>
        </>
      ) : !isCreateMode ? (
        <>
          <Button
            onClick={handleDelete}
            variant="danger"
            size="lg"
            icon="Delete"
          >
            Eliminar
          </Button>
          <Button
            onClick={handleEdit}
            variant="primary"
            size="lg"
            icon="Edit"
          >
            Editar
          </Button>
        </>
      ) : null}
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreateMode ? 'Crear Nuevo Usuario' : 'Detalles del Usuario'}
      icon={modalIcon}
      footer={footer}
      size="lg"
    >

            <div className="space-y-6">
              {/* Username */}
              {isEditing ? (
                <Input
                  label="Username"
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  placeholder="Username"
                  required
                />
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <div className="text-sm font-medium text-white mb-2">Username</div>
                  <div className="text-white/90 font-semibold text-sm">@{displayUser.username}</div>
                </div>
              )}

              {/* Nombre */}
              {isEditing ? (
                <Input
                  label="Nombre"
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                  placeholder="Nombre"
                />
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <div className="text-sm font-medium text-white mb-2">Nombre</div>
                  <div className="text-white/90 font-semibold text-sm">{displayUser.first_name || 'No especificado'}</div>
                </div>
              )}

              {/* Apellido */}
              {isEditing ? (
                <Input
                  label="Apellido"
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                  placeholder="Apellido"
                />
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <div className="text-sm font-medium text-white mb-2">Apellido</div>
                  <div className="text-white/90 font-semibold text-sm">{displayUser.last_name || 'No especificado'}</div>
                </div>
              )}




              {/* Email */}
              {isEditing ? (
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  placeholder="Email"
                />
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <div className="text-sm font-medium text-white mb-2">Email</div>
                  <div className="text-white/90 font-semibold text-sm break-all">{displayUser.email}</div>
                </div>
              )}


              {/* Rol */}
              {isEditing ? (
                <Select
                  label="Rol"
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                  options={[
                    { value: 'admin', label: 'Administrador' },
                    { value: 'user', label: 'Usuario' }
                  ]}
                />
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <div className="text-sm font-medium text-white mb-2">Rol</div>
                  <div className="text-white/90 font-semibold text-sm capitalize">
                    {displayUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </div>
                </div>
              )}


              {/* Campos de contraseña (solo en modo creación) */}
              {isCreateMode && (
                <>
                  {/* Contraseña */}
                  <div className="relative">
                    <Input
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      value={editForm.password}
                      onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                      placeholder="Contraseña"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-8 w-6 h-6 p-0 text-white/80 hover:text-white"
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? '⚫' : '👁'}
                    </Button>
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
              <div style={{ marginBottom: '16px' }}>
                <div className="text-sm font-medium text-white mb-2">Creado</div>
                <div className="text-white/90 font-semibold text-sm">{formatDate(displayUser.created_at)}</div>
              </div>

              {/* Fecha de modificación */}
              <div style={{ marginBottom: '16px' }}>
                <div className="text-sm font-medium text-white mb-2">Modificado</div>
                <div className="text-white/90 font-semibold text-sm">{formatDate(displayUser.updated_at)}</div>
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
    </Modal>
  );
};
