import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import AiConfigurationField from '../components/admin/AiConfigurationField';
import Snackbar from '../components/common/Snackbar';
import { useAiConfigurations } from '../hooks/useAiConfigurations';
import {
  type DraftValue,
  normalizeValue,
  serializeValue,
  valuesAreEqual,
} from '../utils/aiConfigurations';

export default function AiConfigurationsPage() {
  const {
    configurations,
    loading,
    error,
    updateConfiguration,
    clearError,
  } = useAiConfigurations();

  const [drafts, setDrafts] = useState<Record<string, DraftValue>>({});
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({});
  const [savingKeys, setSavingKeys] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const configurationByKey = useMemo(() => {
    const map = new Map<string, (typeof configurations)[number]>();
    configurations.forEach((config) => {
      map.set(config.key, config);
    });
    return map;
  }, [configurations]);

  useEffect(() => {
    setDirtyMap((prev) => {
      let mutated = false;
      const next = { ...prev };
      const keys = new Set(configurations.map((config) => config.key));

      configurations.forEach((config) => {
        if (!(config.key in next)) {
          next[config.key] = false;
          mutated = true;
        }
      });

      Object.keys(next).forEach((key) => {
        if (!keys.has(key)) {
          delete next[key];
          mutated = true;
        }
      });

      return mutated ? next : prev;
    });
  }, [configurations]);


  useEffect(() => {
    setDrafts((prev) => {
      const next: Record<string, DraftValue> = {};
      let mutated = false;
      const currentKeys = new Set(configurations.map((config) => config.key));

      configurations.forEach((config) => {
        const previousValue = prev[config.key];
        if (dirtyMap[config.key] && previousValue !== undefined) {
          next[config.key] = previousValue;
          return;
        }

        const normalized = normalizeValue(config);
        next[config.key] = normalized;

        if (
          previousValue === undefined ||
          !valuesAreEqual(previousValue, normalized, config.value_type)
        ) {
          mutated = true;
        }
      });

      Object.keys(prev).forEach((key) => {
        if (!currentKeys.has(key)) {
          mutated = true;
        }
      });

      if (!mutated && Object.keys(prev).length === Object.keys(next).length) {
        return prev;
      }

      return next;
    });
  }, [configurations, dirtyMap]);


  const handleFieldChange = useCallback(
    (key: string, value: DraftValue) => {
      setSuccessMessage(null);
      setDrafts((prev) => ({
        ...prev,
        [key]: value,
      }));

      const config = configurationByKey.get(key);
      if (config) {
        const original = normalizeValue(config);
        const isDirty = !valuesAreEqual(value, original, config.value_type);
        setDirtyMap((prev) => {
          if (prev[key] === isDirty) {
            return prev;
          }
          return {
            ...prev,
            [key]: isDirty,
          };
        });
      }

    },
    [configurationByKey]
  );

  const handleSave = useCallback(async () => {
    const keysToSave = Object.keys(dirtyMap).filter((key) => dirtyMap[key]);

    if (keysToSave.length === 0) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    clearError();

    let successCount = 0;

    for (const key of keysToSave) {
      const config = configurationByKey.get(key);
      if (!config) {
        continue;
      }

      setSavingKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));

      try {
        const draftValue = drafts[key] ?? normalizeValue(config);
        const payload = serializeValue(draftValue, config.value_type, config.options);
        const updated = await updateConfiguration(key, payload);

        setDrafts((prev) => ({
          ...prev,
          [key]: normalizeValue(updated),
        }));

        setDirtyMap((prev) => ({
          ...prev,
          [key]: false,
        }));


        successCount += 1;
      } catch (err) {
        // Error handling could be improved here
        console.error('Error saving configuration:', err);
      } finally {
        setSavingKeys((prev) => prev.filter((item) => item !== key));
      }
    }

    if (successCount > 0) {
      setSuccessMessage(
        successCount === 1
          ? 'Se guardó 1 configuración.'
          : `Se guardaron ${successCount} configuraciones.`
      );
    }

    setIsSaving(false);
  }, [clearError, configurationByKey, dirtyMap, drafts, updateConfiguration]);

  const dirtyCount = useMemo(
    () => Object.values(dirtyMap).filter(Boolean).length,
    [dirtyMap]
  );

  const hasDirtyFields = dirtyCount > 0;

  // Bloquear navegación interna si hay cambios sin guardar
  useBlocker(() => {
    if (!hasDirtyFields) return false;
    
    const confirmLeave = window.confirm(
      'Tenés cambios sin guardar. ¿Estás seguro de que querés salir?'
    );
    
    return !confirmLeave;
  });

  // Advertencia al refrescar/cerrar la página
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasDirtyFields) {
        event.preventDefault();
        event.returnValue = 'Tenés cambios sin guardar. ¿Estás seguro de que querés salir?';
        return 'Tenés cambios sin guardar. ¿Estás seguro de que querés salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasDirtyFields]);


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

      {successMessage && (
        <Snackbar
          message={successMessage}
          variant="success"
          isOpen={Boolean(successMessage)}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {loading ? (
        <div className="flex flex-col gap-8">
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
        <div className="flex flex-col gap-8">
          {configurations.map((configuration) => (
            <AiConfigurationField
              key={configuration.key}
              configuration={configuration}
              value={drafts[configuration.key] ?? normalizeValue(configuration)}
              onChange={(nextValue) => handleFieldChange(configuration.key, nextValue)}
              isSaving={savingKeys.includes(configuration.key)}
              disabled={isSaving}
            />
          ))}

          <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm">
                {hasDirtyFields ? (
                  <span className="flex items-center gap-2 text-amber-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Tenés {dirtyCount} {dirtyCount === 1 ? 'cambio pendiente' : 'cambios pendientes'} sin guardar
                  </span>
                ) : (
                  <span className="text-slate-300">No hay cambios pendientes</span>
                )}
                {isSaving && (
                  <span className="flex items-center gap-2 text-sky-400">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando configuraciones…
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={!hasDirtyFields || isSaving}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:hover:shadow-sm ${
                  hasDirtyFields
                    ? 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-md focus:ring-amber-500'
                    : 'bg-slate-600 text-slate-400'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
