import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
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
      textColor: 'rgb(147, 197, 253)', // blue-300
      subtitleClass: 'metric-subtitle-blue',
    },
    green: {
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-300/30',
      text: 'text-green-300',
      textColor: 'rgb(134, 239, 172)', // green-300
      subtitleClass: 'metric-subtitle-green',
    },
    purple: {
      gradient: 'from-purple-500/20 to-violet-500/20',
      border: 'border-purple-300/30',
      text: 'text-purple-300',
      textColor: 'rgb(196, 181, 253)', // purple-300
      subtitleClass: 'metric-subtitle-purple',
    },
    orange: {
      gradient: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-300/30',
      text: 'text-orange-300',
      textColor: 'rgb(253, 186, 116)', // orange-300
      subtitleClass: 'metric-subtitle-orange',
    },
    red: {
      gradient: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-300/30',
      text: 'text-red-300',
      textColor: 'rgb(252, 165, 165)', // red-300
      subtitleClass: 'metric-subtitle-red',
    },
    yellow: {
      gradient: 'from-yellow-500/20 to-amber-500/20',
      border: 'border-yellow-300/30',
      text: 'text-yellow-300',
      textColor: 'rgb(253, 224, 71)', // yellow-300
      subtitleClass: 'metric-subtitle-yellow',
    },
  };

  const colors = colorConfig[iconColor];

  return (
    <div
      className={`upload-news-panel group transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
      style={{ padding: '0.75rem', minHeight: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center justify-center flex-1" style={{ padding: '0.25rem 0', '--metric-subtitle-color': colors.textColor } as React.CSSProperties}>
        {icon && (
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border ${colors.border} mb-2`}>
            <div className={colors.text}>
              {icon}
            </div>
          </div>
        )}
        <p className={`text-xs font-semibold mb-1 ${colors.text}`}>{title}</p>
        <p className="text-2xl font-bold text-white mb-0.5 tracking-tight">{value}</p>
        {subtitle && (
          <p className={`text-xs font-medium ${colors.text}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

