import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LoadingState } from '../components/ui/loading-spinner';
import { LoadingModal } from '../components/ui/loading-modal';
import { useClippingReport } from '../hooks/useClippingReport';
import { apiService, type ClippingItem } from '../services/api';
import Snackbar from '../components/common/Snackbar';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function ClippingReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [clipping, setClipping] = useState<ClippingItem | null>(null);
  const [loadingClipping, setLoadingClipping] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const {
    report,
    loading,
    error: reportError,
    isGenerating,
    generateReport,
    getReport,
    updateReport,
    downloadPdf
  } = useClippingReport(parseInt(id || '0'));

  useEffect(() => {
    if (id) {
      loadClipping();
    }
  }, [id]);

  useEffect(() => {
    if (clipping) {
      // Si el clipping tiene reporte, cargarlo; si no, generarlo automáticamente
      if (clipping.has_report) {
        getReport();
      } else {
        generateReport();
      }
    }
  }, [clipping]);

  useEffect(() => {
    if (report?.content) {
      setEditedContent(report.content);
    }
  }, [report]);

  const loadClipping = async () => {
    if (!id) return;
    
    setLoadingClipping(true);
    try {
      const clippingId = parseInt(id);
      const clippingData = await apiService.getClipping(clippingId);
      setClipping(clippingData);
    } catch (error) {
      console.error('Error cargando clipping:', error);
      setErrorMessage('Error al cargar el clipping. Por favor, intenta nuevamente.');
    } finally {
      setLoadingClipping(false);
    }
  };

  const handleSave = async () => {
    if (!report) return;
    
    try {
      await updateReport(editedContent);
      setIsEditing(false);
      setSuccessMessage('Reporte actualizado exitosamente');
    } catch (error) {
      setErrorMessage('Error al actualizar el reporte');
    }
  };


  const handleDownloadPdf = async () => {
    try {
      setShowDownloadModal(true);
      const success = await downloadPdf(`reporte-clipping-${id}.pdf`);
      setShowDownloadModal(false);
      if (success) {
        setSuccessMessage('PDF descargado exitosamente');
      } else {
        setErrorMessage('Error al descargar el PDF');
      }
    } catch (error) {
      setShowDownloadModal(false);
      setErrorMessage('Error al descargar el PDF');
    }
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loadingClipping) {
    return (
      <div className="history-container px-6">
        <div className="upload-news-header">
          <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Cargando...</h1>
        </div>
        <div className="upload-news-panel">
          <LoadingState 
            title="Cargando información del clipping..."
            variant="simple"
            size="lg"
          />
        </div>
      </div>
    );
  }

  if (!clipping) {
    return (
      <div className="history-container px-6">
        <div className="upload-news-header">
          <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Clipping no encontrado</h1>
        </div>
        <div className="upload-news-panel">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="text-red-400 text-lg">El clipping solicitado no existe</div>
            <Button onClick={() => navigate('/clippings-history')} variant="outline">
              Volver al Historial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container px-6">
      {/* Header de la página */}
      <div className="upload-news-header">
        <div className="flex items-center justify-start mb-4">
          <Button onClick={() => navigate(`/clipping/${id}`)} variant="outline" size="sm">
            ← Volver al Detalle
          </Button>
        </div>
        <div className="text-center mb-4">
          <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">
            Reporte: {clipping.name}
          </h1>
          <p className="upload-news-subtitle text-sm mt-2">
            {formatDateOnly(clipping.start_date)} - {formatDateOnly(clipping.end_date)}
          </p>
        </div>
      </div>

      {/* Contenido del reporte */}
      <div className="upload-news-panel">
        {loading && !isGenerating ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
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
              <p className="text-white/70 mt-4">Cargando reporte...</p>
            </div>
          </div>
        ) : reportError ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-4">Error al generar el reporte</div>
              <div className="text-white/70 mb-4">{reportError}</div>
              <Button onClick={() => generateReport()} variant="primary">
                Reintentar
              </Button>
            </div>
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* Botones de acción en la parte superior derecha - solo cuando no está editando */}
            {!isEditing && (
              <div className="flex justify-end gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon="Edit"
                  onClick={() => setIsEditing(true)}
                  title="Editar reporte"
                >
                  Editar
                </Button>
                
                <Button
                  variant="success"
                  size="sm"
                  icon="FileText"
                  onClick={handleDownloadPdf}
                >
                  Descargar PDF
                </Button>
              </div>
            )}

            {/* Contenido del reporte */}
            <div className="min-h-[400px]">
              {isEditing ? (
                <textarea
                  className="w-full h-96 bg-slate-700/50 text-white p-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Escribe el contenido del reporte en Markdown..."
                />
              ) : (
                <div className="markdown-container" style={{
                  padding: '2rem',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  textAlign: 'justify',
                }}>
                  <MarkdownPreview 
                    source={report.content}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'justify',
                    }}
                    data-color-mode="dark"
                    wrapperElement={{
                      'data-color-mode': 'dark',
                      style: {
                        backgroundColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                    components={{
                      ul: ({ children, ...props }) => (
                        <ul style={{ 
                          listStyleType: 'disc', 
                          paddingLeft: '1.5rem',
                          margin: '0.5rem 0'
                        }} {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol style={{ 
                          listStyleType: 'decimal', 
                          paddingLeft: '1.5rem',
                          margin: '0.5rem 0'
                        }} {...props}>
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li style={{ 
                          margin: '0.25rem 0',
                          display: 'list-item'
                        }} {...props}>
                          {children}
                        </li>
                      ),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Mini footer con información del reporte */}
            <div className="border-t border-white/10 pt-4 mt-6">
              <div className="flex items-center justify-between text-xs text-white/60">
                <div>
                  <span>Creado: {formatDateOnly(report.created_at)}</span>
                </div>
                <div className="flex items-center gap-4">
                  {report.creator && <span>Autor: {report.creator.name}</span>}
                  {report.manually_edited && report.reviewer && (
                    <span>Editado por: {report.reviewer.name}</span>
                  )}
                  {report.metadata?.modelo_ia && (
                    <span>IA: {report.metadata.modelo_ia}</span>
                  )}
                </div>
              </div>
              
              {/* Botones de edición debajo de la información del autor */}
              {isEditing && (
                <div className="flex justify-end gap-3" style={{ paddingTop: '2rem' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="X"
                    onClick={() => {
                      setEditedContent(report.content);
                      setIsEditing(false);
                    }}
                    title="Cancelar edición"
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    variant="success"
                    size="sm"
                    icon="Save"
                    onClick={handleSave}
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-white/70 text-lg">No hay reporte disponible</div>
              <Button onClick={() => generateReport()} variant="primary" className="mt-4">
                Generar Reporte
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Snackbars */}
      {successMessage && (
        <Snackbar
          message={successMessage}
          isOpen={true}
          variant="success"
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <Snackbar
          message={errorMessage}
          isOpen={true}
          variant="error"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Modal de descarga */}
      <LoadingModal
        isOpen={showDownloadModal}
        title="Generando PDF"
        description="Estamos preparando el archivo PDF para descarga. Esto puede tomar unos segundos..."
        variant="ai"
        size="lg"
        closable={false}
        icon={
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9h4v4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13h4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17h4" />
          </svg>
        }
      />

      {/* Modal de carga del reporte */}
      <LoadingModal
        isOpen={isGenerating}
        title="Generando reporte con IA"
        description="Estamos analizando las noticias del clipping y creando un informe detallado. Esto puede tomar unos segundos..."
        variant="ai"
        size="lg"
        closable={false}
      />
    </div>
  );
}
