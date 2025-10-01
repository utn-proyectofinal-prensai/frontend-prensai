import { useState, useMemo } from 'react';
import { TEXT_STYLES, STATUS_STYLES } from '../../constants/styles';
import { Button } from '../ui/button';

interface SelectionItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface EnhancedSelectionProps {
  items: SelectionItem[];
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
  showPriority?: boolean;
  maxSelections?: number;
  className?: string;
}

const EnhancedSelection: React.FC<EnhancedSelectionProps> = ({
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
  showPriority = false,
  maxSelections,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'category'>('name');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Filtrar y ordenar elementos
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar solo seleccionados
    if (showSelectedOnly) {
      filtered = filtered.filter(item => selectedItems.includes(item.name));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [items, searchTerm, showSelectedOnly, sortBy, selectedItems]);

  // Agrupar por categoría si está habilitado
  const groupedItems = useMemo(() => {
    if (!showCategories) return { 'Todos': filteredAndSortedItems };
    
    return filteredAndSortedItems.reduce((groups, item) => {
      const category = item.category || 'Sin categoría';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
      return groups;
    }, {} as Record<string, SelectionItem[]>);
  }, [filteredAndSortedItems, showCategories]);

  const isMaxSelectionsReached = maxSelections && selectedItems.length >= maxSelections;
  const hasSelections = selectedItems.length > 0;

  return (
    <div className={className}>
      {/* Header con título y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <h4 className={TEXT_STYLES.title.subsection}>{title}</h4>
          {hasSelections && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES.info}`}>
              {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onSelectAll}
            variant="secondary"
            size="sm"
            disabled={loading}
            icon="Check"
          >
            Seleccionar todo
          </Button>
          <Button
            onClick={onClearAll}
            variant="secondary"
            size="sm"
            disabled={loading || !hasSelections}
            icon="X"
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="space-y-3 mb-4">
        <div className="relative">
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

        <div className="flex flex-wrap gap-2">
          {/* Filtro de ordenamiento */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="name">Ordenar por nombre</option>
            {showPriority && <option value="priority">Ordenar por prioridad</option>}
            {showCategories && <option value="category">Ordenar por categoría</option>}
          </select>

          {/* Filtro de solo seleccionados */}
          <Button
            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
            variant={showSelectedOnly ? "primary" : "outline"}
            size="sm"
          >
            Solo seleccionados
          </Button>
        </div>
      </div>

      {/* Lista de elementos */}
      {loading ? (
        <div className="text-white/70 text-center py-8">{loadingText}</div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="text-white/70 text-center py-8">
          {searchTerm ? 'No se encontraron resultados' : emptyText}
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-4">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              {showCategories && Object.keys(groupedItems).length > 1 && (
                <h5 className="text-sm font-semibold text-white/80 mb-2 px-2">
                  {category}
                </h5>
              )}
              
              <div className="space-y-2">
                {categoryItems.map((item) => {
                  const isSelected = selectedItems.includes(item.name);
                  const isDisabled = !isSelected && isMaxSelectionsReached;
                  
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : isDisabled
                          ? 'bg-gray-500/10 border-gray-500/30 opacity-50 cursor-not-allowed'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(item.name)}
                        disabled={!!isDisabled}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-white/90'}`}>
                            {item.name}
                          </span>
                          
                          {showPriority && item.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
                            </span>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-white/60'}`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Límite de selecciones */}
      {maxSelections && (
        <div className="mt-3 text-center">
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

export default EnhancedSelection;
