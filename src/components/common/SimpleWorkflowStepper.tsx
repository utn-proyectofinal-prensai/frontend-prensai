import { useState } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isValid: boolean;
  isOptional?: boolean;
}

interface SimpleWorkflowStepperProps {
  steps: WorkflowStep[];
  onComplete: () => void;
  onStepChange?: (stepId: string, stepIndex: number) => void;
  className?: string;
}

const SimpleWorkflowStepper: React.FC<SimpleWorkflowStepperProps> = ({
  steps,
  onComplete,
  onStepChange,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Calcular progreso
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Navegar a un paso específico
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
      onStepChange?.(steps[stepIndex].id, stepIndex);
    }
  };

  // Ir al siguiente paso
  const nextStep = () => {
    if (currentStep.isValid) {
      if (isLastStep) {
        onComplete();
      } else {
        goToStep(currentStepIndex + 1);
      }
    }
  };

  // Ir al paso anterior
  const prevStep = () => {
    if (!isFirstStep) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      {/* Header simplificado */}
      <div className="flex-shrink-0 mb-8">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-white mb-2">
            PASO {currentStepIndex + 1}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            {currentStep.title}
          </h2>
          <p className="text-white/70 text-lg">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Contenido del paso actual - área scrolleable */}
      <div className="flex-1 overflow-y-auto mb-8">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-6xl">
            {currentStep.component}
          </div>
        </div>
      </div>

      {/* Navegación simplificada */}
      <div className="flex-shrink-0 flex justify-between items-center pt-6 border-t border-white/20">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${isFirstStep
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 text-white hover:bg-white/20'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </div>
        </button>

        <div className="flex items-center gap-4">
          {!currentStep.isValid && !currentStep.isOptional && (
            <span className="text-sm text-yellow-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Completa este paso para continuar
            </span>
          )}
        </div>

        <button
          onClick={nextStep}
          disabled={!currentStep.isValid && !currentStep.isOptional}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-200 text-lg
            ${currentStep.isValid || currentStep.isOptional
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <div className="flex items-center gap-2">
            {isLastStep ? 'Procesar' : 'Siguiente'}
            {!isLastStep && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Barra de progreso sutil en la parte inferior */}
      <div className="flex-shrink-0 mt-4">
        <div className="w-full bg-white/10 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWorkflowStepper;
