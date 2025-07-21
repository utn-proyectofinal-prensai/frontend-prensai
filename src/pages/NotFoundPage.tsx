import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

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
          <div className="w-full px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/')}
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
                  <p className="text-white/80 text-sm font-medium">Página no encontrada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full px-6 py-12 h-full flex items-start justify-center" style={{ paddingTop: '2rem' }}>
          <div className="max-w-2xl w-full text-center">
            
            {/* Número 404 grande */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-white/20 drop-shadow-lg">404</h1>
            </div>

            {/* Mensaje principal */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                ¡Ups! Página no encontrada
              </h2>
              <p className="text-white/90 text-lg font-medium drop-shadow-md mb-6">
                La página que buscas no existe o ha sido movida.
              </p>
              <p className="text-white/70 text-base">
                Verifica la URL o navega usando los enlaces de abajo.
              </p>
            </div>

            {/* Botones de navegación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate('/')}
                className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl"
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">Ir al Dashboard</h3>
                    <p className="text-blue-300 text-sm font-medium drop-shadow-sm">Volver a la página principal</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/upload-news')}
                className="group bg-transparent backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl"
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6 group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-md">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">Subir Noticias</h3>
                    <p className="text-green-300 text-sm font-medium drop-shadow-sm">Cargar nuevas noticias</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-12">
              <p className="text-white text-sm">
                Si crees que esto es un error, contacta al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}