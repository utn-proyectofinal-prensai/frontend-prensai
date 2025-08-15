import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../types/auth';
import { validateLoginForm, sanitizeInput } from '../utils/validation';

export const useLoginForm = () => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      clearError();
    }
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    // Limpiar errores de validación
    setValidationErrors([]);
    
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    }
  };

  return {
    formData,
    isLoading,
    error,
    validationErrors,
    handleInputChange,
    handleSubmit,
    clearError
  };
};
