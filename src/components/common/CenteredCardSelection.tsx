import { useState } from 'react';

interface CardItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface CenteredCardSelectionProps {
  items: CardItem[];
  selectedItems: string[];
  onToggle: (itemName: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  title: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  maxSelections?: number;
  className?: string;
}

const CenteredCardSelection: React.FC<CenteredCardSelectionProps> = ({
  items,
  selectedItems,
  onToggle,
  onSelectAll,
  onClearAll,
  title,
  loading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay elementos disponibles',
  maxSelections,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Filtrar elementos por búsqueda
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMaxSelectionsReached = maxSelections && selectedItems.length >= maxSelections;
  const hasSelections = selectedItems.length > 0;

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          {hasSelections && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <button
            onClick={onSelectAll}
            disabled={loading}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
          >
            Seleccionar todo
          </button>
          <button
            onClick={onClearAll}
            disabled={loading || !hasSelections}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6 flex justify-center z-10">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all relative z-10"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Lista de cards centrada */}
      {loading ? (
        <div className="text-white/70 text-center py-8">{loadingText}</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-white/70 text-center py-8">
          {searchTerm ? 'No se encontraron resultados' : emptyText}
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.includes(item.name);
              const isDisabled = !isSelected && isMaxSelectionsReached;
              const isHovered = hoveredItem === item.id;
              
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Card principal */}
                  <div
                    onClick={() => !isDisabled && onToggle(item.name)}
                    className={`
                      w-48 h-24 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                      flex flex-col items-center justify-center text-center
                      ${isSelected 
                        ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                        : isDisabled
                        ? 'border-gray-500/30 bg-gray-500/5 opacity-50 cursor-not-allowed'
                        : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10'
                      }
                    `}
                  >
                    {/* Título del tema con ícono de información */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {item.name}
                      </h3>
                      {item.description && (
                        <div 
                          className="relative"
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center cursor-help hover:bg-white/30 transition-colors">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          
                          {/* Tooltip con descripción */}
                          {isHovered && (
                            <div className="absolute z-[9999] bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900/98 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl">
                              <div className="text-white text-xs text-center leading-relaxed">
                                {item.description}
                              </div>
                              {/* Flecha del tooltip */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/98"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Checkbox visual */}
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                      ${isSelected 
                        ? 'border-blue-400 bg-blue-400' 
                        : 'border-white/30 bg-transparent'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Límite de selecciones */}
      {maxSelections && (
        <div className="mt-4 text-center">
          <p className="text-sm text-white/60">
            {selectedItems.length}/{maxSelections} seleccionados
            {isMaxSelectionsReached && (
              <span className="text-yellow-400 ml-2">• Límite alcanzado</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default CenteredCardSelection;
