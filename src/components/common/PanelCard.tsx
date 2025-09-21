import React from 'react';

interface PanelCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'config' | 'form';
  padding?: 'sm' | 'md' | 'lg';
}

const PanelCard: React.FC<PanelCardProps> = ({
  children,
  className = '',
  title,
  variant = 'default',
  padding = 'md'
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'sm': return 'p-4';
      case 'lg': return 'p-10';
      default: return 'p-8';
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'config':
        return 'bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20';
      case 'form':
        return 'bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20';
      default:
        return 'bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20';
    }
  };

  return (
    <div className={`${getVariantClass()} ${getPaddingClass()} ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default PanelCard;
