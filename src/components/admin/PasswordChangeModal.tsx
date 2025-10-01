import React, { useState, useEffect } from 'react';
import { validatePassword } from '../../utils/validation';
import { getRoleInfo } from '../../constants/admin/userRoles';
import type { User } from '../../types/auth';
import { Button } from '../ui/button';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string, currentPassword?: string) => Promise<void>;
  user: User | null;
  requireCurrentPassword?: boolean; // Nueva prop para indicar si se requiere contraseña actual
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  requireCurrentPassword = false
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [confirmPasswordValidationMessage, setConfirmPasswordValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Resetear el modal cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordValidationMessage('');
      setConfirmPasswordValidationMessage('');
      setIsLoading(false);
      setError('');
    }
  }, [isOpen]);

  // Validar nueva contraseña en tiempo real
  useEffect(() => {
    if (newPassword) {
      const error = validatePassword(newPassword);
      if (error) {
        setPasswordValidationMessage(error);
      } else {
        setPasswordValidationMessage('Contraseña válida');
      }
    } else {
      setPasswordValidationMessage('');
    }
  }, [newPassword]);

  // Validar confirmación de contraseña en tiempo real
  useEffect(() => {
    if (confirmPassword) {
      if (newPassword !== confirmPassword) {
        setConfirmPasswordValidationMessage('Las contraseñas no coinciden');
      } else if (newPassword && confirmPassword) {
        setConfirmPasswordValidationMessage('Las contraseñas coinciden');
      } else {
        setConfirmPasswordValidationMessage('');
      }
    } else {
      setConfirmPasswordValidationMessage('');
    }
  }, [newPassword, confirmPassword]);

  // Función para obtener el mensaje de validación prioritario
  const getValidationMessage = () => {
    // Prioridad 1: Error de contraseña nueva
    if (passwordValidationMessage && passwordValidationMessage !== 'Contraseña válida') {
      return { message: passwordValidationMessage, type: 'error' };
    }
    
    // Prioridad 2: Error de confirmación
    if (confirmPasswordValidationMessage && confirmPasswordValidationMessage !== 'Las contraseñas coinciden') {
      return { message: confirmPasswordValidationMessage, type: 'error' };
    }
    
    // Prioridad 3: Éxito de confirmación (cuando ambas son válidas)
    if (confirmPasswordValidationMessage === 'Las contraseñas coinciden' && passwordValidationMessage === 'Contraseña válida') {
      return { message: 'Las contraseñas coinciden', type: 'success' };
    }
    
    // Prioridad 4: Éxito de contraseña individual
    if (passwordValidationMessage === 'Contraseña válida') {
      return { message: passwordValidationMessage, type: 'success' };
    }
    
    return null;
  };

  const handleSubmit = async () => {
    setError('');

    // Validar contraseña actual si es requerida
    if (requireCurrentPassword && !currentPassword.trim()) {
      setError('La contraseña actual es requerida');
      return;
    }

    // Validar contraseña nueva
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    // Validar confirmación de contraseña
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(newPassword, requireCurrentPassword ? currentPassword : undefined);
      onClose();
    } catch (error) {
      setError('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const roleInfo = getRoleInfo(user.role);

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
                Cambiar Contraseña
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                icon="X"
                title="Cerrar"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Header del usuario - Avatar y información básica */}
          <div className="flex items-center justify-center" style={{ padding: '12px 24px' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-xl border-2 border-white/20">
                <span className="text-white text-lg font-bold drop-shadow-lg">
                  {user.first_name?.charAt(0) || user.username?.charAt(0) || '?'}
                </span>
              </div>
              
              <div className="flex flex-col" style={{ marginLeft: '32px' }}>
                <h3 className="text-lg font-bold text-white/90 drop-shadow-lg mb-2">
                  {user.first_name || 'Sin nombre'} {user.last_name || 'Sin apellido'}
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
            className="bg-black/20 overflow-y-auto flex-1"
            style={{
              padding: '16px 24px',
              maxHeight: 'calc(85vh - 120px)',
              minHeight: '300px'
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
          {/* Contraseña Actual - Solo si es requerida */}
          {requireCurrentPassword && (
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
              <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                <div className="col-span-1 flex justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-base">🔐</span>
                  </div>
                </div>
                <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                  <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Actual</div>
                </div>
                <div className="col-span-8 flex items-center">
                  <div className="relative w-full">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
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
                      placeholder="Contraseña actual"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 text-white/80 hover:text-white"
                      title={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={isLoading}
                    >
                      {showCurrentPassword ? '⚫' : '👁'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nueva Contraseña */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
            <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
              <div className="col-span-1 flex justify-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-base">🔒</span>
                </div>
              </div>
              <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Nueva</div>
              </div>
              <div className="col-span-8 flex items-center">
                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    placeholder="Nueva contraseña"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 text-white/80 hover:text-white"
                    title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    disabled={isLoading}
                  >
                    {showNewPassword ? '⚫' : '👁'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
            <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
              <div className="col-span-1 flex justify-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-base">🔐</span>
                </div>
              </div>
              <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Repetir</div>
              </div>
              <div className="col-span-8 flex items-center">
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    placeholder="Repetir contraseña"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 text-white/80 hover:text-white"
                    title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '⚫' : '👁'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de validación prioritario */}
          {(() => {
            const validation = getValidationMessage();
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

          {/* Mostrar error general */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/20 p-4 rounded-lg border border-red-400/30">
              {error}
            </div>
          )}

            </div>
          </div>

          {/* Footer con botones de acción */}
          <div 
            className="bg-black/30 border-t border-white/10" 
            style={{ 
              padding: '16px 24px', 
              display: 'flex',
              flexDirection: 'column', 
              gap: '24px',
              rowGap: '24px'
            }}
          >
            <div 
              className="grid grid-cols-2" 
              style={{ 
                gap: '24px',
                rowGap: '24px'
              }}
            >
              <Button
                onClick={onClose}
                disabled={isLoading}
                variant="secondary"
                size="lg"
                title="Cancelar"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isLoading || 
                  !newPassword || 
                  !confirmPassword || 
                  newPassword !== confirmPassword ||
                  (requireCurrentPassword && !currentPassword)
                }
                variant="success"
                size="lg"
                icon="Save"
                title="Cambiar Contraseña"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    <span>Cambiando...</span>
                  </>
                ) : (
                  <span>Cambiar Contraseña</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordChangeModal;
