import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { DashboardStats, NewsItem } from '../services/api';
import { DASHBOARD_MESSAGES } from '../constants/messages';
import NewsTable from '../components/common/NewsTable';
import { PageHeader } from '../components/ui/page-header';
import '../styles/history.css';

export default function DashboardPage() {
  const { } = useAuth();
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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para las noticias
  const [ultimasNoticias, setUltimasNoticias] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Función para verificar el estado de la API
  const checkApiStatus = useCallback(async () => {
    try {
      await apiService.verifyStatus();
      return true;
    } catch (error) {
      console.error('API está caída:', error);
      setError('La API no está disponible. Por favor, inténtalo más tarde.');
      return false;
    }
  }, []);

  // Función para cargar datos del usuario
  const loadUserData = useCallback(async () => {
    try {
      await apiService.getCurrentUser();
      return true;
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      setError('Error al cargar los datos del usuario.');
      return false;
    }
  }, []);

  // Función para cargar noticias (solo las últimas 4)
  const loadNews = useCallback(async () => {
    try {
      setNewsLoading(true);
      setNewsError(null);
      
      const response = await apiService.getNews({ limit: 5 });
      setUltimasNoticias(response.news);
    } catch (error) {
      console.error('Error cargando noticias:', error);
      setNewsError('Error al cargar las noticias');
      setUltimasNoticias([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const statsData = await apiService.getDashboardStats();
      setStats(statsData);
    } catch (statsError) {
      console.error('Error cargando estadísticas:', statsError);
      // No hacer nada si falla, dejar estadísticas en 0
    }
  }, []);

  // Cargar datos del dashboard en el orden correcto
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Verificar estado de la API
        const apiOnline = await checkApiStatus();
        if (!apiOnline) {
          return;
        }

        // 2. Cargar datos del usuario
        const userLoadedSuccess = await loadUserData();
        if (!userLoadedSuccess) {
          return;
        }

        // 3. Cargar noticias
        await loadNews();

        // 4. Cargar estadísticas (solo una vez)
        await loadStats();

      } catch (err) {
        console.error('Error general cargando datos del dashboard:', err);
        setError(DASHBOARD_MESSAGES.ERRORS.LOAD_DATA_ERROR);
        setUltimasNoticias([]); // Asegurar que sea un array vacío en caso de error general
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [checkApiStatus, loadUserData, loadNews, loadStats]); // Incluir las dependencias necesarias

  // Mostrar loading mientras cargan los datos principales
  if (loading || newsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl font-semibold">{DASHBOARD_MESSAGES.COMMON?.LOADING || 'Cargando dashboard...'}</div>
      </div>
    );
  }

  // Mostrar error si la API está caída o hay error de usuario
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
        <PageHeader
          title="Bienvenido a tu dashboard"
          description="Monitorea y analiza tus noticias con inteligencia artificial"
          className="mb-32"
        />

        {/* TODO: Cuando el endpoint /news/stats esté implementado en el backend, 
             remover el cálculo local de estadísticas y usar directamente apiService.getDashboardStats() */}
        <div className="stats-section mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-blue-300/30 mb-5">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-white/80 mb-2">Noticias Hoy</p>
                <p className="text-3xl font-bold text-white mb-1">{stats.noticiasHoy || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                <p className="text-xs text-blue-300 font-medium">{stats.noticiasHoy ? '+12% vs ayer' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
              </div>
            </div>

            <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-green-300/30 mb-5">
                  <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-white/80 mb-2">Esta Semana</p>
                <p className="text-3xl font-bold text-white mb-1">{stats.noticiasEstaSemana || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                <p className="text-xs text-green-300 font-medium">{stats.noticiasEstaSemana ? '+8% vs semana pasada' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
              </div>
            </div>

            <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-purple-300/30 mb-5">
                  <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-white/80 mb-2">Total Noticias</p>
                <p className="text-3xl font-bold text-white mb-1">{stats.totalNoticias || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                <p className="text-xs text-purple-300 font-medium">{stats.totalNoticias ? '+15% este mes' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
              </div>
            </div>

            <div className="upload-news-panel" style={{ padding: '1rem', minHeight: 'auto' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-orange-300/30 mb-5">
                  <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-white/80 mb-2">Temas Analizados</p>
                <p className="text-3xl font-bold text-white mb-1">{stats.noticiasPorTema.length || DASHBOARD_MESSAGES.COMMON.DATA_PLACEHOLDER}</p>
                <p className="text-xs text-orange-300 font-medium">{stats.noticiasPorTema.length ? '+3 nuevos' : DASHBOARD_MESSAGES.COMMON.NO_DATA}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="actions-section mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button 
              onClick={() => navigate('/upload-news')}
              className="upload-news-panel group hover:scale-105 transition-all duration-300 cursor-pointer text-left"
              style={{ padding: '0.5rem', minHeight: 'auto' }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-300/30 shadow-lg" style={{ marginRight: '1rem' }}>
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-white drop-shadow-sm">Subir noticias</h3>
                  <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Carga nuevas noticias para procesar</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/history')}
              className="upload-news-panel group hover:scale-105 transition-all duration-300 cursor-pointer text-left"
              style={{ padding: '0.5rem', minHeight: 'auto' }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-300/30 shadow-lg" style={{ marginRight: '1rem' }}>
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-white drop-shadow-sm">Ver noticias</h3>
                  <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Explora todas las noticias procesadas</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/create-clipping')}
              className="upload-news-panel group hover:scale-105 transition-all duration-300 cursor-pointer text-left"
              style={{ padding: '0.5rem', minHeight: 'auto' }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-300/30 shadow-lg" style={{ marginRight: '1rem' }}>
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-white drop-shadow-sm">Crear clipping</h3>
                  <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Genera análisis por tema específico</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/clippings-history')}
              className="upload-news-panel group hover:scale-105 transition-all duration-300 cursor-pointer text-left"
              style={{ padding: '0.5rem', minHeight: 'auto' }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-300/30 shadow-lg" style={{ marginRight: '1rem' }}>
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-white drop-shadow-sm">Ver clippings</h3>
                  <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Explora todos los clippings generados</p>
                </div>
              </div>
            </button>

            <button 
                onClick={() => navigate('/settings')}
                className="upload-news-panel group hover:scale-105 transition-all duration-300 cursor-pointer text-left"
                style={{ padding: '0.5rem', minHeight: 'auto' }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-300/30 shadow-lg" style={{ marginRight: '1rem' }}>
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1 text-white drop-shadow-sm">Administración</h3>
                    <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Gestiona temas y menciones</p>
                  </div>
                </div>
            </button>
          </div>
        </div>

        {/* Últimas noticias */}
        <div className="news-section">
          <div className="upload-news-panel">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Últimas noticias procesadas</h2>
                <button 
                  onClick={() => navigate('/history')}
                className="text-white hover:text-white/90 font-bold text-base transition-colors hover:scale-105 transform" 
                >
                  Ver todas →
                </button>
            </div>
            
            {/* Mostrar error de noticias si existe */}
            {newsError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300 text-sm font-medium">
                    Error al cargar las noticias: {newsError}
                  </span>
                </div>
              </div>
            )}
            
              {newsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-white/70 text-lg">Cargando noticias...</div>
                </div>
              ) : ultimasNoticias.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-white/70 text-lg">No hay noticias disponibles</div>
                </div>
              ) : (
              <NewsTable 
                news={ultimasNoticias} 
                showEditButton={false}
              />
            )}
          </div>
        </div>
    </>
  );
} 