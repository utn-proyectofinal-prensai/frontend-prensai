import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ClippingItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
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
              <button
                className="h-10 sm:h-11 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                onClick={() => alert('TODO: Implementar filtros avanzados (fecha, tema, etc.)')}
              >
                🔍 Filtrar
              </button>
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
                        <div className="history-news-title">{clipping.title}</div>
                      </td>
                      <td>
                        <span className="history-topic-badge">
                          {clipping.topic_name || `Tema ${clipping.topic_id}`}
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
                          {clipping.news_count} noticias
                        </div>
                      </td>
                      <td>
                        <div className="history-table-cell-content">
                          {clipping.created_by || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="history-table-cell-content">
                          {clipping.updated_by || '-'}
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
                          <button
                            onClick={() => {
                              // TODO: Implementar edición
                              console.log('Editar:', clipping.id);
                            }}
                            className="history-action-button history-action-edit"
                            title="Editar"
                            style={{ padding: '4px', minWidth: '28px', height: '28px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteClipping(clipping.id)}
                            className="history-action-button history-action-delete"
                            title="Eliminar"
                            style={{ padding: '4px', minWidth: '28px', height: '28px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <div className="relative" ref={dropdownRef}>
                            <button
                              onClick={() => toggleDropdown(clipping.id)}
                              className="history-action-button history-action-generate"
                              title="Generar informe y métricas"
                              style={{ padding: '4px', minWidth: '28px', height: '28px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </button>
                            
                            {openDropdown === clipping.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                                <button
                                  onClick={() => handleGenerateReport(clipping.id, 'informe')}
                                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 first:rounded-t-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Ver informe
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleGenerateReport(clipping.id, 'metricas')}
                                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 last:rounded-b-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Ver métricas
                                  </div>
                                </button>
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
                <button
                  onClick={() => navigate('/create-clipping')}
                  className="h-10 sm:h-11 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Primer Clipping
                </button>
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
                      <button 
                        onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                        disabled={!pagination || pagination.page <= 1}
                        className="history-pagination-button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <span className="text-sm text-white font-medium px-2">
                        Página {pagination?.page || 1} de {pagination?.total_pages || 1}
                      </span>
                      
                      <button 
                        onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                        disabled={!pagination || pagination.page >= pagination.total_pages}
                        className="history-pagination-button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
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

