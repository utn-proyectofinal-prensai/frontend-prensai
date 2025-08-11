import React from 'react';
import { FormField } from '../common';
import { AUTH_CONFIG } from '../../constants';
import type { LoginFormData } from '../../types/auth';

interface LoginFormProps {
  formData: LoginFormData;
  isLoading: boolean;
  validationErrors: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAdminClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  isLoading,
  validationErrors,
  onInputChange,
  onSubmit,
  onAdminClick
}) => {
  const emailIcon = (
    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const passwordIcon = (
    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Campo Email */}
      <FormField
        label="Email"
        type="email"
        name="email"
        placeholder={AUTH_CONFIG.PLACEHOLDERS.EMAIL}
        icon={emailIcon}
        value={formData.email}
        onChange={onInputChange}
        required
        style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.FORM}s`}}
      />
      
      {/* Mostrar error de validación del email */}
      {validationErrors.some(error => error.includes('email') || error.includes('Email')) && (
        <div className="px-4 -mt-2">
          <p className="validation-error">
            {validationErrors.find(error => error.includes('email') || error.includes('Email'))}
          </p>
        </div>
      )}

      {/* Campo Contraseña */}
      <FormField
        label="Contraseña"
        type="password"
        name="password"
        placeholder={AUTH_CONFIG.PLACEHOLDERS.PASSWORD}
        icon={passwordIcon}
        value={formData.password}
        onChange={onInputChange}
        required
        style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.PASSWORD}s`}}
      />
      
      {/* Mostrar error de validación de la contraseña */}
      {validationErrors.some(error => error.includes('contraseña') || error.includes('Contraseña')) && (
        <div className="px-4 -mt-2">
          <p className="validation-error">
            {validationErrors.find(error => error.includes('contraseña') || error.includes('Contraseña'))}
          </p>
        </div>
      )}

      {/* Espaciado */}
      <div className="h-6"></div>
      <div className="h-6"></div>

      {/* Opciones adicionales */}
      <div className="text-center animate-fade-in py-6 px-4" style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.FORM}s`}}>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:scale-105 transform block">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Botón principal */}
      <div className="px-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary text-white py-5 px-8 rounded-xl font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl animate-pulse-glow"
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
      </div>

      {/* Botón de Administración */}
      <div className="text-center animate-fade-in pt-6 px-4" style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.BUTTON}s`}}>
        <button
          type="button"
          onClick={onAdminClick}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors hover:scale-105 transform"
        >
          Administración
        </button>
      </div>
    </form>
  );
}; 
