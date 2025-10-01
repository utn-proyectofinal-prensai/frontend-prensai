import React from 'react';
import { Button } from '../ui/button';

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
          icon: '⚠️',
          iconBg: 'from-red-500 to-red-600',
          confirmVariant: 'danger' as const,
          confirmIcon: 'Delete' as const
        };
      case 'warning':
        return {
          icon: '⚠️',
          iconBg: 'from-yellow-500 to-orange-600',
          confirmVariant: 'danger' as const,
          confirmIcon: 'Warning' as const
        };
      case 'info':
        return {
          icon: 'ℹ️',
          iconBg: 'from-blue-500 to-blue-600',
          confirmVariant: 'primary' as const,
          confirmIcon: 'Check' as const
        };
      default:
        return {
          icon: '⚠️',
          iconBg: 'from-red-500 to-red-600',
          confirmVariant: 'danger' as const,
          confirmIcon: 'Delete' as const
        };
    }
  };

  const config = getTypeConfig();

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
          className="w-[500px] max-w-[90vw] max-h-[85vh] overflow-hidden bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 scale-100"
        >
          
          {/* Header del modal */}
          <div className="bg-black/30 border-b border-white/10" style={{ padding: '16px 24px' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">
                {title}
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

          {/* Contenido del modal */}
          <div 
            className="bg-black/20 overflow-y-auto flex-1"
            style={{
              padding: '24px',
              minHeight: '150px'
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                rowGap: '24px'
              }}
            >
              {/* Ícono y mensaje */}
              <div className="flex items-center justify-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${config.iconBg} rounded-full flex items-center justify-center shadow-xl border-2 border-white/20`}>
                  <span className="text-white text-2xl">
                    {config.icon}
                  </span>
                </div>
              </div>

              {/* Mensaje */}
              <div className="text-center">
                <p className="text-white/90 text-base leading-relaxed whitespace-pre-line">
                  {message}
                </p>
              </div>
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
                title={cancelText}
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                variant={config.confirmVariant}
                size="lg"
                icon={config.confirmIcon}
                title={confirmText}
              >
                {isLoading ? 'Procesando...' : confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
