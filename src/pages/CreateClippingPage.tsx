import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import { useNews } from '../hooks/useNews';
import type { ClippingMetrics, NewsItem } from '../services/api';
import * as XLSX from 'xlsx';
import MetricsCharts from '../components/MetricsCharts';

interface EventoTema {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  activo: boolean;
  etiquetas: string[];
}

// Usar la interfaz NewsItem de la API
type Noticia = NewsItem;

export default function CreateClippingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [eventosTemas, setEventosTemas] = useState<EventoTema[]>([]);
  const [isLoadingTemas, setIsLoadingTemas] = useState(true);

  // Hook para obtener las noticias
  const { news: allNews, loading: newsLoading } = useNews({ limit: 1000 });

  // Cargar temas reales de la base de datos
  useEffect(() => {
    if (allNews.length > 0) {
      try {
        setIsLoadingTemas(true);
        
        // Extraer temas únicos de las noticias
        const temasUnicos = [...new Set(allNews.map(news => news.topic?.name).filter(Boolean))];
        
        // Generar colores para cada tema
        const colores = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
        
        const temasFormateados: EventoTema[] = temasUnicos.map((tema, index) => ({
          id: (index + 1).toString(),
          nombre: tema!,
          descripcion: `Noticias relacionadas con ${tema}`,
          color: colores[index % colores.length],
          activo: true,
          etiquetas: [tema!.toLowerCase()]
        }));
        
        setEventosTemas(temasFormateados);
      } catch (error) {
        console.error('Error cargando temas:', error);
      } finally {
        setIsLoadingTemas(false);
      }
    }
  }, [allNews]);


  const [isLoadingNoticias, setIsLoadingNoticias] = useState(false);

  const [eventoTemaSeleccionado, setEventoTemaSeleccionado] = useState<string>('');
  const [noticiasSeleccionadas, setNoticiasSeleccionadas] = useState<Set<string>>(new Set());
  const [noticiasFiltradas, setNoticiasFiltradas] = useState<Noticia[]>([]);
  const [metricas, setMetricas] = useState<ClippingMetrics | null>(null);
  const [isLoadingMetricas, setIsLoadingMetricas] = useState(false);

  // Cargar noticias cuando cambia el evento/tema seleccionado
  useEffect(() => {
    const loadNoticiasPorTema = async () => {
      if (eventoTemaSeleccionado) {
        try {
          setIsLoadingNoticias(true);
          const eventoTema = eventosTemas.find(e => e.id === eventoTemaSeleccionado);
          
          if (eventoTema) {
            // Filtrar noticias por tema
            const noticiasDelTema = allNews.filter(noticia => noticia.topic?.name === eventoTema.nombre);
            
            setNoticiasFiltradas(noticiasDelTema);
            setNoticiasSeleccionadas(new Set());
          }
        } catch (error) {
          console.error('Error cargando noticias por tema:', error);
        } finally {
          setIsLoadingNoticias(false);
        }
      } else {
        setNoticiasFiltradas([]);
        setNoticiasSeleccionadas(new Set());
      }
    };

    loadNoticiasPorTema();
  }, [eventoTemaSeleccionado, eventosTemas, allNews]);

  const handleEventoTemaChange = (eventoId: string) => {
    setEventoTemaSeleccionado(eventoId);
  };

  const handleNoticiaToggle = (noticiaId: string) => {
    const nuevasSeleccionadas = new Set(noticiasSeleccionadas);
    if (nuevasSeleccionadas.has(noticiaId)) {
      nuevasSeleccionadas.delete(noticiaId);
    } else {
      nuevasSeleccionadas.add(noticiaId);
    }
    setNoticiasSeleccionadas(nuevasSeleccionadas);
  };

  const handleSeleccionarTodas = () => {
    const todasLasIds = noticiasFiltradas.map(noticia => noticia.id);
    setNoticiasSeleccionadas(new Set(todasLasIds));
  };

  const handleDeseleccionarTodas = () => {
    setNoticiasSeleccionadas(new Set());
  };

  const handleGenerarClipping = () => {
    if (noticiasSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una noticia para generar el clipping.');
      return;
    }

    const noticiasDelClipping = noticiasFiltradas.filter(noticia => 
      noticiasSeleccionadas.has(noticia.id)
    );

    // Generar Excel con las noticias seleccionadas
    try {
      // Preparar los datos para el Excel (mismo formato que noticias.xlsx)
      const excelData = noticiasDelClipping.map(noticia => ({
        'TITULO': noticia.title,
        'TIPO PUBLICACION': noticia.publication_type,
        'FECHA': noticia.date,
        'SOPORTE': noticia.support,
        'MEDIO': noticia.media,
        'SECCION': noticia.section,
        'AUTOR': noticia.author,
        'ENTREVISTADO': noticia.interviewee || '-',
        'TEMA': noticia.topic?.name || '-',
        'ETIQUETA_1': '-',
        'ETIQUETA_2': '-',
        'LINK': noticia.link,
        'ALCANCE': noticia.audience_size || '-',
        'COTIZACION': noticia.quotation || '-',
        'TAPA': '-',
        'VALORACION': noticia.valuation || '-',
        'EJE COMUNICACIONAL': '-',
        'FACTOR POLITICO': noticia.political_factor || '-',
        'CRISIS': noticia.crisis ? 'Sí' : 'No',
        'GESTION': '-',
        'AREA': '-',
        'MENCION_1': noticia.mentions[0]?.name || '-',
        'MENCION_2': noticia.mentions[1]?.name || '-',
        'MENCION_3': noticia.mentions[2]?.name || '-',
        'MENCION_4': noticia.mentions[3]?.name || '-',
        'MENCION_5': noticia.mentions[4]?.name || '-'
      }));

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Agregar el worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Noticias');

      // Generar el nombre del archivo con fecha y tema
      const eventoTema = getEventoTemaById(eventoTemaSeleccionado);
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `clipping_${eventoTema?.nombre?.replace(/\s+/g, '_')}_${fecha}.xlsx`;

      // Descargar el archivo
      XLSX.writeFile(workbook, nombreArchivo);

      console.log('Excel generado con éxito:', nombreArchivo);
      alert(`Excel generado con ${noticiasDelClipping.length} noticias seleccionadas.\nArchivo: ${nombreArchivo}`);
    } catch (error) {
      console.error('Error generando Excel:', error);
      alert('Error al generar el archivo Excel. Por favor, intenta nuevamente.');
    }
  };

  const handleGenerarMetricas = async () => {
    if (noticiasSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una noticia para generar las métricas.');
      return;
    }

    try {
      setIsLoadingMetricas(true);
      const newsIds = Array.from(noticiasSeleccionadas);
      const response = await apiService.calculateClippingMetrics(newsIds);
      setMetricas(response.metricas);
      console.log('Métricas calculadas:', response.metricas);
    } catch (error) {
      console.error('Error generando métricas:', error);
      alert('Error al generar las métricas. Por favor, intenta nuevamente.');
    } finally {
      setIsLoadingMetricas(false);
    }
  };

  const handleGenerarInforme = () => {
    if (noticiasSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una noticia para generar el informe.');
      return;
    }

    const noticiasDelClipping = noticiasFiltradas.filter(noticia => 
      noticiasSeleccionadas.has(noticia.id)
    );

    // Aquí iría la lógica para generar informe
    console.log('Generando informe con:', noticiasDelClipping);
    alert(`Informe generado con ${noticiasDelClipping.length} noticias seleccionadas.`);
  };

  const getEventoTemaById = (id: string) => {
    return eventosTemas.find(evento => evento.id === id);
  };

  return (
    <div className="dashboard-container w-full h-screen relative overflow-x-hidden" style={{ backgroundColor: '#1e293b' }}>
      {/* Fondo que cubre TODA la pantalla */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen"
        style={{
          backgroundImage: `url('/images/fondodashboard.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}
      ></div>

      {/* Overlay muy sutil */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-black/5" 
        style={{ zIndex: 1 }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full">
        {/* Header transparente */}
        <div className="bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10 w-full">
          <div className="w-full py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="w-32 h-32 flex items-center justify-center">
                  <img 
                    src="/images/fondoblanco.png" 
                    alt="PrensAI Logo" 
                    className="w-28 h-28 object-contain"
                    onError={(e) => {
                      console.log('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    PrensAI
                  </h1>
                  <p className="text-white/80 text-sm font-medium">Crear Clipping</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white drop-shadow-md">Bienvenido, {user?.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full py-16 px-6 h-full">
          {/* Título y descripción */}
          <div className="mb-32 text-center">
            <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Crear Clipping</h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-md">
              Selecciona un evento/tema y elige las noticias que quieres incluir en tu clipping
            </p>
          </div>

          {/* Paso 1: Seleccionar Evento/Tema */}
          <div className="mt-16 mb-40">
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Paso 1: Selecciona un Evento/Tema</h3>
            
            {isLoadingTemas ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-white/80">Cargando temas...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventosTemas.filter(evento => evento.activo).map((evento) => (
                <button
                  key={evento.id}
                  onClick={() => handleEventoTemaChange(evento.id)}
                  style={{
                    backgroundColor: eventoTemaSeleccionado === evento.id 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    border: eventoTemaSeleccionado === evento.id 
                      ? '2px solid rgba(255, 255, 255, 0.5)' 
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: eventoTemaSeleccionado === evento.id 
                      ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (eventoTemaSeleccionado !== evento.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (eventoTemaSeleccionado !== evento.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: evento.color }}
                    ></div>
                    <div className="text-left">
                      <h4 style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {evento.nombre}
                      </h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '4px' }}>
                        {evento.descripcion}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              </div>
            )}
          </div>

          {/* Paso 2: Seleccionar Noticias */}
          {eventoTemaSeleccionado && (
            <div className="mt-16 mb-40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white drop-shadow-md">
                  Paso 2: Selecciona las noticias para el clipping
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSeleccionarTodas}
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      fontWeight: '700',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ✅ Marcar todas
                  </button>
                  <button
                    onClick={handleDeseleccionarTodas}
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      fontWeight: '700',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ❌ Desmarcar todas
                  </button>
                </div>
              </div>

                             {isLoadingNoticias ? (
                 <div className="flex justify-center items-center py-12">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                   <span className="ml-3 text-white/80">Cargando noticias...</span>
                 </div>
               ) : noticiasFiltradas.length > 0 ? (
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-black/20">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={noticiasSeleccionadas.size === noticiasFiltradas.length && noticiasFiltradas.length > 0}
                              onChange={() => {
                                if (noticiasSeleccionadas.size === noticiasFiltradas.length) {
                                  handleDeseleccionarTodas();
                                } else {
                                  handleSeleccionarTodas();
                                }
                              }}
                              className="rounded border-white/30 bg-black/20 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TÍTULO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TIPO PUBLICACIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">FECHA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">SOPORTE</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MEDIO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">SECCIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">AUTOR</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">CONDUCTOR</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ENTREVISTADO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TEMA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ETIQUETA_1</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ETIQUETA_2</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">LINK</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ALCANCE</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">COTIZACIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TAPA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">VALORACIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">EJE COMUNICACIONAL</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">FACTOR POLÍTICO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">CRISIS</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">GESTIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ÁREA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_1</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_2</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_3</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_4</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_5</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {noticiasFiltradas.map((noticia) => (
                          <tr key={noticia.id} className="hover:bg-black/20 transition-colors duration-200">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={noticiasSeleccionadas.has(noticia.id)}
                                onChange={() => handleNoticiaToggle(noticia.id)}
                                className="rounded border-white/30 bg-black/20 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-semibold text-white max-w-xs truncate text-center">{noticia.title}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.publication_type}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.date}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.support}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.media}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.section}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.author}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">-</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.interviewee || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.topic?.name || 'Sin tema'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[0]?.name || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[1]?.name || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90">
                                <a href={noticia.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                                  Ver
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.audience_size || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.quotation || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">-</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                                noticia.valuation === 'positive' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-300/30' 
                                  : noticia.valuation === 'neutral'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-300/30'
                                  : noticia.valuation === 'negative'
                                  ? 'bg-red-500/20 text-red-300 border border-red-300/30'
                                  : 'bg-white/20 text-white/90 border border-white/30'
                              }`}>
                                {noticia.valuation || 'Sin valoración'}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">-</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.political_factor || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.crisis ? 'Sí' : 'No'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">-</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">-</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[0]?.name || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[1]?.name || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[2]?.name || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[3]?.name || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mentions[4]?.name || '-'}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                             ) : (
                 <div className="text-center py-12">
                   <p className="text-white/60 text-lg">No hay noticias disponibles para este evento/tema</p>
                 </div>
               )}
            </div>
          )}

          {/* Paso 3: Descargar Excel */}
          {eventoTemaSeleccionado && noticiasSeleccionadas.size > 0 && (
            <div className="mt-16 mb-40">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                Paso 3: Descargar Excel
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Opcional. Se descargará un archivo Excel con las noticias seleccionadas y sus respectivos campos de análisis
              </p>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 mb-2">
                      <span className="font-semibold">Evento/Tema:</span> {getEventoTemaById(eventoTemaSeleccionado)?.nombre}
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">Noticias seleccionadas:</span> {noticiasSeleccionadas.size} de {noticiasFiltradas.length}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerarClipping}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Generar Métricas e Informe */}
          {eventoTemaSeleccionado && noticiasSeleccionadas.size > 0 && (
            <div className="mt-16 mb-40">
              <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">
                Paso 4: Generar Métricas e Informe
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card: Generar Métricas */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-green-300/20 mb-3">
                      <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Generar Métricas</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4 text-center">
                    Genera análisis estadísticos y métricas detalladas de las noticias seleccionadas
                  </p>
                  <button
                    onClick={handleGenerarMetricas}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Generar Métricas
                  </button>
                </div>

                {/* Card: Generar Informe */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-purple-300/20 mb-3">
                      <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Generar Informe</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4 text-center">
                    Crea un informe completo con análisis y conclusiones de las noticias seleccionadas
                  </p>
                  <button
                    onClick={handleGenerarInforme}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Generar Informe
                  </button>
                </div>
              </div>

              {/* Visualización de Métricas */}
              {metricas && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-white mb-4 drop-shadow-md">
                    📊 Métricas Calculadas
                  </h4>
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <MetricsCharts metricas={metricas} />
                    
                    {/* Botón para descargar PDF */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => {
                          // TODO: Implementar descarga de PDF
                          alert('Funcionalidad de descarga de PDF próximamente disponible');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        📄 Descargar PDF con Métricas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading state para métricas */}
              {isLoadingMetricas && (
                <div className="mt-8 flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="ml-3 text-white/80">Calculando métricas...</span>
                </div>
              )}
            </div>
          )}

          {/* Resumen */}
          {eventoTemaSeleccionado && (
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h4 className="text-lg font-bold text-white mb-4">Resumen</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
                <div>
                  <p className="font-semibold">Evento/Tema seleccionado:</p>
                  <p>{getEventoTemaById(eventoTemaSeleccionado)?.nombre || 'Ninguno'}</p>
                </div>
                <div>
                  <p className="font-semibold">Total de noticias disponibles:</p>
                  <p>{noticiasFiltradas.length}</p>
                </div>
                <div>
                  <p className="font-semibold">Noticias seleccionadas:</p>
                  <p>{noticiasSeleccionadas.size}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 