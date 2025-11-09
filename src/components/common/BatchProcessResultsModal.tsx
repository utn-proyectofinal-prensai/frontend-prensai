import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import type { BatchProcessResponse, NewsItem, ProcessingError } from '../../services/api';

interface BatchProcessResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: BatchProcessResponse;
  onViewHistory?: () => void;
}

export default function BatchProcessResultsModal({
  isOpen,
  onClose,
  results,
  onViewHistory
}: BatchProcessResultsModalProps) {
  // Separar errores en duplicados y otros errores
  const duplicateMessage = 'Esta noticia ya existe en el sistema';
  const duplicates = results.errors.filter(err => err.reason === duplicateMessage);
  const otherErrors = results.errors.filter(err => err.reason !== duplicateMessage);

  // Calcular estadísticas
  const totalReceived = results.received;
  const totalProcessed = results.persisted;
  const totalDuplicates = duplicates.length;
  const totalErrors = otherErrors.length;

  // Determinar el tipo de resultado
  const allSuccess = totalProcessed === totalReceived && totalReceived > 0 && totalDuplicates === 0 && totalErrors === 0;
  const hasDuplicates = totalDuplicates > 0;
  const hasErrors = totalErrors > 0;
  const partialSuccess = totalProcessed > 0 && (totalDuplicates > 0 || totalErrors > 0);
  const allFailed = totalProcessed === 0 && (totalDuplicates > 0 || totalErrors > 0);

  const getResultIcon = () => {
    if (allSuccess) {
      return (
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    if (hasDuplicates && !hasErrors) {
      return (
        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }
    if (allFailed) {
      return (
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    );
  };

  const getResultTitle = () => {
    if (allSuccess) {
      return 'Procesamiento completado';
    }
    if (hasDuplicates && !hasErrors) {
      return 'Procesamiento completado con duplicados';
    }
    if (allFailed) {
      return 'Error en el procesamiento';
    }
    return 'Procesamiento parcial';
  };

  const getResultDescription = () => {
    if (allSuccess) {
      return `Todas las ${totalProcessed} noticias se procesaron exitosamente.`;
    }
    if (hasDuplicates && !hasErrors) {
      return `${totalProcessed} noticias procesadas. ${totalDuplicates} noticias ya existían en el sistema.`;
    }
    if (allFailed) {
      return 'No se pudo procesar ninguna noticia. Revisa los errores a continuación.';
    }
    return `${totalProcessed} noticias procesadas. ${totalDuplicates} duplicadas. ${totalErrors} errores.`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getResultTitle()}
      icon={getResultIcon()}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          {onViewHistory && totalProcessed > 0 && (
            <Button
              onClick={onViewHistory}
              variant="primary"
              size="default"
            >
              Ver en Historial
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="secondary"
            size="default"
          >
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-sm text-blue-300 font-medium mb-1">Recibidas</div>
            <div className="text-2xl font-bold text-white">{totalReceived}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-sm text-green-300 font-medium mb-1">Procesadas</div>
            <div className="text-2xl font-bold text-white">{totalProcessed}</div>
          </div>
          {totalDuplicates > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-sm text-yellow-300 font-medium mb-1">Duplicadas</div>
              <div className="text-2xl font-bold text-white">{totalDuplicates}</div>
            </div>
          )}
          {totalErrors > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="text-sm text-red-300 font-medium mb-1">Errores</div>
              <div className="text-2xl font-bold text-white">{totalErrors}</div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <p className="text-white/70 text-sm">{getResultDescription()}</p>

        {/* Noticias procesadas exitosamente */}
        {results.news.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Noticias procesadas exitosamente ({results.news.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.news.map((news) => (
                <div
                  key={news.id}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{news.title}</div>
                    <div className="text-green-300/70 text-xs mt-1 truncate">{news.link}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Noticias duplicadas */}
        {duplicates.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Noticias duplicadas ({duplicates.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {duplicates.map((error, index) => (
                <div
                  key={index}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-yellow-300 text-sm font-medium mb-1">Ya existe en el sistema</div>
                    <div className="text-white/70 text-xs truncate">{error.url}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errores reales */}
        {otherErrors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Errores ({otherErrors.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {otherErrors.map((error, index) => (
                <div
                  key={index}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                >
                  <div className="text-red-300 text-sm font-medium mb-1">{error.reason}</div>
                  <div className="text-white/70 text-xs truncate">{error.url}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

