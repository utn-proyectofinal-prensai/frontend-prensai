import { useCallback, useEffect, useState } from 'react';
import { apiService, parseApiError } from '../services/api';
import type { AiConfiguration } from '../services/api';

export function useAiConfigurations() {
  const [configurations, setConfigurations] = useState<AiConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAiConfigurations();
      setConfigurations(response.ai_configurations);
    } catch (err) {
      setError(parseApiError(err, 'Error al cargar configuraciones de IA'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfiguration = useCallback(
    async (key: string, value: AiConfiguration['value']) => {
      try {
        setError(null);
        const updatedConfiguration = await apiService.updateAiConfiguration(key, {
          ai_configuration: { value: value },
        });

        setConfigurations((current) =>
          current.map((configuration) =>
            configuration.key === key
              ? {
                  ...configuration,
                  ...updatedConfiguration,
                  options: updatedConfiguration.options ?? configuration.options,
                  value_type: updatedConfiguration.value_type ?? configuration.value_type,
                }
              : configuration
          )
        );

        return updatedConfiguration;
      } catch (err) {
        const message = parseApiError(err, `Error al actualizar la configuración ${key}`);
        setError(message);
        throw new Error(message);
      }
    },
    []
  );

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const clearError = useCallback(() => setError(null), []);

  return {
    configurations,
    loading,
    error,
    updateConfiguration,
    refetch: fetchConfigurations,
    clearError,
  };
}
