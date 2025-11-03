import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { NOT_FOUND_MESSAGES } from '../constants/messages';
import { GlobalHeader } from '../components/ui/global-header';
import PageBackground from '../components/common/PageBackground';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  return (
    <PageBackground>
      {/* Header Global */}
      <GlobalHeader
        title={NOT_FOUND_MESSAGES.TITLE}
        showBackButton={true}
        backTo="/"
        user={user ? {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        } : undefined}
        isAdmin={isAdmin}
      />

      {/* Contenido principal */}
      <div className="w-full px-6 py-12 h-full flex items-start justify-center content-main" style={{ paddingTop: '2rem' }}>
        <div className="max-w-2xl w-full text-center">
          {/* Número 404 grande */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-white/20 drop-shadow-lg">404</h1>
          </div>

          {/* Mensaje principal */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              ¡Ups! {NOT_FOUND_MESSAGES.TITLE}
            </h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-md mb-6">
              {NOT_FOUND_MESSAGES.DESCRIPTION}
            </p>
            <p className="text-white/70 text-base">
              {NOT_FOUND_MESSAGES.CONTACT_ADMIN}
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
    </PageBackground>
  );
}