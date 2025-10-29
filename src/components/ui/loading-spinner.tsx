import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'ai' | 'simple';
  className?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6', 
  xl: 'w-8 h-8'
};

const borderSizeClasses = {
  sm: '2px',
  md: '3px',
  lg: '4px',
  xl: '4px'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  showIcon = false,
  icon
}) => {
  const getSpinnerStyles = () => {
    switch (variant) {
      case 'ai':
        return {
          borderTopColor: 'rgb(147, 51, 234)',
          borderRightColor: 'rgb(59, 130, 246)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent'
        };
      case 'simple':
        return {
          borderTopColor: 'rgb(59, 130, 246)',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent'
        };
      default:
        return {
          borderTopColor: 'rgb(59, 130, 246)',
          borderRightColor: 'rgba(59, 130, 246, 0.3)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent'
        };
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'ai':
        return 'text-purple-400';
      case 'simple':
        return 'text-blue-400';
      default:
        return 'text-blue-400';
    }
  };

  const defaultIcon = variant === 'ai' ? (
    <svg className={cn(iconSizeClasses[size], getIconColor())} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ) : (
    <svg className={cn(iconSizeClasses[size], getIconColor())} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-solid',
          sizeClasses[size]
        )}
        style={{
          borderWidth: borderSizeClasses[size],
          ...getSpinnerStyles()
        }}
      />
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          {icon || defaultIcon}
        </div>
      )}
    </div>
  );
};

// Componente completo de estado de carga con texto
interface LoadingStateProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'ai' | 'simple';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Cargando...',
  description,
  variant = 'default',
  size = 'lg',
  className,
  showIcon = variant === 'ai',
  icon
}) => {
  return (
    <div className={cn('flex items-center justify-center py-16', className)}>
      <div className="text-center space-y-6">
        <LoadingSpinner 
          size={size}
          variant={variant}
          showIcon={showIcon}
          icon={icon}
        />
        
        {(title || description) && (
          <div className="space-y-3">
            {title && (
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="text-white/60 text-sm max-w-md mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
