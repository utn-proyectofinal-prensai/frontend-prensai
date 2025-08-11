import React from 'react';
import { AUTH_CONFIG } from '../../constants';

export const LoginHeader: React.FC = () => {
  return (
    <>
      {/* Logo real del proyecto */}
      <div className="text-center mb-8 animate-header-fade-in">
        <div className="inline-flex items-center justify-center w-32 h-32 mb-4 animate-bounce-slow">
          <img 
            src="/images/logo.png" 
            alt="PrensAI Logo" 
            className="w-full h-full object-contain drop-shadow-xl"
            onError={(e) => {
              console.log('Error loading logo:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Título y descripción mejorados */}
      <div className="text-center mb-8 animate-header-fade-in" style={{animationDelay: `${AUTH_CONFIG.ANIMATION_DELAYS.TITLE}s`}}>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-2 animate-gradient-x">
          Iniciar Sesión
        </h2>
        <p className="text-gray-600 text-base leading-relaxed font-medium text-center">
          Automatiza, filtrá y analizá las noticias con inteligencia artificial
        </p>
      </div>
    </>
  );
};
