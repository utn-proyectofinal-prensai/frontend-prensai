import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface DashboardLineChartProps {
  data: Array<{ date: string; count: number }>;
  color?: string;
  height?: number;
}

export default function DashboardLineChart({ 
  data, 
  color = '#3B82F6',
  height = 200 
}: DashboardLineChartProps) {
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

  // Formatear fechas para mostrar solo día/mes
  const labels = data.map(item => {
    const date = new Date(item.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Noticias',
        data: data.map(item => item.count),
        borderColor: color,
        backgroundColor: `${color}30`,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 0,
        top: 0,
        left: 0,
        right: 0
      }
    },
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
            const index = context[0].dataIndex;
            const date = new Date(data[index].date);
            return `Día: ${date.toLocaleDateString('es-AR')}`;
          },
          label: function(context: any) {
            return `Noticias: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          display: false,
        },
        ticks: { 
          color: '#cbd5e1',
          font: { 
            size: 12,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif'
          },
          padding: 0,
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
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
    <div style={{ height: `${height - 20}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

