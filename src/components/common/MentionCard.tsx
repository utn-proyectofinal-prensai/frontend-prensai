import React from 'react';
import type { Mention } from '../../services/api';

interface MentionCardProps {
  mention: Mention;
  onEdit?: (mention: Mention) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  className?: string;
}

export const MentionCard: React.FC<MentionCardProps> = ({
  mention,
  onEdit,
  onDelete,
  showActions = false,
  className = ''
}) => {

  return (
    <div className={`
      mention-card bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6 
      hover:bg-black/40 hover:border-white/30 hover:shadow-xl hover:scale-105
      transition-all duration-300 group ${className}
    `}>
      {/* Estado con espaciado apropiado */}
      <div className="flex items-center justify-between mb-3" style={{ paddingLeft: '16px' }}>
        <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-bold border-2 ${
          mention.enabled 
            ? 'bg-green-500/20 text-green-300 border-green-400/40' 
            : 'bg-red-500/20 text-red-300 border-red-400/40'
        }`}>
          <span className="mr-1">
            {mention.enabled ? '✅' : '❌'}
          </span>
          {mention.enabled ? 'ACTIVA' : 'INACTIVA'}
        </span>

        {/* Acciones */}
        {showActions && (
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(mention);
              }}
              className="text-blue-400 hover:text-blue-300 transition-all duration-300 p-2 hover:bg-blue-500/20 rounded-lg hover:scale-110"
              title="Editar mención"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(mention.id);
              }}
              className="text-red-400 hover:text-red-300 transition-all duration-300 p-2 hover:bg-red-500/20 rounded-lg hover:scale-110"
              title="Eliminar mención"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Nombre y descripción */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors mb-1">
          {mention.name}
        </h3>
        <p className="text-white/60 text-sm">
          Persona monitoreada
        </p>
      </div>


      {/* Barra de estado sutil */}
      <div className="mt-4">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              mention.enabled 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' 
                : 'bg-gradient-to-r from-red-400 to-rose-500 w-1/4'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
