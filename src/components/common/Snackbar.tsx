import React, { useEffect, useState } from 'react';

export interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isOpen,
  onClose,
  duration = 5000,
  type = 'error'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Solo llamar onClose si la función no está vacía
        if (onClose && typeof onClose === 'function') {
          setTimeout(onClose, 300);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500 border-2 border-green-600',
          icon: '✓'
        };
      case 'info':
        return {
          bg: 'bg-blue-500 border-2 border-blue-600',
          icon: 'ℹ'
        };
      case 'error':
      default:
        return {
          bg: 'bg-red-500 border-2 border-red-600',
          icon: '✗'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`
          ${typeStyles.bg} text-white
          rounded-lg shadow-lg px-4 py-3 min-w-80 max-w-md
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-lg font-bold">
            {typeStyles.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snackbar;
