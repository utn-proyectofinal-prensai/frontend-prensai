import React from 'react';
import { useAiConfigurations } from '../hooks/useAiConfigurations';
import AiConfigurationField from '../components/admin/AiConfigurationField';
import Snackbar from '../components/common/Snackbar';
import '../styles/ai-configurations.css';

const AiConfigurationsPage: React.FC = () => {
  const {
    configurations,
    loading,
    error,
    updating,
    updateConfiguration,
    refetch,
    clearError
  } = useAiConfigurations();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
            <p className="text-white/80 font-medium">Cargando configuraciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      {error && (
        <Snackbar
          message={error}
          variant="error"
          isOpen={!!error}
          onClose={clearError}
        />
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="mb-8 animate-fade-in">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl px-4 py-3 inline-flex items-center space-x-3">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-200 text-sm font-medium">
                    Los cambios se guardan automáticamente
                  </span>
                </div>
                
                <button
                  onClick={refetch}
                  className="ai-button inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recargar configuraciones
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Content */}
        {configurations.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center animate-slide-in-left">
            <div className="w-24 h-24 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No hay configuraciones disponibles
            </h3>
            <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
              No se encontraron configuraciones de IA habilitadas en el sistema.
            </p>
            <button
              onClick={refetch}
              className="ai-button inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recargar configuraciones
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {configurations.map((config, index) => (
              <div key={config.key} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <AiConfigurationField
                  configuration={config}
                  onUpdate={updateConfiguration}
                  isUpdating={updating === config.key}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiConfigurationsPage;
