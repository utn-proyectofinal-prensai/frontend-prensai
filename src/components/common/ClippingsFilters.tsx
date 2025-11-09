import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/button';

interface ClippingsFiltersProps {
  topics: Array<{ id: number; name: string }>;
  onApplyFilters: (filters: {
    topic_id?: number;
    start_date?: string;
    end_date?: string;
  }) => void;
  onClearFilters: () => void;
  currentFilters: {
    topic_id?: number;
    start_date?: string;
    end_date?: string;
  };
}

export default function ClippingsFilters({
  topics,
  onApplyFilters,
  onClearFilters,
  currentFilters
}: ClippingsFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    topic_id: currentFilters.topic_id || '',
    start_date: currentFilters.start_date || '',
    end_date: currentFilters.end_date || ''
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);
  const isApplyingFilters = useRef(false);
  const prevLocalFilters = useRef(localFilters);

  // No aplicar fechas por defecto - los clippings pueden tener rangos amplios

  // Sincronizar localFilters con currentFilters cuando cambian desde fuera
  useEffect(() => {
    // Solo sincronizar si no estamos aplicando filtros (para evitar loops)
    if (!isApplyingFilters.current) {
      setLocalFilters({
        topic_id: currentFilters.topic_id || '',
        start_date: currentFilters.start_date || '',
        end_date: currentFilters.end_date || ''
      });
    }
  }, [currentFilters]);

  const handleApply = useCallback(() => {
    isApplyingFilters.current = true;
    
    const filters: any = {};
    // Solo agregar filtros que tengan valor (no vacíos, null, undefined, "Todos" o "Todas")
    const isEmptyValue = (val: any) => !val || val === '' || val === 'Todos' || val === 'Todas';
    
    // Solo enviar fechas si tienen valor (no aplicar por defecto)
    if (!isEmptyValue(localFilters.start_date)) {
      filters.start_date = localFilters.start_date;
    }
    if (!isEmptyValue(localFilters.end_date)) {
      filters.end_date = localFilters.end_date;
    }
    
    if (!isEmptyValue(localFilters.topic_id)) {
      const topicId = Number(localFilters.topic_id);
      if (!isNaN(topicId) && topicId > 0) {
        filters.topic_id = topicId;
      }
    }
    
    onApplyFilters(filters);
    
    // Resetear el flag después de un breve delay
    setTimeout(() => {
      isApplyingFilters.current = false;
    }, 100);
  }, [localFilters, onApplyFilters]);

  const handleFilterChange = (key: string, value: string | number) => {
    // Si el valor es vacío, "Todos" o "Todas", limpiar el filtro
    const cleanValue = (value === '' || value === 'Todos' || value === 'Todas') ? '' : value;
    setLocalFilters(prev => ({ ...prev, [key]: cleanValue }));
  };

  // Aplicar filtros automáticamente cuando cambian
  useEffect(() => {
    // No aplicar en el montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevLocalFilters.current = localFilters;
      return;
    }

    // Solo aplicar si los filtros realmente cambiaron (comparar con el valor anterior)
    const hasChanged = 
      prevLocalFilters.current.topic_id !== localFilters.topic_id ||
      prevLocalFilters.current.start_date !== localFilters.start_date ||
      prevLocalFilters.current.end_date !== localFilters.end_date;

    if (!hasChanged) {
      return;
    }

    // Actualizar la referencia
    prevLocalFilters.current = localFilters;

    // Limpiar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Aplicar inmediatamente (no hay campos de texto con debounce)
    const delay = 0;

    debounceTimer.current = setTimeout(() => {
      handleApply();
    }, delay);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localFilters, handleApply]);

  const handleClear = () => {
    setLocalFilters({
      topic_id: '',
      start_date: '',
      end_date: ''
    });
    // Limpiar todos los filtros usando la función del padre
    onClearFilters();
  };

  // Función para eliminar un filtro individual
  const handleRemoveFilter = (filterKey: string) => {
    const newFilters = { ...currentFilters };
    delete newFilters[filterKey as keyof typeof newFilters];
    
    setLocalFilters({
      topic_id: newFilters.topic_id || '',
      start_date: newFilters.start_date || '',
      end_date: newFilters.end_date || ''
    });
    
    onApplyFilters(newFilters);
  };

  // Obtener el nombre del tema para mostrar
  const getTopicName = (topicId: number) => {
    return topics.find(t => t.id === topicId)?.name || `Tema #${topicId}`;
  };

  const activeFilters = Object.entries(currentFilters)
    .filter(([key, value]) => {
      // Excluir valores vacíos, undefined y fechas (nunca mostrar fechas en filtros aplicados)
      if (value === undefined || value === '') return false;
      // No mostrar fechas nunca
      if (key === 'start_date' || key === 'end_date') {
        return false;
      }
      return true;
    })
    .map(([key, value]) => {
      let label = '';
      let displayValue = '';

      switch (key) {
        case 'topic_id':
          label = 'Tema';
          displayValue = getTopicName(value as number);
          break;
        default:
          label = key;
          displayValue = String(value);
      }

      return { key, label, displayValue };
    });

  return (
    <div>
      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white/70 mr-2">Filtros activos:</span>
            {activeFilters.map(({ key, label, displayValue }) => (
              <div
                key={key}
                className="inline-flex items-center gap-2 pr-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-sm text-white"
                style={{ paddingLeft: '1.25rem' }}
              >
                <span className="font-medium text-blue-200">{label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleRemoveFilter(key)}
                  className="ml-1 hover:bg-blue-400/30 rounded-full p-0.5 transition-colors"
                  title={`Eliminar filtro ${label}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {activeFilters.length > 1 && (
              <button
                onClick={handleClear}
                className="text-sm text-blue-300 hover:text-blue-200 underline transition-colors"
              >
                Limpiar todos
              </button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg p-4" style={{ paddingTop: '0.75rem' }}>
        {/* Filtros - siempre visibles en la misma línea */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Contenedor izquierdo: Filtros */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Filtro por Período Desde */}
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }}>
              <label className="text-sm font-medium whitespace-nowrap date-filter-label">
                Período desde
              </label>
              <input
                type="date"
                value={localFilters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="history-filter-input flex-1"
                placeholder="Inicio del clipping"
              />
            </div>

            {/* Filtro por Período Hasta */}
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }}>
              <label className="text-sm font-medium whitespace-nowrap date-filter-label">
                Período hasta
              </label>
              <input
                type="date"
                value={localFilters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="history-filter-input flex-1"
                min={localFilters.start_date || undefined}
                placeholder="Fin del clipping"
              />
            </div>

            {/* Filtro por Tema */}
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }}>
              <label className="text-sm font-medium whitespace-nowrap date-filter-label">
                Tema
              </label>
              <select
                value={localFilters.topic_id}
                onChange={(e) => handleFilterChange('topic_id', e.target.value)}
                className="history-filter-input flex-1"
              >
                <option value="">Todos los temas</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contenedor derecho: Botón de limpiar */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Button
              variant="secondary"
              size="default"
              onClick={handleClear}
              className="h-[2.75rem]"
            >
              Limpiar todos los filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

