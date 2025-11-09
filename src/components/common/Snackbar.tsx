import React, { useEffect, useState, useRef } from 'react';
import { Check, AlertTriangle, X, Info } from 'lucide-react';

export interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isOpen,
  onClose,
  duration = 5000,
  variant = 'error'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setProgress(100);
      startTimeRef.current = Date.now();

      // Animar la barra de progreso
      const updateProgress = () => {
        if (startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
          setProgress(remaining);

          if (remaining <= 0) {
            setIsVisible(false);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setTimeout(() => {
              if (onClose && typeof onClose === 'function') {
                onClose();
              }
            }, 300);
          }
        }
      };

      progressIntervalRef.current = setInterval(updateProgress, 16); // ~60fps

      const timer = setTimeout(() => {
        setIsVisible(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setTimeout(() => {
          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        }, 300);
      }, duration);

      return () => {
        clearTimeout(timer);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    } else {
      setProgress(100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const stylesByVariant: Record<NonNullable<typeof variant>, { container: string; progressBar: string; Icon: React.ComponentType<{ className?: string }> }> = {
    success: {
      container: 'bg-green-500 border-2 border-green-600 text-white',
      progressBar: 'bg-green-300',
      Icon: Check,
    },
    warning: {
      container: 'bg-yellow-500 border-2 border-yellow-600 text-black',
      progressBar: 'bg-yellow-300',
      Icon: AlertTriangle,
    },
    error: {
      container: 'bg-red-500 border-2 border-red-600 text-white',
      progressBar: 'bg-red-300',
      Icon: X,
    },
    info: {
      container: 'bg-blue-500 border-2 border-blue-600 text-white',
      progressBar: 'bg-blue-300',
      Icon: Info,
    },
  };

  const current = stylesByVariant[variant];

  return (
    <div className="fixed bottom-20 left-4 z-[60]">
      <div
        className={`
          ${current.container}
          rounded-lg shadow-lg px-6 min-w-80 max-w-md
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
          overflow-hidden
        `}
        style={{
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem'
        }}
      >
        <div className="flex items-center space-x-4 mb-5">
          <div className="flex-shrink-0">
            <current.Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
          <div
            className={`h-full ${current.progressBar} transition-all ease-linear`}
            style={{
              width: `${progress}%`,
              transition: 'width 0.016s linear'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Snackbar;
