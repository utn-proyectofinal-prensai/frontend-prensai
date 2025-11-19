import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { useTopics } from '../hooks/useTopics';
import { useEnabledMentions } from '../hooks/useMentions';
import { apiService, type NewsItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
import { EditNewsModal } from '../components/common/EditNewsModal';
import NewsTable from '../components/common/NewsTable';
import NewsFilters from '../components/common/NewsFilters';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Calcular fechas por defecto: nueve meses atrás hasta hoy
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 9);
    return date.toISOString().split('T')[0];
  };
  
  const getDefaultEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Estados para filtros avanzados - inicializar con fechas por defecto
  const [advancedFilters, setAdvancedFilters] = useState<{
    topic_id?: number;
    start_date?: string;
    end_date?: string;
    publication_type?: string;
    valuation?: string;
  }>({
    start_date: getDefaultStartDate(),
    end_date: getDefaultEndDate()
  });

  // Estados para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Hook para obtener las noticias
  const { news: newsHistory, pagination, loading: isLoading, setFilters, refetch } = useNews({ 
    page: currentPage,
    limit: pageSize,
    ...advancedFilters
  });

  // Hooks para obtener temas y menciones
  const { topics: enabledTopics } = useTopics();
  const { mentions: enabledMentions } = useEnabledMentions();

  // Manejar cambios de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters({ 
      page, 
      limit: pageSize,
      ...advancedFilters
    });
  };

  // Manejar cambios de tamaño de página
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset a la primera página
    setFilters({ 
      page: 1, 
      limit: newPageSize,
      ...advancedFilters
    });
  };

  // Manejar aplicación de filtros avanzados
  const handleApplyFilters = (filters: {
    topic_id?: number;
    media?: string;
    start_date?: string;
    end_date?: string;
    publication_type?: string;
    valuation?: string;
  }) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Reset a la primera página
    
    // Construir objeto de filtros explícitamente, solo incluyendo los que tienen valor
    const cleanFilters: any = {
      page: 1,
      limit: pageSize
    };
    
    // Solo agregar filtros que existan y tengan valor
    if (filters.topic_id !== undefined && filters.topic_id !== null) {
      cleanFilters.topic_id = filters.topic_id;
    }
    if (filters.media !== undefined && filters.media !== null && filters.media !== '') {
      cleanFilters.media = filters.media;
    }
    if (filters.start_date !== undefined && filters.start_date !== null && filters.start_date !== '') {
      cleanFilters.start_date = filters.start_date;
    }
    if (filters.end_date !== undefined && filters.end_date !== null && filters.end_date !== '') {
      cleanFilters.end_date = filters.end_date;
    }
    if (filters.publication_type !== undefined && filters.publication_type !== null && filters.publication_type !== '') {
      cleanFilters.publication_type = filters.publication_type;
    }
    if (filters.valuation !== undefined && filters.valuation !== null && filters.valuation !== '') {
      cleanFilters.valuation = filters.valuation;
    }
    
    setFilters(cleanFilters);
  };

  // Manejar limpieza de filtros avanzados
  const handleClearFilters = () => {
    // Siempre mantener las fechas por defecto
    const defaultFilters = {
      start_date: getDefaultStartDate(),
      end_date: getDefaultEndDate()
    };
    setAdvancedFilters(defaultFilters);
    setCurrentPage(1); // Reset a la primera página
    setFilters({
      page: 1,
      limit: pageSize,
      ...defaultFilters
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
      <div style={{ marginBottom: '0.75rem' }}>
        <PageHeader
          title="Historial de Noticias"
          description="Revisa todas las noticias que han sido procesadas por el sistema"
        />
      </div>

      {/* Filtros y métricas */}
      <div className="upload-news-panel history-filters-panel" style={{ marginBottom: '0.75rem' }}>
        {/* Filtros avanzados */}
        <NewsFilters
          topics={enabledTopics}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          currentFilters={advancedFilters}
        />
      </div>

      {/* Tabla de noticias mejorada */}
              {isLoading ? (
          <div className="history-table-container">
            <div className="history-loading">
              <div className="history-loading-spinner"></div>
              <p>Cargando historial de noticias...</p>
            </div>
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
              {Object.keys(advancedFilters).length > 0 ? 'No hay noticias que coincidan con los filtros aplicados' : 'No hay noticias procesadas aún'}
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
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <option value={5} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>5</option>
                  <option value={10} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>10</option>
                  <option value={20} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>20</option>
                  <option value={50} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>50</option>
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