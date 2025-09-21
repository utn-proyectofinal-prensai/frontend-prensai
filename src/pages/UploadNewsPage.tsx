import { useState } from 'react';
import { useNews, useEnabledTopics, useEnabledMentions } from '../hooks';
import { useWorkflow } from '../hooks/useWorkflow';
import { type BatchProcessRequest, parseApiError } from '../services/api';
import { 
  Snackbar
} from '../components/common';
import { TEXT_STYLES } from '../constants/styles';
import '../styles/upload-news.css';

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

  // Estados para la nueva interfaz
  const [urlTextArea, setUrlTextArea] = useState('');
  const [activeSection, setActiveSection] = useState<'topics' | 'mentions' | 'urls'>('topics');

  // Efecto para navegar automáticamente al siguiente paso (solo cuando el usuario hace clic en "Seleccionar todo")
  const handleSelectAllTopics = () => {
    selectAllTopics(enabledTopics.map(t => t.name));
    // Solo navegar automáticamente si se seleccionaron todos los temas
    setTimeout(() => setActiveSection('mentions'), 1000);
  };

  const handleSelectAllMentions = () => {
    selectAllMentions(enabledMentions.map(m => m.name));
    // Solo navegar automáticamente si se seleccionaron todas las menciones
    setTimeout(() => setActiveSection('urls'), 1000);
  };

  // Funciones para manejo de URLs múltiples
  const handleMultipleUrls = () => {
    const urls = urlTextArea
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    urls.forEach(url => {
      setUrlInput(url);
      addUrl();
    });
    
    setUrlTextArea('');
  };


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

  // Verificar si está listo para procesar
  const isReadyToProcess = isTopicsStepValid && isMentionsStepValid && isUrlsStepValid;

  // Componente de selección de temas mejorado
  const TopicsSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="upload-news-section-title">Paso 1: Temas a analizar</h3>
            <div className="upload-news-tip">
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Selecciona al menos un tema para continuar al siguiente paso
              </p>
            </div>
            <div className="upload-news-section-actions">
              <button
                onClick={handleSelectAllTopics}
                className="h-11 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-white font-bold mr-1">✓</span>
                <span>Seleccionar todo</span>
              </button>
              <button
                onClick={clearTopics}
                className="h-11 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>✨</span>
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {topicsLoading ? (
        <div className="text-center py-8 text-white/70">Cargando temas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-h-80 overflow-y-auto justify-items-center">
          {enabledTopics.map((topic) => {
            const isSelected = workflowState.selectedTopics.includes(topic.name);
            return (
              <div
                key={topic.id}
                onClick={() => toggleTopic(topic.name)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full min-w-[180px] max-w-[240px] ${
                  isSelected
                    ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-400 bg-blue-400' : 'border-white/30'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{topic.name}</h4>
                    {topic.description && (
                      <p className="text-sm text-white/70 mt-1">{topic.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Componente de selección de menciones mejorado
  const MentionsSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="upload-news-section-title">Paso 2: Menciones a buscar</h3>
            <div className="upload-news-tip">
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Selecciona al menos una mención para continuar al siguiente paso
              </p>
            </div>
            <div className="upload-news-section-actions">
              <button
                onClick={handleSelectAllMentions}
                className="h-11 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-white font-bold mr-1">✓</span>
                <span>Seleccionar todo</span>
              </button>
              <button
                onClick={clearMentions}
                className="h-11 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>✨</span>
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {mentionsLoading ? (
        <div className="text-center py-8 text-white/70">Cargando menciones...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-h-80 overflow-y-auto justify-items-center">
          {enabledMentions.map((mention) => {
            const isSelected = workflowState.selectedMentions.includes(mention.name);
            return (
              <div
                key={mention.id}
                onClick={() => toggleMention(mention.name)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full min-w-[180px] max-w-[240px] ${
                  isSelected
                    ? 'border-green-400 bg-green-500/10 shadow-lg shadow-green-500/20'
                    : 'border-white/20 bg-white/5 hover:border-green-400/50 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-green-400 bg-green-400' : 'border-white/30'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{mention.name}</h4>
                    <p className="text-sm text-white/70 mt-1">Menciones de {mention.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Componente de carga de URLs mejorado
  const UrlsSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="upload-news-section-title">Paso 3: URLs de noticias</h3>
          <div className="upload-news-tip">
            <p className="upload-news-tip-text">
              💡 <strong>Tip:</strong> Agrega al menos una URL válida para poder procesar las noticias
            </p>
          </div>
          <div className="upload-news-section-actions">
            <button
              onClick={clearUrls}
              className="h-11 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>✨</span>
              <span>Limpiar todo</span>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Entrada múltiple de URLs */}
      <div className="upload-news-url-input-area">
        <div className="upload-news-textarea-container">
          <textarea
            value={urlTextArea}
            onChange={(e) => setUrlTextArea(e.target.value)}
            placeholder="Pega aquí múltiples URLs, una por línea:&#10;https://ejemplo.com/noticia1&#10;https://ejemplo.com/noticia2&#10;https://ejemplo.com/noticia3"
            className="upload-news-textarea"
          />
          <div className="upload-news-url-counter">
            {urlTextArea.split('\n').filter(line => line.trim()).length} URLs detectadas
          </div>
        </div>
        
        <div className="upload-news-url-actions">
          <div className="upload-news-url-buttons">
          <button
            onClick={handleMultipleUrls}
            disabled={!urlTextArea.trim()}
            className="h-11 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:scale-100 lg:w-auto w-full"
          >
            <span className="text-white font-bold mr-1">+</span>
            <span>Agregar todas las URLs</span>
          </button>
          
          {/* Entrada individual */}
          <div className="upload-news-url-single">
            <input
              type="text"
            value={workflowState.urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            placeholder="https://ejemplo.com/noticia..."
              className="upload-news-url-input"
            />
            <button
              onClick={addUrl}
              disabled={!workflowState.urlInput.trim()}
              className="h-11 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:scale-100"
            >
              <span className="text-white font-bold mr-1">+</span>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de URLs mejorada */}
      {workflowState.urls.length > 0 && (
        <div className="upload-news-url-list">
          <div className="upload-news-url-list-header">
            <h4 className="upload-news-url-list-title">
              URLs a procesar ({workflowState.urls.length})
            </h4>
            <div className="upload-news-url-stats">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                {workflowState.urls.filter(url => url.isValid).length} válidas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                {workflowState.urls.filter(url => !url.isValid).length} inválidas
              </span>
            </div>
          </div>
              
          <div className="upload-news-url-list-items">
                {workflowState.urls.map((url) => (
                  <div 
                    key={url.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      url.isValid 
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{url.url}</p>
                      {url.error && (
                        <p className="text-red-400 text-sm mt-1">{url.error}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeUrl(url.id)}
                  className="text-white/60 hover:text-red-400 transition-colors ml-4 p-1"
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
      </div>
    );

  return (
    <div className="upload-news-container">
      {/* Header */}
      <div className="upload-news-header">
        <h1 className="upload-news-title">Carga tus noticias para analizar</h1>
        <p className="upload-news-subtitle">Sigue los pasos en orden: Temas → Menciones → URLs</p>
      </div>

      {/* Contenido principal */}
      <div className="upload-news-main-content">
        <div className="upload-news-content-wrapper">
          <div className="upload-news-sections">
              
            {/* Navegación por pestañas con flujo secuencial */}
            <div className="upload-news-navigation">
                {/* Indicador de progreso secuencial */}
                <div className="upload-news-step-indicators">
                  <div className="upload-news-step-item">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isTopicsStepValid 
                        ? 'bg-green-500 text-white' 
                        : activeSection === 'topics'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/20 text-white/50'
                    }`}>
                      {isTopicsStepValid ? '✓' : '1'}
                    </div>
                    <div className={`upload-news-step-connector ${
                      isTopicsStepValid ? 'bg-green-500' : 'bg-white/20'
                    }`}></div>
                  </div>
                  
                  <div className="upload-news-step-item">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isMentionsStepValid 
                        ? 'bg-green-500 text-white' 
                        : activeSection === 'mentions'
                        ? 'bg-green-500 text-white'
                        : isTopicsStepValid
                        ? 'bg-white/30 text-white/70'
                        : 'bg-white/10 text-white/30'
                    }`}>
                      {isMentionsStepValid ? '✓' : '2'}
                    </div>
                    <div className={`upload-news-step-connector ${
                      isMentionsStepValid ? 'bg-green-500' : 'bg-white/20'
                    }`}></div>
                  </div>
                  
                  <div className="upload-news-step-item">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isUrlsStepValid 
                        ? 'bg-green-500 text-white' 
                        : activeSection === 'urls'
                        ? 'bg-purple-500 text-white'
                        : isMentionsStepValid
                        ? 'bg-white/30 text-white/70'
                        : 'bg-white/10 text-white/30'
                    }`}>
                      {isUrlsStepValid ? '✓' : '3'}
                    </div>
                  </div>
                </div>

                {/* Pestañas con numeración */}
                <div className="upload-news-tabs">
                  <button
                    onClick={() => setActiveSection('topics')}
                    disabled={false} // Siempre habilitado
                    className={`upload-news-tab ${activeSection === 'topics' ? 'active' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-base">Temas</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          workflowState.selectedTopics.length > 0 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/20 text-white/70'
                        }`}>
                          {workflowState.selectedTopics.length}
                        </span>
                        {isTopicsStepValid && (
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        )}
                      </div>
                      <span className="text-xs text-white/60">Selecciona los temas que quieres analizar</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('mentions')}
                    disabled={!isTopicsStepValid}
                    className={`upload-news-tab ${activeSection === 'mentions' ? 'active' : ''} ${!isTopicsStepValid ? 'disabled' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          !isTopicsStepValid ? 'bg-white/10' : 'bg-green-500/20'
                        }`}>
                          2
                        </div>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-base">Menciones</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          workflowState.selectedMentions.length > 0 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white/20 text-white/70'
                        }`}>
                          {workflowState.selectedMentions.length}
                        </span>
                        {isMentionsStepValid && (
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        )}
                      </div>
                      <span className="text-xs text-white/60">Elige las menciones que quieres buscar</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('urls')}
                    disabled={!isMentionsStepValid}
                    className={`upload-news-tab ${activeSection === 'urls' ? 'active' : ''} ${!isMentionsStepValid ? 'disabled' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          !isMentionsStepValid ? 'bg-white/10' : 'bg-purple-500/20'
                        }`}>
                          3
                        </div>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>URLs</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          workflowState.urls.length > 0 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white/20 text-white/70'
                        }`}>
                          {workflowState.urls.length}
                        </span>
                        {isUrlsStepValid && (
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        )}
                      </div>
                      <span className="text-xs text-white/60">Agrega las URLs de las noticias</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Contenido de la sección activa */}
              <div className="upload-news-panel">
                {activeSection === 'topics' && <TopicsSection />}
                {activeSection === 'mentions' && <MentionsSection />}
                {activeSection === 'urls' && <UrlsSection />}
              </div>

              {/* Botón de procesamiento prominente */}
              <div className="upload-news-process-button">
                <button
                  onClick={processNews}
                  disabled={!isReadyToProcess || isProcessing || processing}
                >
                  <div className="flex items-center justify-center gap-4">
                    {isProcessing || processing ? (
                      <>
                        <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        Procesando noticias...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Procesar noticias
                      </>
                    )}
                  </div>
                </button>
              </div>
              
              {!isReadyToProcess && (
                <div className="upload-news-completion-message">
                  <p>
                    Completa todos los pasos para procesar
                  </p>
                </div>
              )}
            </div>
        </div>
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