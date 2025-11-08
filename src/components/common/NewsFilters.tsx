import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/button';

interface NewsFiltersProps {
  topics: Array<{ id: number; name: string }>;
  onApplyFilters: (filters: {
    topic_id?: number;
    start_date?: string;
    end_date?: string;
    publication_type?: string;
    valuation?: string;
  }) => void;
  onClearFilters: () => void;
  currentFilters: {
    topic_id?: number;
    start_date?: string;
    end_date?: string;
    publication_type?: string;
    valuation?: string;
  };
}

export default function NewsFilters({
  topics,
  onApplyFilters,
  onClearFilters,
  currentFilters
}: NewsFiltersProps) {
  // Calcular fecha por defecto: dos meses atrás
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);
    return date.toISOString().split('T')[0];
  };

  // Fecha de fin por defecto: hoy
  const getDefaultEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [localFilters, setLocalFilters] = useState({
    topic_id: currentFilters.topic_id || '',
    start_date: currentFilters.start_date || getDefaultStartDate(),
    end_date: currentFilters.end_date || getDefaultEndDate(),
    publication_type: currentFilters.publication_type || '',
    valuation: currentFilters.valuation || ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);
  const isApplyingFilters = useRef(false);

  // Aplicar fechas por defecto al montar el componente si no hay filtros
  useEffect(() => {
    if (isInitialMount.current && (!currentFilters.start_date || !currentFilters.end_date)) {
      const defaultStart = getDefaultStartDate();
      const defaultEnd = getDefaultEndDate();
      onApplyFilters({
        start_date: defaultStart,
        end_date: defaultEnd
      });
      isInitialMount.current = false;
    }
  }, []);

  // Sincronizar localFilters con currentFilters cuando cambian desde fuera
  useEffect(() => {
    // Solo sincronizar si no estamos aplicando filtros (para evitar loops)
    if (!isApplyingFilters.current) {
      setLocalFilters({
        topic_id: currentFilters.topic_id || '',
        start_date: currentFilters.start_date || getDefaultStartDate(),
        end_date: currentFilters.end_date || getDefaultEndDate(),
        publication_type: currentFilters.publication_type || '',
        valuation: currentFilters.valuation || ''
      });
    }
  }, [currentFilters]);

  const handleApply = useCallback(() => {
    isApplyingFilters.current = true;
    
    const filters: any = {};
    // Solo agregar filtros que tengan valor (no vacíos, null, undefined, "Todos" o "Todas")
    const isEmptyValue = (val: any) => !val || val === '' || val === 'Todos' || val === 'Todas';
    
    // Las fechas siempre se envían (tienen valores por defecto)
    filters.start_date = localFilters.start_date || getDefaultStartDate();
    filters.end_date = localFilters.end_date || getDefaultEndDate();
    
    if (!isEmptyValue(localFilters.topic_id)) {
      const topicId = Number(localFilters.topic_id);
      if (!isNaN(topicId) && topicId > 0) {
        filters.topic_id = topicId;
      }
    }
    if (!isEmptyValue(localFilters.publication_type)) {
      filters.publication_type = mapPublicationTypeToBackend(localFilters.publication_type);
    }
    if (!isEmptyValue(localFilters.valuation)) {
      filters.valuation = localFilters.valuation;
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

  const prevLocalFilters = useRef(localFilters);

  // Aplicar filtros automáticamente cuando cambian (con debounce para inputs de texto)
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
      prevLocalFilters.current.end_date !== localFilters.end_date ||
      prevLocalFilters.current.publication_type !== localFilters.publication_type ||
      prevLocalFilters.current.valuation !== localFilters.valuation;

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
      start_date: getDefaultStartDate(),
      end_date: getDefaultEndDate(),
      publication_type: '',
      valuation: ''
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
      end_date: newFilters.end_date || '',
      publication_type: newFilters.publication_type || '',
      valuation: newFilters.valuation || ''
    });
    
    onApplyFilters(newFilters);
  };

  // Obtener el nombre del tema para mostrar
  const getTopicName = (topicId: number) => {
    return topics.find(t => t.id === topicId)?.name || `Tema #${topicId}`;
  };

  // Obtener el label de valoración
  const getValuationLabel = (valuation: string) => {
    const labels: Record<string, string> = {
      positive: 'Positiva',
      neutral: 'Neutra',
      negative: 'Negativa'
    };
    return labels[valuation] || valuation;
  };

  // Mapear valores del frontend a valores del backend
  // El backend usa: 'Agenda', 'Entrevista', 'Declaración', 'Nota'
  const mapPublicationTypeToBackend = (type: string): string => {
    const mapping: Record<string, string> = {
      noticia: 'Nota',
      articulo: 'Declaración',
      entrevista: 'Entrevista',
      opinion: 'Agenda'
    };
    return mapping[type] || type;
  };

  // Obtener el label de tipo de publicación para mostrar en los chips
  const getPublicationTypeLabel = (type: string) => {
    // Si el tipo viene del backend (con mayúscula), mostrarlo tal cual
    if (['Agenda', 'Entrevista', 'Declaración', 'Nota'].includes(type)) {
      return type;
    }
    // Si viene del frontend (minúscula), mapearlo
    const labels: Record<string, string> = {
      noticia: 'Nota',
      articulo: 'Declaración',
      entrevista: 'Entrevista',
      opinion: 'Agenda'
    };
    return labels[type] || type;
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        case 'start_date':
          label = 'Desde';
          displayValue = formatDate(value as string);
          break;
        case 'end_date':
          label = 'Hasta';
          displayValue = formatDate(value as string);
          break;
        case 'publication_type':
          label = 'Tipo';
          displayValue = getPublicationTypeLabel(value as string);
          break;
        case 'valuation':
          label = 'Valoración';
          displayValue = getValuationLabel(value as string);
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
        {/* Filtros de fecha y controles - siempre visibles en la misma línea */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Contenedor izquierdo: Filtros de fecha */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Filtro por Fecha Desde */}
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }}>
              <label className="text-sm font-medium whitespace-nowrap date-filter-label">
                Fecha desde
              </label>
              <input
                type="date"
                value={localFilters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="history-filter-input flex-1"
              />
            </div>

            {/* Filtro por Fecha Hasta */}
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }}>
              <label className="text-sm font-medium whitespace-nowrap date-filter-label">
                Fecha hasta
              </label>
              <input
                type="date"
                value={localFilters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="history-filter-input flex-1"
                min={localFilters.start_date || undefined}
              />
            </div>
          </div>

          {/* Contenedor derecho: Botones */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Botón para mostrar/ocultar filtros avanzados */}
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              icon="ChevronDown"
              iconPosition="right"
              className={`whitespace-nowrap h-[2.75rem] ${showAdvancedFilters ? '[&_svg]:rotate-180' : ''}`}
            >
              {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
            </Button>

            {/* Botón de limpiar */}
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

        {/* Filtros avanzados - colapsables */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: '1rem' }}>
              {/* Filtro por Tema */}
              <div className="history-filter-group">
                <label className="block text-sm font-medium text-white mb-2">
                  Tema
                </label>
                <select
                  value={localFilters.topic_id}
                  onChange={(e) => handleFilterChange('topic_id', e.target.value)}
                  className="history-filter-input w-full"
                >
                  <option value="">Todos los temas</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo de Publicación */}
              <div className="history-filter-group">
                <label className="block text-sm font-medium text-white mb-2">
                  Tipo de Publicación
                </label>
                <select
                  value={localFilters.publication_type}
                  onChange={(e) => handleFilterChange('publication_type', e.target.value)}
                  className="history-filter-input w-full"
                >
                  <option value="">Todos</option>
                  <option value="noticia">Nota</option>
                  <option value="articulo">Declaración</option>
                  <option value="entrevista">Entrevista</option>
                  <option value="opinion">Agenda</option>
                </select>
              </div>

              {/* Filtro por Valoración */}
              <div className="history-filter-group">
                <label className="block text-sm font-medium text-white mb-2">
                  Valoración
                </label>
                <select
                  value={localFilters.valuation}
                  onChange={(e) => handleFilterChange('valuation', e.target.value)}
                  className="history-filter-input w-full"
                >
                  <option value="">Todas</option>
                  <option value="positive">Positiva</option>
                  <option value="neutral">Neutra</option>
                  <option value="negative">Negativa</option>
                </select>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

