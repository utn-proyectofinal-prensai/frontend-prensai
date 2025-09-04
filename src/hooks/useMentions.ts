import { apiService, type Mention } from '../services/api';
import { useApiData } from './useApiData';
import { useMemo } from 'react';

interface UseMentionsReturn {
  mentions: Mention[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook para menciones. Si options.enabled es true, consulta al backend con enabled=true.
export function useMentions(options?: { enabled?: boolean }): UseMentionsReturn {
  const query = useMemo(() => (
    options?.enabled !== undefined ? { enabled: options.enabled } : undefined
  ), [options?.enabled]);

  const { data, loading, error, refetch } = useApiData(apiService.getMentions, query);

  return {
    mentions: data?.mentions || [],
    loading,
    error,
    refetch
  };
}

// Wrapper para sólo habilitadas desde el backend (sin filtrado en front)
export function useEnabledMentions(): UseMentionsReturn {
  return useMentions({ enabled: true });
}
