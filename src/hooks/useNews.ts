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
  topic_id?: number;
  start_date?: string;
  end_date?: string;
  publication_type?: string;
  valuation?: string;
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
      
      // Mapear los filtros al formato que espera apiService, solo incluyendo los que tienen valor
      const apiFilters: any = {};
      
      if (filters.page !== undefined) apiFilters.page = filters.page;
      if (filters.limit !== undefined) apiFilters.limit = filters.limit;
      if (filters.topic_id !== undefined && filters.topic_id !== null) apiFilters.topic_id = filters.topic_id;
      if (filters.start_date !== undefined && filters.start_date !== null && filters.start_date !== '') apiFilters.start_date = filters.start_date;
      if (filters.end_date !== undefined && filters.end_date !== null && filters.end_date !== '') apiFilters.end_date = filters.end_date;
      if (filters.publication_type !== undefined && filters.publication_type !== null && filters.publication_type !== '') apiFilters.publication_type = filters.publication_type;
      if (filters.valuation !== undefined && filters.valuation !== null && filters.valuation !== '') apiFilters.valuation = filters.valuation;
      if (filters.search !== undefined && filters.search !== null && filters.search !== '') apiFilters.search = filters.search;
      if (filters.status !== undefined && filters.status !== null && filters.status !== '') apiFilters.status = filters.status;
      
      const response: NewsListResponse = await apiService.getNews(apiFilters);
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
    // Reemplazar completamente los filtros, no hacer merge
    // Esto asegura que los filtros eliminados (undefined) no se mantengan
    setFilters(newFilters);
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
