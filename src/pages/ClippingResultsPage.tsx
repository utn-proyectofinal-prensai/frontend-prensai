import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import MetricCard from '../components/common/MetricCard';
import { CheckCircle2, Calendar, Tag, FileText } from 'lucide-react';
import '../styles/upload-news.css';

interface ClippingResult {
  clipping: {
    id: number;
    title: string;
    created_at: string;
  };
  message: string;
  newsCount: number;
  topicName: string;
  startDate: string;
  endDate: string;
}

export default function ClippingResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as ClippingResult | undefined;

  // Si no hay resultado o el clipping no está definido, redirigir a create-clipping
  if (!result || !result.clipping) {
    navigate('/create-clipping');
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="upload-news-container">
      <div className="upload-news-main-content">
        <div className="upload-news-content-wrapper">
          <div style={{ marginBottom: '3rem' }}>
            <PageHeader 
              title="Clipping creado exitosamente"
            />
          </div>

          <div className="upload-news-section">
            {/* Tip con el resultado */}
            <div 
              className="upload-news-tip"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)', // green-500/10
                borderColor: 'rgba(34, 197, 94, 0.3)', // green-500/30
                margin: '0 0 2rem 0',
              }}
            >
              <p 
                className="upload-news-tip-text flex items-center justify-center gap-2"
                style={{ color: 'rgb(134, 239, 172)' }} // green-300
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <strong>Resultado:</strong> {result.message || (result.clipping?.title ? `El clipping "${result.clipping.title}" se creó exitosamente.` : 'El clipping se creó exitosamente.')}
              </p>
            </div>

            {/* Resumen de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <MetricCard
                title="Noticias incluidas"
                value={result.newsCount}
                iconColor="blue"
                icon={<FileText className="w-5 h-5" />}
              />
              <MetricCard
                title="Tema"
                value={result.topicName}
                iconColor="green"
                icon={<Tag className="w-5 h-5" />}
              />
              <MetricCard
                title="Fecha inicio"
                value={formatDate(result.startDate)}
                iconColor="purple"
                icon={<Calendar className="w-5 h-5" />}
              />
              <MetricCard
                title="Fecha fin"
                value={formatDate(result.endDate)}
                iconColor="orange"
                icon={<Calendar className="w-5 h-5" />}
              />
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Button
                onClick={() => navigate('/clippings-history')}
                variant="secondary"
                size="default"
                icon="ArrowLeft"
                iconPosition="left"
                className="w-full"
              >
                Volver al historial
              </Button>
              <Button
                onClick={() => navigate(`/clipping/${result.clipping?.id || ''}`)}
                variant="primary"
                size="default"
                icon="Eye"
                iconPosition="left"
                className="w-full"
                disabled={!result.clipping?.id}
              >
                Ver clipping
              </Button>
              <Button
                onClick={() => navigate('/create-clipping')}
                variant="success"
                size="default"
                icon="Plus"
                iconPosition="left"
                className="w-full"
              >
                Crear otro clipping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

