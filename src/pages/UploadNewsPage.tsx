import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews, useEnabledTopics, useEnabledMentions } from '../hooks';
import { useWorkflow } from '../hooks/useWorkflow';
import { type BatchProcessRequest, parseApiError } from '../services/api';
import { 
  Snackbar,
  BatchProcessResultsModal
} from '../components/common';
import type { BatchProcessResponse } from '../services/api';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { LoadingModal } from '../components/ui/loading-modal';
import '../styles/upload-news.css';

export default function UploadNewsPage() {
  const navigate = useNavigate();
  const { batchProcess } = useNews();
  const { topics: enabledTopics, loading: topicsLoading } = useEnabledTopics();
  const { mentions: enabledMentions, loading: mentionsLoading } = useEnabledMentions();
  
  const {
    workflowState,
    addMultipleUrls,
    removeUrl,
    clearUrls,
    toggleTopic,
    toggleMention,
    selectAllTopics,
    clearTopics,
    selectAllMentions,
    clearMentions,
    isTopicsStepValid,
    isMentionsStepValid,
    isUrlsStepValid
  } = useWorkflow();

  // Estados para procesamiento
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para mensajes
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estados para el modal de resultados
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [processResults, setProcessResults] = useState<BatchProcessResponse | null>(null);

  // Estados para la nueva interfaz
  const [activeSection, setActiveSection] = useState<'topics' | 'mentions' | 'urls' | 'summary'>('topics');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Funciones para seleccionar todos los elementos
  const handleSelectAllTopics = () => {
    selectAllTopics(enabledTopics.map(t => t.name));
  };

  const handleSelectAllMentions = () => {
    selectAllMentions(enabledMentions.map(m => m.name));
  };

  // Funciones para el dropdown
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSectionChange = (section: 'topics' | 'mentions' | 'urls' | 'summary') => {
    setActiveSection(section);
    setIsDropdownOpen(false);
  };

  // Funciones para navegación entre pasos
  const goToNextStep = () => {
    const steps: Array<'topics' | 'mentions' | 'urls' | 'summary'> = ['topics', 'mentions', 'urls', 'summary'];
    const currentIndex = steps.indexOf(activeSection);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      // Verificar que el paso actual sea válido antes de avanzar
      if (
        (activeSection === 'topics' && isTopicsStepValid) ||
        (activeSection === 'mentions' && isMentionsStepValid) ||
        (activeSection === 'urls' && isUrlsStepValid) ||
        activeSection === 'summary'
      ) {
        setActiveSection(nextStep);
      }
    }
  };

  const goToPreviousStep = () => {
    const steps: Array<'topics' | 'mentions' | 'urls' | 'summary'> = ['topics', 'mentions', 'urls', 'summary'];
    const currentIndex = steps.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(steps[currentIndex - 1]);
    }
  };

  // Determinar si se puede avanzar
  const canGoNext = () => {
    switch (activeSection) {
      case 'topics':
        return isTopicsStepValid;
      case 'mentions':
        return isMentionsStepValid;
      case 'urls':
        return isUrlsStepValid;
      case 'summary':
        return false; // No hay siguiente paso después de summary
      default:
        return false;
    }
  };

  // Determinar si se puede retroceder
  const canGoPrevious = () => {
    return activeSection !== 'topics';
  };

  // Función para obtener el texto del paso actual
  const getCurrentStepText = () => {
    switch (activeSection) {
      case 'topics':
        return 'Paso 1: Temas';
      case 'mentions':
        return 'Paso 2: Menciones';
      case 'urls':
        return 'Paso 3: Links';
      case 'summary':
        return 'Paso 4: Procesar';
      default:
        return 'Paso 1: Temas';
    }
  };

  // Efecto para cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Procesar noticias
  const processNews = async () => {
    const validUrls = workflowState.urls.filter(url => url.isValid).map(url => url.url);
    if (validUrls.length === 0) {
      setErrorMessage('No hay links válidos para procesar');
      return;
    }

    setIsProcessing(true);

    try {
      const requestData: BatchProcessRequest = {
        urls: validUrls,
        topics: workflowState.selectedTopics,
        mentions: workflowState.selectedMentions
      };

      const response = await batchProcess(requestData);

      // Guardar resultados y mostrar modal
      setProcessResults(response);
      setShowResultsModal(true);
    } catch (error) {
      console.error('Error procesando noticias:', error);
      
      const errorMessage = parseApiError(error, 'Error al procesar las noticias');
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Verificar si está listo para procesar
  const isReadyToProcess = isTopicsStepValid && isMentionsStepValid && isUrlsStepValid;
  const isSummaryStepValid = isReadyToProcess;

  // Componente de selección de temas mejorado
  const TopicsSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
            <h3 className="upload-news-section-title">Paso 1: Temas a analizar</h3>
            <div className="upload-news-tip">
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Selecciona al menos un tema para continuar al siguiente paso
              </p>
            </div>
            <div className="upload-news-section-actions">
          <Button
            onClick={handleSelectAllTopics}
            variant="success"
            size="default"
            icon="Check"
          >
            Seleccionar todo
          </Button>
          <Button
            onClick={clearTopics}
            variant="secondary"
            size="default"
            icon="Refresh"
          >
            Limpiar
          </Button>
            </div>
          </div>
        </div>
      </div>

      {topicsLoading ? (
        <div className="text-center py-8 text-white/70">Cargando temas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-h-80 overflow-y-auto justify-items-center">
          {enabledTopics.map((topic) => {
            const isSelected = workflowState.selectedTopics.includes(topic.name);
            return (
              <div
                key={topic.id}
                onClick={() => toggleTopic(topic.name)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full min-w-[160px] sm:min-w-[180px] max-w-[240px] min-h-[4rem] flex flex-col relative ${
                  isSelected
                    ? 'border-green-400 bg-green-500/10 shadow-lg shadow-green-400/20'
                    : 'border-white/20 bg-white/5 hover:border-green-400/50 hover:bg-white/10'
                }`}
              >
                {/* Checkbox arriba a la derecha - completamente dentro de la card */}
                <div className="absolute top-3 right-3">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-green-400 bg-green-400' : 'border-white/30'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                {/* Contenido centrado */}
                <div className="flex-1 flex items-center justify-center" style={{ paddingRight: '2.25rem', paddingLeft: '0.5rem' }}>
                  <div className="flex flex-col items-center justify-center text-center w-full">
                    <h4 className="font-medium text-white leading-tight break-words">{topic.name}</h4>
                    {topic.description && (
                      <p className="text-sm text-white/70 mt-1 leading-tight break-words">{topic.description}</p>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
            <h3 className="upload-news-section-title">Paso 2: Menciones a buscar</h3>
            <div className="upload-news-tip">
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Selecciona al menos una mención para continuar al siguiente paso
              </p>
            </div>
            <div className="upload-news-section-actions">
          <Button
            onClick={handleSelectAllMentions}
            variant="success"
            size="default"
            icon="Check"
          >
            Seleccionar todo
          </Button>
          <Button
            onClick={clearMentions}
            variant="secondary"
            size="default"
            icon="Refresh"
          >
            Limpiar
          </Button>
            </div>
          </div>
        </div>
      </div>

      {mentionsLoading ? (
        <div className="text-center py-8 text-white/70">Cargando menciones...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-h-80 overflow-y-auto justify-items-center">
          {enabledMentions.map((mention) => {
            const isSelected = workflowState.selectedMentions.includes(mention.name);
            return (
              <div
                key={mention.id}
                onClick={() => toggleMention(mention.name)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full min-w-[160px] sm:min-w-[180px] max-w-[240px] min-h-[4rem] flex flex-col relative ${
                  isSelected
                    ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-400/20'
                    : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                }`}
              >
                {/* Checkbox arriba a la derecha - completamente dentro de la card */}
                <div className="absolute top-3 right-3">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-blue-400 bg-blue-400' : 'border-white/30'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                {/* Contenido centrado */}
                <div className="flex-1 flex items-center justify-center" style={{ paddingRight: '2.25rem', paddingLeft: '0.5rem' }}>
                  <div className="flex flex-col items-center justify-center text-center w-full">
                    <h4 className="font-medium text-white leading-tight break-words">{mention.name}</h4>
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
  const UrlsSection = () => {
    // Estado local para el input
    const [localTextArea, setLocalTextArea] = useState('');

    // Función de validación de URL
    const isValidUrl = (url: string): boolean => {
      try {
        const urlObj = new URL(url);
        return (
          (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') &&
          urlObj.hostname.includes('.') &&
          urlObj.hostname.length >= 3
        );
      } catch {
        return false;
      }
    };

    // Analizar URLs en el textarea para detectar duplicados e inválidas
    const analyzeUrls = () => {
      const text = localTextArea.trim();
      if (!text) {
        return { valid: [], duplicates: [], invalid: [] };
      }

      const urlLines = text
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const existingUrls = workflowState.urls.map(u => u.url.toLowerCase());
      const urlCounts = new Map<string, number>();
      const valid: string[] = [];
      const duplicates: string[] = [];
      const invalid: string[] = [];

      urlLines.forEach(url => {
        const urlLower = url.toLowerCase();
        urlCounts.set(urlLower, (urlCounts.get(urlLower) || 0) + 1);
      });

      urlLines.forEach(url => {
        const urlLower = url.toLowerCase();
        const isDuplicateInText = urlCounts.get(urlLower)! > 1;
        const isExistingDuplicate = existingUrls.includes(urlLower);

        if (!isValidUrl(url)) {
          invalid.push(url);
        } else if (isDuplicateInText || isExistingDuplicate) {
          duplicates.push(url);
        } else {
          valid.push(url);
        }
      });

      return { valid, duplicates, invalid };
    };

    const urlAnalysis = analyzeUrls();

    const handleAddUrls = () => {
      if (urlAnalysis.valid.length > 0) {
        addMultipleUrls(urlAnalysis.valid);
        setLocalTextArea('');
      }
    };

    // Verificar si hay al menos una URL válida en el texto
    const hasValidUrls = () => {
      return urlAnalysis.valid.length > 0;
    };

    return (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-1 lg:gap-0">
          <h3 className="upload-news-section-title">Paso 3: Links de noticias</h3>
          <div className="upload-news-tip">
            <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Agrega al menos un link válido para poder procesar las noticias
              </p>
            </div>
        </div>
        </div>
      </div>

      {/* Input de URLs */}
      <div className="space-y-3">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Agregar links</h4>
          <p className="text-white/70 text-sm mb-3">Pegá los links, uno por línea</p>
          <textarea
            value={localTextArea}
            onChange={(e) => {
              setLocalTextArea(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey && localTextArea.trim()) {
                e.preventDefault();
                handleAddUrls();
              }
            }}
            placeholder="https://ejemplo.com/noticia1&#10;https://ejemplo.com/noticia2&#10;https://ejemplo.com/noticia3"
            className="w-full h-32 bg-blue-500/20 backdrop-filter backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 text-white placeholder-white/50 resize-none transition-all duration-300 focus:outline-none focus:border-blue-400 focus:bg-blue-500/30 text-sm sm:text-base"
          />
          {/* Botones de acción debajo del textarea */}
          <div className="flex gap-3 mt-3">
            <Button
              onClick={handleAddUrls}
              disabled={!hasValidUrls()}
              variant="success"
              size="default"
              icon="Plus"
            >
              Agregar {localTextArea.split('\n').filter(l => l.trim()).length > 0 ? localTextArea.split('\n').filter(l => l.trim()).length : ''} link{localTextArea.split('\n').filter(l => l.trim()).length !== 1 ? 's' : ''}
            </Button>
            <Button
              onClick={clearUrls}
              variant="secondary"
              size="default"
              icon="Refresh"
            >
              Limpiar todo
            </Button>
          </div>
          {/* Mostrar URLs duplicadas e inválidas */}
          {(urlAnalysis.duplicates.length > 0 || urlAnalysis.invalid.length > 0) && (
            <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/10">
              {urlAnalysis.duplicates.length > 0 && (
                <div className="mb-2">
                  <p className="text-yellow-400 text-sm font-medium mb-1">
                    ⚠️ {urlAnalysis.duplicates.length} URL{urlAnalysis.duplicates.length !== 1 ? 's' : ''} duplicada{urlAnalysis.duplicates.length !== 1 ? 's' : ''}:
                  </p>
                  <ul className="list-disc list-inside text-yellow-300/80 text-xs space-y-1">
                    {urlAnalysis.duplicates.map((url, index) => (
                      <li key={index} className="truncate">{url}</li>
                    ))}
                  </ul>
                </div>
              )}
              {urlAnalysis.invalid.length > 0 && (
                <div>
                  <p className="text-red-400 text-sm font-medium mb-1">
                    ❌ {urlAnalysis.invalid.length} URL{urlAnalysis.invalid.length !== 1 ? 's' : ''} inválida{urlAnalysis.invalid.length !== 1 ? 's' : ''}:
                  </p>
                  <ul className="list-disc list-inside text-red-300/80 text-xs space-y-1">
                    {urlAnalysis.invalid.map((url, index) => (
                      <li key={index} className="truncate">{url}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lista de URLs mejorada */}
          {workflowState.urls.length > 0 && (
        <div className="upload-news-url-list" style={{ marginTop: '0.5rem' }}>
          <div className="upload-news-url-list-header">
            <h4 className="upload-news-url-list-title">
                  Links a procesar ({workflowState.urls.length})
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
                    <Button
                      onClick={() => removeUrl(url.id)}
                      variant="ghost"
                      size="icon"
                      icon="Delete"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
  );
  };

  // Componente de resumen
  const SummarySection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
          <h3 className="upload-news-section-title">Paso 4: Procesar noticias</h3>
          <div className="upload-news-tip">
            <p className="upload-news-tip-text">
              💡 <strong>Tip:</strong> Revisa la configuración antes de procesar las noticias
            </p>
          </div>
          <div className="upload-news-section-actions">
            <Button
              onClick={processNews}
              disabled={!isReadyToProcess || isProcessing}
              variant="success"
              size="lg"
              icon="Generate"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" variant="simple" className="mr-2" />
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Procesar {workflowState.urls.filter(url => url.isValid).length} noticias</span>
              )}
            </Button>
          </div>
        </div>
        </div>
                    </div>

      {/* Resumen de configuración */}
        <div className="space-y-6">
        {/* Temas seleccionados */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Temas seleccionados
              </h4>
              <div className="flex items-center gap-2">
                {workflowState.selectedTopics.map((topic) => (
                  <span key={topic} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              {workflowState.selectedTopics.length}
            </div>
          </div>
        </div>

        {/* Menciones seleccionadas */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Menciones seleccionadas
              </h4>
              <div className="flex items-center gap-2">
                {workflowState.selectedMentions.map((mention) => (
                  <span key={mention} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                    {mention}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {workflowState.selectedMentions.length}
            </div>
          </div>
        </div>

        {/* URLs a procesar */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Links a procesar
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                {workflowState.urls.length}
              </div>
              {workflowState.urls.filter(url => !url.isValid).length > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                  {workflowState.urls.filter(url => !url.isValid).length} inválidas
                </span>
              )}
            </div>
          </div>
          
          {/* Lista compacta de URLs */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {workflowState.urls.map((url) => (
              <div key={url.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    url.isValid ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-white/80 truncate text-sm">{url.url}</span>
                </div>
                <Button
                  onClick={() => removeUrl(url.id)}
                  variant="ghost"
                  size="icon"
                  icon="Delete"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="upload-news-container">
      {/* Header */}
      <div className="upload-news-header">
        <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">Carga tus noticias para analizar</h1>
                    </div>

      {/* Contenido principal */}
      <div className="upload-news-main-content">
        <div className="upload-news-content-wrapper">
          <div className="upload-news-sections">
              
              {/* Navegación por pestañas con flujo secuencial */}
            <div className="upload-news-navigation">
              
              {/* Dropdown para móviles */}
              <div className="upload-news-mobile-dropdown" ref={dropdownRef}>
                <Button
                  onClick={handleDropdownToggle}
                  variant="stepper-dropdown"
                  active={activeSection === 'topics'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold">
                      {activeSection === 'topics' ? '1' : activeSection === 'mentions' ? '2' : activeSection === 'urls' ? '3' : '4'}
                    </div>
                    <span>{getCurrentStepText()}</span>
                    <div className="flex items-center gap-2">
                      {activeSection === 'topics' && workflowState.selectedTopics.length > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white min-w-[2rem] flex items-center justify-center">
                          {workflowState.selectedTopics.length}
                        </span>
                      )}
                      {activeSection === 'mentions' && workflowState.selectedMentions.length > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500 text-white min-w-[2rem] flex items-center justify-center">
                          {workflowState.selectedMentions.length}
                        </span>
                      )}
                      {activeSection === 'urls' && workflowState.urls.length > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500 text-white min-w-[2rem] flex items-center justify-center">
                          {workflowState.urls.length}
                        </span>
                      )}
                      {activeSection === 'summary' && isReadyToProcess && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500 text-white min-w-[2rem] flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                
                {isDropdownOpen && (
                  <div className="upload-news-dropdown-content">
                    <div
                      onClick={() => handleSectionChange('topics')}
                      className={`upload-news-dropdown-item ${activeSection === 'topics' ? 'active' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 1: Temas</div>
                        <div className="text-xs text-white/50">Selecciona los temas que quieres analizar</div>
                      </div>
                      {workflowState.selectedTopics.length > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white min-w-[2rem] flex items-center justify-center">
                          {workflowState.selectedTopics.length}
                        </span>
                      )}
                    </div>
                    
                    <div
                      onClick={() => isTopicsStepValid ? handleSectionChange('mentions') : undefined}
                      className={`upload-news-dropdown-item ${activeSection === 'mentions' ? 'active' : ''} ${!isTopicsStepValid ? 'disabled' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        !isTopicsStepValid ? 'bg-white/10' : 'bg-blue-500/20'
                      }`}>
                        {!isTopicsStepValid ? '🔒' : '2'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 2: Menciones</div>
                        <div className="text-xs text-white/50">
                          {!isTopicsStepValid ? 'Completa el paso anterior primero' : 'Elige las menciones que quieres buscar'}
                        </div>
                      </div>
                      {workflowState.selectedMentions.length > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500 text-white min-w-[2rem] flex items-center justify-center">
                          {workflowState.selectedMentions.length}
                        </span>
                      )}
                    </div>
                    
                    <div
                      onClick={() => isMentionsStepValid ? handleSectionChange('urls') : undefined}
                      className={`upload-news-dropdown-item ${activeSection === 'urls' ? 'active' : ''} ${!isMentionsStepValid ? 'disabled' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        !isMentionsStepValid ? 'bg-white/10' : 'bg-purple-500/20'
                      }`}>
                        {!isMentionsStepValid ? '🔒' : '3'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 3: Links</div>
                        <div className="text-xs text-white/50">
                          {!isMentionsStepValid ? 'Completa el paso anterior primero' : 'Agrega los links de las noticias'}
                        </div>
                      </div>
                      {workflowState.urls.length > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500 text-white min-w-[2rem] flex items-center justify-center">
                          {workflowState.urls.length}
                        </span>
                      )}
                    </div>
                    
                    <div
                      onClick={() => isUrlsStepValid ? handleSectionChange('summary') : undefined}
                      className={`upload-news-dropdown-item ${activeSection === 'summary' ? 'active' : ''} ${!isUrlsStepValid ? 'disabled' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        !isUrlsStepValid ? 'bg-white/10' : 'bg-orange-500/20'
                      }`}>
                        {!isUrlsStepValid ? '🔒' : '4'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 4: Procesar</div>
                        <div className="text-xs text-white/50">
                          {!isUrlsStepValid ? 'Completa el paso anterior primero' : 'Revisa y procesa las noticias'}
                        </div>
                      </div>
                      {isReadyToProcess && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500 text-white min-w-[2rem] flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
                {/* Indicador de progreso secuencial */}
                <div className="upload-news-step-indicators">
                  <div className="upload-news-step-item">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isTopicsStepValid 
                        ? 'bg-green-500 text-white' 
                        : activeSection === 'topics'
                        ? 'bg-green-500 text-white'
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
                        ? 'bg-blue-500 text-white'
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
                    <div className={`upload-news-step-connector ${
                      isUrlsStepValid ? 'bg-green-500' : 'bg-white/20'
                    }`}></div>
                  </div>
                  
                  <div className="upload-news-step-item">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSummaryStepValid 
                        ? 'bg-green-500 text-white' 
                        : activeSection === 'summary'
                        ? 'bg-orange-500 text-white'
                        : isUrlsStepValid
                        ? 'bg-white/30 text-white/70'
                        : 'bg-white/10 text-white/30'
                    }`}>
                      {isSummaryStepValid ? '✓' : '4'}
                    </div>
                  </div>
                </div>

                {/* Pestañas con numeración */}
                <div className="upload-news-tabs">
                  <Button
                    onClick={() => setActiveSection('topics')}
                    disabled={false} // Siempre habilitado
                    variant="stepper"
                    size="stepper"
                    active={activeSection === 'topics'}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-base">Temas</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                        workflowState.selectedTopics.length > 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/20 text-white/70'
                      }`}>
                        {workflowState.selectedTopics.length}
                      </span>
                      {isTopicsStepValid && (
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      )}
                    </div>
                    <span className="text-xs text-white/60">Selecciona los temas que quieres analizar</span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveSection('mentions')}
                    disabled={!isTopicsStepValid}
                    variant="stepper"
                    size="stepper"
                    active={activeSection === 'mentions'}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        !isTopicsStepValid ? 'bg-white/10' : 'bg-blue-500/20'
                      }`}>
                        {!isTopicsStepValid ? '🔒' : '2'}
                      </div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-base">Menciones</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                        workflowState.selectedMentions.length > 0 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/20 text-white/70'
                      }`}>
                        {workflowState.selectedMentions.length}
                      </span>
                      {isMentionsStepValid && (
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      )}
                    </div>
                    <span className="text-xs text-white/60">
                      {!isTopicsStepValid ? 'Completa el paso anterior primero' : 'Elige las menciones que quieres buscar'}
                    </span>
                  </Button>
                  
                  <Button
                    onClick={() => setActiveSection('urls')}
                    disabled={!isMentionsStepValid}
                    variant="stepper"
                    size="stepper"
                    active={activeSection === 'urls'}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        !isMentionsStepValid ? 'bg-white/10' : 'bg-purple-500/20'
                      }`}>
                        {!isMentionsStepValid ? '🔒' : '3'}
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Links</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
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
                    <span className="text-xs text-white/60">
                      {!isMentionsStepValid ? 'Completa el paso anterior primero' : 'Agrega los links de las noticias'}
                    </span>
                  </Button>
                  
                <Button
                    onClick={() => setActiveSection('summary')}
                    disabled={!isUrlsStepValid}
                    variant="stepper"
                    size="stepper"
                    active={activeSection === 'summary'}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        !isUrlsStepValid ? 'bg-white/10' : 'bg-orange-500/20'
                      }`}>
                        {!isUrlsStepValid ? '🔒' : '4'}
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Procesar noticias</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                        isReadyToProcess 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-white/20 text-white/70'
                      }`}>
                        {isReadyToProcess ? '✓' : '0'}
                      </span>
                      {isSummaryStepValid && (
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      )}
                    </div>
                    <span className="text-xs text-white/60">
                      {!isUrlsStepValid ? 'Completa el paso anterior primero' : 'Revisa y procesa las noticias'}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Contenido de la sección activa */}
              <div className="upload-news-panel">
                {activeSection === 'topics' && <TopicsSection />}
                {activeSection === 'mentions' && <MentionsSection />}
                {activeSection === 'urls' && <UrlsSection />}
                {activeSection === 'summary' && <SummarySection />}
              </div>

              {/* Botones de navegación */}
              <div className="flex justify-between items-center gap-4 mt-6">
                <Button
                  onClick={goToPreviousStep}
                  disabled={!canGoPrevious()}
                  variant="secondary"
                  size="default"
                  icon="ArrowLeft"
                  iconPosition="left"
                  className="flex-1"
                >
                  Anterior
                </Button>
                <Button
                  onClick={goToNextStep}
                  disabled={!canGoNext()}
                  variant="primary"
                  size="default"
                  icon="ArrowRight"
                  iconPosition="right"
                  className="flex-1"
                >
                  Siguiente
                </Button>
              </div>
              
            </div>
        </div>
      </div>

      {/* Modal de procesamiento de noticias */}
      <LoadingModal
        isOpen={isProcessing}
        title="Procesando noticias"
        description="Analizando contenido y extrayendo información. Esto puede tardar unos segundos..."
        variant="ai"
        size="lg"
        closable={false}
        icon={
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        }
      />

      {/* Modal de resultados del procesamiento */}
      {processResults && (
        <BatchProcessResultsModal
          isOpen={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            // Limpiar el workflow después de cerrar el modal
            clearUrls();
            clearTopics();
            clearMentions();
          }}
          results={processResults}
          onViewHistory={() => {
            setShowResultsModal(false);
            navigate('/history');
          }}
        />
      )}

      {/* Snackbar para errores de conexión/procesamiento */}
      <Snackbar
        message={errorMessage}
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        variant="error"
      />
    </div>
  );
}