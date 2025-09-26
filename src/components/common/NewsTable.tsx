import type { NewsItem } from '../../services/api';

interface NewsTableProps {
  news: NewsItem[];
  showEditButton?: boolean;
  onEditNews?: (news: NewsItem) => void;
  className?: string;
}

export default function NewsTable({ 
  news, 
  showEditButton = false, 
  onEditNews,
  className = ""
}: NewsTableProps) {
  const handleEditNews = (item: NewsItem) => {
    if (onEditNews) {
      onEditNews(item);
    }
  };

  return (
    <div className={`history-table-container ${className}`} style={{ overflowX: 'auto' }}>
      <table className="history-table" style={{ minWidth: '1200px' }}>
        <thead>
          <tr>
            {showEditButton && <th>Acción</th>}
            <th>Título</th>
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
              {showEditButton && (
                <td>
                  <div className="history-table-cell-content">
                    <button
                      onClick={() => handleEditNews(item)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors duration-200"
                      title="Editar noticia"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </td>
              )}
              <td>
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
