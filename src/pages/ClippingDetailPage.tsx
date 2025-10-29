import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, type ClippingItem, type ClippingMetrics } from '../services/api';
import { Button } from '../components/ui/button';
import AdvancedMetricsCharts from '../components/common/AdvancedMetricsCharts';
import { ClippingReportButton } from '../components/common';
import Snackbar from '../components/common/Snackbar';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function ClippingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [clipping, setClipping] = useState<ClippingItem | null>(null);
  const [metrics, setMetrics] = useState<ClippingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadClippingDetail();
    }
  }, [id]);

  const loadClippingDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const clippingId = parseInt(id);
      
      // Cargar solo el clipping (las métricas están incluidas)
      const clippingData = await apiService.getClipping(clippingId);
      
      setClipping(clippingData);
      setMetrics((clippingData as any).metrics || {});
      
    } catch (error) {
      console.error('Error cargando detalle del clipping:', error);
      setError('Error al cargar los detalles del clipping. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/clippings-history');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="history-container px-6">
        <div className="upload-news-header">
          <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Detalle del Clipping</h1>
        </div>
        <div className="upload-news-panel">
          <div className="history-loading">
            <div className="history-loading-spinner"></div>
            <p className="text-white/70 mt-4">Cargando detalles del clipping...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !clipping) {
    return (
      <div className="history-container px-6">
        <div className="upload-news-header">
          <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Detalle del Clipping</h1>
        </div>
        <div className="upload-news-panel">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="text-red-400 text-lg">{error || 'Clipping no encontrado'}</div>
            <Button onClick={handleBack} variant="outline">
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
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              ← Volver
            </Button>
            <ClippingReportButton
              clippingId={clipping.id}
              hasReport={clipping.has_report}
              variant="primary"
              size="sm"
            />
          </div>
          <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">{clipping.name}</h1>
          <p className="upload-news-subtitle text-sm mt-2">
            {formatDate(clipping.start_date)} - {formatDate(clipping.end_date)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section" style={{ marginBottom: '-32px !important' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-blue-300/30 mb-5">
                <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Tema</p>
              <p className="text-lg font-bold text-white mb-1">{clipping.topic?.name || 'Sin tema'}</p>
              <p className="text-xs text-blue-300 font-medium">Asignado</p>
            </div>
          </div>

          <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-green-300/30 mb-5">
                <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Creado por</p>
              <p className="text-lg font-bold text-white mb-1">{clipping.creator?.name || 'N/A'}</p>
              <p className="text-xs text-green-300 font-medium">{formatDate(clipping.created_at)}</p>
            </div>
          </div>

          <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-orange-300/30 mb-5">
                <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Total Noticias</p>
              <p className="text-lg font-bold text-white mb-1">{metrics?.news_count || 0}</p>
              <p className="text-xs text-orange-300 font-medium">En el período</p>
            </div>
          </div>

          <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-purple-300/30 mb-5">
                <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Actualizado por</p>
              <p className="text-lg font-bold text-white mb-1">{clipping.reviewer?.name || clipping.creator?.name || 'N/A'}</p>
              <p className="text-xs text-purple-300 font-medium">{formatDate(clipping.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Individuales */}
      {metrics && (
        <div style={{ marginTop: '-16px !important' }}>
          {/* Gráficos de Valoración y Soporte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Valoración */}
            <div className="upload-news-panel flex flex-col">
              <div className="flex items-center justify-between mb-6" style={{ minHeight: '48px' }}>
                <h3 className="upload-news-section-title mb-0">Valoración de Noticias</h3>
                {metrics?.crisis && (
                  <span className="bg-red-500/20 text-red-400 rounded-full text-base border border-red-400/30 font-semibold flex items-center gap-2" style={{ padding: '12px 24px' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Crisis
                  </span>
                )}
              </div>
              <div className="flex-1">
                <AdvancedMetricsCharts metricas={metrics} chartType="valuation" />
              </div>
            </div>

            {/* Gráfico de Soporte */}
            {metrics?.support_stats?.items && metrics.support_stats.items.length > 0 && (
              <div className="upload-news-panel flex flex-col">
                <div className="mb-6" style={{ minHeight: '48px' }}>
                  <h3 className="upload-news-section-title mb-0">Distribución por Soporte</h3>
                </div>
                <div className="flex-1">
                  <AdvancedMetricsCharts metricas={metrics} chartType="support" />
                </div>
              </div>
            )}
          </div>

          {/* Gráfico de Medios */}
          {metrics?.media_stats?.items && metrics.media_stats.items.length > 0 && (
            <div className="upload-news-panel" style={{ marginTop: '24px' }}>
              <h3 className="upload-news-section-title mb-6">Distribución por Medios</h3>
              <AdvancedMetricsCharts metricas={metrics} chartType="media" />
            </div>
          )}

          {/* Gráfico de Menciones */}
          {metrics?.mention_stats?.items && metrics.mention_stats.items.length > 0 && (
            <div className="upload-news-panel" style={{ marginTop: '24px' }}>
              <h3 className="upload-news-section-title mb-6">Distribución por Menciones</h3>
              <AdvancedMetricsCharts metricas={metrics} chartType="mention" />
            </div>
          )}

        </div>
      )}

      {/* Snackbar para mensajes */}
      <Snackbar
        message={successMessage || error || ''}
        variant={error ? 'error' : 'success'}
        isOpen={!!(successMessage || error)}
        onClose={() => {
          setSuccessMessage(null);
          setError(null);
        }}
      />
    </div>
  );
}
