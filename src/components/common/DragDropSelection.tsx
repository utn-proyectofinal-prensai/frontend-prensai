import { useState, useMemo } from 'react';
import { TEXT_STYLES, STATUS_STYLES } from '../../constants/styles';

interface DragItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  color?: string;
}

interface DragDropSelectionProps {
  items: DragItem[];
  selectedItems: string[];
  onToggle: (itemName: string) => void;
  onReorder: (reorderedItems: string[]) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  title: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  showPriority?: boolean;
  maxSelections?: number;
  className?: string;
}

const DragDropSelection: React.FC<DragDropSelectionProps> = ({
  items,
  selectedItems,
  onToggle,
  onReorder,
  onSelectAll,
  onClearAll,
  title,
  loading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay elementos disponibles',
  searchPlaceholder = 'Buscar...',
  showPriority = false,
  maxSelections,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // Filtrar elementos
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Ordenar elementos seleccionados
  const orderedSelectedItems = useMemo(() => {
    return selectedItems.sort((a, b) => {
      const itemA = items.find(item => item.name === a);
      const itemB = items.find(item => item.name === b);
      
      if (showPriority && itemA?.priority && itemB?.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[itemB.priority] || 0) - (priorityOrder[itemA.priority] || 0);
      }
      
      return a.localeCompare(b);
    });
  }, [selectedItems, items, showPriority]);

  const isMaxSelectionsReached = maxSelections && selectedItems.length >= maxSelections;
  const hasSelections = selectedItems.length > 0;

  // Manejar drag and drop
  const handleDragStart = (e: React.DragEvent, itemName: string) => {
    setDraggedItem(itemName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemName: string) => {
    e.preventDefault();
    setDragOverItem(itemName);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItemName: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemName) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newOrder = [...orderedSelectedItems];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetItemName);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Reordenar elementos
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      onReorder(newOrder);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
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

      {/* Lista de elementos disponibles */}
      <div className="mb-6">
        <h5 className="text-sm font-semibold text-white/80 mb-3">Elementos disponibles</h5>
        {loading ? (
          <div className="text-white/70 text-center py-8">{loadingText}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-white/70 text-center py-8">
            {searchTerm ? 'No se encontraron resultados' : emptyText}
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.includes(item.name);
              const isDisabled = !isSelected && isMaxSelectionsReached;
              
              return (
                <div
                  key={item.id}
                  onClick={() => !isDisabled && onToggle(item.name)}
                  className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
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
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {item.name}
                      </span>
                      
                      {showPriority && item.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de elementos seleccionados (con drag & drop) */}
      {hasSelections && (
        <div>
          <h5 className="text-sm font-semibold text-white/80 mb-3">
            Elementos seleccionados (arrastra para reordenar)
          </h5>
          <div className="space-y-2">
            {orderedSelectedItems.map((itemName, index) => {
              const item = items.find(i => i.name === itemName);
              if (!item) return null;
              
              return (
                <div
                  key={itemName}
                  draggable
                  onDragStart={(e) => handleDragStart(e, itemName)}
                  onDragOver={(e) => handleDragOver(e, itemName)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, itemName)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-move ${
                    draggedItem === itemName
                      ? 'bg-blue-500/30 border-blue-500/70 opacity-50'
                      : dragOverItem === itemName
                      ? 'bg-blue-500/10 border-blue-500/50'
                      : 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    <span className="text-sm text-white/60 font-mono">#{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{item.name}</span>
                      
                      {showPriority && item.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-white/80">{item.description}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onToggle(itemName)}
                    className="text-white/60 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
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

export default DragDropSelection;
