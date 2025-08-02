import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface EventoTema {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  activo: boolean;
  etiquetas: string[];
}

interface Mencion {
  id: string;
  nombre: string;
  activo: boolean;
  numeroMencion?: number; // Número fijo de mención (1-5)
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'eventos' | 'menciones'>('eventos');
  
  // Estados para Eventos/Temas
  const [eventos, setEventos] = useState<EventoTema[]>([
    { id: '1', nombre: 'Elecciones 2024', descripcion: 'Proceso electoral nacional', color: '#3B82F6', activo: true, etiquetas: ['política', 'nacional', 'elecciones'] },
    { id: '2', nombre: 'Economía', descripcion: 'Noticias económicas y financieras', color: '#10B981', activo: true, etiquetas: ['finanzas', 'mercado'] },
    { id: '3', nombre: 'Tecnología', descripcion: 'Innovaciones tecnológicas', color: '#F59E0B', activo: true, etiquetas: ['innovación', 'digital', 'IA'] },
  ]);
  
  // Estados para Menciones
  const [menciones, setMenciones] = useState<Mencion[]>([
    { id: '1', nombre: 'Juan Pérez', activo: true, numeroMencion: 1 },
    { id: '2', nombre: 'María García', activo: true, numeroMencion: 2 },
    { id: '3', nombre: 'Carlos López', activo: true, numeroMencion: 3 },
    { id: '4', nombre: 'Ana Silva', activo: false },
    { id: '5', nombre: 'Roberto Díaz', activo: false },
    { id: '6', nombre: 'Laura Martínez', activo: false },
    { id: '7', nombre: 'Carlos Ruiz', activo: false },
    { id: '8', nombre: 'María González', activo: false },
  ]);

  // Estados para drag and drop
  const [draggedMencion, setDraggedMencion] = useState<string | null>(null);

  // Estados para formularios
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [showMencionForm, setShowMencionForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState<EventoTema | null>(null);
  const [editingMencion, setEditingMencion] = useState<Mencion | null>(null);

  // Colores predefinidos para eventos
  const colores = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  // Funciones para Eventos/Temas
  const handleEventoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const etiqueta1 = (formData.get('etiqueta1') as string)?.trim() || '';
    const etiqueta2 = (formData.get('etiqueta2') as string)?.trim() || '';
    const etiqueta3 = (formData.get('etiqueta3') as string)?.trim() || '';
    
    const etiquetas = [etiqueta1, etiqueta2, etiqueta3].filter(tag => tag.length > 0);
    
    const nuevoEvento: EventoTema = {
      id: editingEvento?.id || Date.now().toString(),
      nombre: formData.get('nombre') as string,
      descripcion: (formData.get('descripcion') as string) || '',
      color: formData.get('color') as string,
      activo: true,
      etiquetas: editingEvento?.etiquetas || etiquetas
    };

    if (editingEvento) {
      setEventos(eventos.map(e => e.id === editingEvento.id ? nuevoEvento : e));
    } else {
      setEventos([...eventos, nuevoEvento]);
    }
    
    setShowEventoForm(false);
    setEditingEvento(null);
  };

  const handleEventoDelete = (id: string) => {
    setEventos(eventos.filter(e => e.id !== id));
  };

  const handleEventoEdit = (evento: EventoTema) => {
    setEditingEvento(evento);
    setShowEventoForm(true);
  };

  // Funciones para Menciones
  const handleMencionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (editingMencion) {
      // Editando - mantener el número de mención si existe
      const nuevaMencion: Mencion = {
        id: editingMencion.id,
        nombre: formData.get('nombre') as string,
        activo: editingMencion.activo,
        numeroMencion: editingMencion.numeroMencion
      };
      setMenciones(menciones.map(m => m.id === editingMencion.id ? nuevaMencion : m));
    } else {
      // Nueva mención - agregar como inactiva (sin número)
      const nuevaMencion: Mencion = {
        id: Date.now().toString(),
        nombre: formData.get('nombre') as string,
        activo: false
      };
      setMenciones([...menciones, nuevaMencion]);
    }
    
