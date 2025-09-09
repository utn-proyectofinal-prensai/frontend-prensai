import { useState } from 'react';
import { useNews, useEnabledTopics, useEnabledMentions } from '../hooks';
import { useWorkflow } from '../hooks/useWorkflow';
import { type BatchProcessRequest, parseApiError } from '../services/api';
import { 
  Snackbar, 
  PanelCard, 
  ActionButton, 
  InputWithButton,
  CenteredCardSelection,
  SimpleWorkflowStepper
} from '../components/common';
import { TEXT_STYLES, STATUS_STYLES } from '../constants/styles';

export default function UploadNewsPage() {
  const { batchProcess, processing } = useNews();
  const { topics: enabledTopics, loading: topicsLoading } = useEnabledTopics();
  const { mentions: enabledMentions, loading: mentionsLoading } = useEnabledMentions();
  
  const {
    workflowState,
    addUrl,
    removeUrl,
    clearUrls,
    toggleTopic,
    toggleMention,
    selectAllTopics,
    clearTopics,
    selectAllMentions,
    clearMentions,
    setUrlInput,
    isTopicsStepValid,
    isMentionsStepValid,
    isUrlsStepValid
  } = useWorkflow();

  // Estados para procesamiento
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Estados para mensajes
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successVariant, setSuccessVariant] = useState<'success' | 'warning'>('success');

  // Procesar noticias
  const processNews = async () => {
    const validUrls = workflowState.urls.filter(url => url.isValid).map(url => url.url);
    if (validUrls.length === 0) {
      setErrorMessage('No hay URLs válidas para procesar');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Iniciando procesamiento...');

    try {
      const requestData: BatchProcessRequest = {
        urls: validUrls,
        topics: workflowState.selectedTopics,
        mentions: workflowState.selectedMentions
      };

      const response = await batchProcess(requestData);

      const allOk = response.received === response.persisted && response.persisted > 0;
      const partial = response.persisted > 0 && response.errors.length > 0;
      const none = response.persisted === 0 && response.errors.length > 0;

      if (allOk) {
        setSuccessVariant('success');
        setProcessingStatus('Procesamiento completado exitosamente');
        setSuccessMessage(`Listo: ${response.persisted}/${response.received} procesadas correctamente.`);
      } else if (partial) {
        setSuccessVariant('warning');
        setProcessingStatus('Procesamiento parcial');
        setSuccessMessage(`Parcial: ${response.persisted}/${response.received} OK. ${response.errors.length} con error.`);
      } else if (none) {
        setProcessingStatus('Error en el procesamiento');
        setErrorMessage('No se pudo procesar ninguna noticia. Revisa las URLs ingresadas.');
      } else {
        setSuccessVariant('warning');
        setProcessingStatus('Procesamiento finalizado');
        setSuccessMessage(`Resultado: ${response.persisted}/${response.received} procesadas.`);
      }
    } catch (error) {
      console.error('Error procesando noticias:', error);
      setProcessingStatus('Error en el procesamiento');
      
      const errorMessage = parseApiError(error, 'Error al procesar las noticias');
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Definir los pasos del workflow
  const workflowSteps = [
    {
      id: 'topics',
      title: 'Selecciona los temas',
      description: 'Elige los temas que quieres analizar en las noticias',
      component: (
        <CenteredCardSelection
          items={enabledTopics.map(topic => ({
            id: topic.id.toString(),
            name: topic.name,
            description: topic.description,
            color: 'blue'
          }))}
          selectedItems={workflowState.selectedTopics}
          onToggle={toggleTopic}
          onSelectAll={() => selectAllTopics(enabledTopics.map(t => t.name))}
          onClearAll={clearTopics}
          title="Temas a analizar"
          loading={topicsLoading}
          loadingText="Cargando temas..."
          emptyText="No hay temas habilitados"
          maxSelections={10}
        />
      ),
      isValid: isTopicsStepValid
    },
    {
      id: 'mentions',
      title: 'Selecciona las menciones',
      description: 'Elige las menciones que quieres buscar en las noticias',
      component: (
        <CenteredCardSelection
          items={enabledMentions.map(mention => ({
            id: mention.id.toString(),
            name: mention.name,
            description: 'Menciones de ' + mention.name,
            color: 'green'
          }))}
          selectedItems={workflowState.selectedMentions}
          onToggle={toggleMention}
          onSelectAll={() => selectAllMentions(enabledMentions.map(m => m.name))}
          onClearAll={clearMentions}
          title="Menciones a buscar"
          loading={mentionsLoading}
          loadingText="Cargando menciones..."
          emptyText="No hay menciones habilitadas"
          maxSelections={8}
        />
      ),
      isValid: isMentionsStepValid
    },
    {
      id: 'urls',
      title: 'Agrega las URLs',
      description: 'Ingresa las URLs de las noticias que quieres procesar',
      component: (
        <div className="space-y-6">
          <InputWithButton
            value={workflowState.urlInput}
            onChange={setUrlInput}
            onButtonClick={addUrl}
            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            placeholder="https://ejemplo.com/noticia..."
            buttonText="Agregar"
            buttonDisabled={!workflowState.urlInput.trim()}
          />

          {workflowState.urls.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  URLs a procesar ({workflowState.urls.length})
                </h3>
                <ActionButton
                  onClick={clearUrls}
                  variant="secondary"
                  size="sm"
                >
                  Limpiar todo
                </ActionButton>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {workflowState.urls.map((url) => (
                  <div 
                    key={url.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      url.isValid 
                        ? STATUS_STYLES.success
                        : STATUS_STYLES.error
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium truncate">{url.url}</p>
                      {url.error && (
                        <p className="text-red-400 text-sm mt-1">{url.error}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeUrl(url.id)}
                      className="text-white/60 hover:text-red-400 transition-colors ml-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      isValid: isUrlsStepValid
    },
    {
      id: 'review',
      title: 'Revisa tu configuración',
      description: 'Verifica que todo esté correcto antes de procesar',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resumen de temas */}
            <PanelCard title="Temas seleccionados" padding="sm">
              <div className="space-y-2">
                {workflowState.selectedTopics.length > 0 ? (
                  workflowState.selectedTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-white">{topic}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No hay temas seleccionados</p>
                )}
              </div>
            </PanelCard>

            {/* Resumen de menciones */}
            <PanelCard title="Menciones seleccionadas" padding="sm">
              <div className="space-y-2">
                {workflowState.selectedMentions.length > 0 ? (
                  workflowState.selectedMentions.map((mention, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-white">{mention}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No hay menciones seleccionadas</p>
                )}
              </div>
            </PanelCard>
          </div>

          {/* Resumen de URLs */}
          <PanelCard title="URLs a procesar" padding="sm">
            <div className="space-y-2">
              {workflowState.urls.length > 0 ? (
                workflowState.urls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${url.isValid ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white truncate">{url.url}</span>
                    {url.error && (
                      <span className="text-red-400 text-sm">({url.error})</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-white/60">No hay URLs agregadas</p>
              )}
            </div>
          </PanelCard>
        </div>
      ),
      isValid: isTopicsStepValid && isMentionsStepValid && isUrlsStepValid
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Título de bienvenida */}
      <div className="flex-shrink-0 text-center py-8">
        <h1 className={TEXT_STYLES.title.main}>Carga tus noticias para analizar</h1>
        <p className={TEXT_STYLES.subtitle.main}>Sigue los pasos para configurar y procesar tus noticias</p>
      </div>

      {/* Workflow - área principal con altura fija */}
      <div className="flex-1 px-4 pb-4">
        <PanelCard className="h-full">
          <SimpleWorkflowStepper
            steps={workflowSteps}
            onComplete={processNews}
            onStepChange={(stepId, stepIndex) => {
              console.log(`Cambiado a paso: ${stepId} (${stepIndex})`);
            }}
            className="h-full"
          />
        </PanelCard>
      </div>

      {/* Overlay de procesamiento */}
      {(isProcessing || processing) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="processing-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-md mx-4 rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900/90 to-slate-800/90 shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center animate-pulse-glow mb-4">
              <svg className="w-6 h-6 text-blue-300 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
            <h3 id="processing-title" className={TEXT_STYLES.title.section}>
              {processingStatus || 'Procesando noticias…'}
            </h3>
            <p className={TEXT_STYLES.subtitle.secondary + ' mt-1'}>
              Esto puede tardar unos segundos.
            </p>
          </div>
        </div>
      )}

      {/* Snackbars para mensajes */}
      <Snackbar
        message={errorMessage}
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        variant="error"
      />
      
      <Snackbar
        message={successMessage}
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        variant={successVariant}
      />
    </div>
  );
}