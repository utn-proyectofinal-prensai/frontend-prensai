import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: string;
  titulo: string;
  tipoPublicacion: string;
  fecha: string;
  soporte: string;
  medio: string;
  seccion: string;
  autor: string;
  conductor: string;
  entrevistado: string;
  tema: string;
  etiqueta1: string;
  etiqueta2: string;
  link: string;
  alcance: string;
  cotizacion: string;
  tapa: string;
  valoracion: string;
  ejeComunicacional: string;
  factorPolitico: string;
  crisis: string;
  gestion: string;
  area: string;
  mencion1: string;
  mencion2: string;
  mencion3: string;
  mencion4: string;
  mencion5: string;
  status: 'processed' | 'pending' | 'error';
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [newsHistory, setNewsHistory] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulación de datos históricos
  useEffect(() => {
    const mockData: NewsItem[] = [
      {
        id: '1',
        titulo: 'Nueva tecnología revoluciona el mercado financiero',
        tipoPublicacion: 'Nota',
        fecha: '2024-01-15',
        soporte: 'Digital',
        medio: 'El País',
        seccion: 'Tecnología',
        autor: 'Carlos Ruiz',
        conductor: '',
        entrevistado: '',
        tema: 'Tecnología',
        etiqueta1: 'Fintech',
        etiqueta2: 'Innovación',
        link: 'https://ejemplo.com/noticia1',
        alcance: 'Internacional',
        cotizacion: 'Alta',
        tapa: 'No',
        valoracion: 'Positiva',
        ejeComunicacional: 'Innovación',
        factorPolitico: 'Bajo',
        crisis: 'No',
        gestion: 'Privada',
        area: 'Tecnología',
        mencion1: 'CEO',
        mencion2: 'Analista',
        mencion3: '',
        mencion4: '',
        mencion5: '',
        status: 'processed'
      },
      {
        id: '2',
        titulo: 'Análisis del impacto económico en América Latina',
        tipoPublicacion: 'Reportaje',
        fecha: '2024-01-14',
        soporte: 'Digital',
        medio: 'BBC Mundo',
        seccion: 'Economía',
        autor: 'María González',
        conductor: '',
        entrevistado: '',
        tema: 'Economía',
        etiqueta1: 'América Latina',
        etiqueta2: 'Análisis',
        link: 'https://ejemplo.com/noticia2',
        alcance: 'Internacional',
        cotizacion: 'Media',
        tapa: 'No',
        valoracion: 'Neutral',
        ejeComunicacional: 'Transparencia',
        factorPolitico: 'Alto',
        crisis: 'No',
        gestion: 'Mixta',
        area: 'Economía',
        mencion1: 'Economista',
        mencion2: 'Analista',
        mencion3: '',
        mencion4: '',
        mencion5: '',
        status: 'processed'
      },
      {
        id: '3',
        titulo: 'Avances en investigación médica contra el cáncer',
        tipoPublicacion: 'Entrevista',
        fecha: '2024-01-13',
        soporte: 'Digital',
        medio: 'Nature',
        seccion: 'Ciencia',
        autor: 'Dr. Ana Silva',
        conductor: 'Roberto López',
        entrevistado: 'Dr. Juan Pérez',
        tema: 'Ciencia',
        etiqueta1: 'Medicina',
        etiqueta2: 'Investigación',
        link: 'https://ejemplo.com/noticia3',
        alcance: 'Internacional',
        cotizacion: 'Alta',
        tapa: 'Sí',
        valoracion: 'Muy Positiva',
        ejeComunicacional: 'Innovación',
        factorPolitico: 'Bajo',
        crisis: 'No',
        gestion: 'Privada',
        area: 'Ciencia',
        mencion1: 'Investigador',
        mencion2: 'Médico',
        mencion3: 'Universidad',
        mencion4: '',
        mencion5: '',
        status: 'processed'
      },
      {
        id: '4',
        titulo: 'Cambios climáticos afectan producción agrícola',
        tipoPublicacion: 'Nota',
        fecha: '2024-01-12',
        soporte: 'Impreso',
        medio: 'Reuters',
        seccion: 'Medio Ambiente',
        autor: 'Laura Martínez',
        conductor: '',
        entrevistado: '',
        tema: 'Medio Ambiente',
        etiqueta1: 'Clima',
        etiqueta2: 'Agricultura',
        link: 'https://ejemplo.com/noticia4',
        alcance: 'Nacional',
        cotizacion: 'Media',
        tapa: 'No',
        valoracion: 'Negativa',
        ejeComunicacional: 'Sostenibilidad',
        factorPolitico: 'Medio',
        crisis: 'Sí',
        gestion: 'Mixta',
        area: 'Agricultura',
        mencion1: 'Productor',
        mencion2: 'Especialista',
        mencion3: '',
        mencion4: '',
        mencion5: '',
        status: 'processed'
      },
      {
        id: '5',
        titulo: 'Nuevas políticas educativas en Europa',
        tipoPublicacion: 'Nota',
        fecha: '2024-01-11',
        soporte: 'Digital',
        medio: 'Le Monde',
        seccion: 'Educación',
        autor: 'Pierre Dubois',
        conductor: '',
        entrevistado: '',
        tema: 'Educación',
        etiqueta1: 'Europa',
        etiqueta2: 'Políticas',
        link: 'https://ejemplo.com/noticia5',
        alcance: 'Internacional',
        cotizacion: 'Media',
        tapa: 'No',
        valoracion: 'Neutral',
        ejeComunicacional: 'Transparencia',
        factorPolitico: 'Alto',
        crisis: 'No',
        gestion: 'Legislativa',
        area: 'Educación',
        mencion1: 'Ministro',
        mencion2: 'Especialista',
        mencion3: '',
        mencion4: '',
        mencion5: '',
        status: 'pending'
      },
      {
        id: '6',
        titulo: 'Innovaciones en transporte público urbano',
        tipoPublicacion: 'Reportaje',
        fecha: '2024-01-10',
        soporte: 'Digital',
        medio: 'The Guardian',
        seccion: 'Transporte',
        autor: 'Sarah Johnson',
        conductor: '',
        entrevistado: '',
        tema: 'Transporte',
        etiqueta1: 'Urbano',
        etiqueta2: 'Innovación',
        link: 'https://ejemplo.com/noticia6',
        alcance: 'Nacional',
        cotizacion: 'Baja',
        tapa: 'No',
        valoracion: 'Positiva',
        ejeComunicacional: 'Desarrollo',
        factorPolitico: 'Medio',
        crisis: 'No',
        gestion: 'Municipal',
        area: 'Transporte',
        mencion1: 'Alcalde',
        mencion2: 'Especialista',
        mencion3: '',
        mencion4: '',
        mencion5: '',
        status: 'error'
      }
    ];

    // Simular carga
    setTimeout(() => {
      setNewsHistory(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processed':
        return 'Procesado';
      case 'pending':
        return 'Pendiente';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      case 'neutral':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredNews = newsHistory.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.medio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tema?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
          <div className="w-full px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/')}
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
                  <p className="text-white/80 text-sm font-medium">Historial de noticias</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full px-6 py-8 h-full overflow-y-auto flex justify-center">
          <div className="max-w-7xl w-full">
            
            {/* Header de la página */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                Historial de Noticias Procesadas
              </h2>
              <p className="text-white/80 text-lg">
                Revisa todas las noticias que han sido procesadas por el sistema
              </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Buscar
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por título, fuente o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  />
                </div>

                {/* Filtro por estado */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <option value="all" style={{ backgroundColor: '#1e293b', color: 'white' }}>Todos los estados</option>
                    <option value="processed" style={{ backgroundColor: '#1e293b', color: 'white' }}>Procesado</option>
                    <option value="pending" style={{ backgroundColor: '#1e293b', color: 'white' }}>Pendiente</option>
                    <option value="error" style={{ backgroundColor: '#1e293b', color: 'white' }}>Error</option>
                  </select>
                </div>

                {/* Estadísticas */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Total de noticias
                  </label>
                  <div className="text-2xl font-bold text-white">
                    {filteredNews.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de noticias */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white/80">Cargando historial...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-black/20">
                      <tr>
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
                        <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ESTADO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredNews.map((item) => (
                        <tr key={item.id} className="hover:bg-black/20 transition-colors duration-200">
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-semibold text-white max-w-xs truncate text-center">{item.titulo}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.tipoPublicacion}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.fecha}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.soporte}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.medio}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.seccion}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.autor}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.conductor || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.entrevistado || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.tema}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.etiqueta1}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.etiqueta2}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90">
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                                Ver
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.alcance}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.cotizacion}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.tapa}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                              item.valoracion === 'Muy Positiva' 
                                ? 'bg-green-500/20 text-green-300 border border-green-300/30' 
                                : item.valoracion === 'Positiva'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-300/30'
                                : item.valoracion === 'Negativa'
                                ? 'bg-red-500/20 text-red-300 border border-red-300/30'
                                : 'bg-white/20 text-white/90 border border-white/30'
                            }`}>
                              {item.valoracion}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.ejeComunicacional}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.factorPolitico}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.crisis}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.gestion}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.area}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.mencion1 || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.mencion2 || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.mencion3 || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.mencion4 || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="text-sm font-medium text-white/90 whitespace-nowrap">{item.mencion5 || '-'}</div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Paginación */}
            {!isLoading && filteredNews.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 px-6 py-3">
                  <div className="flex items-center space-x-4">
                    <button className="text-white/60 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-white">Página 1 de 1</span>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 