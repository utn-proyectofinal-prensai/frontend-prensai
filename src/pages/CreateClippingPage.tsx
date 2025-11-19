import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ClippingData } from '../services/api';
import { useEnabledTopics } from '../hooks';
import { NewsTable, Snackbar } from '../components/common';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LoadingModal } from '../components/ui/loading-modal';
import { PageHeader } from '../components/ui/page-header';
import '../styles/upload-news.css';


export default function CreateClippingPage() {
  const navigate = useNavigate();
  const { topics: enabledTopics, loading: topicsLoading } = useEnabledTopics();
  
  // Estados para el flujo de tabs
  const [activeSection, setActiveSection] = useState<'topic' | 'news' | 'generate'>('topic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Estados para los datos del clipping
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 9);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [selectedNewsIds, setSelectedNewsIds] = useState<Set<number>>(new Set());
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Estados para procesamiento
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Estados para mensajes
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [titleError, setTitleError] = useState('');


  // Validaciones de pasos (memoizadas para evitar re-renders)
  const isTopicStepValid = useMemo(() => {
    return selectedTopic !== null;
  }, [selectedTopic]);
  const isDatesStepValid = useMemo(() => dateTo && (!dateFrom || new Date(dateFrom) <= new Date(dateTo)), [dateFrom, dateTo]);
  const isNewsStepValid = useMemo(() => selectedNewsIds.size > 0, [selectedNewsIds.size]);
  const isGenerateStepValid = useMemo(() => isNewsStepValid, [isNewsStepValid]);

  // Funciones para el dropdown
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSectionChange = (section: 'topic' | 'news' | 'generate') => {
    setActiveSection(section);
    setIsDropdownOpen(false);
  };

  // Funciones para navegación entre pasos
  const goToNextStep = () => {
    // Si estamos en generate, procesar el clipping
    if (activeSection === 'generate') {
      generateClipping();
      return;
    }
    
    const steps: Array<'topic' | 'news' | 'generate'> = ['topic', 'news', 'generate'];
    const currentIndex = steps.indexOf(activeSection);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      // Verificar que el paso actual sea válido antes de avanzar
      if (
        (activeSection === 'topic' && isTopicStepValid) ||
        (activeSection === 'news' && isNewsStepValid)
      ) {
        setActiveSection(nextStep);
      }
    }
  };

  const goToPreviousStep = () => {
    const steps: Array<'topic' | 'news' | 'generate'> = ['topic', 'news', 'generate'];
    const currentIndex = steps.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(steps[currentIndex - 1]);
    }
  };

  // Determinar si se puede avanzar
  const canGoNext = () => {
    switch (activeSection) {
      case 'topic':
        return isTopicStepValid;
      case 'news':
        return isNewsStepValid;
      case 'generate':
        return isGenerateStepValid && !isGenerating;
      default:
        return false;
    }
  };

  // Determinar si se puede retroceder
  const canGoPrevious = () => {
    return activeSection !== 'topic';
  };

  // Función para obtener el texto del paso actual
  const getCurrentStepText = () => {
    switch (activeSection) {
      case 'topic':
        return 'Paso 1: Tema';
      case 'news':
        return 'Paso 2: Noticias';
      case 'generate':
        return 'Paso 3: Generar';
      default:
        return 'Paso 1: Tema';
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

  // Cargar noticias automáticamente cuando se selecciona un tema
  useEffect(() => {
    if (selectedTopic === null) {
      setFilteredNews([]);
      setSelectedNewsIds(new Set());
    } else {
      // Cargar noticias automáticamente con los filtros por defecto
      loadFilteredNews();
    }
  }, [selectedTopic]);

  // Limpiar error cuando hay texto en el input (solo cuando se intenta generar)
  useEffect(() => {
    if (titleError && titleInputRef.current?.value?.trim()) {
      setTitleError('');
    }
  }, [titleError]);

  // Función para cargar noticias filtradas
  const loadFilteredNews = async () => {
    if (!selectedTopic || !dateTo) {
      setFilteredNews([]);
      setSelectedNewsIds(new Set());
      return;
    }

    setIsLoadingNews(true);
    try {
      const response = await apiService.getNews({
        topic_id: selectedTopic,
        start_date: dateFrom || undefined,
        end_date: dateTo,
        limit: 1000
      });
      setFilteredNews(response.news);
      setSelectedNewsIds(new Set());
    } catch (error) {
      console.error('Error cargando noticias:', error);
      setErrorMessage('Error al cargar las noticias filtradas');
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Manejar selección de noticias
  const handleNewsToggle = (newsId: number) => {
    const newSelected = new Set(selectedNewsIds);
    if (newSelected.has(newsId)) {
      newSelected.delete(newsId);
    } else {
      newSelected.add(newsId);
    }
    setSelectedNewsIds(newSelected);
  };

  const handleSelectAllNews = () => {
    setSelectedNewsIds(new Set(filteredNews.map(news => news.id)));
  };

  const handleDeselectAllNews = () => {
    setSelectedNewsIds(new Set());
  };


  // Generar clipping
  const generateClipping = async () => {
    // Obtener el valor actual del input usando el ref
    const currentTitle = titleInputRef.current?.value;
    
    // Validar que hay noticias seleccionadas
    if (!isNewsStepValid) {
      setErrorMessage('Por favor selecciona al menos una noticia para generar el clipping');
      return;
    }
    
    // Validar que hay un título
    if (!currentTitle || !currentTitle.trim()) {
      setTitleError('Por favor ingresa un título');
      return;
    }
    
    // Limpiar errores si todo está bien
    setTitleError('');

    setIsGenerating(true);

    try {
      const clippingData: ClippingData = {
        name: currentTitle.trim(),
        topic_id: selectedTopic!,
        start_date: dateFrom,
        end_date: dateTo,
        news_ids: Array.from(selectedNewsIds)
      };

      const response = await apiService.createClipping(clippingData);
      
      // Verificar que la respuesta tenga la estructura esperada
      if (!response || !response.id) {
        console.error('Respuesta inesperada de la API:', response);
        setErrorMessage('Error: La respuesta del servidor no tiene el formato esperado.');
        return;
      }

      // Obtener el nombre del tema desde la respuesta o desde enabledTopics
      const topicName = response.topic?.name || enabledTopics.find(t => t.id === selectedTopic)?.name || 'Sin tema';

      // Redirigir a la página de resultados con los datos del clipping (usando todos los valores de la API)
      navigate('/clipping-results', {
        state: {
          result: {
            clipping: {
              id: response.id,
              title: response.name,
              created_at: response.created_at
            },
            message: `El clipping "${response.name}" se creó exitosamente.`,
            newsCount: response.news_ids?.length || selectedNewsIds.size,
            topicName: topicName,
            startDate: response.start_date,
            endDate: response.end_date
          }
        }
      });

    } catch (error) {
      console.error('Error generando clipping:', error);
      setErrorMessage('Error al generar el clipping. Por favor, intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Componente de selección de tema
  const TopicSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
            <h3 className="upload-news-section-title">Paso 1: Selecciona un tema</h3>
            <div className="upload-news-tip">
              <p className="upload-news-tip-text flex items-center justify-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <strong>Tip:</strong> Selecciona el tema que quieres analizar para tu clipping
              </p>
            </div>
                </div>
                </div>
              </div>
              
      {topicsLoading ? (
        <div className="text-center py-8 text-white/70">Cargando temas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-h-80 overflow-y-auto justify-items-center">
          {enabledTopics.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
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


  // Componente de selección de noticias
  const NewsSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
            <h3 className="upload-news-section-title">Paso 2: Selecciona noticias</h3>
            
            <div className="upload-news-tip">
              <p className="upload-news-tip-text flex items-center justify-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <strong>Tip:</strong> Ajusta las fechas y haz clic en "Filtrar" para actualizar
              </p>
            </div>
            
            {/* Rango de fechas en línea */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span 
                  style={{ 
                    color: '#FFFFFF', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    display: 'block'
                  }}
                >
                  Desde:
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-10 bg-white/10 backdrop-filter backdrop-blur-sm border border-white/20 rounded-lg px-3 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <span 
                  style={{ 
                    color: '#FFFFFF', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    display: 'block'
                  }}
                >
                  Hasta:
                </span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-10 bg-white/10 backdrop-filter backdrop-blur-sm border border-white/20 rounded-lg px-3 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <Button
                onClick={loadFilteredNews}
                disabled={!isDatesStepValid}
                variant="primary"
                size="default"
                icon="Search"
              >
                Filtrar
              </Button>
              </div>
            </div>
          </div>
        </div>

      {isLoadingNews ? (
        <div className="text-center py-8 text-white/70">
          <div className="relative inline-flex items-center justify-center mx-auto mb-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500/30 border-t-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          Cargando noticias...
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-white/80">
              {filteredNews.length} noticias encontradas • {selectedNewsIds.size} seleccionadas
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleSelectAllNews}
                variant="success"
                size="default"
                icon="Check"
              >
                Seleccionar todo
              </Button>
              <Button
                onClick={handleDeselectAllNews}
                variant="secondary"
                size="default"
                icon="Refresh"
              >
                Limpiar
              </Button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <NewsTable 
              news={filteredNews}
              showEditButton={false}
              onEditNews={() => {}} // No editamos en este contexto
              selectedNewsIds={selectedNewsIds}
              onNewsToggle={handleNewsToggle}
            />
          </div>
        </div>
      ) : isTopicStepValid && isDatesStepValid ? (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No se encontraron noticias para los filtros seleccionados</p>
          <p className="text-white/40 text-sm mt-2">Intenta ajustar el rango de fechas y vuelve a filtrar</p>
              </div>
            ) : (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">Selecciona un tema para cargar las noticias automáticamente</p>
              </div>
            )}
          </div>
  );

  // Componente de generación
  const GenerateSection = () => {
    const [expandedNews, setExpandedNews] = useState(false);

    return (
      <div className="upload-news-section">
        <div className="upload-news-section-header">
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
              <h3 className="upload-news-section-title">Paso 3: Generar clipping</h3>
              <div className="upload-news-tip">
                <p className="upload-news-tip-text flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <strong>Tip:</strong> Agrega un título para generar el clipping y revisa la información antes de continuar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Campo de título */}
        <div className="clipping-title-input-wrapper">
          <Input
            ref={titleInputRef}
            label="Título del clipping"
            type="text"
            placeholder="Ej: Clipping Política - Enero 2024"
            error={titleError || undefined}
            helperText="Este título identificará tu clipping en el sistema"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Dropdowns de resumen */}
        <div>
          {/* Tema seleccionado - Estático */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden" style={{ marginBottom: '1.5rem' }}>
            <div className="w-full flex items-center justify-between p-4" style={{ minHeight: '72px', cursor: 'default', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-green-300/30 flex-shrink-0">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white">Tema seleccionado</h4>
                  <p className="text-sm text-white/70">{enabledTopics.find(t => t.id === selectedTopic)?.name || 'Ninguno'}</p>
                </div>
              </div>
              <div className="w-5 h-5 flex-shrink-0"></div>
            </div>
          </div>

          {/* Período - Estático */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden" style={{ marginBottom: '1.5rem' }}>
            <div className="w-full flex items-center justify-between p-4" style={{ minHeight: '72px', cursor: 'default', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-blue-300/30 flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white">Período</h4>
                  <p className="text-sm text-white/70">
                    {dateFrom && dateTo ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}` : 'No definido'}
                  </p>
                </div>
              </div>
              <div className="w-5 h-5 flex-shrink-0"></div>
            </div>
          </div>

          {/* Dropdown de Noticias */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setExpandedNews(!expandedNews)}
              className="w-full flex items-center justify-between hover:bg-white/5 transition-colors"
              style={{ minHeight: '72px', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1rem', paddingBottom: '1rem' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-purple-300/30 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white">Noticias seleccionadas</h4>
                  <p className="text-sm text-white/70">{selectedNewsIds.size} noticia{selectedNewsIds.size !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <svg 
                className={`w-5 h-5 text-white/70 transition-transform flex-shrink-0 ${expandedNews ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedNews && (
              <div className="border-t border-white/10 pt-4 pb-4" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                {selectedNewsIds.size > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {Array.from(selectedNewsIds).map((newsId) => {
                      const news = filteredNews.find(n => n.id === newsId);
                      return news ? (
                        <div key={newsId} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-white/80 truncate text-sm">
                              <strong>{news.title}</strong>
                              {news.media && <span> - {news.media}</span>}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {news.link && (
                              <Button
                                onClick={() => window.open(news.link, '_blank')}
                                variant="ghost"
                                size="icon"
                                icon="ExternalLink"
                              />
                            )}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm text-center py-4">No hay noticias seleccionadas</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Crear Clipping"
        description="Genera reportes personalizados seleccionando un tema y noticias"
        className="mb-6"
      />
      <div className="upload-news-container">
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
                  active={activeSection === 'topic'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold">
                      {activeSection === 'topic' ? '1' : activeSection === 'news' ? '2' : '3'}
                    </div>
                    <span>{getCurrentStepText()}</span>
                    <div className="flex items-center gap-2">
                      {activeSection === 'topic' && selectedTopic && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white min-w-[2rem] flex items-center justify-center">
                          ✓
                        </span>
                      )}
                      {activeSection === 'news' && selectedNewsIds.size > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500 text-white min-w-[2rem] flex items-center justify-center">
                          {selectedNewsIds.size}
                        </span>
                      )}
                      {activeSection === 'generate' && isGenerateStepValid && (
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
                      onClick={() => handleSectionChange('topic')}
                      className={`upload-news-dropdown-item ${activeSection === 'topic' ? 'active' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 1: Tema</div>
                        <div className="text-xs text-white/50">Selecciona el tema a analizar</div>
                      </div>
                      {isTopicStepValid && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white min-w-[2rem] flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                    
                    <div
                      onClick={() => isTopicStepValid ? handleSectionChange('news') : undefined}
                      className={`upload-news-dropdown-item ${activeSection === 'news' ? 'active' : ''} ${!isTopicStepValid ? 'disabled' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        !isTopicStepValid ? 'bg-white/10' : 'bg-purple-500/20'
                      }`}>
                        {!isTopicStepValid ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : '2'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 2: Noticias</div>
                        <div className="text-xs text-white/50">
                          {!isTopicStepValid ? 'Completa el paso anterior primero' : 'Selecciona fechas y noticias'}
                        </div>
                      </div>
                      {selectedNewsIds.size > 0 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500 text-white min-w-[2rem] flex items-center justify-center">
                          {selectedNewsIds.size}
                        </span>
                      )}
                    </div>
                    
                    <div
                      onClick={() => isNewsStepValid ? handleSectionChange('generate') : undefined}
                      className={`upload-news-dropdown-item ${activeSection === 'generate' ? 'active' : ''} ${!isNewsStepValid ? 'disabled' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        !isNewsStepValid ? 'bg-white/10' : 'bg-orange-500/20'
                      }`}>
                        {!isNewsStepValid ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : '3'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 3: Generar</div>
                        <div className="text-xs text-white/50">
                          {!isNewsStepValid ? 'Completa el paso anterior primero' : 'Genera el clipping'}
                        </div>
                      </div>
                      {isGenerateStepValid && (
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
                    isTopicStepValid 
                      ? 'bg-green-500 text-white' 
                      : activeSection === 'topic'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white/50'
                  }`}>
                    {isTopicStepValid ? '✓' : '1'}
                  </div>
                  <div className={`upload-news-step-connector ${
                    isTopicStepValid ? 'bg-green-500' : 'bg-white/20'
                  }`}></div>
                </div>
                
                <div className="upload-news-step-item">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isNewsStepValid 
                      ? 'bg-green-500 text-white' 
                      : activeSection === 'news'
                      ? 'bg-purple-500 text-white'
                      : isTopicStepValid
                      ? 'bg-white/30 text-white/70'
                      : 'bg-white/10 text-white/30'
                  }`}>
                    {isNewsStepValid ? '✓' : '2'}
                 </div>
                  <div className={`upload-news-step-connector ${
                    isNewsStepValid ? 'bg-green-500' : 'bg-white/20'
                  }`}></div>
            </div>
                
                <div className="upload-news-step-item">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isGenerateStepValid 
                      ? 'bg-green-500 text-white' 
                      : activeSection === 'generate'
                      ? 'bg-orange-500 text-white'
                      : isNewsStepValid
                      ? 'bg-white/30 text-white/70'
                      : 'bg-white/10 text-white/30'
                  }`}>
                    {isGenerateStepValid ? '✓' : '3'}
                  </div>
                </div>
              </div>

              {/* Pestañas con numeración */}
              <div className="upload-news-tabs">
                <Button
                  onClick={() => setActiveSection('topic')}
                  disabled={false}
                  variant="stepper"
                  size="stepper"
                  active={activeSection === 'topic'}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-base">Tema</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                      selectedTopic 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white/70'
                    }`}>
                      {selectedTopic ? '✓' : '0'}
                    </span>
                    {selectedTopic && (
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    )}
                  </div>
                  <span className="text-xs text-white/60">Selecciona el tema a analizar</span>
                </Button>
                
                <Button
                  onClick={() => setActiveSection('news')}
                  disabled={!isTopicStepValid}
                  variant="stepper"
                  size="stepper"
                  active={activeSection === 'news'}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      !isTopicStepValid ? 'bg-white/10' : 'bg-purple-500/20'
                    }`}>
                      {!isTopicStepValid ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : '2'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Noticias</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                      selectedNewsIds.size > 0 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/20 text-white/70'
                    }`}>
                      {selectedNewsIds.size}
                    </span>
                    {isNewsStepValid && (
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    )}
                  </div>
                  <span className="text-xs text-white/60">
                    {!isTopicStepValid ? 'Completa el paso anterior primero' : 'Selecciona fechas y noticias'}
                  </span>
                </Button>
                
                <Button
                  onClick={() => setActiveSection('generate')}
                  disabled={!isNewsStepValid}
                  variant="stepper"
                  size="stepper"
                  active={activeSection === 'generate'}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      !isNewsStepValid ? 'bg-white/10' : 'bg-orange-500/20'
                    }`}>
                      {!isNewsStepValid ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : '3'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generar</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold min-w-[2rem] flex items-center justify-center ${
                      isGenerateStepValid 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white/20 text-white/70'
                    }`}>
                      {isGenerateStepValid ? '✓' : '0'}
                    </span>
                    {isGenerateStepValid && (
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    )}
                  </div>
                  <span className="text-xs text-white/60">
                    {!isNewsStepValid ? 'Completa el paso anterior primero' : 'Genera el clipping'}
                  </span>
                </Button>
                </div>
                </div>

            {/* Contenido de la sección activa */}
            <div className="upload-news-panel">
              {activeSection === 'topic' && <TopicSection />}
              {activeSection === 'news' && <NewsSection />}
              {activeSection === 'generate' && <GenerateSection />}
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
                variant={activeSection === 'generate' ? 'success' : 'primary'}
                size="default"
                icon={activeSection === 'generate' ? 'Generate' : 'ArrowRight'}
                iconPosition={activeSection === 'generate' ? 'left' : 'right'}
                className="flex-1"
              >
                {activeSection === 'generate' 
                  ? (isGenerating 
                      ? 'Generando...' 
                      : `Generar Clipping`)
                  : 'Siguiente'}
              </Button>
            </div>
            
          </div>
                </div>
                </div>

      {/* Modal de generación de clipping */}
      <LoadingModal
        isOpen={isGenerating}
        title="Generando clipping"
        description="Estamos procesando las noticias seleccionadas y creando el clipping. Esto puede tomar unos segundos..."
        variant="ai"
        size="lg"
        closable={false}
        icon={
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

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
        variant="success"
      />
      </div>
    </>
  );
} 