import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface DashboardBarChartProps {
  data: Array<{ name: string; count: number }>;
  color?: string;
  height?: number;
  horizontal?: boolean;
  maxItems?: number;
}

export default function DashboardBarChart({ 
  data, 
  color = '#3B82F6',
  height = 200,
  horizontal = false,
  maxItems = 5
}: DashboardBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
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

  // Limitar cantidad de items
  const displayData = data.slice(0, maxItems);
  const total = displayData.reduce((sum, item) => sum + item.count, 0);

  // Función para truncar labels largos (Chart.js no soporta saltos de línea en labels del eje X)
  const formatLabel = (text: string, maxLength: number = 12): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const chartData = {
    labels: displayData.map(item => formatLabel(item.name)),
    datasets: [
      {
        label: 'Cantidad',
        data: displayData.map(item => item.count),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: (horizontal ? 'y' : 'x') as 'x' | 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: color,
        borderWidth: 2,
        cornerRadius: 10,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
          family: 'system-ui, -apple-system, sans-serif'
        },
        bodyFont: {
          size: 13,
          weight: 500,
          family: 'system-ui, -apple-system, sans-serif'
        },
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            // Mostrar el nombre completo en el tooltip
            const index = context[0].dataIndex;
            return displayData[index]?.name || '';
          },
          label: function(context: any) {
            const value = context.parsed.y || context.parsed.x;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${value} noticias (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          display: !horizontal,
          lineWidth: 1,
        },
        ticks: { 
          color: '#cbd5e1',
          font: { 
            size: horizontal ? 12 : 10,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif'
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: horizontal ? undefined : 8,
          callback: function(_value: any, index: number) {
            const label = displayData[index]?.name || '';
            // En resoluciones pequeñas, truncar más agresivamente
            return label.length > 10 ? label.substring(0, 10) + '...' : label;
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          display: horizontal,
          lineWidth: 1,
        },
        ticks: { 
          color: '#cbd5e1',
          font: { 
            size: 12,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif'
          },
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

