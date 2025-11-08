import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { DashboardSnapshot } from '../services/api';
import { DASHBOARD_MESSAGES } from '../constants/messages';
import { PageHeader } from '../components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  MetricCard,
  DashboardLineChart, 
  DashboardBarChart,
  AdvancedMetricsCharts
} from '../components/common';
import '../styles/history.css';

export default function DashboardPage() {
  const { } = useAuth();
  const navigate = useNavigate();
  
  // Estado para el snapshot del dashboard
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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


  // Función para cargar snapshot del dashboard
  const loadDashboardSnapshot = useCallback(async () => {
    // Para desarrollo: usar mock data para ver los gráficos
    const USE_MOCK_DATA = true; // Cambiar a false para usar el API real
    
    if (USE_MOCK_DATA) {
      const mockSnapshot: DashboardSnapshot = {
        context: "global",
        generated_at: "2025-11-06T19:00:00.130-03:00",
        data: {
          meta: {
            range: {
              to: "2025-11-06",
              from: "2025-10-30"
            },
            generated_at: "2025-11-06T19:00:00-03:00"
          },
          news: {
            count: 24,
            trend: [
              { date: "2025-10-30", count: 0 },
              { date: "2025-10-31", count: 0 },
              { date: "2025-11-01", count: 0 },
              { date: "2025-11-02", count: 5 },
              { date: "2025-11-03", count: 0 },
              { date: "2025-11-04", count: 0 },
              { date: "2025-11-05", count: 0 },
              { date: "2025-11-06", count: 19 }
            ],
            valuation: {
              neutral: 8,
              negative: 2,
              positive: 12,
              unassigned: 2
            }
          },
          topics: {
            top: [
              { name: "La Noche de los Museos", news_count: 9 },
              { name: "Agenda Programada", news_count: 8 },
              { name: "Elecciones", news_count: 4 },
              { name: "Recorrido por eventos y estrenos", news_count: 1 }
            ],
            count_unique: 4
          },
          reports: {
            count: 0
          },
          mentions: {
            top: [
              { count: 9, entity: "Gabriela Ricardes" },
              { count: 6, entity: "Jorge Macri" }
            ],
            count_unique: 2
          },
          clippings: {
            count: 1
          }
        }
      };
      setSnapshot(mockSnapshot);
      return;
    }

    try {
      const snapshotData = await apiService.getDashboardSnapshot();
      setSnapshot(snapshotData);
    } catch (snapshotError) {
      console.error('Error cargando snapshot del dashboard:', snapshotError);
      // Mock data como fallback si el API falla
      const mockSnapshot: DashboardSnapshot = {
        context: "global",
        generated_at: "2025-11-06T19:00:00.130-03:00",
        data: {
          meta: {
            range: {
              to: "2025-11-06",
              from: "2025-10-30"
            },
            generated_at: "2025-11-06T19:00:00-03:00"
          },
          news: {
            count: 24,
            trend: [
              { date: "2025-10-30", count: 0 },
              { date: "2025-10-31", count: 0 },
              { date: "2025-11-01", count: 0 },
              { date: "2025-11-02", count: 5 },
              { date: "2025-11-03", count: 0 },
              { date: "2025-11-04", count: 0 },
              { date: "2025-11-05", count: 0 },
              { date: "2025-11-06", count: 19 }
            ],
            valuation: {
              neutral: 8,
              negative: 2,
              positive: 12,
              unassigned: 2
            }
          },
          topics: {
            top: [
              { name: "La Noche de los Museos", news_count: 9 },
              { name: "Agenda Programada", news_count: 8 },
              { name: "Elecciones", news_count: 4 },
              { name: "Recorrido por eventos y estrenos", news_count: 1 }
            ],
            count_unique: 4
          },
          reports: {
            count: 0
          },
          mentions: {
            top: [
              { count: 9, entity: "Gabriela Ricardes" },
              { count: 6, entity: "Jorge Macri" }
            ],
            count_unique: 2
          },
          clippings: {
            count: 1
          }
        }
      };
      setSnapshot(mockSnapshot);
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

        // 3. Cargar snapshot del dashboard y noticias en paralelo
        await loadDashboardSnapshot();

      } catch (err) {
        console.error('Error general cargando datos del dashboard:', err);
        setError(DASHBOARD_MESSAGES.ERRORS.LOAD_DATA_ERROR);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [checkApiStatus, loadUserData, loadDashboardSnapshot]);

  // Mostrar loading mientras cargan los datos principales
  if (loading) {
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

  // Acceder a los datos del snapshot
  const data = snapshot?.data || null;

  return (
    <>
      {/* Título de bienvenida */}
      <PageHeader
        title="Bienvenido a tu dashboard"
        description="Monitorea y analiza tus noticias con inteligencia artificial"
        className="mb-3"
      />

      {/* Acciones principales */}
      <div className="actions-section" style={{ marginBottom: '1rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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

      {/* Primera fila: Tendencia (3/4) + Cards apiladas (1/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ marginBottom: '1rem' }}>
        {/* Columna izquierda: Tendencia */}
        <div className="lg:col-span-3 w-full">
          <Card variant="default" padding="default" className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white mb-1">Tendencia de Volumen de Noticias</CardTitle>
              {data?.meta?.range && (
                <p className="text-sm text-slate-300 font-medium mt-1">
                  {new Date(data.meta.range.from).toLocaleDateString('es-AR')} - {new Date(data.meta.range.to).toLocaleDateString('es-AR')}
                </p>
              )}
            </CardHeader>
            <CardContent style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
              <DashboardLineChart 
                data={data?.news?.trend || []} 
                color="#3B82F6"
                height={240}
              />
            </CardContent>
          </Card>
      </div>

        {/* Columna derecha: Cards apiladas (1/4) */}
        <div className="lg:col-span-1 flex flex-col gap-3 items-stretch">
          {/* Noticias procesadas */}
          <MetricCard
            title="Noticias procesadas"
            value={data?.news?.count || 0}
            subtitle={`Últimos 7 días`}
            iconColor="purple"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            onClick={() => navigate('/history')}
          />

          {/* Clippings generados */}
          <MetricCard
            title="Clippings generados"
            value={data?.clippings?.count || 0}
            subtitle="Últimos 7 días"
            iconColor="purple"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            onClick={() => navigate('/clippings-history')}
          />
        </div>
      </div>

      {/* Segunda fila: Temas (2/4), Menciones (1/4) y Sentimiento (1/4) - Ancho total */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '1rem' }}>
        {/* Temas principales - vertical - 2/4 */}
        <Card variant="default" padding="default" className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-xl font-bold text-white mb-1">Temas Principales</CardTitle>
            <p className="text-sm text-slate-300 font-medium mt-1">Top {data?.topics?.top?.length || 0} temas</p>
          </CardHeader>
                <CardContent className="flex-1">
                  <DashboardBarChart 
                    data={data?.topics?.top?.map(t => ({ name: t.name, count: t.news_count })) || []}
                    color="#A855F7"
                    height={180}
                    horizontal={false}
                    maxItems={5}
                  />
          </CardContent>
        </Card>

        {/* Menciones principales - vertical - 1/4 */}
        <Card variant="default" padding="default" className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-xl font-bold text-white mb-1">Ranking de Menciones Principales</CardTitle>
            <p className="text-sm text-slate-300 font-medium mt-1">Top {data?.mentions?.top?.length || 0} menciones</p>
          </CardHeader>
                <CardContent className="flex-1">
                  <DashboardBarChart 
                    data={data?.mentions?.top?.map(m => ({ name: m.entity, count: m.count })) || []}
                    color="#10B981"
                    height={180}
                    horizontal={false}
                    maxItems={5}
                  />
          </CardContent>
        </Card>

        {/* Distribución de sentimiento - 1/4 */}
        <Card variant="default" padding="default" className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-xl font-bold text-white mb-1">Distribución por Sentimiento</CardTitle>
            <p className="text-sm text-slate-300 font-medium mt-1">Últimos 7 días</p>
          </CardHeader>
          <CardContent className="flex-1">
            {data?.news?.valuation ? (
              <AdvancedMetricsCharts 
                metricas={{
                  valuation: {
                    positive: {
                      count: data.news.valuation.positive,
                      percentage: data.news.valuation.positive + data.news.valuation.neutral + data.news.valuation.negative + (data.news.valuation.unassigned || 0) > 0
                        ? (data.news.valuation.positive / (data.news.valuation.positive + data.news.valuation.neutral + data.news.valuation.negative + (data.news.valuation.unassigned || 0))) * 100
                        : 0
                    },
                    neutral: {
                      count: data.news.valuation.neutral,
                      percentage: data.news.valuation.positive + data.news.valuation.neutral + data.news.valuation.negative + (data.news.valuation.unassigned || 0) > 0
                        ? (data.news.valuation.neutral / (data.news.valuation.positive + data.news.valuation.neutral + data.news.valuation.negative + (data.news.valuation.unassigned || 0))) * 100
                        : 0
                    },
                    negative: {
                      count: data.news.valuation.negative,
                      percentage: data.news.valuation.positive + data.news.valuation.neutral + data.news.valuation.negative + (data.news.valuation.unassigned || 0) > 0
                        ? (data.news.valuation.negative / (data.news.valuation.positive + data.news.valuation.neutral + data.news.valuation.negative + (data.news.valuation.unassigned || 0))) * 100
                        : 0
                    }
                  }
                } as any}
                chartType="valuation"
                showOnlyPercentages={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm">No hay datos disponibles</div>
              </div>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
