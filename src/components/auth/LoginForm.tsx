import React, { useMemo, useCallback } from 'react';
import { FormField } from '../common';
import { useAnimationControl } from '../../hooks';
import { AUTH_CONFIG } from '../../constants';
import { SYSTEM_MESSAGES } from '../../constants/messages';
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
  // Función para validar email en tiempo real - memoizada
  const validateEmail = useCallback((email: string) => {
    if (!email) return { state: 'default' as const, message: '' };
    
    if (!email.includes('@')) {
      return { 
        state: 'error' as const, 
        message: SYSTEM_MESSAGES.VALIDATION.EMAIL.MISSING_AT 
      };
    }
    
    if (email.length < 5) {
      return { 
        state: 'error' as const, 
        message: SYSTEM_MESSAGES.VALIDATION.EMAIL.TOO_SHORT 
      };
    }
    
    if (!email.includes('.') || email.split('@')[1].length < 2) {
      return { 
        state: 'error' as const, 
        message: SYSTEM_MESSAGES.VALIDATION.EMAIL.MISSING_DOMAIN 
      };
    }
    
    return { 
      state: 'success' as const, 
      message: SYSTEM_MESSAGES.SUCCESS.EMAIL_VALID 
    };
  }, []);

  // Función para validar contraseña en tiempo real - memoizada
  const validatePassword = useCallback((password: string) => {
    if (!password) return { state: 'default' as const, message: '' };
    
    if (password.length < 6) {
      return { 
        state: 'error' as const, 
        message: SYSTEM_MESSAGES.VALIDATION.PASSWORD.TOO_SHORT 
      };
    }
    
    return { 
      state: 'success' as const, 
      message: SYSTEM_MESSAGES.SUCCESS.PASSWORD_VALID 
    };
  }, []);

  // Estados de validación en tiempo real - memoizados
  const emailValidation = useMemo(() => validateEmail(formData.email), [validateEmail, formData.email]);
  const passwordValidation = useMemo(() => validatePassword(formData.password), [validatePassword, formData.password]);

  // Control de animaciones para evitar re-triggering
  const { elementRef: formRef, hasAnimated: formHasAnimated } = useAnimationControl<HTMLFormElement>(800);
  const { elementRef: emailRef, hasAnimated: emailHasAnimated } = useAnimationControl(400);
  const { elementRef: passwordRef, hasAnimated: passwordHasAnimated } = useAnimationControl(600);

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
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={`space-y-6 ${formHasAnimated ? 'animation-completed' : 'animate-form-fade-in'}`}
    >
      {/* Campo Email */}
      <div ref={emailRef} className="form-field">
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder={AUTH_CONFIG.PLACEHOLDERS.EMAIL}
          icon={emailIcon}
          value={formData.email}
          onChange={onInputChange}
          required
          validationState={emailValidation.state}
          errorMessage={emailValidation.state === 'error' ? emailValidation.message : undefined}
          successMessage={emailValidation.state === 'success' ? emailValidation.message : undefined}
          style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.FORM}s`}}
        />
      </div>
      
      {/* Mostrar error de validación del email (solo si hay errores del servidor) */}
      {validationErrors.some(error => error.includes('email') || error.includes('Email')) && (
        <div className="px-4 -mt-2">
          <div className="validation-error">
            {validationErrors.find(error => error.includes('email') || error.includes('Email'))}
          </div>
        </div>
      )}

      {/* Campo Contraseña */}
      <div ref={passwordRef} className="form-field">
        <FormField
          label="Contraseña"
          type="password"
          name="password"
          placeholder={AUTH_CONFIG.PLACEHOLDERS.PASSWORD}
          icon={passwordIcon}
          value={formData.password}
          onChange={onInputChange}
          required
          validationState={passwordValidation.state}
          errorMessage={passwordValidation.state === 'error' ? passwordValidation.message : undefined}
          successMessage={passwordValidation.state === 'success' ? passwordValidation.message : undefined}
          style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.PASSWORD}s`}}
        />
      </div>
      
      {/* Mostrar error de validación de la contraseña (solo si hay errores del servidor) */}
      {validationErrors.some(error => error.includes('contraseña') || error.includes('Contraseña')) && (
        <div className="px-4 -mt-2">
          <div className="validation-error">
            {validationErrors.find(error => error.includes('contraseña') || error.includes('Contraseña'))}
          </div>
        </div>
      )}

      {/* Opciones adicionales */}
      <div className="text-center animate-fade-in py-6 px-4 forgot-password-link" style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.FORM}s`}}>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:scale-105 transform block">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Botón principal */}
      <div className="px-4 button-spacing">
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
      <div className="text-center animate-fade-in pt-6 px-4 btn-admin" style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.BUTTON}s`}}>
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
