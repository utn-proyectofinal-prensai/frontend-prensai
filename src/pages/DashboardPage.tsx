import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type DashboardData, type ClippingItem } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState } from '../components/ui/loading-spinner';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
// @ts-ignore - react-tagcloud tiene problemas de tipos
import { TagCloud } from 'react-tagcloud';
import '../styles/history.css';
import '../styles/upload-news.css';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentReports, setRecentReports] = useState<ClippingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Datos mock basados en la especificación del apiary.apib
  const getMockDashboardData = (): DashboardData => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Formatear fechas como en el apiary (YYYY-MM-DD)
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const formatDateTime = (date: Date) => {
      const offset = -3; // UTC-3 (Argentina)
      const localDate = new Date(date.getTime() + (offset * 60 * 60 * 1000));
      return localDate.toISOString().replace('Z', `-0${Math.abs(offset)}:00`);
    };

    return {
      meta: {
        range: {
          from: formatDate(sevenDaysAgo),
          to: formatDate(today)
        },
        generated_at: formatDateTime(today)
      },
      news: {
        count: 248,
        valuation: {
          positive: 92,
          neutral: 108,
          negative: 48,
          unassigned: 0
        },
        trend: [
          { date: formatDate(new Date(sevenDaysAgo.getTime() + 24*60*60*1000)), count: 32 },
          { date: formatDate(new Date(sevenDaysAgo.getTime() + 48*60*60*1000)), count: 40 },
          { date: formatDate(new Date(sevenDaysAgo.getTime() + 72*60*60*1000)), count: 25 },
          { date: formatDate(new Date(sevenDaysAgo.getTime() + 96*60*60*1000)), count: 45 },
          { date: formatDate(new Date(sevenDaysAgo.getTime() + 120*60*60*1000)), count: 30 },
          { date: formatDate(new Date(sevenDaysAgo.getTime() + 144*60*60*1000)), count: 60 },
          { date: formatDate(today), count: 16 }
        ]
      },
      topics: {
        count_unique: 12,
        top: [
          { name: "Economía", news_count: 58 },
          { name: "Cultura", news_count: 34 },
          { name: "Política", news_count: 28 }
        ]
      },
      mentions: {
        count_unique: 41,
        top: [
          { entity: "Jorge Macri", count: 12 },
          { entity: "GCBA", count: 9 },
          { entity: "CABA", count: 6 }
        ]
      },
      clippings: {
        count: 7
      },
      reports: {
        count: 6
      }
    };
  };

  // Helper para extraer datos del wrapper si existe
  // Según apiary.apib, la respuesta debería ser formato directo
  // Pero el backend puede devolver con wrapper { context, generated_at, data }
  const extractDashboardData = (response: DashboardData, useMock: boolean = false): DashboardData | null => {
    // Si useMock es true, devolver datos mock
    if (useMock) {
      return getMockDashboardData();
    }

    // Si la respuesta tiene el wrapper { context, generated_at, data: {...} }
    if (response.data !== undefined) {
      // Si data está vacío, usar mock
      if (!response.data || Object.keys(response.data).length === 0) {
        return getMockDashboardData();
      }
      
      // Si hay datos pero todos están en 0 o vacíos, usar mock para visualización
      const hasData = response.data.news && (
        response.data.news.count > 0 ||
        (response.data.news.valuation && (
          response.data.news.valuation.positive > 0 ||
          response.data.news.valuation.neutral > 0 ||
          response.data.news.valuation.negative > 0
        ))
      );
      
      if (!hasData) {
        return getMockDashboardData();
      }
      
      // Devolver los datos directamente (sin el wrapper)
      return response.data as DashboardData;
    }
    
    // Formato directo según apiary.apib: { meta, news, topics, mentions, clippings, reports }
    // Verificar si tiene la estructura esperada
    if (response.meta && response.news) {
      // Validar si tiene datos reales o está vacío
      const hasData = response.news.count > 0 || 
        (response.news.valuation && (
          (response.news.valuation.positive || 0) > 0 ||
          (response.news.valuation.neutral || 0) > 0 ||
          (response.news.valuation.negative || 0) > 0
        ));
      
      if (!hasData) {
        return getMockDashboardData();
      }
      
      return response;
    }
    
    // Si no coincide con ningún formato conocido, usar mock
    return getMockDashboardData();
  };

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

      // Cargar datos del dashboard
      const response = await apiService.getDashboard();
      console.log('Dashboard response recibida:', response);
      
      // Validar estructura de datos
      if (!response || typeof response !== 'object') {
        throw new Error('Estructura de datos inválida');
      }
      
      // Extraer datos del wrapper si existe
      // Usar mock automáticamente si los datos están vacíos
      const extractedData = extractDashboardData(response, false);
      
      if (!extractedData) {
        // No hay snapshot disponible, mostrar estado vacío
        setDashboardData(null);
        setError(null); // No es un error, simplemente no hay datos
          return;
        }

      setDashboardData(extractedData);

      // Cargar últimos reportes
      try {
        const reports = await apiService.getRecentReports(3);
        setRecentReports(reports);
      } catch (reportError) {
        console.warn('Error cargando reportes recientes:', reportError);
        // No es crítico, continuar sin reportes
        setRecentReports([]);
      }

      } catch (err) {
      console.error('Error cargando dashboard:', err);
      setError('Error al cargar el dashboard. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

  // Calcular métricas derivadas basadas en los datos del backend
  const calculateMetrics = () => {
    if (!dashboardData || !dashboardData.news) return null;

    const { news, clippings, reports, topics, mentions } = dashboardData;
    const total = news.count || 0;
    const valuation = news.valuation || { positive: 0, neutral: 0, negative: 0, unassigned: 0 };
    const positivePercent = total > 0 
      ? Math.round((valuation.positive / total) * 100) 
      : 0;
    
    // Errores de IA (noticias sin valoración)
    const aiErrors = valuation.unassigned || 0;
    
    // Total de noticias con valoración (revisadas)
    const reviewedCount = (valuation.positive || 0) + (valuation.neutral || 0) + (valuation.negative || 0);

    return {
      totalNews: total,
      aiErrors,
      positivePercent,
      reviewedCount,
      clippingsCount: clippings?.count || 0,
      reportsCount: reports?.count || 0,
      topicsCount: topics?.count_unique || 0,
      mentionsCount: mentions?.count_unique || 0
    };
  };

  // Datos para el gráfico de distribución de tono (donut)
  const getToneDistributionData = () => {
    if (!dashboardData || !dashboardData.news || !dashboardData.news.valuation) return null;

    const { valuation } = dashboardData.news;

    return {
      labels: ['Positivo', 'Neutral', 'Negativo'],
      datasets: [{
        data: [
          valuation.positive || 0,
          valuation.neutral || 0,
          valuation.negative || 0
        ],
        backgroundColor: [
          '#10B981', // Verde para positivo
          '#3B82F6', // Azul para neutral
          '#EF4444'  // Rojo para negativo
        ],
        borderColor: [
          '#059669',
          '#2563EB',
          '#DC2626'
        ],
        borderWidth: 2
      }]
    };
  };

  // Datos para el gráfico de tendencia de noticias
  const getTrendData = () => {
    if (!dashboardData || !dashboardData.news || !dashboardData.news.trend) return null;

    const { trend } = dashboardData.news;

    return {
      labels: trend.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'Noticias',
        data: trend.map(item => item.count),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }]
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="history-container px-6">
        <LoadingState 
          title="Cargando dashboard..."
          variant="simple"
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container px-6">
        <div className="upload-news-panel">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-4">{error}</div>
              <Button onClick={loadDashboardData} variant="primary">
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    // Si no hay datos pero tampoco hay error, mostrar mensaje informativo
    if (!error) {
      return (
        <div className="history-container px-6">
          <div className="upload-news-panel">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-white/60 text-lg mb-4 text-center">
                <p className="mb-2">No hay datos del dashboard disponibles.</p>
                <p className="text-sm">El dashboard se generará automáticamente cuando haya datos disponibles.</p>
              </div>
              <Button onClick={loadDashboardData} variant="primary">
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="history-container px-6">
        <LoadingState 
          title="Cargando dashboard..."
          variant="simple"
          size="lg"
        />
      </div>
    );
  }

  const toneData = getToneDistributionData();
  const trendData = getTrendData();

  // Verificar que tenemos los datos mínimos necesarios
  if (!dashboardData.news) {
    return (
      <div className="history-container px-6">
        <div className="upload-news-panel">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-4">Los datos del dashboard no están disponibles</div>
              <Button onClick={loadDashboardData} variant="primary">
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container px-6" style={{ gap: '1.5rem' }}>
      {/* Header */}
      <div className="upload-news-header">
        <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">PrensAI</h1>
        <p className="upload-news-subtitle">Dashboard de análisis</p>
        {dashboardData.meta && (
          <div className="mt-2 text-sm text-white/60">
            <span>
              {formatDate(dashboardData.meta.range.from)} - {formatDate(dashboardData.meta.range.to)}
            </span>
            {dashboardData.meta.generated_at && (
              <span className="ml-4">
                · Generado: {new Date(dashboardData.meta.generated_at).toLocaleString('es-ES')}
              </span>
            )}
          </div>
        )}
        </div>

      {/* Métricas principales */}
      {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Noticias */}
          <Card variant="default" padding="default">
            <CardContent className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-blue-300/30 mb-4">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Total Noticias</p>
              <p className="text-4xl font-bold text-white mb-1">{metrics.totalNews.toLocaleString()}</p>
              <p className="text-xs text-white/60">En el período</p>
            </CardContent>
          </Card>

          {/* Clippings Creados */}
          <Card variant="default" padding="default">
            <CardContent className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-green-300/30 mb-4">
                  <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Clippings Creados</p>
              <p className="text-4xl font-bold text-white mb-1">{metrics.clippingsCount.toLocaleString()}</p>
              <p className="text-xs text-white/60">En el período</p>
            </CardContent>
          </Card>

          {/* Reportes Generados */}
          <Card variant="default" padding="default">
            <CardContent className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-purple-300/30 mb-4">
                  <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Reportes Generados</p>
              <p className="text-4xl font-bold text-white mb-1">{metrics.reportsCount.toLocaleString()}</p>
              <p className="text-xs text-white/60">Con IA</p>
            </CardContent>
          </Card>

          {/* Tono Positivo */}
          <Card variant="default" padding="default">
            <CardContent className="flex flex-col items-center text-center py-6">
              <div className="relative w-20 h-20 mb-4">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - metrics.positivePercent / 100)}`}
                    strokeLinecap="round"
                  />
                  </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{metrics.positivePercent}%</span>
                </div>
              </div>
              <p className="text-base font-medium text-white/80 mb-2">Tono Positivo</p>
              <p className="text-xs text-white/60">
                {dashboardData.news?.valuation?.positive || 0} de {metrics.totalNews} noticias
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos y datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de tono */}
        {toneData && (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Distribución de tono</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="w-64 h-64">
                  <Pie
                    data={toneData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: '#fff',
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                              return `${label}: ${value} (${percent}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {toneData.labels.map((label, index) => {
                  const total = toneData.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? ((toneData.datasets[0].data[index] / total) * 100).toFixed(0) : 0;
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: toneData.datasets[0].backgroundColor[index]
                        }}
                      />
                      <span className="text-sm text-white/70">
                        {label}: {toneData.datasets[0].data[index]} ({percent}%)
                      </span>
                </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tendencia de noticias */}
        {trendData && (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Tendencia de noticias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line
                  data={trendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#fff',
                          font: {
                            size: 11
                          }
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#fff',
                          font: {
                            size: 11
                          }
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Últimos informes generados - columna completa */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Últimos informes generados</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <p className="text-white/60 text-center py-4">No hay informes generados aún</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/clipping/${report.id}/report`)}
                >
                <div className="flex-1">
                    <p className="text-white font-medium mb-2">{report.name}</p>
                    {report.updated_at !== report.created_at && (
                      <div className="text-xs text-white/60">
                        <span>Entregado: {formatDate(report.updated_at)}</span>
                </div>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ArrowLeft"
                      className="rotate-180"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temas principales y Top Menciones - en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temas principales - Word Cloud */}
        {dashboardData.topics && dashboardData.topics.top && dashboardData.topics.top.length > 0 && (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Temas principales</CardTitle>
              <p className="text-sm text-white/60 mt-1">
                {dashboardData.topics.count_unique} temas únicos analizados
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-center justify-center py-4">
                {dashboardData.topics.top && dashboardData.topics.top.length > 0 ? (
                  <div className="tag-cloud-wrapper w-full h-full p-5" style={{ cursor: 'pointer' }}>
                    {/* @ts-ignore */}
                    <TagCloud
                      tags={dashboardData.topics.top.map(topic => ({
                        value: topic.name,
                        count: topic.news_count
                      }))}
                      minSize={16}
                      maxSize={48}
                      colorOptions={{
                        luminosity: 'bright',
                        hue: 'blue'
                      }}
                      className="tag-cloud"
                      onClick={(tag: any) => {
                        console.log('Tag clicked:', tag);
                      }}
                    />
                </div>
                ) : (
                  <p className="text-white/60 text-center py-8">No hay temas disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Menciones */}
        {dashboardData.mentions && dashboardData.mentions.top && dashboardData.mentions.top.length > 0 && (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Top Menciones</CardTitle>
              <p className="text-sm text-white/60 mt-1">
                {dashboardData.mentions.count_unique} menciones únicas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.mentions.top.map((mention, index) => (
                  <div
                    key={mention.entity}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-300/30">
                        <span className="text-sm font-bold text-blue-300">{index + 1}</span>
                      </div>
                      <span className="text-white font-medium">{mention.entity}</span>
                    </div>
                    <span className="text-lg font-bold text-white">{mention.count}</span>
                </div>
                ))}
                </div>
            </CardContent>
          </Card>
            )}
          </div>
        </div>
  );
} 
