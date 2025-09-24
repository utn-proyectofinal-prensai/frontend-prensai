import AiConfigurationField from '../components/admin/AiConfigurationField';
import Snackbar from '../components/common/Snackbar';
import { useAiConfigurations } from '../hooks/useAiConfigurations';

export default function AiConfigurationsPage() {
  const {
    configurations,
    loading,
    error,
    updateConfiguration,
    clearError,
  } = useAiConfigurations();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-14 sm:px-6">
      {error && (
        <Snackbar
          message={error}
          variant="error"
          isOpen={Boolean(error)}
          onClose={clearError}
        />
      )}

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-3xl border border-slate-200/60 bg-white/70"
            ></div>
          ))}
        </div>
      ) : configurations.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-16 text-center shadow-lg shadow-slate-900/10">
          <h2 className="text-lg font-semibold text-slate-900">No hay configuraciones disponibles</h2>
          <p className="mt-2 text-sm text-slate-500">
            Todavía no hay configuraciones de IA habilitadas. Volvé a intentarlo más tarde.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {configurations.map((configuration) => (
            <AiConfigurationField
              key={configuration.key}
              configuration={configuration}
              onUpdate={updateConfiguration}
            />
          ))}
        </div>
      )}
    </div>
  );
}
