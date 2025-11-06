import { 
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardDonutChartProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
    unassigned?: number;
  };
  height?: number;
  showLegend?: boolean;
}

export default function DashboardDonutChart({ 
  data, 
  height = 200,
  showLegend = true 
}: DashboardDonutChartProps) {
  const total = data.positive + data.neutral + data.negative + (data.unassigned || 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">No hay datos disponibles</div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Positiva', 'Neutra', 'Negativa', ...(data.unassigned && data.unassigned > 0 ? ['Sin asignar'] : [])],
    datasets: [
      {
        data: [
          data.positive,
          data.neutral,
          data.negative,
          ...(data.unassigned && data.unassigned > 0 ? [data.unassigned] : [])
        ],
        backgroundColor: [
          '#22c55e', // Verde más vibrante para positivo
          '#f59e0b', // Naranja/amarillo para neutro
          '#ef4444', // Rojo para negativo
          ...(data.unassigned && data.unassigned > 0 ? ['#64748b'] : []) // Gris para sin asignar
        ],
        borderColor: '#0f172a',
        borderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          color: '#f1f5f9',
          font: { 
            size: 13,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif'
          },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#3B82F6',
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
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} noticias (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

