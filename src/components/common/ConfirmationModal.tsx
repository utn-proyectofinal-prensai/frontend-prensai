import React from 'react';

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

  // Configuración de colores y íconos según el tipo
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          iconBg: 'from-red-500 to-red-600',
          confirmButton: 'from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 border-red-400/40 hover:shadow-red-500/25',
          confirmIcon: '🗑️'
        };
      case 'warning':
        return {
          icon: '⚠️',
          iconBg: 'from-yellow-500 to-orange-600',
          confirmButton: 'from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 border-yellow-400/40 hover:shadow-yellow-500/25',
          confirmIcon: '⚠️'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          iconBg: 'from-blue-500 to-blue-600',
          confirmButton: 'from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 border-blue-400/40 hover:shadow-blue-500/25',
          confirmIcon: '✅'
        };
      default:
        return {
          icon: '⚠️',
          iconBg: 'from-red-500 to-red-600',
          confirmButton: 'from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 border-red-400/40 hover:shadow-red-500/25',
          confirmIcon: '🗑️'
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
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:scale-105 border border-white/20 flex-shrink-0"
                title="Cerrar"
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-6 py-4 bg-gradient-to-r ${config.confirmButton} disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl transform hover:scale-110 disabled:transform-none border-2 disabled:border-gray-500/40 text-base`}
                title={confirmText}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">{config.confirmIcon}</span>
                    <span>{confirmText}</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-4 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-gray-500/25 transform hover:scale-110 disabled:transform-none border-2 border-gray-400/40 text-base"
                title={cancelText}
              >
                <span className="text-xl">❌</span>
                <span>{cancelText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
