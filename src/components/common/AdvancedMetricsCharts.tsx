import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import type { ClippingMetrics } from '../../services/api';

// Registrar los elementos específicos que necesitamos
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

interface AdvancedMetricsChartsProps {
  metricas: ClippingMetrics;
  chartType: 'valuation' | 'media' | 'support' | 'mention';
  showOnlyPercentages?: boolean;
}

export default function AdvancedMetricsCharts({ metricas, chartType, showOnlyPercentages = false }: AdvancedMetricsChartsProps) {
  // Paleta de colores original de la aplicación
  const colorPalette = {
    primary: ['#3B82F6', '#10B981', '#A855F7', '#F97316', '#EF4444', '#F59E0B', '#06B6D4', '#8B5CF6'], // Colores principales
    valuation: ['#10B981', '#3B82F6', '#EF4444'], // Verde, Azul, Rojo para valoración
    neutral: ['#6B7280', '#9CA3AF', '#D1D5DB'], // Grises para elementos neutros
  };

  const getChartData = () => {
    let labels: string[];
    let values: number[];
    let percentages: number[];

    switch (chartType) {
      case 'valuation':
        labels = ['Positivas', 'Neutrales', 'Negativas'];
        values = [
          metricas.valuation?.positive?.count || 0,
          metricas.valuation?.neutral?.count || 0,
          metricas.valuation?.negative?.count || 0,
        ];
        percentages = [
          metricas.valuation?.positive?.percentage || 0,
          metricas.valuation?.neutral?.percentage || 0,
          metricas.valuation?.negative?.percentage || 0,
        ];
        break;
      case 'media':
        labels = metricas.media_stats?.items?.map(item => item.key) || [];
        values = metricas.media_stats?.items?.map(item => item.count) || [];
        percentages = metricas.media_stats?.items?.map(item => item.percentage) || [];
        break;
      case 'support':
        labels = metricas.support_stats?.items?.map(item => item.key) || [];
        values = metricas.support_stats?.items?.map(item => item.count) || [];
        percentages = metricas.support_stats?.items?.map(item => item.percentage) || [];
        break;
      case 'mention':
        labels = metricas.mention_stats?.items?.map(item => item.name) || [];
        values = metricas.mention_stats?.items?.map(item => item.count) || [];
        percentages = metricas.mention_stats?.items?.map(item => item.percentage) || [];
        break;
      default:
        labels = [];
        values = [];
        percentages = [];
    }

    return { labels, values, percentages };
  };

  const { labels, values, percentages } = getChartData();

  // Paleta de colores inteligente basada en la cantidad de elementos
  const getSmartColorPalette = () => {
    if (labels.length <= colorPalette.primary.length) {
      return colorPalette.primary.slice(0, labels.length);
    } else {
      // Para muchos elementos, repetir la paleta con variaciones
      const extendedPalette = [];
      for (let i = 0; i < labels.length; i++) {
        const baseColor = colorPalette.primary[i % colorPalette.primary.length];
        const opacity = 0.7 + (Math.floor(i / colorPalette.primary.length) * 0.1);
        const alpha = Math.min(opacity, 1.0);
        extendedPalette.push(`${baseColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
      }
      return extendedPalette;
    }
  };

  const smartColorPalette = getSmartColorPalette();


  // Configuración común para todos los gráficos
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: { 
            size: 12,
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: { 
          size: 14, 
          weight: 'bold' as const,
          family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
        },
        bodyFont: { 
          size: 12,
          family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
        },
      },
    },
  };

  // Gráfico Pie Chart para Valoración (más clásico y fácil de interpretar)
  const pieChartData = {
    labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: chartType === 'valuation' ? colorPalette.valuation : smartColorPalette.slice(0, labels.length),
        borderColor: chartType === 'valuation' ? colorPalette.valuation : smartColorPalette.slice(0, labels.length),
        borderWidth: 3,
      },
    ],
  };

  const pieChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: false,
      },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function(context: { label: string; parsed: number; dataIndex: number }) {
            return `${context.label}: ${context.parsed.toFixed(1)}% (${Math.round(values[context.dataIndex])} noticias)`;
          },
        },
      },
    },
  };


  // Gráfico Horizontal Bar para Medios/Soporte (más legible)
  const horizontalBarData = {
    labels,
    datasets: [
      {
        label: 'Cantidad',
        data: values,
        backgroundColor: smartColorPalette.slice(0, labels.length).map(color => `${color}CC`),
        borderColor: smartColorPalette.slice(0, labels.length),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const horizontalBarOptions = {
    ...commonOptions,
    indexAxis: 'y' as const,
    plugins: {
      ...commonOptions.plugins,
      legend: { display: false },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function(context: { label: string; parsed: { x: number }; dataIndex: number }) {
            return `${context.label}: ${Math.round(context.parsed.x)} noticias (${percentages[context.dataIndex].toFixed(1)}%)`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: '#ffffff', 
          font: { 
            size: 11,
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
          },
          stepSize: 1,
          callback: function(value: any) {
            return Math.round(value);
          }
        },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: '#ffffff', 
          font: { 
            size: 10,
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
          },
          maxTicksLimit: 8,
        },
      },
    },
  };


  // Gráfico Vertical Bar con Scroll (para muchos datos)
  const verticalBarScrollData = {
    labels,
    datasets: [
      {
        label: 'Cantidad',
        data: values,
        backgroundColor: smartColorPalette.slice(0, labels.length).map(color => `${color}CC`),
        borderColor: smartColorPalette.slice(0, labels.length),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const verticalBarScrollOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: { display: false },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function(context: { label: string; parsed: { y: number }; dataIndex: number }) {
            return `${context.label}: ${Math.round(context.parsed.y)} noticias (${percentages[context.dataIndex].toFixed(1)}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: '#ffffff', 
          font: { 
            size: 11,
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
          },
          stepSize: 1,
          callback: function(value: any) {
            return Math.round(value);
          }
        },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: '#ffffff', 
          font: { 
            size: 10,
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  // Renderizar gráfico según el tipo
  const renderChart = () => {
    if (labels.length === 0) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="text-center flex flex-col items-center">
            <div className="mb-3" style={{ width: '3rem', height: '3rem' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full text-white/60">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white/70">No hay datos disponibles</h3>
          </div>
        </div>
      );
    }

    // Solo para medios mostrar el gráfico vertical
    if (chartType === 'media') {
      return <Bar data={verticalBarScrollData} options={verticalBarScrollOptions} />;
    }

    // Para otros tipos de gráficos, mantener el comportamiento original
    switch (chartType) {
      case 'valuation':
        return <Pie data={pieChartData} options={pieChartOptions} />;
      case 'support':
        return <Bar data={horizontalBarData} options={horizontalBarOptions} />;
      case 'mention':
        return <Bar data={horizontalBarData} options={horizontalBarOptions} />;
      default:
        return <Bar data={horizontalBarData} options={horizontalBarOptions} />;
    }
  };

  return (
    <div>
      <div className="h-48">
        {renderChart()}
      </div>
      
      {/* Leyenda inteligente */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center" style={{ marginTop: '16px', marginBottom: '8px' }}>
          {/* Si todos los valores son iguales, mostrar solo una vez el valor común */}
          {values.every(v => v === values[0]) && values.length > 3 ? (
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div 
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: smartColorPalette[0] }}
              ></div>
              <span className="text-white/70 text-xs">
                {labels.length} medios • {Math.round(values[0])} noticia{values[0] !== 1 ? 's' : ''} cada uno ({percentages[0].toFixed(1)}%)
              </span>
            </div>
          ) : (
            /* Leyenda normal para valores diferentes */
            labels.map((label, index) => {
              const colors = chartType === 'valuation' ? colorPalette.valuation : smartColorPalette;
              const color = colors[index % colors.length];
              
              return (
                <div key={index} className="flex items-center" style={{ gap: '8px' }}>
                  <div 
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-white/70 text-xs">
                    {label}: {showOnlyPercentages ? `${percentages[index].toFixed(1)}%` : `${Math.round(values[index])} (${percentages[index].toFixed(1)}%)`}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
