import type { NewsItem } from '../../services/api';
import { Button } from '../ui/button';

interface NewsTableProps {
  news: NewsItem[];
  showEditButton?: boolean;
  onEditNews?: (news: NewsItem) => void;
  className?: string;
  selectedNewsIds?: Set<number>;
  onNewsToggle?: (newsId: number) => void;
}

export default function NewsTable({ 
  news, 
  showEditButton = false, 
  onEditNews,
  className = "",
  selectedNewsIds,
  onNewsToggle
}: NewsTableProps) {
  const handleEditNews = (item: NewsItem) => {
    if (onEditNews) {
      onEditNews(item);
    }
  };

  const handleNewsToggle = (newsId: number) => {
    if (onNewsToggle) {
      onNewsToggle(newsId);
    }
  };

  const showCheckboxes = selectedNewsIds !== undefined && onNewsToggle !== undefined;

  return (
    <div className={`history-table-container ${className}`} style={{ overflowX: 'auto' }}>
      <table className="history-table" style={{ minWidth: '1200px' }}>
        <thead>
          <tr>
            {showCheckboxes && <th>Seleccionar</th>}
            {showEditButton && <th>Acción</th>}
            <th className="history-table-title-col">Título</th>
            <th>Fecha</th>
            <th>Medio</th>
            <th>Link</th>
            <th>Tipo</th>
            <th>Soporte</th>
            <th>Sección</th>
            <th>Valoración</th>
            <th>Tema</th>
            <th>Menciones</th>
            <th>Autor</th>
            <th>Entrevistado</th>
            <th>Crisis</th>
            <th>Factor Político</th>
            <th>Audiencia</th>
            <th>Presupuesto</th>
            {showEditButton && (
              <>
                <th>Creador</th>
                <th>Revisor</th>
                <th>Fecha de Creación</th>
                <th>Última Actualización</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id}>
              {showCheckboxes && (
                <td>
                  <div className="history-table-cell-content">
                    <input
                      type="checkbox"
                      checked={selectedNewsIds?.has(item.id) || false}
                      onChange={() => handleNewsToggle(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                </td>
              )}
              {showEditButton && (
                <td>
                  <div className="history-table-cell-content">
                    <Button
                      onClick={() => handleEditNews(item)}
                      variant="ghost"
                      size="icon"
                      icon="Edit"
                      title="Editar noticia"
                    />
                  </div>
                </td>
              )}
              <td className="history-table-title-col">
                <div className="history-table-cell-content font-semibold">
                  {item.title}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.media}
                </div>
              </td>
              <td>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="history-link"
                >
                  Ver
                </a>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.publication_type === 'REVISAR MANUAL' || !item.publication_type ? (
                    <span className="history-badge history-badge-warning">
                      {item.publication_type || 'Sin tipo'}
                    </span>
                  ) : (
                    item.publication_type
                  )}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.support || '-'}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.section || '-'}
                </div>
              </td>
              <td>
                <span className={`history-badge ${
                  item.valuation === 'positive' 
                    ? 'history-badge-positive' 
                    : item.valuation === 'neutral'
                    ? 'history-badge-neutral'
                    : item.valuation === 'negative'
                    ? 'history-badge-negative'
                    : item.valuation === 'REVISAR MANUAL' || !item.valuation
                    ? 'history-badge-warning'
                    : 'history-badge-neutral'
                }`}>
                  {item.valuation === 'positive' ? 'Positiva' :
                   item.valuation === 'negative' ? 'Negativa' :
                   item.valuation === 'neutral' ? 'Neutra' :
                   item.valuation === 'REVISAR MANUAL' ? 'Revisar manual' :
                   item.valuation || 'Sin valoración'}
                </span>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.topic ? (
                    <div className="flex flex-col gap-1">
                      <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                        {item.topic.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-white/50">-</span>
                  )}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.mentions.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {item.mentions.map((mention, index) => (
                        <span key={index} className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                          {mention.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-white/50">-</span>
                  )}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.author || '-'}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.interviewee || '-'}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.crisis ? (
                    <span className="text-red-400 font-semibold">SÍ</span>
                  ) : (
                    <span className="text-white font-semibold">NO</span>
                  )}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.political_factor === 'REVISAR MANUAL' || !item.political_factor ? (
                    <span className="history-badge history-badge-warning">
                      {item.political_factor || 'Sin factor'}
                    </span>
                  ) : (
                    item.political_factor
                  )}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.audience_size ? item.audience_size.toLocaleString('es-AR') : '-'}
                </div>
              </td>
              <td>
                <div className="history-table-cell-content">
                  {item.quotation ? item.quotation.toLocaleString('es-AR') : '-'}
                </div>
              </td>
              {showEditButton && (
                <>
                  <td>
                    <div className="history-table-cell-content">
                      {item.creator?.name || '-'}
                    </div>
                  </td>
                  <td>
                    <div className="history-table-cell-content">
                      {item.reviewer?.name || '-'}
                    </div>
                  </td>
                  <td>
                    <div className="history-table-cell-content">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td>
                    <div className="history-table-cell-content">
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
