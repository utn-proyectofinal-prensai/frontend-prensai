// Configuración de la API
import { AUTH_MESSAGES, API_MESSAGES } from '../constants/messages';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'


// Tipos de datos según la nueva API
export interface NewsItem {
  id: number;
  title: string;
  publication_type: string;
  date: string;
  support: string;
  media: string;
  section: string;
  author: string;
  interviewee: string | null;
  link: string;
  audience_size: number | null;
  quotation: number | null;
  valuation: string | null;
  political_factor: string | null;
  plain_text: string | null;
  crisis: boolean;
  created_at: string;
  updated_at: string;
  topic: EntityRef | null;
  mentions: EntityRef[];
  creator: EntityRef | null;
  reviewer: EntityRef | null;
}

// Tipos base para referencias simples
export interface EntityRef {
  id: number;
  name: string;
}

export interface Pagination {
  page: number;
  count: number;
  pages: number;
  prev: number | null;
  next: number | null;
}

export interface ApiError {
  message: string;
}

export interface ProcessingError {
  url: string;
  reason: string;
}

export interface ErrorResponse {
  errors: (ApiError | ProcessingError | string)[];
}

export interface BatchProcessRequest {
  urls: string[];
  topics: string[];
  mentions: string[];
}

export interface BatchProcessResponse {
  received: number;
  processed_by_ai: number;
  persisted: number;
  news: NewsItem[];
  errors: ProcessingError[];
}

export interface NewsListResponse {
  news: NewsItem[];
  pagination: Pagination;
}

export interface DashboardStats {
  totalNoticias: number;
  noticiasHoy: number;
  noticiasEstaSemana: number;
  noticiasEsteMes: number;
  noticiasPorTema: { tema: string; count: number }[];
  noticiasPorMedio: { medio: string; count: number }[];
}

export interface ActiveMention {
  position: number;
  name: string;
}

export interface Mention {
  id: number;
  name: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  crisis: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClippingData {
  title: string;
  topic_id: number;
  start_date: string;
  end_date: string;
  news_ids: number[];
}

export interface ClippingItem {
  id: number;
  title: string;
  topic_id: number;
  topic_name?: string;
  start_date: string;
  end_date: string;
  news_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface SoporteMetric {
  soporte: string;
  cantidad: number;
  porcentaje: number;
}

export interface ClippingMetrics {
  totalNoticias: number;
  soporte: SoporteMetric[];
  resumen: {
    soportesUnicos: number;
    soporteMasFrecuente: string;
    porcentajeSoporteMasFrecuente: number;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  current_sign_in_at?: string;
  sign_in_count?: number;
}

export interface CreateUserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  password: string;
  password_confirmation: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'user';
}

// Función helper para manejar errores de la API
export function parseApiError(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    // Si el mensaje contiene "HTTP error! status:", es un error de fetch
    if (error.message.includes('HTTP error! status:')) {
      return defaultMessage;
    }
    
    try {
      const errorData: ErrorResponse = JSON.parse(error.message);
      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Si hay errores de procesamiento con URL y reason
        const processingErrors = errorData.errors.filter((err): err is ProcessingError => 
          typeof err === 'object' && err !== null && 'url' in err && 'reason' in err
        );
        
        if (processingErrors.length > 0) {
          return `Errores en URLs: ${processingErrors.map(err => `${err.url}: ${err.reason}`).join(', ')}`;
        } else {
          // Errores generales
          return errorData.errors.map(err => {
            if (typeof err === 'string') return err;
            if (typeof err === 'object' && err !== null && 'message' in err) {
              return (err as ApiError).message;
            }
            return String(err);
          }).join(', ');
        }
      } else {
        return error.message;
      }
    } catch {
      // Si no es JSON válido, usar el mensaje tal como viene
      return error.message;
    }
  }
  return defaultMessage;
}

// Función helper para hacer requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const jwtToken = localStorage.getItem('jwt-token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  
  const config: RequestInit = {
    headers,
    ...options,
  };

      try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido o expirado, limpiar localStorage
          localStorage.removeItem('jwt-token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error(AUTH_MESSAGES.VALIDATION.SESSION_EXPIRED);
        }

        // Intentar extraer mensaje de error desde la API
        let apiMessage = '';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const raw = (data?.errors?.[0]?.message as string | undefined) ?? '';
            apiMessage = raw.trim();
          }
        } catch (parseErr) {
          console.warn('No se pudo parsear el error de la API:', parseErr);
        }

        throw new Error(apiMessage || `${API_MESSAGES.ERRORS.HTTP_ERROR} ${response.status}`);
      }
      
      // Para respuestas 204 No Content, no intentar parsear JSON
      if (response.status === 204) {
        return {} as T;
      }
      
      // Solo intentar parsear JSON si hay contenido
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // Para otros tipos de contenido, devolver texto vacío
      return {} as T;
    } catch (error) {
      console.error('Error en API request:', error);
      throw error;
    }
}

