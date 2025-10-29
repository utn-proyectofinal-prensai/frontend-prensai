import React from 'react';
import { Modal } from './modal';
import { LoadingState } from './loading-spinner';

interface LoadingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  variant?: 'default' | 'ai' | 'simple';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  icon?: React.ReactNode;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  onClose,
  title = 'Procesando...',
  description,
  variant = 'ai',
  size = 'lg',
  closable = false,
  icon
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closable ? onClose || (() => {}) : () => {}}
      size="sm"
      className="pointer-events-auto"
    >
      <div 
        className="px-8"
        style={{ 
          paddingBottom: '48px',
          paddingTop: '48px'
        }}
      >
        <LoadingState
          title={title}
          description={description}
          variant={variant}
          size={size}
          icon={icon}
        />
      </div>
    </Modal>
  );
};

export default LoadingModal;
