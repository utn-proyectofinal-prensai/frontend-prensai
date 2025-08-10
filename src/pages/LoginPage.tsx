import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Limpiar error cuando cambian los inputs
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.email, formData.password, error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    }
  };



  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/images/fondo.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh'
        }}
      ></div>

      {/* Formulario flotante a la derecha */}
      <div className="relative z-20 flex items-center justify-end h-full pr-16">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 w-full max-w-md border border-white/20 animate-slide-in-right hover-lift min-h-[600px]">
          {/* Logo real del proyecto */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-40 h-40 mb-6 animate-bounce-slow">
              <img 
                src="/images/logo.png" 
                alt="PrensAI Logo" 
                className="w-full h-full object-contain drop-shadow-xl"
                onError={(e) => {
                  console.log('Error loading logo:', e);
                  // Fallback si no carga la imagen
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Título y descripción mejorados */}
          <div className="text-center mb-16 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 animate-gradient-x">Iniciar Sesión</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium text-center">Automatiza, filtrá y analizá las noticias con inteligencia artificial</p>
          </div>

          {/* Espaciado adicional antes del formulario */}
          <div className="h-8"></div>

          {/* Formulario mejorado */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-3 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@prensai.com"
                  className="w-4/5 pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm input-focus text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu contraseña"
                  className="w-4/5 pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm input-focus text-lg"
                  required
                />
              </div>
            </div>

            {/* Espaciado adicional entre campos */}
            <div className="h-4"></div>

            {/* Espaciado adicional antes de las opciones */}
            <div className="h-8"></div>

            {/* Opciones adicionales */}
            <div className="text-center animate-fade-in py-6 space-y-4" style={{animationDelay: '0.3s'}}>
              <label className="flex items-center justify-center hover-lift">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                <span className="ml-3 text-sm text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:scale-105 transform block">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Espaciado adicional antes del botón */}
            <div className="h-6"></div>

            {/* Mensaje de error mejorado */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón mejorado */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-8 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl animate-pulse-glow"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <span>Iniciar sesión</span>
              )}
            </button>

            {/* Espaciado adicional antes del registro */}
            <div className="h-4"></div>

            {/* Registro */}
            <div className="text-center animate-fade-in pt-4" style={{animationDelay: '0.5s'}}>
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:scale-105 transform">
                  Regístrate aquí
                </a>
              </p>
            </div>

            {/* Botón de Administración */}
            <div className="text-center animate-fade-in pt-6" style={{animationDelay: '0.7s'}}>
              <button
                type="button"
                onClick={() => navigate('/admin-users')}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors hover:scale-105 transform"
              >
                Administración
              </button>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
}