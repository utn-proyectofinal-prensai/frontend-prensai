import { useState } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isValid: boolean;
  isOptional?: boolean;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  onComplete: () => void;
  onStepChange?: (stepId: string, stepIndex: number) => void;
  className?: string;
}

const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  steps,
  onComplete,
  onStepChange,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Calcular progreso
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const completedCount = completedSteps.size;

  // Navegar a un paso específico
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
      setVisitedSteps(prev => new Set([...prev, stepIndex]));
      onStepChange?.(steps[stepIndex].id, stepIndex);
    }
  };

  // Ir al siguiente paso
  const nextStep = () => {
    if (currentStep.isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
      
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

  // Verificar si un paso está disponible
  const isStepAvailable = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    if (visitedSteps.has(stepIndex)) return true;
    
    // Un paso está disponible si el anterior está completado
    return completedSteps.has(stepIndex - 1);
  };

  // Verificar si un paso está completado
  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex);
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      {/* Header fijo del workflow */}
      <div className="flex-shrink-0 border-b border-white/20 pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStep.title}
            </h2>
            <p className="text-white/70">
              {currentStep.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60 mb-1">
              Paso {currentStepIndex + 1} de {steps.length}
            </div>
            <div className="text-lg font-semibold text-white">
              {completedCount}/{steps.length} completados
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Indicadores de pasos */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => isStepAvailable(index) && goToStep(index)}
              disabled={!isStepAvailable(index)}
              className={`
                flex flex-col items-center p-3 rounded-lg transition-all duration-200
                ${isStepAvailable(index) 
                  ? 'cursor-pointer hover:bg-white/10' 
                  : 'cursor-not-allowed opacity-50'
                }
                ${index === currentStepIndex 
                  ? 'bg-blue-500/20 border-2 border-blue-400' 
                  : ''
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2
                ${isStepCompleted(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStepIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white/60'
                }
              `}>
                {isStepCompleted(index) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-center">
                <div className={`text-xs font-medium ${
                  index === currentStepIndex ? 'text-white' : 'text-white/60'
                }`}>
                  {step.title}
                </div>
                {step.isOptional && (
                  <div className="text-xs text-white/40 mt-1">Opcional</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual - área scrolleable */}
      <div className="flex-1 overflow-y-auto mb-6">
        {currentStep.component}
      </div>

      {/* Footer fijo del workflow */}
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
            px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${currentStep.isValid || currentStep.isOptional
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <div className="flex items-center gap-2">
            {isLastStep ? 'Procesar' : 'Siguiente'}
            {!isLastStep && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default WorkflowStepper;
