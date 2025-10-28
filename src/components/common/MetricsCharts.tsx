
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { ClippingMetrics } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MetricsChartsProps {
  metricas: ClippingMetrics;
}

export default function MetricsCharts({ metricas }: MetricsChartsProps) {
  // Configuración para el gráfico de barras
  const barChartData = {
    labels: metricas.support_stats?.items?.map(item => item.key) || [],
    datasets: [
      {
        label: 'Cantidad de noticias',
        data: metricas.support_stats?.items?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(139, 92, 246, 0.8)',   // Purple
          'rgba(6, 182, 212, 0.8)',    // Cyan
          'rgba(132, 204, 22, 0.8)',   // Lime
          'rgba(249, 115, 22, 0.8)',   // Orange
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(132, 204, 22, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribución por Soporte',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: { dataIndex: number; parsed: { y: number } }) {
            const percentage = metricas.support_stats?.items?.[context.dataIndex]?.percentage || 0;
            return `${context.parsed.y} noticias (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Configuración para el gráfico de dona
  const doughnutChartData = {
    labels: metricas.support_stats?.items?.map(item => item.key) || [],
    datasets: [
      {
        data: metricas.support_stats?.items?.map(item => item.percentage) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(132, 204, 22, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(132, 204, 22, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 3,
        cutout: '60%',
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Porcentajes por Soporte',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: { label: string; parsed: number }) {
            const soporte = context.label;
            const cantidad = metricas.support_stats?.items?.find(item => item.key === soporte)?.count || 0;
            return `${soporte}: ${context.parsed}% (${cantidad} noticias)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
          <div className="text-2xl font-bold">{metricas.news_count}</div>
          <div className="text-sm opacity-90">Total Noticias</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
          <div className="text-2xl font-bold">{metricas.support_stats?.total || 0}</div>
          <div className="text-sm opacity-90">Soportes Únicos</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
          <div className="text-2xl font-bold">{metricas.support_stats?.items?.[0]?.key || '-'}</div>
          <div className="text-sm opacity-90">Más Frecuente</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <div className="text-2xl font-bold">{metricas.support_stats?.items?.[0]?.percentage || 0}%</div>
          <div className="text-sm opacity-90">Porcentaje Principal</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Gráfico de dona */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="h-80">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Detalle por Soporte</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4">Soporte</th>
                <th className="text-left py-3 px-4">Cantidad</th>
                <th className="text-left py-3 px-4">Porcentaje</th>
                <th className="text-left py-3 px-4">Barra</th>
              </tr>
            </thead>
            <tbody>
              {metricas.support_stats?.items?.map((item, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="py-3 px-4 font-medium">{item.key}</td>
                  <td className="py-3 px-4">{item.count}</td>
                  <td className="py-3 px-4">{item.percentage}%</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 