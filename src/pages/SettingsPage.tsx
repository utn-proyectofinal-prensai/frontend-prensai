import React, { useState, useEffect } from 'react';
import { apiService, type Topic, type Mention } from '../services/api';
import Snackbar from '../components/common/Snackbar';

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

  // Cargar eventos/temas desde la API
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setEventosLoading(true);
        setEventosError(null);
        
        // Cargar todos los temas usando la nueva API
        const { topics } = await apiService.getAllTopics();
        setEventos(topics);
      } catch (err) {
        console.error('Error cargando eventos/temas:', err);
        const apiMsg = err instanceof Error ? err.message : '';
        const message = apiMsg?.trim() ? apiMsg : 'Error al cargar los eventos/temas';
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

  // Funciones para Eventos/Temas
  const handleEventoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nombre = formData.get('nombre') as string;
    const descripcion = (formData.get('descripcion') as string) || '';
    const enabled = formData.get('enabled') === 'true';
    
    try {
      if (editingEvento) {
        // Editando evento/tema existente
        await apiService.updateTopic(editingEvento.id.toString(), {
          name: nombre,
          description: descripcion,
          enabled
        });
      } else {
        // Creando nuevo evento/tema
        await apiService.createTopic({
          name: nombre,
          description: descripcion,
          enabled
        });
      }
      
      // Recargar eventos/temas desde la API para asegurar sincronización
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
      
      setShowEventoForm(false);
      setEditingEvento(null);
    } catch (error) {
      console.error('❌ Error guardando evento/tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({
        message: apiMsg?.trim() ? apiMsg : 'Error al guardar el evento/tema. Intenta nuevamente.',
        show: true
      });
    }
  };

  const handleEventoDelete = async (id: number) => {
    try {
      await apiService.deleteTopic(id.toString());
      
      // Recargar eventos/temas desde la API
      const { topics } = await apiService.getAllTopics();
      setEventos(topics);
    } catch (error) {
      console.error('❌ Error eliminando evento/tema:', error);
      const apiMsg = error instanceof Error ? error.message : '';
      setSnackbar({
        message: apiMsg?.trim() ? apiMsg : 'Error al eliminar el evento/tema. Intenta nuevamente.',
        show: true
      });
    }
  };

  const handleEventoEdit = (evento: Topic) => {
    setEditingEvento(evento);
    setShowEventoForm(true);
  };

  // Funciones para Menciones
  const handleMencionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
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
            Eventos/Temas
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

        {/* Contenido de Eventos/Temas */}
        {activeTab === 'eventos' && (
          <div className="space-y-6">
            {/* Header con botón agregar */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Eventos y Temas</h2>
              <button
                onClick={() => setShowEventoForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                + Agregar Evento/Tema
              </button>
            </div>

            {/* Loading y Error states */}
            {eventosLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white/80">Cargando eventos...</p>
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
              /* Lista de eventos/temas */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventos.map((evento) => (
                <div key={evento.id} className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{evento.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEventoEdit(evento)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEventoDelete(evento.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{evento.description}</p>
                  
                  {/* Estados */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        evento.enabled 
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-400/30'
                      }`}>
                        {evento.enabled ? 'Activo' : 'Inactivo'}
                      </span>
                      {evento.crisis && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-400/30">
                          ⚠️ Crisis
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menciones.map((mencion) => (
                  <div key={mencion.id} className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{mencion.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMencionEdit(mencion)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleMencionDelete(mencion.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {/* Estado activo */}
                    <div className="mt-4 flex justify-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mencion.enabled 
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-400/30'
                      }`}>
                        {mencion.enabled ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Evento/Tema */}
      {showEventoForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingEvento ? 'Editar Evento/Tema' : 'Agregar Evento/Tema'}
            </h3>
            <form onSubmit={handleEventoSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  defaultValue={editingEvento?.name}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Elecciones 2024"
                />
                <p className="text-white/60 text-xs mt-1">
                  El sistema intentará asociar las noticias a alguno de los eventos o temas cargados. <strong>SE RECOMIENDA REVISIÓN POSTERIOR.</strong>
                </p>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  defaultValue={editingEvento?.description}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                  placeholder="Descripción del evento o tema"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Estado
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="enabled"
                      value="true"
                      defaultChecked={editingEvento?.enabled !== false}
                      className="w-4 h-4 text-blue-600 bg-black/30 border-white/20 focus:ring-blue-500"
                    />
                    <span className="text-white">Activo</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="enabled"
                      value="false"
                      defaultChecked={editingEvento?.enabled === false}
                      className="w-4 h-4 text-blue-600 bg-black/30 border-white/20 focus:ring-blue-500"
                    />
                    <span className="text-white">Inactivo</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventoForm(false);
                    setEditingEvento(null);
                  }}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingEvento ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Mención */}
      {showMencionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingMencion ? 'Editar Mención' : 'Agregar Mención'}
            </h3>
            <form onSubmit={handleMencionSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Nombre a buscar
                </label>
                <input
                  type="text"
                  name="nombre"
                  defaultValue={editingMencion?.name}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                  placeholder="Ej: Juan Pérez"
                />
                <p className="text-white/60 text-xs mt-1">
                  Este nombre se buscará <strong>exactamente</strong> en todas las noticias procesadas, tal como lo escribas aquí
                </p>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Estado
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="enabled"
                      value="true"
                      defaultChecked={editingMencion?.enabled !== false}
                      className="w-4 h-4 text-green-600 bg-black/30 border-white/20 focus:ring-green-500"
                    />
                    <span className="text-white">Activa</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="enabled"
                      value="false"
                      defaultChecked={editingMencion?.enabled === false}
                      className="w-4 h-4 text-green-600 bg-black/30 border-white/20 focus:ring-green-500"
                    />
                    <span className="text-white">Inactiva</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMencionForm(false);
                    setEditingMencion(null);
                  }}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingMencion ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
