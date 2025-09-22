import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { 
  NewsItem, 
  NewsListResponse, 
  BatchProcessRequest, 
  BatchProcessResponse,
  Pagination 
} from '../services/api';

interface UseNewsFilters {
  page?: number;
  limit?: number;
  topic?: string;
  media?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  status?: string;
}

interface UseNewsReturn {
  news: NewsItem[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setFilters: (filters: UseNewsFilters) => void;
  batchProcess: (data: BatchProcessRequest) => Promise<BatchProcessResponse>;
  processing: boolean;
}

export function useNews(initialFilters?: UseNewsFilters): UseNewsReturn {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UseNewsFilters>(initialFilters || {});
  const [processing, setProcessing] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: NewsListResponse = await apiService.getNews(filters);
      setNews(response.news);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las noticias';
      setError(errorMessage);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const batchProcess = useCallback(async (data: BatchProcessRequest): Promise<BatchProcessResponse> => {
    try {
      setProcessing(true);
      setError(null);
      
      const response = await apiService.batchProcessNews(data);
      
      // Refrescar la lista de noticias después del procesamiento
      await fetchNews();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar las noticias';
      setError(errorMessage);
      console.error('Error batch processing news:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [fetchNews]);

  const updateFilters = useCallback((newFilters: UseNewsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    pagination,
    loading,
    error,
    refetch: fetchNews,
    setFilters: updateFilters,
    batchProcess,
    processing
  };
}

// Hook específico para obtener una noticia por ID
export function useNewsById(id: number | null) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsById = useCallback(async (newsId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getNewsById(newsId);
      setNews(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la noticia';
      setError(errorMessage);
      console.error('Error fetching news by ID:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchNewsById(id);
    } else {
      setNews(null);
      setError(null);
    }
  }, [id, fetchNewsById]);

  return {
    news,
    loading,
    error,
    refetch: () => id ? fetchNewsById(id) : Promise.resolve()
  };
}
