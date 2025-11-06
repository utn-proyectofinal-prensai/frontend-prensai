import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  onClick?: () => void;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'blue',
  onClick,
  className = ''
}: MetricCardProps) {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-300/30',
      text: 'text-blue-300',
    },
    green: {
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-300/30',
      text: 'text-green-300',
    },
    purple: {
      gradient: 'from-purple-500/20 to-violet-500/20',
      border: 'border-purple-300/30',
      text: 'text-purple-300',
    },
    orange: {
      gradient: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-300/30',
      text: 'text-orange-300',
    },
    red: {
      gradient: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-300/30',
      text: 'text-red-300',
    },
  };

  const colors = colorConfig[iconColor];

  return (
    <div
      className={`upload-news-panel group transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
      style={{ padding: '1rem', minHeight: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center justify-center flex-1" style={{ padding: '0.5rem 0' }}>
        {icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border ${colors.border} mb-3`}>
            <div className={colors.text}>
              {icon}
            </div>
          </div>
        )}
        <p className="text-sm font-semibold text-slate-200 mb-1.5">{title}</p>
        <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>
        {subtitle && (
          <p className={`text-xs ${colors.text} font-medium`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

