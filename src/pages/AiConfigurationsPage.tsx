import AiConfigurationField from '../components/admin/AiConfigurationField';
import Snackbar from '../components/common/Snackbar';
import { useAiConfigurations } from '../hooks/useAiConfigurations';

export default function AiConfigurationsPage() {
  const {
    configurations,
    loading,
    error,
    updateConfiguration,
    refetch,
    clearError,
  } = useAiConfigurations();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-0">
      {error && (
        <Snackbar
          message={error}
          variant="error"
          isOpen={Boolean(error)}
          onClose={clearError}
        />
      )}

      <div className="mb-10 flex justify-end">
        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-600 hover:bg-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Actualizando…' : 'Recargar'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-slate-800/70 bg-slate-900/60"
            ></div>
          ))}
        </div>
      ) : configurations.length === 0 ? (
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 px-10 py-16 text-center">
          <h2 className="text-lg font-semibold text-slate-100">No hay configuraciones disponibles</h2>
          <p className="mt-2 text-sm text-slate-400">
            Todavía no hay configuraciones de IA habilitadas. Volvé a intentarlo más tarde.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="space-y-12">
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
