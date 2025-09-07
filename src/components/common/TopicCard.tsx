import React from 'react';
import type { Topic } from '../../services/api';

interface TopicCardProps {
  topic: Topic;
  isSelected?: boolean;
  onSelect?: (topic: Topic) => void;
  onEdit?: (topic: Topic) => void;
  onDelete?: (id: number) => void;
  onView?: (topic: Topic) => void;
  showActions?: boolean;
  variant?: 'selection' | 'management';
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onView,
  showActions = false,
  variant = 'selection',
  className = ''
}) => {

  const handleClick = () => {
    if (onSelect && variant === 'selection') {
      onSelect(topic);
    } else if (onView && variant === 'management') {
      onView(topic);
    }
  };

  const baseClasses = `
    relative overflow-hidden rounded-xl border transition-all duration-300 group
    ${variant === 'selection' ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : onView ? 'cursor-pointer hover:shadow-xl hover:scale-105' : 'hover:shadow-xl'}
    ${className}
  `;

  if (variant === 'selection') {
    return (
      <div
        onClick={handleClick}
        className={`${baseClasses} topic-card ${
          isSelected
            ? 'selected bg-white/10 border-white/40 shadow-2xl transform scale-105'
            : 'bg-black/30 border-white/20 hover:bg-black/40 hover:border-white/30'
        }`}
      >
        <div className="backdrop-blur-sm p-6">
          {/* Estado con espaciado apropiado */}
          <div className="flex items-center justify-between mb-3" style={{ paddingLeft: '16px' }}>
            <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-bold border-2 ${
              topic.enabled 
                ? 'bg-green-500/20 text-green-300 border-green-400/40' 
                : 'bg-red-500/20 text-red-300 border-red-400/40'
            }`}>
              {topic.enabled ? '✅ ACTIVO' : '❌ INACTIVO'}
            </span>
            {isSelected && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Indicador de crisis si existe */}
          {topic.crisis && (
            <div className="mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-400/30">
                ⚠️ Crisis
              </span>
            </div>
          )}

          {/* Header con título y descripción */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-300 transition-colors mb-2">
              {topic.name}
            </h3>
            {topic.description && (
              <p className="text-white/70 text-sm line-clamp-3 mb-4">
                {topic.description}
              </p>
            )}
          </div>

          {/* Barra de estado sutil */}
          <div className="mt-4">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 w-full ${
                  topic.enabled 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-red-400 to-rose-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Efecto de selección */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
        )}
      </div>
    );
  }

  // Variant 'management'
  return (
    <div 
      onClick={handleClick}
      className={`${baseClasses} topic-card bg-black/30 border-white/20 hover:bg-black/40`}>
      <div className="backdrop-blur-sm p-6">
        {/* Estado con espaciado apropiado */}
        <div className="flex items-center justify-between mb-3" style={{ paddingLeft: '16px' }}>
          <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-bold border-2 ${
            topic.enabled 
              ? 'bg-green-500/20 text-green-300 border-green-400/40' 
              : 'bg-red-500/20 text-red-300 border-red-400/40'
          }`}>
            {topic.enabled ? '✅ ACTIVO' : '❌ INACTIVO'}
          </span>
          
          {showActions && (
            <div className="flex space-x-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(topic);
                }}
                className="text-blue-400 hover:text-blue-300 transition-all duration-300 p-2 hover:bg-blue-500/20 rounded-lg hover:scale-110"
                title="Editar tema"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(topic.id);
                }}
                className="text-red-400 hover:text-red-300 transition-all duration-300 p-2 hover:bg-red-500/20 rounded-lg hover:scale-110"
                title="Eliminar tema"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {/* Indicador de crisis si existe */}
        {topic.crisis && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-400/30">
              ⚠️ Crisis
            </span>
          </div>
        )}

        {/* Título */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {topic.name}
          </h3>
          {/* Descripción */}
          {topic.description && (
            <p className="text-white/70 text-sm line-clamp-3 mb-4">
              {topic.description}
            </p>
          )}
        </div>

        {/* Barra de estado sutil */}
        <div className="mt-4">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 w-full ${
                topic.enabled 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-400 to-rose-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
