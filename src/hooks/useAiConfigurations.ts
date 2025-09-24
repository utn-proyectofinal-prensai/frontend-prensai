import { useState, useEffect } from 'react';
import { apiService, parseApiError } from '../services/api';
import type { AiConfiguration } from '../services/api';

export function useAiConfigurations() {
  const [configurations, setConfigurations] = useState<AiConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null); // Key de la configuración siendo actualizada
  const [statuses, setStatuses] = useState<Record<string, 'idle' | 'saving' | 'synced' | 'error'>>({});

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAiConfigurations();
      setConfigurations(response.ai_configurations);
    } catch (err) {
      const errorMessage = parseApiError(err, 'Error al cargar configuraciones de IA');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = async (key: string, value: string | string[] | number, enabled: boolean): Promise<boolean> => {
    try {
      setUpdating(key);
      setStatuses(prev => ({ ...prev, [key]: 'saving' }));
      setError(null);

      // Confiar en el backend/renderer: enviar el tipo tal como lo emite el control
      const payloadValue: string | string[] | number = value;

      const updatedConfig = await apiService.updateAiConfiguration(key, {
        ai_configuration: { value: payloadValue, enabled }
      });

      // Confiar en la respuesta del backend sin forzar conversiones

      // Actualizar la configuración en el estado local
      setConfigurations(prev => 
        prev.map(config => 
          config.key === key ? updatedConfig : config
        )
      );
      setStatuses(prev => ({ ...prev, [key]: 'synced' }));

      return true;
    } catch (err) {
      const errorMessage = parseApiError(err, `Error al actualizar configuración ${key}`);
      setError(errorMessage);
      setStatuses(prev => ({ ...prev, [key]: 'error' }));
      return false;
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return {
    configurations,
    loading,
    error,
    updating,
    statuses,
    refetch: fetchConfigurations,
    updateConfiguration,
    clearError: () => setError(null)
  };
}