// Servicios de la API
export const apiService = {
  // Obtener todas las noticias con paginación
  async getNews(filters?: {
    page?: number;
    limit?: number;
    topic_id?: number;
    media?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    status?: string;
  }): Promise<NewsListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.topic_id) params.append('topic_id', filters.topic_id.toString());
    if (filters?.media) params.append('media', filters.media);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<NewsListResponse>(endpoint);
  },

  // Obtener una noticia específica
  async getNewsById(id: number): Promise<NewsItem> {
    return apiRequest<NewsItem>(`/news/${id}`);
  },

  // Actualizar una noticia
  async updateNews(id: number, newsData: {
    title?: string;
    publication_type?: string;
    date?: string;
    support?: string;
    media?: string;
    section?: string;
    author?: string;
    interviewee?: string;
    audience_size?: number;
    quotation?: number;
    valuation?: string;
    political_factor?: string;
    crisis?: boolean;
    topic_id?: number;
    mention_ids?: number[];
  }): Promise<NewsItem> {
    return apiRequest<NewsItem>(`/news/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ news: newsData }),
    });
  },

  // Procesar noticias por lotes
  async batchProcessNews(data: BatchProcessRequest): Promise<BatchProcessResponse> {
    return apiRequest<BatchProcessResponse>('/news/batch_process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener estadísticas del dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await apiRequest<DashboardStats>('/news/stats');
    } catch (error) {
      console.warn('Endpoint /news/stats no disponible, devolviendo datos por defecto');
      // Devolver datos por defecto si el endpoint no existe
      return {
        totalNoticias: 0,
        noticiasHoy: 0,
        noticiasEstaSemana: 0,
        noticiasEsteMes: 0,
        noticiasPorTema: [],
        noticiasPorMedio: []
      };
    }
  },

  // Importar noticias desde Excel
  async importNews(file: File): Promise<{
    message: string;
    totalProcesadas: number;
    importadas: number;
    errores: number;
  }> {
    const formData = new FormData();
    formData.append('excel', file);

    const url = `${API_BASE_URL}/news/import`;
    const jwtToken = localStorage.getItem('jwt-token');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error importando noticias:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ token: string }> {
    console.log('Intentando login con:', { email });
    
    const response = await fetch(`${API_BASE_URL}/users/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { email, password } }),
    });

    console.log('Respuesta del backend:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en login:', errorData);
      // Usar el mensaje de error que devuelve el backend
      throw new Error(errorData.errors?.[0]?.message || AUTH_MESSAGES.VALIDATION.AUTHENTICATION_ERROR);
    }

    const data = await response.json();
    console.log('Datos de respuesta:', data);
    
    return { token: data.token };
  },

  async verifyStatus(): Promise<{ valid: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (response.ok) {
        return { valid: true };
      }
      return { valid: false };
    } catch {
      return { valid: false };
    }
  },

  // Obtener usuario actual usando el token JWT
  async getCurrentUser(): Promise<{ user: UserInfo }> {
    return apiRequest<{ user: UserInfo }>('/user');
  },

  // Actualizar perfil personal del usuario autenticado
  async updateCurrentUser(userData: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  }): Promise<{ user: UserInfo }> {
    return apiRequest<{ user: UserInfo }>('/user', {
      method: 'PATCH',
      body: JSON.stringify({ user: userData }),
    });
  },

  // Cambiar contraseña del usuario autenticado
  async changeCurrentUserPassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    // NOTA: Este endpoint no existe actualmente en el backend
    // Necesita ser implementado como /api/v1/user/change_password o similar
    // El endpoint /api/v1/users/password es solo para recuperación de contraseña (password reset)
    return apiRequest<{ message: string }>('/user/change_password', {
      method: 'PATCH',
      body: JSON.stringify({ 
        user: { 
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: newPassword 
        } 
      }),
    });
  },

  // Métodos de gestión de usuarios (solo para admins)
  async getUsers(): Promise<{ users: User[] }> {
    return apiRequest<{ users: User[] }>('/users');
  },

  async getUser(id: string): Promise<{ user: User }> {
    return apiRequest<{ user: User }>(`/users/${id}`);
  },

  async createUser(userData: CreateUserData): Promise<{ user: User }> {
    return apiRequest<{ user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify({ user: userData }),
    });
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<{ user: User }> {
    return apiRequest<{ user: User }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ user: userData }),
    });
  },

  async deleteUser(id: string): Promise<void> {
    console.log('API: Eliminando usuario con ID:', id);
    console.log('API: Token disponible:', !!localStorage.getItem('jwt-token'));
    
    try {
      await apiRequest(`/users/${id}`, {
        method: 'DELETE',
      });
      console.log('API: Usuario eliminado exitosamente');
    } catch (error) {
      console.error('API: Error en deleteUser:', error);
      throw error;
    }
  },

  // Cambiar contraseña de un usuario específico (solo para admins)
  async changeUserPassword(id: string, newPassword: string): Promise<{ message: string }> {
    // NOTA: Este endpoint no existe actualmente en el backend
    // Necesita ser implementado como /api/v1/users/:id/change_password
    // Diferente del endpoint de recuperación de contraseña
    return apiRequest<{ message: string }>(`/users/${id}/change_password`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        user: { 
          password: newPassword,
          password_confirmation: newPassword 
        } 
      }),
    });
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/users/sign_out', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('user');
    }
  },

  // Gestión de menciones activas
  async getActiveMentions(): Promise<{ activeMentions: ActiveMention[] }> {
    return apiRequest<{ activeMentions: ActiveMention[] }>('/mentions/active');
  },

  async updateActiveMentions(mentions: ActiveMention[]): Promise<{
    message: string;
    activeMentions: ActiveMention[];
  }> {
    return apiRequest<{
      message: string;
      activeMentions: ActiveMention[];
    }>('/mentions/active', {
      method: 'PUT',
      body: JSON.stringify({ mentions }),
    });
  },

  async getAllMentions(): Promise<{ mentions: Mention[] }> {
    return apiRequest<{ mentions: Mention[] }>('/mentions');
  },

  // CRUD de menciones individuales
  async createMention(data: { name: string; enabled: boolean }): Promise<Mention> {
    return apiRequest<Mention>('/mentions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMention(id: string, data: { name: string; enabled: boolean }): Promise<Mention> {
    return apiRequest<Mention>(`/mentions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMention(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/mentions/${id}`, {
      method: 'DELETE',
    });
  },

  // Eventos/Temas (Topics)
  async getAllTopics(): Promise<{ topics: Topic[] }> {
    return apiRequest<{ topics: Topic[] }>('/topics');
  },

  async createTopic(data: {
    name: string;
    description: string;
    enabled: boolean;
  }): Promise<Topic> {
    return apiRequest<Topic>('/topics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTopic(id: string, data: {
    name: string;
    description: string;
    enabled: boolean;
  }): Promise<Topic> {
    return apiRequest<Topic>(`/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTopic(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/topics/${id}`, {
      method: 'DELETE',
    });
  },

  // Métricas de clipping
  async calculateClippingMetrics(newsIds: string[]): Promise<{
    message: string;
    metricas: ClippingMetrics;
  }> {
    return apiRequest<{ message: string; metricas: ClippingMetrics }>('/news/metrics', {
      method: 'POST',
      body: JSON.stringify({ newsIds }),
    });
  },

  // Crear clipping
  async createClipping(data: ClippingData): Promise<{
    message: string;
    clipping: {
      id: number;
      title: string;
      created_at: string;
    };
  }> {
    return apiRequest<{
      message: string;
      clipping: {
        id: number;
        title: string;
        created_at: string;
      };
    }>('/clippings', {
      method: 'POST',
      body: JSON.stringify({ clipping: data }),
    });
  },

  // Obtener clippings con paginación
  async getClippings(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    topic_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    clippings: ClippingItem[];
    pagination: {
      page: number;
      limit: number;
      count: number;
      total_pages: number;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.topic_id) params.append('topic_id', filters.topic_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/clippings${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<{
      clippings: ClippingItem[];
      pagination: {
        page: number;
        limit: number;
        count: number;
        total_pages: number;
      };
    }>(endpoint);
  },

  // Eliminar clipping
  async deleteClipping(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/clippings/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiService; 
