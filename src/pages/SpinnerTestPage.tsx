import { useState } from 'react';
import { Button } from '../components/ui/button';
import { LoadingState, LoadingSpinner } from '../components/ui/loading-spinner';
import { LoadingModal } from '../components/ui/loading-modal';
import '../styles/history.css';
import '../styles/upload-news.css';

export default function SpinnerTestPage() {
  const [showLoadingStates, setShowLoadingStates] = useState(false);
  const [showSpinners, setShowSpinners] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCustomSpinner, setShowCustomSpinner] = useState(false);

  const simulateLoading = () => {
    setShowLoadingStates(true);
    setTimeout(() => setShowLoadingStates(false), 3000);
  };

  const simulateSpinners = () => {
    setShowSpinners(true);
    setTimeout(() => setShowSpinners(false), 3000);
  };

  const simulateModals = () => {
    setShowModals(true);
    setTimeout(() => setShowModals(false), 3000);
  };

  const simulatePdfModal = () => {
    setShowPdfModal(true);
    setTimeout(() => setShowPdfModal(false), 3000);
  };

  const simulateAiModal = () => {
    setShowAiModal(true);
    setTimeout(() => setShowAiModal(false), 3000);
  };

  const simulateCustomSpinner = () => {
    setShowCustomSpinner(true);
    setTimeout(() => setShowCustomSpinner(false), 2000);
  };

  return (
    <div className="history-container px-6">
      {/* Header */}
      <div className="upload-news-header">
        <h1 className="upload-news-title text-2xl sm:text-3xl lg:text-4xl">
          Test de Spinners y Estados de Carga
        </h1>
        <p className="upload-news-subtitle text-sm mt-2">
          Prueba todos los componentes de carga del design system
        </p>
      </div>

      {/* Controles principales */}
      <div className="upload-news-panel mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Controles de Prueba</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={simulateLoading}
              variant="primary"
              disabled={showLoadingStates}
              className="w-full"
            >
              {showLoadingStates ? 'Cargando...' : 'Probar Loading States'}
            </Button>
            
            <Button 
              onClick={simulateSpinners}
              variant="success"
              disabled={showSpinners}
              className="w-full"
            >
              {showSpinners ? 'Mostrando...' : 'Probar Spinners'}
            </Button>
            
            <Button 
              onClick={simulateModals}
              variant="outline"
              disabled={showModals}
              className="w-full"
            >
              {showModals ? 'Modales Abiertos...' : 'Probar Modales'}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading States */}
      <div className="upload-news-panel mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Loading States (En Página)</h3>
        
        {showLoadingStates ? (
          <div className="space-y-6">
            <LoadingState 
              title="Cargando información del clipping..."
              variant="simple"
              size="lg"
            />
            
            <LoadingState 
              title="Generando reporte con IA"
              description="Estamos analizando las noticias del clipping y creando un informe detallado. Esto puede tomar unos segundos..."
              variant="ai"
              size="xl"
            />
            
            <LoadingState 
              title="Cargando reporte..."
              variant="default"
              size="lg"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">Presiona "Probar Loading States" para ver los ejemplos</p>
          </div>
        )}
      </div>

      {/* Spinners individuales */}
      <div className="upload-news-panel mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Spinners Individuales</h3>
        
        {showSpinners ? (
          <div className="space-y-8">
            {/* Diferentes tamaños */}
            <div>
              <h4 className="text-white/80 font-medium mb-4">Diferentes Tamaños</h4>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <LoadingSpinner size="sm" variant="simple" />
                  <p className="text-white/60 text-sm mt-2">Pequeño</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" variant="default" />
                  <p className="text-white/60 text-sm mt-2">Mediano</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" variant="ai" showIcon />
                  <p className="text-white/60 text-sm mt-2">Grande</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="xl" variant="ai" showIcon />
                  <p className="text-white/60 text-sm mt-2">Extra Grande</p>
                </div>
              </div>
            </div>

            {/* Diferentes variantes */}
            <div>
              <h4 className="text-white/80 font-medium mb-4">Diferentes Variantes</h4>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <LoadingSpinner size="lg" variant="simple" />
                  <p className="text-white/60 text-sm mt-2">Simple</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" variant="default" />
                  <p className="text-white/60 text-sm mt-2">Default</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" variant="ai" showIcon />
                  <p className="text-white/60 text-sm mt-2">AI</p>
                </div>
              </div>
            </div>

            {/* Spinner personalizado */}
            <div>
              <h4 className="text-white/80 font-medium mb-4">Spinner Personalizado</h4>
              <div className="flex items-center justify-center">
                <LoadingSpinner 
                  size="lg" 
                  variant="ai" 
                  showIcon
                  icon={
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">Presiona "Probar Spinners" para ver los ejemplos</p>
          </div>
        )}
      </div>

      {/* Estados de carga en botones */}
      <div className="upload-news-panel mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Estados de Carga en Botones</h3>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={simulateCustomSpinner}
              variant="primary"
              disabled={showCustomSpinner}
              icon={showCustomSpinner ? undefined : "Save"}
            >
              {showCustomSpinner ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
            
            <Button 
              onClick={simulateCustomSpinner}
              variant="success"
              disabled={showCustomSpinner}
              icon={showCustomSpinner ? undefined : "FileText"}
            >
              {showCustomSpinner ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Descargando...
                </>
              ) : (
                'Descargar PDF'
              )}
            </Button>
            
            <Button 
              onClick={simulateCustomSpinner}
              variant="outline"
              disabled={showCustomSpinner}
              icon={showCustomSpinner ? undefined : "Plus"}
            >
              {showCustomSpinner ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Subiendo...
                </>
              ) : (
                'Subir Archivo'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modales de carga */}
      <div className="upload-news-panel mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Modales de Carga</h3>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={simulateAiModal}
              variant="primary"
              disabled={showAiModal}
            >
              {showAiModal ? 'Generando...' : 'Generar Reporte IA'}
            </Button>
            
            <Button 
              onClick={simulatePdfModal}
              variant="success"
              disabled={showPdfModal}
            >
              {showPdfModal ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Documentación */}
      <div className="upload-news-panel">
        <h3 className="text-lg font-semibold text-white mb-4">Documentación de Componentes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">LoadingState</h4>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Spinner + texto en página</li>
              <li>• Variantes: simple, default, ai</li>
              <li>• Tamaños: sm, md, lg, xl</li>
              <li>• Para estados de carga completos</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">LoadingSpinner</h4>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Solo el spinner</li>
              <li>• Para botones o elementos pequeños</li>
              <li>• Íconos personalizables</li>
              <li>• Mismo sistema de variantes</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">LoadingModal</h4>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Modal con spinner</li>
              <li>• Para procesos largos</li>
              <li>• No cerrable durante proceso</li>
              <li>• Íconos específicos por proceso</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">Estados en Botones</h4>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Spinner inline pequeño</li>
              <li>• Texto dinámico</li>
              <li>• Botón deshabilitado</li>
              <li>• Para acciones rápidas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modales */}
      <LoadingModal
        isOpen={showAiModal}
        title="Generando reporte con IA"
        description="Estamos analizando las noticias del clipping y creando un informe detallado. Esto puede tomar unos segundos..."
        variant="ai"
        size="lg"
        closable={false}
      />

      <LoadingModal
        isOpen={showPdfModal}
        title="Generando PDF"
        description="Estamos preparando el archivo PDF para descarga. Esto puede tomar unos segundos..."
        variant="ai"
        size="lg"
        closable={false}
        icon={
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9h4v4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13h4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 17h4" />
          </svg>
        }
      />
    </div>
  );
}
