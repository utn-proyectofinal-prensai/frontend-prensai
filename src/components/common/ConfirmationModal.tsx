import React from 'react';
import { Button } from '../ui/button';
import { Modal, ModalFooter } from '../ui/modal';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  // Configuración de íconos según el tipo
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'AlertTriangle',
          iconBg: 'from-red-500 to-red-600',
          confirmVariant: 'danger' as const,
          confirmIcon: 'Delete' as const
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconBg: 'from-yellow-500 to-orange-600',
          confirmVariant: 'danger' as const,
          confirmIcon: 'AlertTriangle' as const
        };
      case 'info':
        return {
          icon: 'Info',
          iconBg: 'from-blue-500 to-blue-600',
          confirmVariant: 'primary' as const,
          confirmIcon: 'Check' as const
        };
      default:
        return {
          icon: 'AlertTriangle',
          iconBg: 'from-red-500 to-red-600',
          confirmVariant: 'danger' as const,
          confirmIcon: 'Delete' as const
        };
    }
  };

  const config = getTypeConfig();

  // Icono del modal basado en el tipo
  const modalIcon = (
    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
      {config.icon === 'AlertTriangle' ? (
        <AlertTriangle className="w-4 h-4 text-white" />
      ) : (
        <Info className="w-4 h-4 text-white" />
      )}
    </div>
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
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        variant={config.confirmVariant}
        size="lg"
        icon={config.confirmIcon}
      >
        {isLoading ? 'Procesando...' : confirmText}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={modalIcon}
      footer={footer}
      size="sm"
    >
      {/* Mensaje */}
      <div className="text-center mb-12">
        <p className="text-white/90 text-base leading-relaxed whitespace-pre-line">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
