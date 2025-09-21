import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import '../styles/history.css';

export default function HistoryPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Hook para obtener las noticias
  const { news: newsHistory, loading: isLoading } = useNews({ limit: 100 });

  // Filtrar noticias basado en estado y término de búsqueda
  const filteredNews = newsHistory.filter(news => {
    const matchesStatus = filterStatus === 'all'; // La nueva API no tiene status
    const matchesSearch = searchTerm === '' || 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.media.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (news.topic?.name && news.topic.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });




  return (
    <div className="history-container">
      {/* Header de la página */}
      <div className="history-header">
        <h1 className="history-title">Historial de Noticias Procesadas</h1>
        <p className="history-subtitle">
          Revisa todas las noticias que han sido procesadas por el sistema
        </p>
      </div>

            {/* Filtros y búsqueda mejorados */}
            <div className="history-filters">
              <div className="history-filters-grid">
                {/* Búsqueda */}
                <div className="history-filter-group">
                  <label className="history-filter-label">
                    🔍 Buscar noticias
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por título, fuente, tema o mención..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="history-filter-input"
                  />
                </div>

                {/* Filtro por estado */}
                <div className="history-filter-group">
                  <label className="history-filter-label">
                    📊 Estado de procesamiento
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="history-filter-select"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="processed">Procesado</option>
                    <option value="pending">Pendiente</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                {/* Estadísticas mejoradas */}
                <div className="history-stats">
                  <div className="history-stat-item">
                    <div className="history-stat-value">{newsHistory.length}</div>
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
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Medio</th>
                        <th>Sección</th>
                        <th>Autor</th>
                        <th>Tema</th>
                        <th>Valoración</th>
                        <th>Crisis</th>
                        <th>Menciones</th>
                        <th>Link</th>
                        <th>Estado</th>
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
                              {item.publication_type || '-'}
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
                              {item.topic?.name || 'Sin tema'}
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
                                : 'history-badge-neutral'
                            }`}>
                              {item.valuation || 'Sin valoración'}
                            </span>
                          </td>
                          <td>
                            {item.crisis ? (
                              <span className="history-badge history-badge-crisis">
                                ⚠️ Crisis
                              </span>
                            ) : (
                              <span className="text-white/50">-</span>
                            )}
                          </td>
                          <td>
                            <div className="history-table-cell-content">
                              {item.mentions.slice(0, 2).map((mention, index) => (
                                <span key={index} className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs mr-1 mb-1">
                                  {mention.name}
                                </span>
                              ))}
                              {item.mentions.length > 2 && (
                                <span className="text-white/50 text-xs">+{item.mentions.length - 2}</span>
                              )}
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
                            <span className="history-badge history-badge-processed">
                              ✓ Procesada
                            </span>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium">No se encontraron noticias</div>
                  <div className="text-sm mt-2">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay noticias en el historial'}
                  </div>
                </div>
              )}
            </div>

            {/* Paginación mejorada */}
            {!isLoading && filteredNews.length > 0 && (
              <div className="history-pagination">
                <div className="history-pagination-container">
                  <button className="history-pagination-button" disabled>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="history-pagination-info">Página 1 de 1</span>
                  <button className="history-pagination-button" disabled>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
    </div>
  );
} 