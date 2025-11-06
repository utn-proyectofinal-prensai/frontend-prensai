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
      <div className="flex items-center justify-center h-full text-white/60">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">No hay datos disponibles</div>
        </div>
      </div>
    );
  }

  // Limitar cantidad de items
  const displayData = data.slice(0, maxItems);
  const total = displayData.reduce((sum, item) => sum + item.count, 0);

  const chartData = {
    labels: displayData.map(item => item.name),
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
            size: horizontal ? 12 : 11,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif'
          },
          maxRotation: horizontal ? 0 : 45,
          minRotation: 0,
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

