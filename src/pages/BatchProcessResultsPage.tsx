import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import MetricCard from '../components/common/MetricCard';
import type { BatchProcessResponse, ProcessingError } from '../services/api';
import { Info } from 'lucide-react';
import '../styles/upload-news.css';

export default function BatchProcessResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results as BatchProcessResponse | undefined;

  // Si no hay resultados, redirigir a upload-news
  if (!results) {
    navigate('/upload-news');
    return null;
  }

  // Separar errores en duplicados y otros errores
  const duplicateMessage = 'Esta noticia ya existe en el sistema';
  const duplicates = results.errors.filter(err => 
    err.reason === duplicateMessage || err.motivo === duplicateMessage
  );
  const otherErrors = results.errors.filter(err => 
    err.reason !== duplicateMessage && err.motivo !== duplicateMessage
  );

  // Calcular estadísticas
  const totalReceived = results.received;
  const totalProcessed = results.persisted;
  const totalDuplicates = duplicates.length;
  const totalErrors = otherErrors.length;

  // Determinar el tipo de resultado
  const allSuccess = totalProcessed === totalReceived && totalReceived > 0 && totalDuplicates === 0 && totalErrors === 0;
  const hasDuplicates = totalDuplicates > 0;
  const hasErrors = totalErrors > 0;
  const allDuplicates = totalProcessed === 0 && totalDuplicates > 0 && totalErrors === 0; // Todas duplicadas
  const allFailed = totalProcessed === 0 && totalErrors > 0; // Todas fallaron con errores (no duplicados)

  const getResultDescription = () => {
    if (allSuccess) {
      return 'Todas las noticias se procesaron exitosamente.';
    }
    if (allDuplicates) {
      return `Todas las noticias ya existían en el sistema.`;
    }
    if (hasDuplicates && !hasErrors) {
      return `${totalProcessed} noticias procesadas. ${totalDuplicates} noticias ya existían en el sistema.`;
    }
    if (allFailed) {
      return 'No se pudo procesar ninguna noticia. Revisa los errores a continuación.';
    }
    return `${totalProcessed} noticias procesadas. ${totalDuplicates} duplicadas. ${totalErrors} errores.`;
  };

  const getTipColor = () => {
    if (allSuccess) {
      return {
        bg: 'rgba(34, 197, 94, 0.1)', // green-500/10
        border: 'rgba(34, 197, 94, 0.3)', // green-500/30
        text: 'rgb(134, 239, 172)', // green-300
      };
    }
    if (allDuplicates) {
      return {
        bg: 'rgba(234, 179, 8, 0.1)', // yellow-500/10
        border: 'rgba(234, 179, 8, 0.3)', // yellow-500/30
        text: 'rgb(253, 224, 71)', // yellow-300
      };
    }
    if (hasDuplicates && !hasErrors) {
      return {
        bg: 'rgba(59, 130, 246, 0.1)', // blue-500/10
        border: 'rgba(59, 130, 246, 0.3)', // blue-500/30
        text: 'rgb(147, 197, 253)', // blue-300
      };
    }
    if (allFailed) {
      return {
        bg: 'rgba(239, 68, 68, 0.1)', // red-500/10
        border: 'rgba(239, 68, 68, 0.3)', // red-500/30
        text: 'rgb(252, 165, 165)', // red-300
      };
    }
    return {
      bg: 'rgba(251, 191, 36, 0.1)', // orange-500/10
      border: 'rgba(251, 191, 36, 0.3)', // orange-500/30
      text: 'rgb(253, 186, 116)', // orange-300
    };
  };

  const getErrorReason = (error: ProcessingError & { motivo?: string }) => {
    const reason = error.reason || error.motivo || 'Error desconocido';
    // Eliminar todo lo que está entre paréntesis
    return reason.replace(/\s*\([^)]*\)/g, '').trim();
  };

  const getErrorUrl = (error: ProcessingError & { url?: string }) => {
    return error.url || '';
  };

  return (
    <div className="upload-news-container">
      <div className="upload-news-main-content">
        <div className="upload-news-content-wrapper">
          <div style={{ marginBottom: '3rem' }}>
            <PageHeader 
              title="Procesamiento completado"
            />
          </div>

          <div className="upload-news-section">
            {/* Tip con el resultado */}
            <div 
              className="upload-news-tip"
              style={{
                backgroundColor: getTipColor().bg,
                borderColor: getTipColor().border,
                margin: '0 0 2rem 0',
              }}
            >
              <p 
                className="upload-news-tip-text flex items-center justify-center gap-2"
                style={{ color: getTipColor().text }}
              >
                <Info className="w-4 h-4 flex-shrink-0" />
                <strong>Resultado:</strong> {getResultDescription()}
              </p>
            </div>

            {/* Resumen de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <MetricCard
                title="Recibidas"
                value={totalReceived}
                iconColor="blue"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <MetricCard
                title="Procesadas"
                value={totalProcessed}
                iconColor="green"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
              {totalDuplicates > 0 ? (
                <MetricCard
                  title="Duplicadas"
                  value={totalDuplicates}
                  iconColor="yellow"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                />
              ) : (
                <MetricCard
                  title="Errores"
                  value={totalErrors}
                  iconColor="red"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                />
              )}
            </div>

            {/* Noticias procesadas exitosamente */}
            {results.news.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Noticias procesadas exitosamente ({results.news.length})
                </h3>
                <div className="space-y-3">
                  {results.news.map((news) => (
                    <Card key={news.id} className="bg-green-500/10 border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium mb-2">{news.title}</div>
                            <div className="text-green-300/70 text-xs truncate">{news.link}</div>
                          </div>
                          <Button
                            onClick={() => window.open(news.link, '_blank')}
                            variant="ghost"
                            size="icon"
                            icon="ExternalLink"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Noticias duplicadas */}
            {duplicates.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Noticias duplicadas ({duplicates.length})
                </h3>
                <div className="space-y-3">
                  {duplicates.map((error, index) => (
                    <Card key={index} className="bg-yellow-500/10 border-yellow-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-yellow-300 text-sm font-medium mb-1">Ya existe en el sistema</div>
                            <div className="text-white/70 text-xs truncate">{getErrorUrl(error)}</div>
                          </div>
                          <Button
                            onClick={() => window.open(getErrorUrl(error), '_blank')}
                            variant="ghost"
                            size="icon"
                            icon="ExternalLink"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Errores reales */}
            {otherErrors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Errores ({otherErrors.length})
                </h3>
                <div className="space-y-3">
                  {otherErrors.map((error, index) => (
                    <Card key={index} className="bg-red-500/10 border-red-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-red-300 text-sm font-medium mb-1">{getErrorReason(error)}</div>
                            <div className="text-white/70 text-xs truncate">{getErrorUrl(error)}</div>
                          </div>
                          <Button
                            onClick={() => window.open(getErrorUrl(error), '_blank')}
                            variant="ghost"
                            size="icon"
                            icon="ExternalLink"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button
                onClick={() => navigate('/history')}
                variant="primary"
                size="default"
                icon="ArrowLeft"
                iconPosition="left"
                className="w-full"
              >
                Ver historial de noticias
              </Button>
              <Button
                onClick={() => navigate('/upload-news')}
                variant="success"
                size="default"
                icon="Plus"
                iconPosition="left"
                className="w-full"
              >
                Cargar más noticias
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