    setShowMencionForm(false);
    setEditingMencion(null);
  };

  const handleMencionDelete = (id: string) => {
    setMenciones(menciones.filter(m => m.id !== id));
  };

  const handleMencionEdit = (mencion: Mencion) => {
    setEditingMencion(mencion);
    setShowMencionForm(true);
  };

  // Funciones para drag and drop
  const handleDragStart = (e: React.DragEvent, mencionId: string) => {
    setDraggedMencion(mencionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetActivo: boolean) => {
    e.preventDefault();
    if (!draggedMencion) return;

    const mencionesActivas = menciones.filter(m => m.activo).length;
    
    // Si estamos moviendo a activo y ya hay 5, no permitir
    if (targetActivo && mencionesActivas >= 5) {
      alert('Ya tienes 5 menciones activas. Debes desactivar una antes de activar otra.');
      return;
    }

    if (targetActivo) {
      // Moviendo a activo - asignar el primer número disponible
      const numerosUsados = menciones.filter(m => m.activo && m.numeroMencion).map(m => m.numeroMencion!);
      const numerosDisponibles = [1, 2, 3, 4, 5].filter(num => !numerosUsados.includes(num));
      const numeroAsignar = numerosDisponibles[0];

      setMenciones(menciones.map(m => 
        m.id === draggedMencion 
          ? { ...m, activo: true, numeroMencion: numeroAsignar }
          : m
      ));
    } else {
      // Moviendo a inactivo - remover número de mención
      setMenciones(menciones.map(m => 
        m.id === draggedMencion 
          ? { ...m, activo: false, numeroMencion: undefined }
          : m
      ));
    }
    
    setDraggedMencion(null);
  };

  const mencionesActivas = menciones.filter(m => m.activo).sort((a, b) => (a.numeroMencion || 0) - (b.numeroMencion || 0));
  const mencionesInactivas = menciones.filter(m => !m.activo);

  return (
    <div className="dashboard-container w-full h-screen relative overflow-x-hidden" style={{ backgroundColor: '#1e293b' }}>
      {/* Fondo que cubre TODA la pantalla */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen"
        style={{
          backgroundImage: `url('/images/fondodashboard.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}
      ></div>

      {/* Overlay muy sutil */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-black/5" 
        style={{ zIndex: 1 }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full">
        {/* Header transparente */}
        <div className="bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10 w-full">
          <div className="w-full py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="w-32 h-32 flex items-center justify-center">
                  <img 
                    src="/images/fondoblanco.png" 
                    alt="PrensAI Logo" 
                    className="w-28 h-28 object-contain"
                    onError={(e) => {
                      console.log('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    PrensAI
                  </h1>
                  <p className="text-white/80 text-sm font-medium">Gestión de eventos/temas y menciones</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white drop-shadow-md">Bienvenido, {user?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Contenido principal */}
      <div className="w-full px-6 py-16 h-full">
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

            {/* Lista de eventos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <div key={evento.id} className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: evento.color }}
                      ></div>
                      <h3 className="text-lg font-semibold text-white">{evento.nombre}</h3>
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
                  <p className="text-white/70 text-sm">{evento.descripcion}</p>
                  
                  {/* Etiquetas */}
                  {evento.etiquetas && evento.etiquetas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {evento.etiquetas.map((etiqueta, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
                        >
                          {etiqueta}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Estado activo en la esquina inferior derecha */}
                  <div className="mt-4 flex justify-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      evento.activo 
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-400/30'
                    }`}>
                      {evento.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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

            {/* Sistema de Drag and Drop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Menciones en Uso (máximo 5) */}
              <div 
                className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Menciones en Uso</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                    {mencionesActivas.length}/5
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Arrastra aquí las menciones que quieres usar. Máximo 5 menciones activas.
                </p>
                
                {mencionesActivas.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-xl">
                    <p className="text-white/40 text-sm">Arrastra menciones aquí para activarlas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mencionesActivas.map((mencion, index) => (
                      <div
                        key={mencion.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, mencion.id)}
                        className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-4 cursor-move hover:bg-black/40 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-white/60">📌</span>
                            <span className="text-white font-medium">{mencion.nombre}</span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                              Mención {mencion.numeroMencion}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMencionEdit(mencion)}
                              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleMencionDelete(mencion.id)}
                              className="text-red-400 hover:text-red-300 transition-colors text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Menciones Disponibles */}
              <div 
                className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, false)}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Menciones Disponibles</h3>
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm font-medium">
                    {mencionesInactivas.length}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Menciones que no están en uso. Arrastra a "Menciones en Uso" para activarlas.
                </p>
                
                {mencionesInactivas.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-xl">
                    <p className="text-white/40 text-sm">Todas las menciones están en uso</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mencionesInactivas.map((mencion) => (
                      <div
                        key={mencion.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, mencion.id)}
                        className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-4 cursor-move hover:bg-black/40 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-white/60">📋</span>
                            <span className="text-white font-medium">{mencion.nombre}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMencionEdit(mencion)}
                              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleMencionDelete(mencion.id)}
                              className="text-red-400 hover:text-red-300 transition-colors text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="mt-8 p-6 bg-blue-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/20">
              <h4 className="text-lg font-semibold text-blue-300 mb-3">📋 Instrucciones</h4>
              <ul className="text-white/80 text-sm space-y-2">
                <li>• <strong>Arrastra y suelta</strong> menciones entre las dos columnas para activarlas/desactivarlas</li>
                <li>• Solo puedes tener <strong>máximo 5 menciones activas</strong> a la vez</li>
                <li>• Las menciones activas son las que se usarán para buscar en las noticias</li>
                <li>• Puedes agregar todas las menciones que quieras, pero solo 5 estarán en uso</li>
              </ul>
            </div>
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
                  defaultValue={editingEvento?.nombre}
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
                  Descripción (opcional)
                </label>
                <textarea
                  name="descripcion"
                  defaultValue={editingEvento?.descripcion}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                  placeholder="Descripción del evento o tema (opcional)"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colores.map((color) => (
                    <label key={color} className="cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        defaultChecked={editingEvento?.color === color}
                        className="hidden"
                      />
                      <div 
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          editingEvento?.color === color ? 'border-white scale-110' : 'border-white/30'
                        }`}
                        style={{ backgroundColor: color }}
                      ></div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Etiquetas (opcionales)
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="etiqueta1"
                    defaultValue={editingEvento?.etiquetas?.[0] || ''}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Primera etiqueta (opcional)"
                  />
                  <input
                    type="text"
                    name="etiqueta2"
                    defaultValue={editingEvento?.etiquetas?.[1] || ''}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Segunda etiqueta (opcional)"
                  />
                  <input
                    type="text"
                    name="etiqueta3"
                    defaultValue={editingEvento?.etiquetas?.[2] || ''}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="Tercera etiqueta (opcional)"
                  />
                </div>
                <p className="text-white/60 text-xs mt-2">
                  Puedes agregar hasta 3 etiquetas para categorizar mejor el evento/tema.
                </p>
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
                  defaultValue={editingMencion?.nombre}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                  placeholder="Ej: Juan Pérez"
                />
                <p className="text-white/60 text-xs mt-1">
                  Este nombre se buscará <strong>exactamente</strong> en todas las noticias procesadas, tal como lo escribas aquí
                </p>
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
      </div>
    </div>
  );
} 