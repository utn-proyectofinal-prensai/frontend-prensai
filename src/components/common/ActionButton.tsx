import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'gradient' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white';
      case 'secondary':
        return 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm font-medium rounded-lg';
      case 'lg':
        return 'px-8 py-4 text-lg font-bold rounded-xl';
      default:
        return 'px-6 py-3 font-semibold rounded-xl';
    }
  };

  const baseClasses = 'transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantClasses()} ${getSizeClasses()} ${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
