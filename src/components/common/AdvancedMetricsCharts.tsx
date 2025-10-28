import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, PolarArea, Radar, Pie } from 'react-chartjs-2';
import type { ClippingMetrics } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

interface AdvancedMetricsChartsProps {
  metricas: ClippingMetrics;
  chartType: 'valuation' | 'media' | 'support' | 'mention';
}

export default function AdvancedMetricsCharts({ metricas, chartType }: AdvancedMetricsChartsProps) {
  // Paleta de colores optimizada para UX
  const colorPalette = {
    primary: ['#3B82F6', '#10B981', '#A855F7', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'],
    valuation: ['#10B981', '#F59E0B', '#EF4444'], // Verde, Amarillo, Rojo para valoración
    neutral: ['#6B7280', '#9CA3AF', '#D1D5DB'], // Grises para elementos neutros
  };

  const getChartData = () => {
    let data: any;
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
          weight: 'bold',
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
        backgroundColor: chartType === 'valuation' ? colorPalette.valuation : colorPalette.primary.slice(0, labels.length),
        borderColor: chartType === 'valuation' ? colorPalette.valuation : colorPalette.primary.slice(0, labels.length),
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
        backgroundColor: colorPalette.primary.slice(0, labels.length).map(color => `${color}CC`),
        borderColor: colorPalette.primary.slice(0, labels.length),
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

  // Gráfico Vertical Bar para Soporte (clásico y efectivo)
  const verticalBarData = {
    labels,
    datasets: [
      {
        label: 'Cantidad',
        data: values,
        backgroundColor: colorPalette.primary.slice(0, labels.length).map(color => `${color}CC`),
        borderColor: colorPalette.primary.slice(0, labels.length),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const verticalBarOptions = {
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
            size: 11,
            family: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  // Renderizar el gráfico apropiado según el tipo
  const renderChart = () => {
    if (labels.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 text-white/60">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No hay datos disponibles</div>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case 'valuation':
        return <Pie data={pieChartData} options={pieChartOptions} />;
      case 'media':
      case 'mention':
        return <Bar data={horizontalBarData} options={horizontalBarOptions} />;
      case 'support':
        return <Bar data={verticalBarData} options={verticalBarOptions} />;
      default:
        return <Bar data={horizontalBarData} options={horizontalBarOptions} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-60">
        {renderChart()}
      </div>
      
      {/* Leyenda con colores */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {labels.map((label, index) => {
            const colors = chartType === 'valuation' ? colorPalette.valuation : colorPalette.primary;
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center" style={{ gap: '12px' }}>
                <div 
                  className="w-3 h-3 rounded-sm border border-white/20"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-white/80 text-sm">
                  {label}: {Math.round(values[index])} ({percentages[index].toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
