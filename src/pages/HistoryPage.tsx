import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { useEnabledTopics } from '../hooks/useTopics';
import { useEnabledMentions } from '../hooks/useMentions';
import { apiService, type NewsItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
import { EditNewsModal } from '../components/common/EditNewsModal';
import NewsTable from '../components/common/NewsTable';
import { Button } from '../components/ui/button';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estados para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Hook para obtener las noticias
  const { news: newsHistory, pagination, loading: isLoading, setFilters, refetch } = useNews({ 
    page: currentPage,
    limit: pageSize
  });

  // Hooks para obtener temas y menciones
  const { topics: enabledTopics } = useEnabledTopics();
  const { mentions: enabledMentions } = useEnabledMentions();

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

  // Funciones para manejar la edición
  const handleEditNews = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingNews(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSaveNews = async (updatedData: Partial<NewsItem>) => {
    if (!editingNews) return;

    setIsSaving(true);
    setErrorMessage('');

    try {
      await apiService.updateNews(editingNews.id, {
        title: updatedData.title,
        publication_type: updatedData.publication_type,
        date: updatedData.date,
        support: updatedData.support,
        media: updatedData.media,
        section: updatedData.section,
        author: updatedData.author,
        interviewee: updatedData.interviewee || undefined,
        audience_size: updatedData.audience_size || undefined,
        quotation: updatedData.quotation || undefined,
        valuation: updatedData.valuation || undefined,
        political_factor: updatedData.political_factor || undefined,
        crisis: updatedData.crisis,
        topic_id: updatedData.topic?.id,
        mention_ids: updatedData.mentions?.map(m => m.id) || []
      });

      setSuccessMessage('Noticia actualizada exitosamente');
      handleCloseEditModal();
      
      // Refrescar la lista de noticias
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error('Error actualizando noticia:', error);
      setErrorMessage('Error al actualizar la noticia. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
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
              <Button
                variant="primary"
                size="default"
                icon="Search"
                onClick={() => alert('TODO: Implementar filtros avanzados (fecha, medio, tema, etc.)')}
              >
                Filtrar
              </Button>
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
          <NewsTable 
            news={filteredNews} 
            showEditButton={true}
            onEditNews={handleEditNews}
          />
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
                  <Button 
                    onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                    disabled={!pagination || pagination.page <= 1}
                    variant="outline"
                    size="icon"
                    title="Página anterior"
                  >
                    ‹
                  </Button>
                  
                  <span className="text-sm text-white px-3">
                    {pagination ? (
                      `Página ${pagination.page} de ${pagination.pages}`
                    ) : (
                      `Página 1 de 1`
                    )}
                  </span>
                  
                  <Button 
                    onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                    disabled={!pagination || pagination.page >= pagination.pages}
                    variant="outline"
                    size="icon"
                    title="Página siguiente"
                  >
                    ›
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && editingNews && (
        <EditNewsModal
          newsItem={editingNews}
          topics={enabledTopics}
          mentions={enabledMentions}
          isOpen={isEditModalOpen}
          isSaving={isSaving}
          onClose={handleCloseEditModal}
          onSave={handleSaveNews}
        />
      )}

      {/* Snackbars para feedback */}
      <Snackbar
        message={successMessage}
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        variant="success"
      />
      <Snackbar
        message={errorMessage}
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        variant="error"
      />
    </div>
  );
} 