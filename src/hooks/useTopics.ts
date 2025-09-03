import { apiService, type Topic } from '../services/api';
import { useApiData } from './useApiData';

interface UseTopicsReturn {
  topics: Topic[];
  enabledTopics: Topic[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook para temas - obtiene todos los temas
export function useTopics(): UseTopicsReturn {
  const { data, loading, error, refetch } = useApiData(apiService.getTopics);

  const topics = data?.topics || [];
  const enabledTopics = topics.filter(topic => topic.enabled);

  return {
    topics,
    enabledTopics,
    loading,
    error,
    refetch
  };
}

// Hook para temas activos - obtiene solo temas activos del backend
export function useEnabledTopics(): UseTopicsReturn {
  const { data, loading, error, refetch } = useApiData(
    apiService.getTopics, 
    { enabled: true }
  );

  const topics = data?.topics || [];
  // El backend ya filtró, así que todos son activos
  const enabledTopics = topics;

  return {
    topics,
    enabledTopics,
    loading,
    error,
    refetch
  };
}
