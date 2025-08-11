import React from 'react';

export interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password';
  name: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  validationState?: 'default' | 'error' | 'success';
  errorMessage?: string;
  successMessage?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  placeholder,
  icon,
  value,
  onChange,
  required = false,
  className = '',
  style,
  validationState = 'default',
  errorMessage,
  successMessage
}) => {
  // Determinar las clases CSS basadas en el estado de validación
  const getInputClasses = () => {
    const baseClasses = 'form-input';
    const iconClass = icon ? 'has-icon' : '';
    
    switch (validationState) {
      case 'error':
        return `${baseClasses} ${iconClass} error`;
      case 'success':
        return `${baseClasses} ${iconClass} success`;
      default:
        return `${baseClasses} ${iconClass}`;
    }
  };

  // Determinar las clases del icono basadas en el estado de validación
  const getIconClasses = () => {
    const baseClasses = 'form-field-icon';
    
    switch (validationState) {
      case 'error':
        return `${baseClasses} error`;
      case 'success':
        return `${baseClasses} success`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={`space-y-4 px-4 animate-field-fade-in ${className}`} style={style}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className={getIconClasses()}>
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={getInputClasses()}
          required={required}
        />
      </div>
      
      {/* Mostrar mensaje de error */}
      {validationState === 'error' && errorMessage && (
        <div className="validation-error">
          {errorMessage}
        </div>
      )}
      
      {/* Mostrar mensaje de éxito */}
      {validationState === 'success' && successMessage && (
        <div className="validation-success">
          {successMessage}
        </div>
      )}
    </div>
  );
};
