import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  dateProcessed: string;
  status: 'processed' | 'pending' | 'error';
  category?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
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
        title: 'Nueva tecnología revoluciona el mercado financiero',
        url: 'https://ejemplo.com/noticia1',
        source: 'El País',
        dateProcessed: '2024-01-15',
        status: 'processed',
        category: 'Tecnología',
        sentiment: 'positive'
      },
      {
        id: '2',
        title: 'Análisis del impacto económico en América Latina',
        url: 'https://ejemplo.com/noticia2',
        source: 'BBC Mundo',
        dateProcessed: '2024-01-14',
        status: 'processed',
        category: 'Economía',
        sentiment: 'neutral'
      },
      {
        id: '3',
        title: 'Avances en investigación médica contra el cáncer',
        url: 'https://ejemplo.com/noticia3',
        source: 'Nature',
        dateProcessed: '2024-01-13',
        status: 'processed',
        category: 'Ciencia',
        sentiment: 'positive'
      },
      {
        id: '4',
        title: 'Cambios climáticos afectan producción agrícola',
        url: 'https://ejemplo.com/noticia4',
        source: 'Reuters',
        dateProcessed: '2024-01-12',
        status: 'processed',
        category: 'Medio Ambiente',
        sentiment: 'negative'
      },
      {
        id: '5',
        title: 'Nuevas políticas educativas en Europa',
        url: 'https://ejemplo.com/noticia5',
        source: 'Le Monde',
        dateProcessed: '2024-01-11',
        status: 'pending',
        category: 'Educación',
        sentiment: 'neutral'
      },
      {
        id: '6',
        title: 'Innovaciones en transporte público urbano',
        url: 'https://ejemplo.com/noticia6',
        source: 'The Guardian',
        dateProcessed: '2024-01-10',
        status: 'error',
        category: 'Transporte',
        sentiment: 'positive'
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
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
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
                  <p className="text-white/80 text-sm font-medium">Historial de Noticias</p>
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
                  <table className="w-full">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Título</th>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Fuente</th>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Categoría</th>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Sentimiento</th>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Estado</th>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Fecha</th>
                        <th className="px-6 py-4 text-center text-white/90 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredNews.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-white font-medium mb-1 line-clamp-2">
                                {item.title}
                              </div>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline"
                              >
                                Ver original
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white/80">{item.source}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white/80">{item.category || 'Sin categoría'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${getSentimentColor(item.sentiment)}`}>
                              {item.sentiment === 'positive' && 'Positivo'}
                              {item.sentiment === 'negative' && 'Negativo'}
                              {item.sentiment === 'neutral' && 'Neutral'}
                              {!item.sentiment && 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white/80 text-sm">
                              {new Date(item.dateProcessed).toLocaleDateString('es-ES')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button className="text-green-400 hover:text-green-300 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
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