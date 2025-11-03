import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ClippingItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { EditClippingModal, ClippingReportButton } from '../components/common';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
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

  // Estados para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clippingToDelete, setClippingToDelete] = useState<ClippingItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [clippingToEdit, setClippingToEdit] = useState<ClippingItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Función para cargar clippings
  const loadClippings = async () => {
    setLoading(true);
    try {
      const response = await apiService.getClippings({
        page: currentPage,
        limit: pageSize,
        // El filtro por texto se realiza en el frontend
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
  }, [currentPage, pageSize]);

  // Filtro de frontend por título o tema
  const visibleClippings = useMemo(() => {
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return clippings;
    return clippings.filter((c) => {
      const title = (c.name || '').toLowerCase();
      const topic = (c.topic?.name || '').toLowerCase();
      return title.includes(term) || topic.includes(term);
    });
  }, [clippings, searchTerm]);

  // Efecto para cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Solo cerrar si el click no es en un botón del dropdown
      const target = event.target as HTMLElement;
      const isDropdownButton = target.closest('[data-dropdown-button]');
      const isDropdownContent = target.closest('[data-dropdown-content]');
      
      if (!isDropdownButton && !isDropdownContent && openDropdown) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      // Usar un pequeño delay para evitar cerrar inmediatamente
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdown]);


  // Manejar cambios de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // Manejar eliminación de clipping
  const handleDeleteClipping = (clipping: ClippingItem) => {
    setClippingToDelete(clipping);
    setShowDeleteModal(true);
  };

  const confirmDeleteClipping = async () => {
    if (!clippingToDelete) return;

    setIsDeleting(true);
    try {
      await apiService.deleteClipping(clippingToDelete.id);
      
      // Recargar todo el listado de clippings
      await loadClippings();
      
      setSuccessMessage(`Clipping "${clippingToDelete.name}" eliminado exitosamente`);
      setShowDeleteModal(false);
      setClippingToDelete(null);
      
    } catch (error) {
      console.error('Error eliminando clipping:', error);
      setErrorMessage('Error al eliminar el clipping. Por favor, intenta nuevamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteClipping = () => {
    setShowDeleteModal(false);
    setClippingToDelete(null);
  };

  // Manejar edición de clipping
  const handleEditClipping = (clipping: ClippingItem) => {
    setClippingToEdit(clipping);
    setShowEditModal(true);
  };

  const handleUpdateClipping = async (updatedData: Partial<ClippingItem>) => {
    if (!clippingToEdit) return;

    setIsUpdating(true);
    try {
      await apiService.updateClipping(clippingToEdit.id, updatedData);
      
      // Recargar todo el listado de clippings
      await loadClippings();
      
      setSuccessMessage(`Clipping "${updatedData.name || clippingToEdit.name}" actualizado exitosamente`);
      setShowEditModal(false);
      setClippingToEdit(null);
      
    } catch (error) {
      console.error('Error actualizando clipping:', error);
      setErrorMessage('Error al actualizar el clipping. Por favor, intenta nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEditClipping = () => {
    setShowEditModal(false);
    setClippingToEdit(null);
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


  return (
    <div className="history-container px-6">
      {/* Header de la página */}
      <PageHeader
        title="Historial de Clippings"
        description="Revisa todos los clippings que has generado en el sistema"
      />

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
                variant="primary"
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
            <div className="relative inline-flex items-center justify-center">
              <div className="history-loading-spinner" style={{ 
                width: '4rem', 
                height: '4rem',
                borderWidth: '4px',
                borderTopColor: 'rgb(59, 130, 246)',
                borderRightColor: 'rgba(59, 130, 246, 0.3)',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
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
                  {visibleClippings.map((clipping) => (
                    <tr key={clipping.id}>
                      <td>
                        <div className="history-news-title">{clipping.name}</div>
                      </td>
                      <td>
                        <span className="history-topic-badge">
                          {clipping.topic?.name || '-'}
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
                            onClick={() => handleEditClipping(clipping)}
                            variant="ghost"
                            size="icon"
                            icon="Edit"
                            title="Editar"
                          />
                          <Button
                            onClick={() => handleDeleteClipping(clipping)}
                            variant="ghost"
                            size="icon"
                            icon="Delete"
                            title="Eliminar"
                          />
                          <ClippingReportButton
                            clippingId={clipping.id}
                            hasReport={clipping.has_report}
                            variant="ghost"
                            size="icon"
                          />
                          <Button
                            onClick={() => navigate(`/clipping/${clipping.id}`)}
                            variant="ghost"
                            size="icon"
                            icon="Eye"
                            title="Ver métricas"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Estado vacío */}
            {visibleClippings.length === 0 && !loading && (
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
            {(pagination || visibleClippings.length > 0) && (
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

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteClipping}
        onConfirm={confirmDeleteClipping}
        title="Eliminar Clipping"
        message={`¿Estás seguro de que deseas eliminar el clipping "${clippingToDelete?.name}" y sus reportes?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Modal de edición de clipping */}
      <EditClippingModal
        clipping={clippingToEdit}
        isOpen={showEditModal}
        isSaving={isUpdating}
        onClose={cancelEditClipping}
        onSave={handleUpdateClipping}
      />
    </div>
  );
}

