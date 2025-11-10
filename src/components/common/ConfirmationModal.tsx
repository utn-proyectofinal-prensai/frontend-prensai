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

  // Función para procesar el mensaje y poner en negrita el texto entre comillas
  const processMessage = (text: string) => {
    // Dividir por saltos de línea para mantener el formato
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      // Buscar texto entre comillas dobles y reemplazarlo con negrita
      const parts = line.split(/"([^"]*)"/g);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, partIndex) => {
            // Las partes en índices impares están entre comillas
            if (partIndex % 2 === 1) {
              return <strong key={partIndex} className="text-white font-semibold">{part}</strong>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // Icono del modal basado en el tipo - sin fondo, solo color
  const modalIcon = (() => {
    switch (type) {
      case 'danger':
        return (
          <AlertTriangle className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        );
      case 'warning':
        return (
          <AlertTriangle className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        );
      case 'info':
        return (
          <Info className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        );
      default:
        return (
          <AlertTriangle className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        );
    }
  })();

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
      size="default"
      className="!w-[520px]"
    >
      {/* Mensaje */}
      <div className="text-center mb-12 flex items-center justify-center" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        <p className="text-white/90 text-base leading-relaxed">
          {processMessage(message)}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
