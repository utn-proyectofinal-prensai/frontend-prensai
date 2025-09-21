import { apiService, type Topic } from '../services/api';
import { useApiData } from './useApiData';
import { useMemo } from 'react';

interface UseTopicsReturn {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook para temas. Si options.enabled es true, consulta al backend con enabled=true.
export function useTopics(options?: { enabled?: boolean }): UseTopicsReturn {
  const query = useMemo(() => (
    options?.enabled !== undefined ? { enabled: options.enabled } : undefined
  ), [options?.enabled]);

  const { data, loading, error, refetch } = useApiData(apiService.getAllTopics, query);

  return {
    topics: data?.topics || [],
    loading,
    error,
    refetch
  };
}

// Wrapper para sólo habilitados desde el backend (sin filtrado en front)
export function useEnabledTopics(): UseTopicsReturn {
  return useTopics({ enabled: true });
}
