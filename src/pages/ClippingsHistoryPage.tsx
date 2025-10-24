import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ClippingItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
import { Button } from '../components/ui/button';
import '../styles/history.css';
import '../styles/upload-news.css';

// Interfaz para paginación
interface PaginationInfo {
  page: number;
  limit: number;
  count: number;
  total_pages: number;
}

export default function ClippingsHistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [clippings, setClippings] = useState<ClippingItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Función para cargar clippings
  const loadClippings = async () => {
    setLoading(true);
    try {
      const response = await apiService.getClippings({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined
      });
      setClippings(response.clippings);
      setPagination(response.pagination);
      
    } catch (error) {
      console.error('Error cargando clippings:', error);
      setErrorMessage('Error al cargar el historial de clippings');
    } finally {
      setLoading(false);
    }
  };

  // Cargar clippings al montar el componente y cuando cambien los filtros
  useEffect(() => {
    loadClippings();
  }, [currentPage, pageSize, searchTerm]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar cambios de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar dropdown
  const toggleDropdown = (clippingId: number) => {
    setOpenDropdown(openDropdown === clippingId ? null : clippingId);
  };

  const handleGenerateReport = (clippingId: number, type: 'informe' | 'metricas') => {
    console.log(`Generar ${type} para clipping:`, clippingId);
    setOpenDropdown(null);
    // TODO: Implementar generación de informe o métricas
  };

  // Manejar cambios de tamaño de página
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset a la primera página
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset a la primera página
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para eliminar clipping
  const deleteClipping = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este clipping?')) {
      return;
    }

    try {
      await apiService.deleteClipping(id);
      setClippings(clippings.filter(c => c.id !== id));
      setSuccessMessage('Clipping eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando clipping:', error);
      setErrorMessage('Error al eliminar el clipping');
    }
  };

  return (
    <div className="history-container px-6">
      {/* Header de la página */}
      <div className="upload-news-header">
        <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Historial de Clippings</h1>
        <p className="upload-news-subtitle">
          Revisa todos los clippings que han sido generados por el sistema
        </p>
      </div>

      {/* Filtros y métricas */}
      <div className="upload-news-panel history-filters-panel">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
          <h3 className="upload-news-section-title flex-shrink-0">Filtros de búsqueda</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Búsqueda */}
            <div className="history-filter-group flex-1">
              <input
                type="text"
                placeholder="🔍 Buscar por título o tema..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="history-filter-input"
              />
            </div>

            {/* Botón de filtros (TODO: implementar filtros avanzados) */}
            <div className="history-filter-group flex-shrink-0">
              <Button
                variant="outline"
                size="default"
                icon="Search"
                onClick={() => alert('TODO: Implementar filtros avanzados (fecha, tema, etc.)')}
              >
                Filtrar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clippings */}
      <div className="upload-news-panel">
        {loading ? (
          <div className="history-loading">
            <div className="history-loading-spinner"></div>
            <p className="text-white/70 mt-4">Cargando clippings...</p>
          </div>
        ) : (
          <>
            {/* Tabla de clippings */}
            <div className="history-table-container" style={{ overflowX: 'auto' }}>
              <table className="history-table" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tema</th>
                    <th>Período</th>
                    <th>Noticias</th>
                    <th>Creador</th>
                    <th>Editor</th>
                    <th>Creación</th>
                    <th>Edición</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clippings.map((clipping) => (
                    <tr key={clipping.id}>
                      <td>
                        <div className="history-news-title">{clipping.name}</div>
                      </td>
                      <td>
                        <span className="history-topic-badge">
                          {clipping.topic.name}
                        </span>
                      </td>
                      <td>
                        <div className="history-news-date" style={{ lineHeight: '1.2', whiteSpace: 'normal' }}>
                          <div>{formatDate(clipping.start_date)}</div>
                          <div>a {formatDate(clipping.end_date)}</div>
                        </div>
                      </td>
                      <td>
                        <div className="history-news-count">
                          {clipping.news_ids.length} noticias
                        </div>
                      </td>
                      <td>
                        <div className="history-table-cell-content">
                          {clipping.creator?.name || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="history-table-cell-content">
                          {clipping.reviewer?.name || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="history-news-date">
                          {formatDate(clipping.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="history-news-date">
                          {formatDate(clipping.updated_at)}
                        </div>
                      </td>
                      <td>
                        <div className="history-actions" style={{ display: 'flex', gap: '2px', flexWrap: 'nowrap' }}>
                          <Button
                            onClick={() => {
                              // TODO: Implementar edición
                              console.log('Editar:', clipping.id);
                            }}
                            variant="ghost"
                            size="icon"
                            icon="Edit"
                            title="Editar"
                          />
                          <Button
                            onClick={() => deleteClipping(clipping.id)}
                            variant="ghost"
                            size="icon"
                            icon="Delete"
                            title="Eliminar"
                          />
                          <div className="relative" ref={dropdownRef}>
                            <Button
                              onClick={() => toggleDropdown(clipping.id)}
                              variant="ghost"
                              size="icon"
                              icon="Generate"
                              title="Generar informe y métricas"
                            />
                            
                            {openDropdown === clipping.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                                <Button
                                  onClick={() => handleGenerateReport(clipping.id, 'informe')}
                                  variant="ghost"
                                  size="sm"
                                  icon="FileText"
                                  className="w-full justify-start px-4 py-2 text-sm first:rounded-t-lg"
                                >
                                  Ver informe
                                </Button>
                                <Button
                                  onClick={() => handleGenerateReport(clipping.id, 'metricas')}
                                  variant="ghost"
                                  size="sm"
                                  icon="Sparkles"
                                  className="w-full justify-start px-4 py-2 text-sm last:rounded-b-lg"
                                >
                                  Ver métricas
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Estado vacío */}
            {clippings.length === 0 && !loading && (
              <div className="history-empty">
                <div className="history-empty-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron clippings</h3>
                <p className="text-white/70 mb-6">
                  {searchTerm ? `No hay clippings que coincidan con "${searchTerm}"` : 'No hay clippings generados aún'}
                </p>
                <Button
                  onClick={() => navigate('/create-clipping')}
                  variant="primary"
                  size="default"
                  icon="Plus"
                >
                  Crear Primer Clipping
                </Button>
              </div>
            )}

            {/* Controles de paginación */}
            {(pagination || clippings.length > 0) && (
              <div className="history-pagination">
                <div className="history-pagination-container">
                  {/* Selector de tamaño de página */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={pageSize} 
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-white font-medium">por página</span>
                  </div>

                  {/* Información de paginación */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/70">
                      {pagination ? (
                        `Mostrando ${((pagination.page - 1) * pageSize) + 1} a ${Math.min(pagination.page * pageSize, pagination.count)} de ${pagination.count} resultados`
                      ) : (
                        `Mostrando ${clippings.length} resultados`
                      )}
                    </span>
                    
                    {/* Navegación de páginas */}
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                        disabled={!pagination || pagination.page <= 1}
                        variant="outline"
                        size="icon"
                        title="Página anterior"
                      >
                        ←
                      </Button>
                      
                      <span className="text-sm text-white font-medium px-2">
                        Página {pagination?.page || 1} de {pagination?.total_pages || 1}
                      </span>
                      
                      <Button 
                        onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                        disabled={!pagination || pagination.page >= pagination.total_pages}
                        variant="outline"
                        size="icon"
                        title="Página siguiente"
                      >
                        →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Snackbar para mensajes */}
      <Snackbar
        message={successMessage || errorMessage}
        variant={successMessage ? 'success' : 'error'}
        isOpen={!!(successMessage || errorMessage)}
        onClose={() => {
          setSuccessMessage('');
          setErrorMessage('');
        }}
      />
    </div>
  );
}

