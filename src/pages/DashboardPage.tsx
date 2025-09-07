import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { NewsItem, DashboardStats } from '../services/api';
import { DASHBOARD_MESSAGES } from '../constants/messages';

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los datos
  const [stats, setStats] = useState<DashboardStats>({
    totalNoticias: 0,
    noticiasHoy: 0,
    noticiasEstaSemana: 0,
    noticiasEsteMes: 0,
    noticiasPorTema: [],
    noticiasPorMedio: []
  });
  
  const [ultimasNoticias, setUltimasNoticias] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas y últimas noticias en paralelo
        // Si las estadísticas fallan, continuamos con las noticias
        const [statsData, newsData] = await Promise.allSettled([
          apiService.getDashboardStats(),
          apiService.getNews({ limit: 4 }) // Últimas 4 noticias
        ]);
        
        // Manejar resultado de estadísticas
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value);
        } else {
          console.warn('Error cargando estadísticas del dashboard:', statsData.reason);
          // Mantener valores por defecto definidos en el estado inicial
        }
        
        // Manejar resultado de noticias
        if (newsData.status === 'fulfilled') {
          // Asegurar que siempre sea un array
          const noticias = Array.isArray(newsData.value) ? newsData.value : [];
          setUltimasNoticias(noticias);
        } else {
          console.error('Error cargando noticias:', newsData.reason);
          setUltimasNoticias([]); // Asegurar que sea un array vacío
          setError(DASHBOARD_MESSAGES.ERRORS.LOAD_DATA_ERROR);
          return; // Solo mostrar error si fallan las noticias
        }
        
        setError(null);
      } catch (err) {
        console.error('Error general cargando datos del dashboard:', err);
        setError(DASHBOARD_MESSAGES.ERRORS.LOAD_DATA_ERROR);
        setUltimasNoticias([]); // Asegurar que sea un array vacío en caso de error general
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Mostrar loading mientras cargan los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl font-semibold">{DASHBOARD_MESSAGES.COMMON?.LOADING || 'Cargando dashboard...'}</div>
      </div>
    );
  }

  // Mostrar error si algo falló
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <>
        {/* Título de bienvenida */}
        <div className="welcome-section mb-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Bienvenido a tu dashboard</h2>
          <p className="text-white/90 text-lg font-medium drop-shadow-md">Monitorea y analiza tus noticias con inteligencia artificial</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="stats-section mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Noticias Hoy</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.noticiasHoy || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                  <p className="text-xs text-green-300 font-bold">{stats.noticiasHoy ? '+12% vs ayer' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Esta Semana</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.noticiasEstaSemana || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                  <p className="text-xs text-blue-300 font-bold">{stats.noticiasEstaSemana ? '+8% vs semana pasada' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Total Noticias</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.totalNoticias || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                  <p className="text-xs text-purple-300 font-bold">{stats.totalNoticias ? '+15% este mes' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Temas Analizados</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.noticiasPorTema.length || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                  <p className="text-xs text-orange-300 font-bold">{stats.noticiasPorTema.length ? '+3 nuevos' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones principales - MISMO ESTILO QUE LAS CARDS */}
        <div className="actions-section mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <button 
              onClick={() => navigate('/upload-news')}
              className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl"
              style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">Subir set de noticias</h3>
                  <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Carga nuevas noticias (links) para procesar</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/history')}
              className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-12 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl" 
              style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-8 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-sm">Ver histórico</h3>
                  <p className="text-green-300 text-base leading-relaxed font-medium drop-shadow-sm">Explora todas las noticias procesadas</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/create-clipping')}
              className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-12 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl" 
              style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-8 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-sm">Crear clipping</h3>
                  <p className="text-purple-300 text-base leading-relaxed font-medium drop-shadow-sm">Genera análisis por tema específico</p>
                </div>
              </div>
            </button>

            {isAdmin && (
              <button 
                onClick={() => navigate('/settings')}
                className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-12 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl" 
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-8 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-sm">Administración</h3>
                    <p className="text-orange-300 text-base leading-relaxed font-medium drop-shadow-sm">Gestiona temas y menciones de personas</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Últimas noticias */}
        <div className="news-section">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-8 py-8 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Últimas noticias procesadas</h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-white !important hover:text-white/90 font-bold text-base transition-colors hover:scale-105 transform" 
                  style={{ color: 'white' }}
                >
                  Ver todas →
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TÍTULO</th>
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
                  {ultimasNoticias && ultimasNoticias.length > 0 ? ultimasNoticias.map((noticia) => (
                    <tr key={noticia.id} className="hover:bg-black/20 transition-colors duration-200">
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm font-semibold text-white max-w-xs truncate text-center">{noticia.titulo}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.tipoPublicacion}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{new Date(noticia.fecha).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.soporte}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.medio}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.seccion}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.autor}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.conductor || '-'}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.entrevistado || '-'}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.tema}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.etiqueta1}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.etiqueta2}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90">
                          <a href={noticia.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                            Ver
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.alcance}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.cotizacion}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.tapa}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                          noticia.valoracion === 'Muy Positiva' 
                            ? 'bg-green-500/20 text-green-300 border border-green-300/30' 
                            : noticia.valoracion === 'Positiva'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-300/30'
                            : noticia.valoracion === 'Negativa'
                            ? 'bg-red-500/20 text-red-300 border border-red-300/30'
                            : 'bg-white/20 text-white/90 border border-white/30'
                        }`}>
                          {noticia.valoracion}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.ejeComunicacional}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.factorPolitico}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.crisis}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.gestion}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.area}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion1 || '-'}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion2 || '-'}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion3 || '-'}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion4 || '-'}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion5 || '-'}</div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={27} className="px-6 py-12 text-center">
                        <div className="text-white/60 text-lg">
                          {loading ? 'Cargando noticias...' : 'No hay noticias disponibles'}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </>
  );
} 