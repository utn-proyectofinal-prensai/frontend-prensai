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


  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
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
              {/* Nombre */}
              <Input
                label="Nombre"
                type="text"
                value={isEditing ? editForm.first_name : (displayUser.first_name || '')}
                onChange={(e) => isEditing && setEditForm({...editForm, first_name: e.target.value})}
                placeholder="Nombre"
                disabled={!isEditing}
              />

              {/* Apellido */}
              <Input
                label="Apellido"
                type="text"
                value={isEditing ? editForm.last_name : (displayUser.last_name || '')}
                onChange={(e) => isEditing && setEditForm({...editForm, last_name: e.target.value})}
                placeholder="Apellido"
                disabled={!isEditing}
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={isEditing ? editForm.email : (displayUser.email || '')}
                onChange={(e) => isEditing && setEditForm({...editForm, email: e.target.value})}
                placeholder="Email"
                disabled={!isEditing}
              />

              {/* Username y Rol en dos columnas */}
              <div className="flex gap-3 w-full">
                {/* Username */}
                <div className="flex-1">
                  <Input
                    label="Username"
                    type="text"
                    value={isEditing ? editForm.username : (displayUser.username || '')}
                    onChange={(e) => isEditing && setEditForm({...editForm, username: e.target.value})}
                    placeholder="Username"
                    required
                    disabled={!isEditing}
                  />
                </div>

                {/* Rol */}
                <div className="flex-1">
                  <Select
                    label="Rol"
                    value={isEditing ? editForm.role : displayUser.role}
                    onChange={(e) => isEditing && setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                    options={[
                      { value: 'admin', label: 'Administrador' },
                      { value: 'user', label: 'Usuario' }
                    ]}
                    disabled={!isEditing}
                  />
                </div>
              </div>


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
                      className="absolute right-3 top-[46px] w-6 h-6 p-0 text-white/80 hover:text-white flex items-center justify-center"
                      style={{ transform: 'translateY(-50%)' }}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      icon={showPassword ? "EyeOff" : "Eye"}
                    />
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
                  {/* Creado y Modificado en dos columnas */}
                  <div className="flex gap-3 w-full">
                    {/* Creado */}
                    <div className="flex-1">
                      <Input
                        label="Creado"
                        type="text"
                        value={formatDate(displayUser.created_at)}
                        disabled
                      />
                    </div>

                    {/* Modificado */}
                    <div className="flex-1">
                      <Input
                        label="Modificado"
                        type="text"
                        value={formatDate(displayUser.updated_at)}
                        disabled
                      />
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
    </Modal>
  );
};
