import { useState, useMemo } from 'react';
import { TEXT_STYLES, STATUS_STYLES } from '../../constants/styles';

interface ChipItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color?: string;
  icon?: string;
}

interface ChipSelectionProps {
  items: ChipItem[];
  selectedItems: string[];
  onToggle: (itemName: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  title: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  showCategories?: boolean;
  maxSelections?: number;
  className?: string;
}

const ChipSelection: React.FC<ChipSelectionProps> = ({
  items,
  selectedItems,
  onToggle,
  onSelectAll,
  onClearAll,
  title,
  loading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay elementos disponibles',
  searchPlaceholder = 'Buscar...',
  showCategories = false,
  maxSelections,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar elementos
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    return filtered;
  }, [items, searchTerm, selectedCategory]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
    return uniqueCategories;
  }, [items]);

  const isMaxSelectionsReached = maxSelections && selectedItems.length >= maxSelections;
  const hasSelections = selectedItems.length > 0;

  // Colores predefinidos para chips
  const getChipColor = (item: ChipItem, isSelected: boolean) => {
    if (isSelected) {
      return item.color || 'blue';
    }
    return 'gray';
  };

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
          <h4 className={TEXT_STYLES.title.subsection}>{title}</h4>
          {hasSelections && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES.info}`}>
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
          placeholder={searchPlaceholder}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
        />
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filtros de categoría */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category || 'all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

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
              const chipColor = getChipColor(item, isSelected);
              
              return (
                <div
                  key={item.id}
                  onClick={() => !isDisabled && onToggle(item.name)}
                  className={getChipClasses(chipColor, isSelected)}
                  title={item.description}
                >
                  {item.icon && (
                    <span className="text-xs">{item.icon}</span>
                  )}
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

export default ChipSelection;
