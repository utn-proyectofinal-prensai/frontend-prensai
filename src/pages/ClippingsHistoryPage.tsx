import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ClippingItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { EditClippingModal } from '../components/common';
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
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    if (openDropdown === clippingId) {
      setOpenDropdown(null);
    } else {
      // Lógica simplificada: si hay pocas filas (menos de 3), mostrar hacia arriba
      if (clippings.length <= 2) {
        setDropdownDirection('up');
      } else {
        // Para más filas, detectar espacio disponible
        const buttonElement = document.querySelector(`[data-clipping-id="${clippingId}"]`) as HTMLElement;
        if (buttonElement) {
          const rect = buttonElement.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - rect.bottom;
          
          // Si hay menos de 200px de espacio abajo, mostrar hacia arriba
          if (spaceBelow < 200) {
            setDropdownDirection('up');
          } else {
            setDropdownDirection('down');
          }
        } else {
          setDropdownDirection('down');
        }
      }
      setOpenDropdown(clippingId);
    }
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

  const handleGenerateReport = async (clippingId: number, type: 'informe' | 'metricas') => {
    setOpenDropdown(null);
    
    try {
      if (type === 'informe') {
        // Generar o obtener reporte
        const report = await apiService.generateClippingReport(clippingId);
        console.log('Reporte generado:', report);
        
        // TODO: Mostrar el reporte en un modal o nueva página
        setSuccessMessage('Reporte generado exitosamente');
      } else if (type === 'metricas') {
        // Obtener métricas detalladas
        const metrics = await apiService.getClippingMetrics(clippingId);
        console.log('Métricas obtenidas:', metrics);
        
        // TODO: Mostrar las métricas en un modal o nueva página
        setSuccessMessage('Métricas obtenidas exitosamente');
      }
    } catch (error) {
      console.error(`Error generando ${type}:`, error);
      setErrorMessage(`Error al generar ${type}. Por favor, intenta nuevamente.`);
    }
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
                          <div className="relative" ref={dropdownRef}>
                            <Button
                              onClick={() => toggleDropdown(clipping.id)}
                              variant="ghost"
                              size="icon"
                              icon="Generate"
                              title="Generar informe y métricas"
                              data-clipping-id={clipping.id}
                            />
                            
                            {openDropdown === clipping.id && (
                              <div className={`absolute right-0 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 ${
                                dropdownDirection === 'up' 
                                  ? 'bottom-full mb-1 dropdown-up' 
                                  : 'top-full mt-1 dropdown-down'
                              }`}>
                                <Button
                                  onClick={() => handleGenerateReport(clipping.id, 'informe')}
                                  variant="ghost"
                                  size="sm"
                                  icon="FileText"
                                  className={`w-full justify-start px-4 py-2 text-sm ${
                                    dropdownDirection === 'up' 
                                      ? 'last:rounded-t-lg first:rounded-b-lg' 
                                      : 'first:rounded-t-lg last:rounded-b-lg'
                                  }`}
                                >
                                  Ver informe
                                </Button>
                                <Button
                                  onClick={() => handleGenerateReport(clipping.id, 'metricas')}
                                  variant="ghost"
                                  size="sm"
                                  icon="Sparkles"
                                  className={`w-full justify-start px-4 py-2 text-sm ${
                                    dropdownDirection === 'up' 
                                      ? 'first:rounded-t-lg last:rounded-b-lg' 
                                      : 'last:rounded-t-lg first:rounded-b-lg'
                                  }`}
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

