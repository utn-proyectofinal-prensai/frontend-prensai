import { useState, useEffect } from 'react';
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

interface Noticia {
  id: string;
  titulo: string;
  tipoPublicacion: string;
  fecha: string;
  soporte: string;
  medio: string;
  seccion: string;
  autor: string;
  conductor: string;
  entrevistado: string;
  tema: string;
  etiqueta1: string;
  etiqueta2: string;
  link: string;
  alcance: string;
  cotizacion: string;
  tapa: string;
  valoracion: string;
  ejeComunicacional: string;
  factorPolitico: string;
  crisis: string;
  gestion: string;
  area: string;
  mencion1: string;
  mencion2: string;
  mencion3: string;
  mencion4: string;
  mencion5: string;
}

export default function CreateClippingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [eventosTemas, setEventosTemas] = useState<EventoTema[]>([
    { id: '1', nombre: 'Elecciones 2024', descripcion: 'Proceso electoral nacional', color: '#3B82F6', activo: true, etiquetas: ['política', 'nacional', 'elecciones'] },
    { id: '2', nombre: 'Economía', descripcion: 'Noticias económicas y financieras', color: '#10B981', activo: true, etiquetas: ['finanzas', 'mercado'] },
    { id: '3', nombre: 'Tecnología', descripcion: 'Innovaciones tecnológicas', color: '#F59E0B', activo: true, etiquetas: ['innovación', 'digital', 'IA'] },
  ]);

  const [noticias, setNoticias] = useState<Noticia[]>([
    {
      id: '1',
      titulo: 'Nuevas medidas económicas anunciadas por el gobierno',
      tipoPublicacion: 'Nota',
      fecha: '2024-01-15',
      soporte: 'Digital',
      medio: 'Clarín',
      seccion: 'Política',
      autor: 'Juan Pérez',
      conductor: '',
      entrevistado: '',
      tema: 'Economía',
      etiqueta1: 'Gobierno',
      etiqueta2: 'Medidas',
      link: 'https://www.clarin.com/noticia1',
      alcance: 'Nacional',
      cotizacion: 'Alta',
      tapa: 'No',
      valoracion: 'Positiva',
      ejeComunicacional: 'Transparencia',
      factorPolitico: 'Alto',
      crisis: 'No',
      gestion: 'Ejecutiva',
      area: 'Economía',
      mencion1: 'Presidente',
      mencion2: 'Ministro',
      mencion3: '',
      mencion4: '',
      mencion5: ''
    },
    {
      id: '2',
      titulo: 'Avances en tecnología de inteligencia artificial',
      tipoPublicacion: 'Entrevista',
      fecha: '2024-01-15',
      soporte: 'Digital',
      medio: 'La Nación',
      seccion: 'Tecnología',
      autor: 'María García',
      conductor: 'Carlos López',
      entrevistado: 'Dr. Ana Silva',
      tema: 'Tecnología',
      etiqueta1: 'IA',
      etiqueta2: 'Innovación',
      link: 'https://www.lanacion.com/noticia2',
      alcance: 'Internacional',
      cotizacion: 'Media',
      tapa: 'Sí',
      valoracion: 'Muy Positiva',
      ejeComunicacional: 'Innovación',
      factorPolitico: 'Bajo',
      crisis: 'No',
      gestion: 'Privada',
      area: 'Tecnología',
      mencion1: 'CEO',
      mencion2: 'Investigador',
      mencion3: 'Universidad',
      mencion4: '',
      mencion5: ''
    },
    {
      id: '3',
      titulo: 'Incremento en las exportaciones del sector agrícola',
      tipoPublicacion: 'Reportaje',
      fecha: '2024-01-14',
      soporte: 'Impreso',
      medio: 'Infobae',
      seccion: 'Economía',
      autor: 'Roberto Díaz',
      conductor: '',
      entrevistado: '',
      tema: 'Economía',
      etiqueta1: 'Exportaciones',
      etiqueta2: 'Campo',
      link: 'https://www.infobae.com/noticia3',
      alcance: 'Nacional',
      cotizacion: 'Alta',
      tapa: 'No',
      valoracion: 'Positiva',
      ejeComunicacional: 'Desarrollo',
      factorPolitico: 'Medio',
      crisis: 'No',
      gestion: 'Mixta',
      area: 'Agricultura',
      mencion1: 'Productor',
      mencion2: 'Exportador',
      mencion3: 'Ministerio',
      mencion4: '',
      mencion5: ''
    },
    {
      id: '4',
      titulo: 'Debate sobre reforma educativa en el Congreso',
      tipoPublicacion: 'Nota',
      fecha: '2024-01-14',
      soporte: 'Digital',
      medio: 'Página 12',
      seccion: 'Educación',
      autor: 'Laura Martínez',
      conductor: '',
      entrevistado: '',
      tema: 'Educación',
      etiqueta1: 'Reforma',
      etiqueta2: 'Congreso',
      link: 'https://www.pagina12.com/noticia4',
      alcance: 'Nacional',
      cotizacion: 'Media',
      tapa: 'No',
      valoracion: 'Neutral',
      ejeComunicacional: 'Transparencia',
      factorPolitico: 'Alto',
      crisis: 'No',
      gestion: 'Legislativa',
      area: 'Educación',
      mencion1: 'Diputado',
      mencion2: 'Senador',
      mencion3: 'Ministro',
      mencion4: '',
      mencion5: ''
    },
    {
      id: '5',
      titulo: 'Nuevas tecnologías en el sector financiero',
      tipoPublicacion: 'Reportaje',
      fecha: '2024-01-13',
      soporte: 'Digital',
      medio: 'Ámbito',
      seccion: 'Finanzas',
      autor: 'Carlos Ruiz',
      conductor: '',
      entrevistado: '',
      tema: 'Tecnología',
      etiqueta1: 'Fintech',
      etiqueta2: 'Bancos',
      link: 'https://www.ambito.com/noticia5',
      alcance: 'Nacional',
      cotizacion: 'Alta',
      tapa: 'No',
      valoracion: 'Positiva',
      ejeComunicacional: 'Innovación',
      factorPolitico: 'Medio',
      crisis: 'No',
      gestion: 'Privada',
      area: 'Finanzas',
      mencion1: 'Banco',
      mencion2: 'Especialista',
      mencion3: '',
      mencion4: '',
      mencion5: ''
    },
    {
      id: '6',
      titulo: 'Análisis del mercado de valores',
      tipoPublicacion: 'Nota',
      fecha: '2024-01-13',
      soporte: 'Digital',
      medio: 'Clarín',
      seccion: 'Economía',
      autor: 'María González',
      conductor: '',
      entrevistado: '',
      tema: 'Economía',
      etiqueta1: 'Mercado',
      etiqueta2: 'Análisis',
      link: 'https://www.clarin.com/noticia6',
      alcance: 'Nacional',
      cotizacion: 'Media',
      tapa: 'No',
      valoracion: 'Neutral',
      ejeComunicacional: 'Transparencia',
      factorPolitico: 'Bajo',
      crisis: 'No',
      gestion: 'Privada',
      area: 'Economía',
      mencion1: 'Analista',
      mencion2: 'Especialista',
      mencion3: '',
      mencion4: '',
      mencion5: ''
    }
  ]);

  const [eventoTemaSeleccionado, setEventoTemaSeleccionado] = useState<string>('');
  const [noticiasSeleccionadas, setNoticiasSeleccionadas] = useState<Set<string>>(new Set());
  const [noticiasFiltradas, setNoticiasFiltradas] = useState<Noticia[]>([]);

  // Filtrar noticias cuando cambia el evento/tema seleccionado
  useEffect(() => {
    if (eventoTemaSeleccionado) {
      // Buscar por el nombre del evento/tema, no por el ID
      const eventoTema = eventosTemas.find(e => e.id === eventoTemaSeleccionado);
      const filtradas = noticias.filter(noticia => noticia.tema === eventoTema?.nombre);
      setNoticiasFiltradas(filtradas);
      // Limpiar selecciones al cambiar de tema
      setNoticiasSeleccionadas(new Set());
    } else {
      setNoticiasFiltradas([]);
      setNoticiasSeleccionadas(new Set());
    }
  }, [eventoTemaSeleccionado, noticias, eventosTemas]);

  const handleEventoTemaChange = (eventoId: string) => {
    setEventoTemaSeleccionado(eventoId);
  };

  const handleNoticiaToggle = (noticiaId: string) => {
    const nuevasSeleccionadas = new Set(noticiasSeleccionadas);
    if (nuevasSeleccionadas.has(noticiaId)) {
      nuevasSeleccionadas.delete(noticiaId);
    } else {
      nuevasSeleccionadas.add(noticiaId);
    }
    setNoticiasSeleccionadas(nuevasSeleccionadas);
  };

  const handleSeleccionarTodas = () => {
    const todasLasIds = noticiasFiltradas.map(noticia => noticia.id);
    setNoticiasSeleccionadas(new Set(todasLasIds));
  };

  const handleDeseleccionarTodas = () => {
    setNoticiasSeleccionadas(new Set());
  };

  const handleGenerarClipping = () => {
    if (noticiasSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una noticia para generar el clipping.');
      return;
    }

    const noticiasDelClipping = noticiasFiltradas.filter(noticia => 
      noticiasSeleccionadas.has(noticia.id)
    );

    // Aquí iría la lógica para generar el clipping
    console.log('Generando clipping con:', noticiasDelClipping);
    alert(`Clipping generado con ${noticiasDelClipping.length} noticias seleccionadas.`);
  };

  const handleGenerarMetricas = () => {
    if (noticiasSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una noticia para generar las métricas.');
      return;
    }

    const noticiasDelClipping = noticiasFiltradas.filter(noticia => 
      noticiasSeleccionadas.has(noticia.id)
    );

    // Aquí iría la lógica para generar métricas
    console.log('Generando métricas con:', noticiasDelClipping);
    alert(`Métricas generadas con ${noticiasDelClipping.length} noticias seleccionadas.`);
  };

  const handleGenerarInforme = () => {
    if (noticiasSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una noticia para generar el informe.');
      return;
    }

    const noticiasDelClipping = noticiasFiltradas.filter(noticia => 
      noticiasSeleccionadas.has(noticia.id)
    );

    // Aquí iría la lógica para generar informe
    console.log('Generando informe con:', noticiasDelClipping);
    alert(`Informe generado con ${noticiasDelClipping.length} noticias seleccionadas.`);
  };

  const getEventoTemaById = (id: string) => {
    return eventosTemas.find(evento => evento.id === id);
  };

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
                  <p className="text-white/80 text-sm font-medium">Crear Clipping</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
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
        </div>

        {/* Contenido principal */}
        <div className="w-full py-16 px-6 h-full">
          {/* Título y descripción */}
          <div className="mb-32 text-center">
            <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Crear Clipping</h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-md">
              Selecciona un evento/tema y elige las noticias que quieres incluir en tu clipping
            </p>
          </div>

          {/* Paso 1: Seleccionar Evento/Tema */}
          <div className="mt-16 mb-40">
            <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Paso 1: Selecciona un Evento/Tema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventosTemas.filter(evento => evento.activo).map((evento) => (
                <button
                  key={evento.id}
                  onClick={() => handleEventoTemaChange(evento.id)}
                  style={{
                    backgroundColor: eventoTemaSeleccionado === evento.id 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    border: eventoTemaSeleccionado === evento.id 
                      ? '2px solid rgba(255, 255, 255, 0.5)' 
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: eventoTemaSeleccionado === evento.id 
                      ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (eventoTemaSeleccionado !== evento.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (eventoTemaSeleccionado !== evento.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: evento.color }}
                    ></div>
                    <div className="text-left">
                      <h4 style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {evento.nombre}
                      </h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '4px' }}>
                        {evento.descripcion}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Paso 2: Seleccionar Noticias */}
          {eventoTemaSeleccionado && (
            <div className="mt-16 mb-40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white drop-shadow-md">
                  Paso 2: Selecciona las noticias para el clipping
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSeleccionarTodas}
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      fontWeight: '700',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ✅ Marcar todas
                  </button>
                  <button
                    onClick={handleDeseleccionarTodas}
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      fontWeight: '700',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ❌ Desmarcar todas
                  </button>
                </div>
              </div>

              {noticiasFiltradas.length > 0 ? (
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-black/20">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={noticiasSeleccionadas.size === noticiasFiltradas.length && noticiasFiltradas.length > 0}
                              onChange={() => {
                                if (noticiasSeleccionadas.size === noticiasFiltradas.length) {
                                  handleDeseleccionarTodas();
                                } else {
                                  handleSeleccionarTodas();
                                }
                              }}
                              className="rounded border-white/30 bg-black/20 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TÍTULO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TIPO PUBLICACIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">FECHA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">SOPORTE</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MEDIO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">SECCIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">AUTOR</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">CONDUCTOR</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ENTREVISTADO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TEMA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ETIQUETA_1</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ETIQUETA_2</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">LINK</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ALCANCE</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">COTIZACIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">TAPA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">VALORACIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">EJE COMUNICACIONAL</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">FACTOR POLÍTICO</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">CRISIS</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">GESTIÓN</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">ÁREA</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_1</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_2</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_3</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_4</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-white/80 uppercase tracking-wider">MENCIÓN_5</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {noticiasFiltradas.map((noticia) => (
                          <tr key={noticia.id} className="hover:bg-black/20 transition-colors duration-200">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={noticiasSeleccionadas.has(noticia.id)}
                                onChange={() => handleNoticiaToggle(noticia.id)}
                                className="rounded border-white/30 bg-black/20 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-semibold text-white max-w-xs truncate text-center">{noticia.titulo}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.tipoPublicacion}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.fecha}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.soporte}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.medio}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.seccion}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.autor}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.conductor || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.entrevistado || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.tema}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.etiqueta1}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.etiqueta2}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90">
                                <a href={noticia.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                                  Ver
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.alcance}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.cotizacion}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.tapa}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                                noticia.valoracion === 'Muy Positiva' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-300/30' 
                                  : noticia.valoracion === 'Positiva'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-300/30'
                                  : noticia.valoracion === 'Negativa'
                                  ? 'bg-red-500/20 text-red-300 border border-red-300/30'
                                  : 'bg-white/20 text-white/90 border border-white/30'
                              }`}>
                                {noticia.valoracion}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.ejeComunicacional}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.factorPolitico}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.crisis}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.gestion}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.area}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion1 || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion2 || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion3 || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion4 || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <div className="text-sm font-medium text-white/90 whitespace-nowrap">{noticia.mencion5 || '-'}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg">No hay noticias disponibles para este evento/tema</p>
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Descargar Excel */}
          {eventoTemaSeleccionado && noticiasSeleccionadas.size > 0 && (
            <div className="mt-16 mb-40">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                Paso 3: Descargar Excel
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Opcional. Se descargará un archivo Excel con las noticias seleccionadas y sus respectivos campos de análisis
              </p>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 mb-2">
                      <span className="font-semibold">Evento/Tema:</span> {getEventoTemaById(eventoTemaSeleccionado)?.nombre}
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">Noticias seleccionadas:</span> {noticiasSeleccionadas.size} de {noticiasFiltradas.length}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerarClipping}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Generar Métricas e Informe */}
          {eventoTemaSeleccionado && noticiasSeleccionadas.size > 0 && (
            <div className="mt-16 mb-40">
              <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">
                Paso 4: Generar Métricas e Informe
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card: Generar Métricas */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-green-300/20 mb-3">
                      <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Generar Métricas</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4 text-center">
                    Genera análisis estadísticos y métricas detalladas de las noticias seleccionadas
                  </p>
                  <button
                    onClick={handleGenerarMetricas}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Generar Métricas
                  </button>
                </div>

                {/* Card: Generar Informe */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-purple-300/20 mb-3">
                      <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Generar Informe</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4 text-center">
                    Crea un informe completo con análisis y conclusiones de las noticias seleccionadas
                  </p>
                  <button
                    onClick={handleGenerarInforme}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Generar Informe
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resumen */}
          {eventoTemaSeleccionado && (
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h4 className="text-lg font-bold text-white mb-4">Resumen</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
                <div>
                  <p className="font-semibold">Evento/Tema seleccionado:</p>
                  <p>{getEventoTemaById(eventoTemaSeleccionado)?.nombre || 'Ninguno'}</p>
                </div>
                <div>
                  <p className="font-semibold">Total de noticias disponibles:</p>
                  <p>{noticiasFiltradas.length}</p>
                </div>
                <div>
                  <p className="font-semibold">Noticias seleccionadas:</p>
                  <p>{noticiasSeleccionadas.size}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 