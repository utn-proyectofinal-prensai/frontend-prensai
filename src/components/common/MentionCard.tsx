import React from 'react';
import type { Mention } from '../../services/api';
import { Button } from '../ui/button';

interface MentionCardProps {
  mention: Mention;
  onEdit?: (mention: Mention) => void;
  onDelete?: (id: number) => void;
  onView?: (mention: Mention) => void;
  showActions?: boolean;
  className?: string;
}

export const MentionCard: React.FC<MentionCardProps> = ({
  mention,
  onEdit,
  onDelete,
  onView,
  showActions = false,
  className = ''
}) => {

  const handleClick = () => {
    if (onView) {
      onView(mention);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        mention-card bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6 
        hover:bg-black/40 hover:border-white/30 hover:shadow-xl hover:scale-105
        transition-all duration-300 group cursor-pointer ${className}
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
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(mention);
              }}
              variant="ghost"
              size="icon"
              icon="Edit"
              title="Editar mención"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(mention.id);
              }}
              variant="ghost"
              size="icon"
              icon="Delete"
              title="Eliminar mención"
            />
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
                : 'bg-gradient-to-r from-red-400 to-rose-500 w-full'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
