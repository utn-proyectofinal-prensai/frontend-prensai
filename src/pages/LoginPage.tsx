import { useLoginForm } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { LoginHeader, LoginForm } from '../components/auth';
import { Snackbar } from '../components/common';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    formData,
    isLoading,
    error,
    validationErrors,
    handleInputChange,
    handleSubmit
  } = useLoginForm();

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 w-full h-full auth-background"
        style={{
          backgroundImage: `url('/images/fondo.png')`
        }}
      ></div>

      {/* Formulario flotante a la derecha */}
      <div className="relative z-20 flex items-center justify-end h-full pr-16">
        <div className="auth-container rounded-2xl p-16 w-full max-w-lg animate-slide-in-right hover-lift min-h-[600px]">
          <LoginHeader />
          
          {/* Espaciado adicional antes del formulario */}
          <div className="h-8"></div>

          <LoginForm
            formData={formData}
            isLoading={isLoading}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onAdminClick={() => navigate('/admin-users')}
          />
        </div>
      </div>

      {/* Snackbar para errores de login */}
      <Snackbar
        message={error || 'Error al iniciar sesión'}
        isOpen={!!error}
        onClose={() => {}} // No hacer nada al cerrar, el error se limpia automáticamente
        duration={8000} // Aumentar la duración a 8 segundos
      />

      {/* Snackbar para errores de validación */}
      <Snackbar
        message={validationErrors.join(', ')}
        isOpen={validationErrors.length > 0}
        onClose={() => {}} // Los errores se limpian automáticamente al escribir
        duration={5000}
      />
    </div>
  );
}