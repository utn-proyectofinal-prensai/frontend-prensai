import React, { useState } from 'react';
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
import type { ClippingMetrics, MetricItem } from '../services/api';

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

type MetricType = 'soporte' | 'medio' | 'tema' | 'valoracion' | 'ejeComunicacional' | 'factorPolitico' | 'crisis' | 'gestion' | 'area' | 'menciones';

export default function MetricsCharts({ metricas }: MetricsChartsProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('soporte');
  
  const metricTypes: MetricType[] = ['soporte', 'medio', 'tema', 'valoracion', 'ejeComunicacional', 'factorPolitico', 'gestion', 'area'];
  
  const getCurrentMetrics = () => {
    return metricas[activeMetric] || [];
  };

  const getMetricColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  const getMetricBorderColor = (index: number) => {
    const colors = [
      'border-blue-400', 'border-green-400', 'border-yellow-400', 'border-red-400', 'border-purple-400',
      'border-pink-400', 'border-indigo-400', 'border-teal-400', 'border-orange-400', 'border-cyan-400'
    ];
    return colors[index % colors.length];
  };

  const barChartData = {
    labels: getCurrentMetrics().map(item => item.nombre),
    datasets: [{
      label: `Cantidad por ${activeMetric}`,
      data: getCurrentMetrics().map(item => item.cantidad),
      backgroundColor: getCurrentMetrics().map((_, index) => {
        const color = getMetricColor(index);
        return color.replace('bg-', '').replace('-500', '');
      }).map(color => `rgba(${color === 'blue' ? '59, 130, 246' : color === 'green' ? '34, 197, 94' : color === 'yellow' ? '234, 179, 8' : color === 'red' ? '239, 68, 68' : color === 'purple' ? '168, 85, 247' : color === 'pink' ? '236, 72, 153' : color === 'indigo' ? '99, 102, 241' : color === 'teal' ? '20, 184, 166' : color === 'orange' ? '249, 115, 22' : '6, 182, 212'}, 0.8)`),
      borderColor: getCurrentMetrics().map((_, index) => {
        const color = getMetricBorderColor(index);
        return color.replace('border-', '').replace('-400', '');
      }).map(color => `rgba(${color === 'blue' ? '96, 165, 250' : color === 'green' ? '74, 222, 128' : color === 'yellow' ? '250, 204, 21' : color === 'red' ? '248, 113, 113' : color === 'purple' ? '196, 181, 253' : color === 'pink' ? '244, 114, 182' : color === 'indigo' ? '129, 140, 248' : color === 'teal' ? '45, 212, 191' : color === 'orange' ? '251, 146, 60' : '34, 211, 238'}, 1)`),
      borderWidth: 2
    }]
  };

  const doughnutChartData = {
    labels: getCurrentMetrics().map(item => item.nombre),
    datasets: [{
      data: getCurrentMetrics().map(item => item.porcentaje),
      backgroundColor: getCurrentMetrics().map((_, index) => {
        const color = getMetricColor(index);
        return color.replace('bg-', '').replace('-500', '');
      }).map(color => `rgba(${color === 'blue' ? '59, 130, 246' : color === 'green' ? '34, 197, 94' : color === 'yellow' ? '234, 179, 8' : color === 'red' ? '239, 68, 68' : color === 'purple' ? '168, 85, 247' : color === 'pink' ? '236, 72, 153' : color === 'indigo' ? '99, 102, 241' : color === 'teal' ? '20, 184, 166' : color === 'orange' ? '249, 115, 22' : '6, 182, 212'}, 0.8)`),
      borderColor: getCurrentMetrics().map((_, index) => {
        const color = getMetricBorderColor(index);
        return color.replace('border-', '').replace('-400', '');
      }).map(color => `rgba(${color === 'blue' ? '96, 165, 250' : color === 'green' ? '74, 222, 128' : color === 'yellow' ? '250, 204, 21' : color === 'red' ? '248, 113, 113' : color === 'purple' ? '196, 181, 253' : color === 'pink' ? '244, 114, 182' : color === 'indigo' ? '129, 140, 248' : color === 'teal' ? '45, 212, 191' : color === 'orange' ? '251, 146, 60' : '34, 211, 238'}, 1)`),
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      title: {
        display: true,
        text: `Distribución por ${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}`,
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Análisis de Valoración - Sección destacada */}
      {metricas.valoracionAnalysis && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-6 border border-red-300/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Análisis de Valoración
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Card Negativas */}
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {metricas.valoracionAnalysis.negativas.cantidad}
                </div>
                <div className="text-sm text-red-300">Negativas</div>
                <div className="text-xs text-red-200">
                  {metricas.valoracionAnalysis.negativas.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Positivas */}
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {metricas.valoracionAnalysis.positivas.cantidad}
                </div>
                <div className="text-sm text-green-300">Positivas</div>
                <div className="text-xs text-green-200">
                  {metricas.valoracionAnalysis.positivas.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Neutras */}
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-4 border border-yellow-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {metricas.valoracionAnalysis.neutras.cantidad}
                </div>
                <div className="text-sm text-yellow-300">Neutras</div>
                <div className="text-xs text-yellow-200">
                  {metricas.valoracionAnalysis.neutras.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card No Especificadas */}
            <div className="bg-gray-500/20 backdrop-blur-sm rounded-lg p-4 border border-gray-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">
                  {metricas.valoracionAnalysis.noEspecificadas.cantidad}
                </div>
                <div className="text-sm text-gray-300">No Especificadas</div>
                <div className="text-xs text-gray-200">
                  {metricas.valoracionAnalysis.noEspecificadas.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Estado del Tema */}
            <div className={`backdrop-blur-sm rounded-lg p-4 border ${
              metricas.valoracionAnalysis.esTemaCritico 
                ? 'bg-red-500/20 border-red-300/30' 
                : 'bg-green-500/20 border-green-300/30'
            }`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  metricas.valoracionAnalysis.esTemaCritico ? 'text-red-400' : 'text-green-400'
                }`}>
                  {metricas.valoracionAnalysis.esTemaCritico ? 'CRÍTICO' : 'NO CRÍTICO'}
                </div>
                <div className={`text-sm ${
                  metricas.valoracionAnalysis.esTemaCritico ? 'text-red-300' : 'text-green-300'
                }`}>
                  Estado del Tema
                </div>
                <div className={`text-xs ${
                  metricas.valoracionAnalysis.esTemaCritico ? 'text-red-200' : 'text-green-200'
                }`}>
                  {metricas.valoracionAnalysis.negativas.cantidad >= 5 ? '5+ negativas' : '< 5 negativas'}
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de valoración */}
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Distribución por Valoración</h4>
            <div className="space-y-3">
              {/* Barra Negativas */}
              <div className="flex items-center">
                <span className="text-red-300 text-sm w-20">Negativas:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.valoracionAnalysis.negativas.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-red-300 text-sm w-12">{metricas.valoracionAnalysis.negativas.cantidad}</span>
              </div>

              {/* Barra Positivas */}
              <div className="flex items-center">
                <span className="text-green-300 text-sm w-20">Positivas:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.valoracionAnalysis.positivas.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-green-300 text-sm w-12">{metricas.valoracionAnalysis.positivas.cantidad}</span>
              </div>

              {/* Barra Neutras */}
              <div className="flex items-center">
                <span className="text-yellow-300 text-sm w-20">Neutras:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.valoracionAnalysis.neutras.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-yellow-300 text-sm w-12">{metricas.valoracionAnalysis.neutras.cantidad}</span>
              </div>

              {/* Barra No Especificadas */}
              <div className="flex items-center">
                <span className="text-gray-300 text-sm w-20">No Espec.:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-gray-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.valoracionAnalysis.noEspecificadas.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-gray-300 text-sm w-12">{metricas.valoracionAnalysis.noEspecificadas.cantidad}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análisis de Menciones - Sección destacada */}
      {metricas.mencionesAnalysis && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg p-6 border border-blue-300/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Análisis de Menciones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Card Mención 1 */}
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {metricas.mencionesAnalysis.mencion1.cantidad}
                </div>
                <div className="text-sm text-blue-300">Mención 1</div>
                <div className="text-xs text-blue-200">
                  {metricas.mencionesAnalysis.mencion1.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Mención 2 */}
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-purple-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {metricas.mencionesAnalysis.mencion2.cantidad}
                </div>
                <div className="text-sm text-purple-300">Mención 2</div>
                <div className="text-xs text-purple-200">
                  {metricas.mencionesAnalysis.mencion2.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Mención 3 */}
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {metricas.mencionesAnalysis.mencion3.cantidad}
                </div>
                <div className="text-sm text-green-300">Mención 3</div>
                <div className="text-xs text-green-200">
                  {metricas.mencionesAnalysis.mencion3.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Mención 4 */}
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-4 border border-yellow-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {metricas.mencionesAnalysis.mencion4.cantidad}
                </div>
                <div className="text-sm text-yellow-300">Mención 4</div>
                <div className="text-xs text-yellow-200">
                  {metricas.mencionesAnalysis.mencion4.porcentaje}%
                </div>
              </div>
            </div>

            {/* Card Mención 5 */}
            <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-4 border border-orange-300/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {metricas.mencionesAnalysis.mencion5.cantidad}
                </div>
                <div className="text-sm text-orange-300">Mención 5</div>
                <div className="text-xs text-orange-200">
                  {metricas.mencionesAnalysis.mencion5.porcentaje}%
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de menciones */}
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Distribución por Menciones</h4>
            <div className="space-y-3">
              {/* Barra Mención 1 */}
              <div className="flex items-center">
                <span className="text-blue-300 text-sm w-20">Mención 1:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.mencionesAnalysis.mencion1.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-blue-300 text-sm w-12">{metricas.mencionesAnalysis.mencion1.cantidad}</span>
              </div>

              {/* Barra Mención 2 */}
              <div className="flex items-center">
                <span className="text-purple-300 text-sm w-20">Mención 2:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.mencionesAnalysis.mencion2.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-purple-300 text-sm w-12">{metricas.mencionesAnalysis.mencion2.cantidad}</span>
              </div>

              {/* Barra Mención 3 */}
              <div className="flex items-center">
                <span className="text-green-300 text-sm w-20">Mención 3:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.mencionesAnalysis.mencion3.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-green-300 text-sm w-12">{metricas.mencionesAnalysis.mencion3.cantidad}</span>
              </div>

              {/* Barra Mención 4 */}
              <div className="flex items-center">
                <span className="text-yellow-300 text-sm w-20">Mención 4:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.mencionesAnalysis.mencion4.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-yellow-300 text-sm w-12">{metricas.mencionesAnalysis.mencion4.cantidad}</span>
              </div>

              {/* Barra Mención 5 */}
              <div className="flex items-center">
                <span className="text-orange-300 text-sm w-20">Mención 5:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 mx-2">
                  <div 
                    className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metricas.mencionesAnalysis.mencion5.porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-orange-300 text-sm w-12">{metricas.mencionesAnalysis.mencion5.cantidad}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-300/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{metricas.totalNoticias}</div>
            <div className="text-sm text-blue-300">Total Noticias</div>
          </div>
        </div>

        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-300/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{metricas.resumen.mediosUnicos}</div>
            <div className="text-sm text-green-300">Medios Únicos</div>
          </div>
        </div>

        <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-purple-300/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{metricas.resumen.temasUnicos}</div>
            <div className="text-sm text-purple-300">Temas Únicos</div>
          </div>
        </div>

        <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-4 border border-orange-300/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{metricas.resumen.rangoDias}</div>
            <div className="text-sm text-orange-300">Rango (Días)</div>
          </div>
        </div>
      </div>

      {/* Pestañas de Métricas */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {metricTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveMetric(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeMetric === type
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Gráfico de Dona */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="h-64">
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        <div className="mt-6 bg-white/10 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-4">
            Detalle de {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2">Nombre</th>
                  <th className="text-right py-2">Cantidad</th>
                  <th className="text-right py-2">Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentMetrics().map((item, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-2">{item.nombre}</td>
                    <td className="text-right py-2">{item.cantidad}</td>
                    <td className="text-right py-2">{item.porcentaje}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 