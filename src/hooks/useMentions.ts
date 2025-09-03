import { apiService, type Mention } from '../services/api';
import { useApiData } from './useApiData';

interface UseMentionsReturn {
  mentions: Mention[];
  enabledMentions: Mention[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook para menciones - obtiene todas las menciones
export function useMentions(): UseMentionsReturn {
  const { data, loading, error, refetch } = useApiData(apiService.getMentions);

  const mentions = data?.mentions || [];
  const enabledMentions = mentions.filter(mention => mention.enabled);

  return {
    mentions,
    enabledMentions,
    loading,
    error,
    refetch
  };
}

// Hook para menciones activas - obtiene solo menciones activas del backend
export function useEnabledMentions(): UseMentionsReturn {
  const { data, loading, error, refetch } = useApiData(
    apiService.getMentions, 
    { enabled: true }
  );

  const mentions = data?.mentions || [];
  // El backend ya filtró, así que todas son activas
  const enabledMentions = mentions;

  return {
    mentions,
    enabledMentions,
    loading,
    error,
    refetch
  };
}