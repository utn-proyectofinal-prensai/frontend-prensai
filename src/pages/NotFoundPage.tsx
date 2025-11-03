import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { NOT_FOUND_MESSAGES } from '../constants/messages';
import { GlobalHeader } from '../components/ui/global-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Home, Upload } from 'lucide-react';
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
          {/* Mensaje principal con Card del design system - incluye el 404 */}
          <Card variant="elevated" padding="lg" className="mb-20" style={{ marginBottom: '5rem' }}>
            <CardHeader className="text-center !p-0 !mb-8">
              {/* Número 404 grande */}
              <div className="mb-8">
                <h1 className="text-9xl font-bold text-white/20 drop-shadow-lg">404</h1>
              </div>
              
              <CardTitle className="text-3xl mb-4">
                ¡Ups! {NOT_FOUND_MESSAGES.TITLE}
              </CardTitle>
              <CardDescription className="text-lg text-white/90">
                {NOT_FOUND_MESSAGES.DESCRIPTION}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Botones de navegación con Cards del design system */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" style={{ marginBottom: '4rem' }}>
            <Card 
              variant="glass" 
              padding="lg" 
              className="cursor-pointer hover:scale-105 transition-all duration-300 group"
              onClick={() => navigate('/')}
            >
              <CardContent className="flex flex-col items-center text-center p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 border border-blue-300/30 shadow-lg">
                  <Home className="w-8 h-8 text-blue-300" />
                </div>
                <CardTitle className="text-xl mb-2">Ir al Dashboard</CardTitle>
                <CardDescription className="text-blue-300">Volver a la página principal</CardDescription>
              </CardContent>
            </Card>

            <Card 
              variant="glass" 
              padding="lg" 
              className="cursor-pointer hover:scale-105 transition-all duration-300 group"
              onClick={() => navigate('/upload-news')}
            >
              <CardContent className="flex flex-col items-center text-center p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300 border border-green-300/30 shadow-lg">
                  <Upload className="w-8 h-8 text-green-300" />
                </div>
                <CardTitle className="text-xl mb-2">Subir Noticias</CardTitle>
                <CardDescription className="text-green-300">Cargar nuevas noticias</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Información adicional */}
          <div className="mt-12">
            <p className="text-white/70 text-sm">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}