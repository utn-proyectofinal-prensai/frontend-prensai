import { useState, useEffect } from 'react';
import { apiService, type Topic, type Mention } from '../services/api';
import { Snackbar, TopicCard, MentionCard, ConfirmationModal } from '../components/common';
import { TopicModal, MentionModal } from '../components/admin';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'eventos' | 'menciones'>('eventos');
  
  // Estados para Eventos/Temas
  const [eventos, setEventos] = useState<Topic[]>([]);
  const [eventosLoading, setEventosLoading] = useState(true);
  const [eventosError, setEventosError] = useState<string | null>(null);
  
  // Estados para Menciones
  const [menciones, setMenciones] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Snackbar para mensajes
  const [snackbar, setSnackbar] = useState<{ message: string; show: boolean; type: 'success' | 'error' | 'info' }>({
    message: '',
    show: false,
    type: 'error'
  });

  // Nota: Eliminada funcionalidad de drag and drop - ahora se usa el campo enabled directamente

  // Cargar menciones desde la API
  useEffect(() => {
    const loadMentions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar todas las menciones usando la nueva API
        const { mentions } = await apiService.getAllMentions();
        setMenciones(mentions);
      } catch (err) {
        console.error('Error cargando menciones:', err);
        const apiMsg = err instanceof Error ? err.message : '';
        const message = apiMsg?.trim() ? apiMsg : 'Error al cargar las menciones';
        setError(message);
        setSnackbar({ message, show: true, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadMentions();
  }, []);

  // Cargar temas desde la API
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setEventosLoading(true);
        setEventosError(null);
        
        // Cargar todos los temas usando la nueva API
        const { topics } = await apiService.getAllTopics();
        setEventos(topics);
      } catch (err) {
        console.error('Error cargando temas:', err);
        const apiMsg = err instanceof Error ? err.message : '';
        const message = apiMsg?.trim() ? apiMsg : 'Error al cargar los temas';
        setEventosError(message);
        setSnackbar({ message, show: true, type: 'error' });
      } finally {
        setEventosLoading(false);
      }
    };

    loadTopics();
  }, []);

  // Estados para formularios
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showMentionModal, setShowMentionModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedMention, setSelectedMention] = useState<Mention | null>(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [isCreatingMention, setIsCreatingMention] = useState(false);

  // Estados para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'topic' | 'mention';
    itemName: string;
  } | null>(null);

  // Nota: Eliminada la selección de colores - la nueva API no incluye este campo

  // Funciones para modal de confirmación
  const showDeleteConfirmation = (type: 'topic' | 'mention', id: number, name: string) => {
    const isTopicType = type === 'topic';
    setConfirmModalConfig({
      title: `Eliminar ${isTopicType ? 'Tema' : 'Mención'}`,
      message: `¿Estás seguro de que quieres eliminar ${isTopicType ? 'el tema' : 'la mención'} "${name}"?\n\nEsta acción no se puede deshacer.`,
      onConfirm: () => {
        if (isTopicType) {
          handleEventoDeleteConfirmed(id);
        } else {
          handleMencionDeleteConfirmed(id);
        }
      },
      type,
      itemName: name
    });
    setShowConfirmModal(true);
  };

  const handleEventoDelete = (id: number) => {
    const topic = eventos.find(t => t.id === id);
    if (topic) {
      showDeleteConfirmation('topic', id, topic.name);
    }
  };

  const handleEventoDeleteConfirmed = async (id: number) => {
    try {
      await apiService.deleteTopic(id.toString());
      
      // Recargar temas desde la API
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
      
      setSnackbar({ message: 'Tema eliminado correctamente', show: true, type: 'success' });
      setShowConfirmModal(false);
      setConfirmModalConfig(null);
    } catch (error) {
      console.error('❌ Error eliminando tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al eliminar el tema. Intenta nuevamente.', show: true, type: 'error' });
      setShowConfirmModal(false);
      setConfirmModalConfig(null);
    }
  };

  const handleTopicView = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsCreatingTopic(false);
    setShowTopicModal(true);
  };

  const handleTopicEditClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsCreatingTopic(false);
    setShowTopicModal(true);
  };

  const handleTopicEdit = async (topic: Topic) => {
    try {
      await apiService.updateTopic(topic.id.toString(), {
        name: topic.name,
        description: topic.description,
        enabled: topic.enabled
      });
      
      // Recargar temas desde la API para asegurar sincronización
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
      
      setSnackbar({ message: 'Tema actualizado correctamente', show: true, type: 'success' });
    } catch (error) {
      console.error('Error al actualizar tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al actualizar el tema', show: true, type: 'error' });
    }
  };

  const handleTopicCreate = async (topicData: any) => {
    try {
      await apiService.createTopic({
        name: topicData.name,
        description: topicData.description,
        enabled: topicData.enabled
      });
      
      // Recargar temas desde la API para asegurar sincronización
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
      
      setSnackbar({ message: 'Tema creado correctamente', show: true, type: 'success' });
    } catch (error) {
      console.error('Error al crear tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al crear el tema', show: true, type: 'error' });
    }
  };


  const handleMencionDelete = (id: number) => {
    const mention = menciones.find(m => m.id === id);
    if (mention) {
      showDeleteConfirmation('mention', id, mention.name);
    }
  };

  const handleMencionDeleteConfirmed = async (id: number) => {
    try {
      await apiService.deleteMention(id.toString());
      
      // Recargar menciones desde la API
      const { mentions } = await apiService.getAllMentions();
      setMenciones(mentions);
      
      setSnackbar({ message: 'Mención eliminada correctamente', show: true, type: 'success' });
      setShowConfirmModal(false);
      setConfirmModalConfig(null);
    } catch (error) {
      console.error('❌ Error eliminando mención:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({
        message: apiMsg?.trim() ? apiMsg : 'Error al eliminar la mención. Intenta nuevamente.',
        show: true,
        type: 'error'
      });
      setShowConfirmModal(false);
      setConfirmModalConfig(null);
    }
  };

  const handleMentionView = (mention: Mention) => {
    setSelectedMention(mention);
    setIsCreatingMention(false);
    setShowMentionModal(true);
  };

  const handleMentionEditClick = (mention: Mention) => {
    setSelectedMention(mention);
    setIsCreatingMention(false);
    setShowMentionModal(true);
  };

  const handleMentionEdit = async (mention: Mention) => {
    try {
      await apiService.updateMention(mention.id.toString(), {
        name: mention.name,
        enabled: mention.enabled
      });
      
      // Recargar menciones desde la API para asegurar sincronización
      const { mentions } = await apiService.getAllMentions();
      setMenciones(mentions);
      
      setSnackbar({ message: 'Mención actualizada correctamente', show: true, type: 'success' });
    } catch (error) {
      console.error('Error al actualizar mención:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al actualizar la mención', show: true, type: 'error' });
    }
  };

  const handleMentionCreate = async (mentionData: any) => {
    try {
      await apiService.createMention({
        name: mentionData.name,
        enabled: mentionData.enabled
      });
      
      // Recargar menciones desde la API para asegurar sincronización
      const { mentions } = await apiService.getAllMentions();
      setMenciones(mentions);
      
      setSnackbar({ message: 'Mención creada correctamente', show: true, type: 'success' });
    } catch (error) {
      console.error('Error al crear mención:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al crear la mención', show: true, type: 'error' });
    }
  };


  return (
    <div className="w-full h-full">
      {/* Header de la página */}
      <PageHeader
        title="Temas y Menciones"
        description="Gestioná los temas y menciones que el sistema monitoreará en las noticias"
        className="mb-12"
      />

      {/* Contenido principal */}
      <div className="w-full h-full flex flex-col items-center">
        {/* Tabs */}
        <div className="flex space-x-1 mb-16 bg-black/20 backdrop-blur-sm rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('eventos')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'eventos'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Temas
          </button>
          <button
            onClick={() => setActiveTab('menciones')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'menciones'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Menciones
          </button>
        </div>

        {/* Contenido de Temas */}
        {activeTab === 'eventos' && (
          <div className="w-full">
            {/* Header con botón agregar */}
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
              <h2 className="text-xl font-bold text-white">Temas</h2>
              <Button
                onClick={() => {
                  setSelectedTopic(null);
                  setIsCreatingTopic(true);
                  setShowTopicModal(true);
                }}
                variant="success"
                size="default"
                icon="Plus"
              >
                Agregar Tema
              </Button>
            </div>

            {/* Loading y Error states */}
            {eventosLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white/80">Cargando temas...</p>
              </div>
            ) : eventosError ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">⚠️</div>
                <p className="text-white/80 mb-4">{eventosError}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="primary"
                  size="default"
                  icon="Refresh"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              /* Lista de eventos/temas con cards mejoradas */
              <div className="cards-grid" style={{ marginTop: '2.5rem', paddingTop: '0' }}>
                {eventos.map((evento) => (
                  <TopicCard
                    key={evento.id}
                    topic={evento}
                    variant="management"
                    showActions={true}
                    onView={handleTopicView}
                    onEdit={handleTopicEditClick}
                    onDelete={handleEventoDelete}
                  />
              ))}
            </div>
            )}
          </div>
        )}

        {/* Contenido de Menciones */}
        {activeTab === 'menciones' && (
          <div className="w-full">
            {/* Header con botón agregar */}
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
              <h2 className="text-xl font-bold text-white">Menciones de Personas</h2>
              <Button
                onClick={() => {
                  setSelectedMention(null);
                  setIsCreatingMention(true);
                  setShowMentionModal(true);
                }}
                variant="success"
                size="default"
                icon="Plus"
              >
                Agregar Mención
              </Button>
            </div>

            {/* Lista de Menciones */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white/80">Cargando menciones...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">⚠️</div>
                <p className="text-white/80 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="primary"
                  size="default"
                  icon="Refresh"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              /* Lista de menciones con cards mejoradas */
              <div className="cards-grid" style={{ marginTop: '2.5rem', paddingTop: '0' }}>
                {menciones.map((mencion) => (
                  <MentionCard
                    key={mencion.id}
                    mention={mencion}
                    showActions={true}
                    onView={handleMentionView}
                    onEdit={handleMentionEditClick}
                    onDelete={handleMencionDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Tema */}
      <TopicModal
        topic={selectedTopic}
        isOpen={showTopicModal}
        onClose={() => {
          setShowTopicModal(false);
          setSelectedTopic(null);
          setIsCreatingTopic(false);
        }}
        onEdit={handleTopicEdit}
        onDelete={handleEventoDelete}
        onCreateTopic={handleTopicCreate}
        isCreateMode={isCreatingTopic}
        initialEditMode={selectedTopic !== null && !isCreatingTopic}
      />

      {/* Modal para Mención */}
      <MentionModal
        mention={selectedMention}
        isOpen={showMentionModal}
        onClose={() => {
          setShowMentionModal(false);
          setSelectedMention(null);
          setIsCreatingMention(false);
        }}
        onEdit={handleMentionEdit}
        onDelete={handleMencionDelete}
        onCreateMention={handleMentionCreate}
        isCreateMode={isCreatingMention}
        initialEditMode={selectedMention !== null && !isCreatingMention}
      />

      {/* Modal de confirmación para eliminación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmModalConfig(null);
        }}
        onConfirm={confirmModalConfig?.onConfirm || (() => {})}
        title={confirmModalConfig?.title || ''}
        message={confirmModalConfig?.message || ''}
        confirmText="Eliminar"
        type="danger"
      />

      {/* Snackbar de mensajes */}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.show}
        variant={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
        duration={6000}
      />
    </div>
  );
}
