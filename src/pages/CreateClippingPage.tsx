import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ClippingData } from '../services/api';
import { useEnabledTopics } from '../hooks';
import { NewsTable, Snackbar } from '../components/common';
import { Button } from '../components/ui/button';
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
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [selectedNewsIds, setSelectedNewsIds] = useState<Set<number>>(new Set());
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Estados para procesamiento
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStatus, setGeneratingStatus] = useState('');
  
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
    console.log('Título actual:', currentTitle);
    
    // Validar que hay noticias seleccionadas
    if (!isNewsStepValid) {
      setErrorMessage('Por favor selecciona al menos una noticia para generar el clipping');
      return;
    }
    
    // Validar que hay un título
    if (!currentTitle || !currentTitle.trim()) {
      console.log('Título vacío, estableciendo mensaje de error');
      setTitleError('Por favor ingresa un título');
      return;
    }
    
    // Limpiar errores si todo está bien
    setTitleError('');

    setIsGenerating(true);
    setGeneratingStatus('Generando clipping...');

    try {
      const clippingData: ClippingData = {
        title: currentTitle.trim(),
        topic_id: selectedTopic!,
        start_date: dateFrom,
        end_date: dateTo,
        news_ids: Array.from(selectedNewsIds)
      };

      await apiService.createClipping(clippingData);
      
      setSuccessMessage(`Clipping "${currentTitle}" generado exitosamente con ${selectedNewsIds.size} noticias`);
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

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
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Selecciona el tema que quieres analizar para tu clipping
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
                className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full min-w-[160px] sm:min-w-[180px] max-w-[240px] ${
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


  // Componente de selección de noticias
  const NewsSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
            <h3 className="upload-news-section-title">Paso 2: Selecciona noticias</h3>
            
            <div className="upload-news-tip">
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Las noticias se cargan automáticamente. Ajusta las fechas y haz clic en "Filtrar" para actualizar
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
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
  const GenerateSection = () => (
    <div className="upload-news-section">
      <div className="upload-news-section-header">
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2 lg:gap-0">
            <h3 className="upload-news-section-title">Paso 3: Generar clipping</h3>
            <div className="upload-news-tip">
              <p className="upload-news-tip-text">
                💡 <strong>Tip:</strong> Ingresa un título y haz clic en "Generar Clipping" para crear tu clipping
              </p>
            </div>
            <div className="upload-news-section-actions">
                  <Button
                onClick={generateClipping}
                disabled={isGenerating}
                variant="success"
                size="lg"
                icon="Generate"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Generando...</span>
                  </>
                ) : (
                  <span>Generar Clipping</span>
                )}
                  </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Campo de título */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
          <h4 className="text-base sm:text-lg font-semibold text-white flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Título del clipping <span className="text-red-400">*</span>
          </h4>
          <p 
                    style={{ 
              color: '#FFFFFF', 
              opacity: 0.6,
                      fontSize: '14px',
              marginBottom: '12px'
            }}
          >
            Este título identificará tu clipping en el sistema
          </p>
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Ej: Clipping Política - Enero 2024"
            className="w-full bg-white/10 backdrop-filter backdrop-blur-sm border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            autoComplete="off"
            spellCheck="false"
          />
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg" style={{ display: titleError ? 'block' : 'none' }}>
            <p className="text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {titleError}
            </p>
          </div>
        </div>

        {/* Espaciado personalizado */}
        <div style={{ height: '60px' }}></div>

        {/* Resumen de configuración */}
        <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
            <div>
              <p className="font-semibold">Tema seleccionado:</p>
              <p>{enabledTopics.find(t => t.id === selectedTopic)?.name || 'Ninguno'}</p>
            </div>
            <div>
              <p className="font-semibold">Período:</p>
              <p>{dateFrom && dateTo ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}` : 'No definido'}</p>
            </div>
            <div>
              <p className="font-semibold">Noticias seleccionadas:</p>
              <p>{selectedNewsIds.size}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
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
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold">
                      {activeSection === 'topic' ? '1' : activeSection === 'news' ? '2' : '3'}
                    </div>
                    <span>{getCurrentStepText()}</span>
                    <div className="flex items-center gap-2">
                      {activeSection === 'topic' && selectedTopic && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500 text-white">
                          ✓
                        </span>
                      )}
                      {activeSection === 'news' && selectedNewsIds.size > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-500 text-white">
                          {selectedNewsIds.size}
                        </span>
                      )}
                      {activeSection === 'generate' && isGenerateStepValid && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
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
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 1: Tema</div>
                        <div className="text-xs text-white/50">Selecciona el tema a analizar</div>
                      </div>
                      {isTopicStepValid && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500 text-white">
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
                        {!isTopicStepValid ? '🔒' : '2'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 2: Noticias</div>
                        <div className="text-xs text-white/50">
                          {!isTopicStepValid ? 'Completa el paso anterior primero' : 'Selecciona fechas y noticias'}
                        </div>
                      </div>
                      {selectedNewsIds.size > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-500 text-white">
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
                        {!isNewsStepValid ? '🔒' : '3'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paso 3: Generar</div>
                        <div className="text-xs text-white/50">
                          {!isNewsStepValid ? 'Completa el paso anterior primero' : 'Genera el clipping'}
                        </div>
                      </div>
                      {isGenerateStepValid && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
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
                      ? 'bg-blue-500 text-white'
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
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-base">Tema</span>
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
                      {!isTopicStepValid ? '🔒' : '2'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Noticias</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
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
                      {!isNewsStepValid ? '🔒' : '3'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generar</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
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
            
          </div>
                </div>
                </div>

      {/* Overlay de procesamiento mejorado */}
      {isGenerating && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="generating-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div className="w-auto max-w-sm mx-4 rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300 min-h-[400px] flex flex-col justify-center">
            {/* Spinner principal centrado */}
            <div className="flex justify-center py-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/30 to-emerald-500/30 animate-ping"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-500/40 to-emerald-500/40 border border-blue-400/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Contenido del modal centrado */}
            <div className="text-center">
              <h3 id="generating-title" className="text-xl font-bold text-white py-6">
                {generatingStatus || 'Generando clipping…'}
              </h3>
              <p className="text-white/70 text-sm py-6">
                Procesando noticias seleccionadas
              </p>
              <p className="text-white/60 text-xs py-4">
                Esto puede tardar unos segundos. Por favor, no cierres esta ventana.
              </p>
            </div>
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
        variant="success"
      />
    </div>
  );
} 