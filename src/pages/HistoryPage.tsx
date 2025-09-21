import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function HistoryPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Hook para obtener las noticias
  const { news: newsHistory, pagination, loading: isLoading } = useNews({ limit: 100 });

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="history-filter-input"
              />
            </div>

            {/* Filtro por estado */}
            <div className="history-filter-group flex-shrink-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="history-filter-select"
              >
                <option value="all">📊 Todos los estados</option>
                <option value="processed">Procesado</option>
                <option value="pending">Pendiente</option>
                <option value="error">Error</option>
              </select>
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
                        {item.valuation || 'Sin valoración'}
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

        {/* Paginación mejorada */}
        {filteredNews.length > 0 && (
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
    </div>
  );
}