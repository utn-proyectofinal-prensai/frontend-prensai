import { useState, useEffect } from 'react';
import { apiService, type Topic, type Mention } from '../services/api';
import { Snackbar, TopicCard, MentionCard } from '../components/common';
import { TopicFormModal, MentionFormModal } from '../components/admin';

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

  // Snackbar para errores
  const [snackbar, setSnackbar] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false
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
        setSnackbar({ message, show: true });
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
        setSnackbar({ message, show: true });
      } finally {
        setEventosLoading(false);
      }
    };

    loadTopics();
  }, []);

  // Estados para formularios
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [showMencionForm, setShowMencionForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Topic | null>(null);
  const [editingMencion, setEditingMencion] = useState<Mention | null>(null);

  // Nota: Eliminada la selección de colores - la nueva API no incluye este campo

  // Funciones para Temas
  const handleEventoSubmit = async (formData: FormData) => {
    const nombre = formData.get('nombre') as string;
    const descripcion = (formData.get('descripcion') as string) || '';
    const enabled = formData.get('enabled') === 'true';
    // Nota: crisis no se puede modificar por el momento desde la API
    
    try {
      if (editingEvento) {
        // Editando tema existente
        await apiService.updateTopic(editingEvento.id.toString(), {
          name: nombre,
          description: descripcion,
          enabled
        });
      } else {
        // Creando nuevo tema
        await apiService.createTopic({
          name: nombre,
          description: descripcion,
          enabled
        });
      }
      
      // Recargar temas desde la API para asegurar sincronización
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
      
      setShowEventoForm(false);
      setEditingEvento(null);
    } catch (error) {
      console.error('❌ Error guardando tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al guardar el tema. Intenta nuevamente.', show: true });
    }
  };

  const handleEventoDelete = async (id: number) => {
    try {
      await apiService.deleteTopic(id.toString());
      
      // Recargar temas desde la API
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
    } catch (error) {
      console.error('❌ Error eliminando tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({ message: apiMsg?.trim() ? apiMsg : 'Error al eliminar el tema. Intenta nuevamente.', show: true });
    }
  };

  const handleEventoEdit = (evento: Topic) => {
    setEditingEvento(evento);
    setShowEventoForm(true);
  };

  // Funciones para Menciones
  const handleMencionSubmit = async (formData: FormData) => {
    const nombre = formData.get('nombre') as string;
    const enabled = formData.get('enabled') === 'true';
    
    try {
      if (editingMencion) {
        // Editando mención existente
        await apiService.updateMention(editingMencion.id.toString(), { name: nombre, enabled });
      } else {
        // Creando nueva mención
        await apiService.createMention({ name: nombre, enabled });
      }
      
      // Recargar menciones desde la API para asegurar sincronización
      const { mentions } = await apiService.getAllMentions();
      setMenciones(mentions);
      
      setShowMencionForm(false);
      setEditingMencion(null);
    } catch (error) {
      console.error('❌ Error guardando mención:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({
        message: apiMsg?.trim() ? apiMsg : 'Error al guardar la mención. Intenta nuevamente.',
        show: true
      });
    }
  };

  const handleMencionDelete = async (id: number) => {
    try {
      await apiService.deleteMention(id.toString());
      
      // Recargar menciones desde la API
      const { mentions } = await apiService.getAllMentions();
      setMenciones(mentions);
    } catch (error) {
      console.error('❌ Error eliminando mención:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({
        message: apiMsg?.trim() ? apiMsg : 'Error al eliminar la mención. Intenta nuevamente.',
        show: true
      });
    }
  };

  const handleMencionEdit = (mencion: Mention) => {
    setEditingMencion(mencion);
    setShowMencionForm(true);
  };


  return (
    <div className="w-full h-full">
      {/* Contenido principal */}
      <div className="w-full h-full">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 backdrop-blur-sm rounded-lg p-1 w-fit">
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
          <div className="space-y-6">
            {/* Header con botón agregar */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Temas</h2>
              <button
                onClick={() => setShowEventoForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                + Agregar Tema
              </button>
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
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              /* Lista de eventos/temas con cards mejoradas */
              <div className="cards-grid">
                {eventos.map((evento) => (
                  <TopicCard
                    key={evento.id}
                    topic={evento}
                    variant="management"
                    showActions={true}
                    onEdit={handleEventoEdit}
                    onDelete={handleEventoDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contenido de Menciones */}
        {activeTab === 'menciones' && (
          <div className="space-y-6">
            {/* Header con botón agregar */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Menciones de Personas</h2>
              <button
                onClick={() => setShowMencionForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                + Agregar Mención
              </button>
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
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              /* Lista de menciones con cards mejoradas */
              <div className="cards-grid">
                {menciones.map((mencion) => (
                  <MentionCard
                    key={mencion.id}
                    mention={mencion}
                    showActions={true}
                    onEdit={handleMencionEdit}
                    onDelete={handleMencionDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Tema */}
      <TopicFormModal
        isOpen={showEventoForm}
        editingTopic={editingEvento}
        onClose={() => {
          setShowEventoForm(false);
          setEditingEvento(null);
        }}
        onSubmit={handleEventoSubmit}
      />

      {/* Modal para Mención */}
      <MentionFormModal
        isOpen={showMencionForm}
        editingMention={editingMencion}
        onClose={() => {
          setShowMencionForm(false);
          setEditingMencion(null);
        }}
        onSubmit={handleMencionSubmit}
      />

      {/* Snackbar de errores */}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.show}
        onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
        duration={6000}
      />
    </div>
  );
}
