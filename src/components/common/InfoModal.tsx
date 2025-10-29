import React, { useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Download } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  icon?: React.ReactNode;
  autoCloseDelay?: number; // en milisegundos
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  message,
  icon,
  autoCloseDelay = 3000 // 3 segundos por defecto
}) => {
  // Auto-cerrar el modal después del delay
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  // Agregar estilos CSS para la animación
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes download-progress {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const defaultIcon = (
    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center" style={{ marginBottom: '2rem' }}>
      <div className="relative">
        <Download className="w-8 h-8 text-white animate-bounce" />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="w-full h-full bg-white rounded-full" 
            style={{
              animation: 'download-progress 2s ease-in-out infinite',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="default"
    >
      <div className="flex flex-col items-center justify-center px-8" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {icon || defaultIcon}
        <h3 className="text-white/90 text-lg font-medium text-center" style={{ marginBottom: '1rem' }}>
          {message}
        </h3>
      </div>
    </Modal>
  );
};

export default InfoModal;
