import React from 'react';
import type { Mention } from '../../services/api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
        mention-card bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 
        hover:bg-black/40 hover:border-white/30 hover:shadow-xl hover:scale-105
        transition-all duration-300 group cursor-pointer ${className}
      `}
      style={{ paddingTop: '2rem', paddingBottom: '2rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      >
      {/* Estado con espaciado apropiado */}
      <div className="flex items-center justify-between" style={{ paddingLeft: '16px', marginBottom: '1.5rem' }}>
        <Badge 
          variant={mention.enabled ? 'success' : 'danger'} 
          size="sm"
        >
          {mention.enabled ? 'ACTIVA' : 'INACTIVA'}
        </Badge>

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors" style={{ marginBottom: '0.75rem' }}>
          {mention.name}
        </h3>
        <p className="text-white/60 text-sm">
          Persona monitoreada
        </p>
      </div>


      {/* Barra de estado sutil */}
      <div style={{ marginTop: '2rem' }}>
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
