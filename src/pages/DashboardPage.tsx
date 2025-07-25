import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Datos mock para el dashboard
  const stats = {
    totalNoticias: 1247,
    noticiasHoy: 23,
    noticiasEstaSemana: 156,
    noticiasEsteMes: 892,
    clippingGenerados: 45,
    temasAnalizados: 12
  };

  const ultimasNoticias = [
    {
      id: 1,
      titulo: "Nuevas medidas económicas anunciadas por el gobierno",
      medio: "Clarín",
      fecha: "2024-01-15",
      sentimiento: "Neutral",
      tema: "Economía",
      porcentaje: 85
    },
    {
      id: 2,
      titulo: "Avances en tecnología de inteligencia artificial",
      medio: "La Nación",
      fecha: "2024-01-15",
      sentimiento: "Positivo",
      tema: "Tecnología",
      porcentaje: 92
    },
    {
      id: 3,
      titulo: "Incremento en las exportaciones del sector agrícola",
      medio: "Infobae",
      fecha: "2024-01-14",
      sentimiento: "Positivo",
      tema: "Agricultura",
      porcentaje: 78
    },
    {
      id: 4,
      titulo: "Debate sobre reforma educativa en el Congreso",
      medio: "Página 12",
      fecha: "2024-01-14",
      sentimiento: "Neutral",
      tema: "Educación",
      porcentaje: 88
    }
  ];

  const handleLogout = () => {
    logout();
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
                  <p className="text-white/80 text-sm font-medium">Dashboard de análisis inteligente</p>
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
                <button 
                  onClick={handleLogout}
                  className="bg-black/40 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black/50 border border-white/30 hover:border-white/50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  <span className="text-white font-semibold">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full py-16 px-6 h-full">
          {/* Título de bienvenida */}
          <div className="welcome-section mb-32 text-center">
            <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Bienvenido a tu dashboard</h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-md">Monitorea y analiza tus noticias con inteligencia artificial</p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="stats-section mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Noticias Hoy</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.noticiasHoy}</p>
                  <p className="text-xs text-green-300 font-bold">+12% vs ayer</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Esta Semana</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.noticiasEstaSemana}</p>
                  <p className="text-xs text-blue-300 font-bold">+8% vs semana pasada</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Clippings</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.clippingGenerados}</p>
                  <p className="text-xs text-purple-300 font-bold">+15% este mes</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:bg-black/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-3">Temas Analizados</p>
                  <p className="text-3xl font-bold text-white mb-2">{stats.temasAnalizados}</p>
                  <p className="text-xs text-orange-300 font-bold">+3 nuevos</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Acciones principales - MISMO ESTILO QUE LAS CARDS */}
          <div className="actions-section mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        <button 
                          onClick={() => navigate('/upload-news')}
                          className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl"
                          style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
                        >
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">Subir set de noticias</h3>
                              <p className="text-blue-300 text-sm leading-relaxed font-medium drop-shadow-sm">Carga nuevas noticias (links) para procesar</p>
                            </div>
                          </div>
                        </button>

                        <button 
                          onClick={() => navigate('/history')}
                          className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-12 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl" 
                          style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
                        >
                          <div className="flex items-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-8 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-sm">Ver histórico</h3>
                              <p className="text-green-300 text-base leading-relaxed font-medium drop-shadow-sm">Explora todas las noticias procesadas</p>
                            </div>
                          </div>
                        </button>

                        <button className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-12 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl" style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-8 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-sm">Crear clipping</h3>
                  <p className="text-purple-300 text-base leading-relaxed font-medium drop-shadow-sm">Genera análisis por tema específico</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin')}
              className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-12 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl" 
              style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-8 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-sm">Administración</h3>
                  <p className="text-orange-300 text-base leading-relaxed font-medium drop-shadow-sm">Gestiona eventos, temas y menciones</p>
                </div>
              </div>
            </button>
            </div>
          </div>

          {/* Últimas noticias */}
          <div className="news-section">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-8 py-8 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Últimas noticias procesadas</h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-white !important hover:text-white/90 font-bold text-base transition-colors hover:scale-105 transform" 
                  style={{ color: 'white' }}
                >
                  Ver todas →
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-8 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Noticia</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Medio</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Fecha</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Sentimiento</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Tema</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Confianza</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {ultimasNoticias.map((noticia) => (
                                      <tr key={noticia.id} className="hover:bg-black/20 transition-colors duration-200">
                    <td className="px-8 py-8 text-center">
                        <div className="text-sm font-semibold text-white max-w-xs truncate text-center">{noticia.titulo}</div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="text-sm font-medium text-white/90">{noticia.medio}</div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="text-sm font-medium text-white/90">{noticia.fecha}</div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${
                          noticia.sentimiento === 'Positivo' 
                            ? 'bg-green-500/20 text-green-300 border border-green-300/30' 
                            : noticia.sentimiento === 'Negativo'
                            ? 'bg-red-500/20 text-red-300 border border-red-300/30'
                            : 'bg-white/20 text-white/90 border border-white/30'
                        }`}>
                          {noticia.sentimiento}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="text-sm font-medium text-white/90">{noticia.tema}</div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-20 bg-white/20 rounded-full h-2.5 mr-3">
                            <div 
                              className="bg-white/60 h-2.5 rounded-full" 
                              style={{ width: `${noticia.porcentaje}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-white/90">{noticia.porcentaje}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
} 