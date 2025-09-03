import { useState, useEffect, useCallback } from 'react';

// Hook genérico para datos de API con query parameters
export function useApiData<T>(
  fetchFunction: (queryParams?: Record<string, string | number | boolean>) => Promise<T>,
  queryParams?: Record<string, string | number | boolean>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(queryParams);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, queryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
