import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import AiConfigurationField from '../components/admin/AiConfigurationField';
import Snackbar from '../components/common/Snackbar';
import { useAiConfigurations } from '../hooks/useAiConfigurations';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
import { AlertTriangle, Check, RefreshCw, Info } from 'lucide-react';
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
    let errorCount = 0;

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
        console.error('Error saving configuration:', err);
        errorCount += 1;
        // El error ya se maneja en updateConfiguration que llama a setError
      } finally {
        setSavingKeys((prev) => prev.filter((item) => item !== key));
      }
    }

    setIsSaving(false);
    
    if (successCount > 0) {
      setSuccessMessage(
        successCount === 1
          ? 'Se guardó 1 configuración exitosamente.'
          : `Se guardaron ${successCount} configuraciones exitosamente.`
      );
    }
  }, [clearError, configurationByKey, dirtyMap, drafts, updateConfiguration]);

  const dirtyCount = useMemo(
    () => Object.values(dirtyMap).filter(Boolean).length,
    [dirtyMap]
  );

  const hasDirtyFields = dirtyCount > 0;

  // Bloquear navegación interna si hay cambios sin guardar
  const blocker = useBlocker(() => hasDirtyFields);

  // Manejar el estado del blocker
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmLeave = window.confirm(
        'Tenés cambios sin guardar. ¿Estás seguro de que querés salir?'
      );
      
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
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

      {/* Header de la página */}
      <PageHeader
        title="Configuraciones de IA"
        description="Gestioná los parámetros del módulo de inteligencia artificial"
      />

      {loading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-white/20 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-sm"
            ></div>
          ))}
        </div>
      ) : configurations.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl px-10 py-16 text-center shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-white/10 border border-white/20">
              <Info className="w-8 h-8 text-white/50" />
            </div>
            <h2 className="text-xl font-semibold text-white">No hay configuraciones disponibles</h2>
            <p className="text-sm text-white/60 max-w-md">
              Todavía no hay configuraciones de IA habilitadas. Volvé a intentarlo más tarde.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 pb-24">
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
          </div>

          {/* Barra de estado inferior mejorada */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-xl shadow-2xl">
            <div className="mx-auto w-full max-w-6xl px-6 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                  {hasDirtyFields ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30">
                      <AlertTriangle className="w-4 h-4 text-amber-300" />
                      <span className="text-sm font-medium text-amber-300">
                        {dirtyCount} {dirtyCount === 1 ? 'cambio pendiente' : 'cambios pendientes'} sin guardar
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30">
                      <Check className="w-4 h-4 text-green-300" />
                      <span className="text-sm font-medium text-green-300">
                        No hay cambios pendientes
                      </span>
                    </div>
                  )}
                  {isSaving && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-sm font-medium text-blue-400">
                        Guardando configuraciones…
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSave();
                  }}
                  disabled={!hasDirtyFields || isSaving}
                  variant="primary"
                  size="lg"
                  icon="Save"
                  iconPosition="left"
                  className="min-w-[160px]"
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
