import React, { useState, useEffect } from 'react';
import { validatePassword } from '../../utils/validation';
import type { User } from '../../types/auth';
import { Button } from '../ui/button';
import { Modal, ModalFooter } from '../ui/modal';
import { Input } from '../ui/input';

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


  // Icono del modal
  const modalIcon = (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );

  // Footer del modal
  const footer = (
    <ModalFooter>
      <Button
        onClick={onClose}
        disabled={isLoading}
        variant="secondary"
        size="lg"
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
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar Contraseña"
      icon={modalIcon}
      footer={footer}
      size="default"
    >

      <div className="space-y-6">
        {/* Contraseña Actual - Solo si es requerida */}
        {requireCurrentPassword && (
          <div className="relative">
            <Input
              label="Contraseña Actual"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Contraseña actual"
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              variant="ghost"
              size="icon"
              className="absolute right-3 top-[46px] w-6 h-6 p-0 text-white/80 hover:text-white flex items-center justify-center"
              style={{ transform: 'translateY(-50%)' }}
              title={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              disabled={isLoading}
              icon={showCurrentPassword ? "EyeOff" : "Eye"}
            />
          </div>
        )}

        {/* Nueva Contraseña */}
        <div className="relative">
          <Input
            label="Nueva Contraseña"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            variant="ghost"
            size="icon"
            className="absolute right-3 top-[46px] w-6 h-6 p-0 text-white/80 hover:text-white flex items-center justify-center"
            style={{ transform: 'translateY(-50%)' }}
            title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            disabled={isLoading}
            icon={showNewPassword ? "EyeOff" : "Eye"}
          />
        </div>

        {/* Confirmar Contraseña */}
        <div className="relative">
          <Input
            label="Confirmar Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetir contraseña"
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            variant="ghost"
            size="icon"
            className="absolute right-3 top-[46px] w-6 h-6 p-0 text-white/80 hover:text-white flex items-center justify-center"
            style={{ transform: 'translateY(-50%)' }}
            title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            disabled={isLoading}
            icon={showConfirmPassword ? "EyeOff" : "Eye"}
          />
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
    </Modal>
  );
};

export default PasswordChangeModal;
