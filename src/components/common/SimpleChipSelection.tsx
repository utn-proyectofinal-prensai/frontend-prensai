import { useState } from 'react';

interface SimpleChipItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface SimpleChipSelectionProps {
  items: SimpleChipItem[];
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

const SimpleChipSelection: React.FC<SimpleChipSelectionProps> = ({
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

  // Filtrar elementos por búsqueda
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMaxSelectionsReached = maxSelections && selectedItems.length >= maxSelections;
  const hasSelections = selectedItems.length > 0;

  const getChipClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-2';
    
    if (isSelected) {
      switch (color) {
        case 'blue':
          return `${baseClasses} bg-blue-500/20 text-blue-300 border-blue-400/50 hover:bg-blue-500/30`;
        case 'green':
          return `${baseClasses} bg-green-500/20 text-green-300 border-green-400/50 hover:bg-green-500/30`;
        case 'purple':
          return `${baseClasses} bg-purple-500/20 text-purple-300 border-purple-400/50 hover:bg-purple-500/30`;
        case 'orange':
          return `${baseClasses} bg-orange-500/20 text-orange-300 border-orange-400/50 hover:bg-orange-500/30`;
        case 'red':
          return `${baseClasses} bg-red-500/20 text-red-300 border-red-400/50 hover:bg-red-500/30`;
        default:
          return `${baseClasses} bg-blue-500/20 text-blue-300 border-blue-400/50 hover:bg-blue-500/30`;
      }
    } else {
      return `${baseClasses} bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/30`;
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
          {hasSelections && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
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
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
        />
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>


      {/* Lista de chips */}
      {loading ? (
        <div className="text-white/70 text-center py-8">{loadingText}</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-white/70 text-center py-8">
          {searchTerm ? 'No se encontraron resultados' : emptyText}
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.includes(item.name);
              const isDisabled = !isSelected && isMaxSelectionsReached;
              const chipColor = item.color || 'blue';
              
              return (
                <div
                  key={item.id}
                  onClick={() => !isDisabled && onToggle(item.name)}
                  className={getChipClasses(chipColor, isSelected)}
                  title={item.description}
                >
                  <span>{item.name}</span>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
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

export default SimpleChipSelection;
