import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hook para obtener las noticias
  const { news: newsHistory, pagination, loading: isLoading, setFilters } = useNews({ 
    page: currentPage,
    limit: pageSize
  });

  // Manejar cambios de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters({ 
      page, 
      limit: pageSize,
      search: searchTerm || undefined
    });
  };

  // Manejar cambios de tamaño de página
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset a la primera página
    setFilters({ 
      page: 1, 
      limit: newPageSize,
      search: searchTerm || undefined
    });
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset a la primera página
    setFilters({ 
      page: 1, 
      limit: pageSize,
      search: term || undefined
    });
  };

  // Los datos ya vienen filtrados y paginados del backend
  const filteredNews = newsHistory;

  return (
    <div className="history-container px-6">
      {/* Header de la página */}
      <div className="upload-news-header">
        <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Historial de Noticias Procesadas</h1>
        <p className="upload-news-subtitle">
          Revisa todas las noticias que han sido procesadas por el sistema
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
                placeholder="🔍 Buscar por título, fuente, tema o mención..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="history-filter-input"
                  />
                </div>

            {/* Botón de filtros (TODO: implementar filtros avanzados) */}
            <div className="history-filter-group flex-shrink-0">
              <button
                className="h-10 sm:h-11 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                onClick={() => alert('TODO: Implementar filtros avanzados (fecha, medio, tema, etc.)')}
              >
                🔍 Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas dentro del panel */}
        <div className="history-stats">
          <div className="history-stat-item">
            <div className="history-stat-value">{pagination?.count || 0}</div>
            <div className="history-stat-label">Total</div>
          </div>
          <div className="history-stat-item">
            <div className="history-stat-value">{filteredNews.length}</div>
            <div className="history-stat-label">Mostrando</div>
          </div>
          <div className="history-stat-item">
            <div className="history-stat-value">
              {newsHistory.filter(n => n.valuation === 'positive').length}
            </div>
            <div className="history-stat-label">Positivas</div>
                </div>
          <div className="history-stat-item">
            <div className="history-stat-value">
              {newsHistory.filter(n => n.crisis).length}
                </div>
            <div className="history-stat-label">Crisis</div>
                </div>
              </div>
            </div>

      {/* Tabla de noticias mejorada */}
      <div className="history-table-container">
              {isLoading ? (
          <div className="history-loading">
            <div className="history-loading-spinner"></div>
            <p>Cargando historial de noticias...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Medio</th>
                  <th>Tipo</th>
                  <th>Soporte</th>
                  <th>Sección</th>
                  <th>Autor</th>
                  <th>Entrevistado</th>
                  <th>Valoración</th>
                  <th>Crisis</th>
                  <th>Tema</th>
                  <th>Menciones</th>
                  <th>Factor Político</th>
                  <th>Audiencia</th>
                  <th>Presupuesto</th>
                  <th>Link</th>
                  <th>Creador</th>
                  <th>Revisor</th>
                  <th>Fecha de Creación</th>
                  <th>Última Actualización</th>
                      </tr>
                    </thead>
              <tbody>
                      {filteredNews.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="history-table-cell-content font-semibold">
                        {item.title}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.media}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.publication_type === 'REVISAR MANUAL' || !item.publication_type ? (
                          <span className="history-badge history-badge-warning">
                            {item.publication_type || 'Sin tipo'}
                          </span>
                        ) : (
                          item.publication_type
                        )}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.support || '-'}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.section || '-'}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.author || '-'}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.interviewee || '-'}
                            </div>
                          </td>
                    <td>
                      <span className={`history-badge ${
                              item.valuation === 'positive' 
                          ? 'history-badge-positive' 
                                : item.valuation === 'neutral'
                          ? 'history-badge-neutral'
                                : item.valuation === 'negative'
                          ? 'history-badge-negative'
                          : item.valuation === 'REVISAR MANUAL' || !item.valuation
                          ? 'history-badge-warning'
                          : 'history-badge-neutral'
                      }`}>
                        {item.valuation === 'positive' ? 'Positiva' :
                         item.valuation === 'negative' ? 'Negativa' :
                         item.valuation === 'neutral' ? 'Neutra' :
                         item.valuation === 'REVISAR MANUAL' ? 'Revisar manual' :
                         item.valuation || 'Sin valoración'}
                      </span>
                    </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.crisis ? (
                          <span className="text-red-400 font-semibold">SÍ</span>
                        ) : (
                          <span className="text-white font-semibold">NO</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.topic ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                              {item.topic.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/50">-</span>
                        )}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.mentions.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {item.mentions.map((mention, index) => (
                              <span key={index} className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                {mention.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white/50">-</span>
                        )}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.political_factor === 'REVISAR MANUAL' || !item.political_factor ? (
                          <span className="history-badge history-badge-warning">
                            {item.political_factor || 'Sin factor'}
                          </span>
                        ) : (
                          item.political_factor
                        )}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.audience_size ? item.audience_size.toLocaleString('es-AR') : '-'}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.quotation ? `$${item.quotation.toLocaleString('es-AR')}` : '-'}
                      </div>
                          </td>
                    <td>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="history-link"
                      >
                        Ver
                      </a>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.creator?.name || '-'}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {item.reviewer?.name || '-'}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                          </td>
                    <td>
                      <div className="history-table-cell-content">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredNews.length === 0 && !isLoading && (
          <div className="history-empty">
            <div className="history-empty-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
                  </div>
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron noticias</h3>
            <p className="text-white/70">
              {searchTerm ? `No hay noticias que coincidan con "${searchTerm}"` : 'No hay noticias procesadas aún'}
            </p>
                </div>
              )}

        {/* Controles de paginación */}
        {(pagination || newsHistory.length > 0) && (
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
                    `Mostrando ${newsHistory.length} resultados`
                  )}
                </span>
                
                {/* Navegación de páginas */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                    disabled={!pagination || pagination.page <= 1}
                    className="history-pagination-button"
                  >
                    ‹
                    </button>
                  
                  <span className="text-sm text-white px-3">
                    {pagination ? (
                      `Página ${pagination.page} de ${pagination.pages}`
                    ) : (
                      `Página 1 de 1`
                    )}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                    disabled={!pagination || pagination.page >= pagination.pages}
                    className="history-pagination-button"
                  >
                    ›
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 