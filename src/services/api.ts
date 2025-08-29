// Configuración de la API
import { AUTH_MESSAGES, API_MESSAGES } from '../constants/messages';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

// Tipos de datos
export interface NewsItem {
  id: string;
  titulo: string;
  tipoPublicacion: string;
  fecha: string;
  soporte: string;
  medio: string;
  seccion: string;
  autor: string;
  conductor: string;
  entrevistado: string;
  tema: string;
  etiqueta1: string;
  etiqueta2: string;
  link: string;
  alcance: string;
  cotizacion: string;
  tapa: string;
  valoracion: string;
  ejeComunicacional: string;
  factorPolitico: string;
  crisis: string;
  gestion: string;
  area: string;
  mencion1: string;
  mencion2: string;
  mencion3: string;
  mencion4: string;
  mencion5: string;
  status: 'processed' | 'pending' | 'error';
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
        throw new Error(`${API_MESSAGES.ERRORS.HTTP_ERROR} ${response.status}`);
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
  // Obtener todas las noticias
  async getNews(filters?: {
    tema?: string;
    medio?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    limit?: number;
    offset?: number;
  }): Promise<NewsItem[]> {
    const params = new URLSearchParams();
    
    if (filters?.tema) params.append('tema', filters.tema);
    if (filters?.medio) params.append('medio', filters.medio);
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest<{ noticias: NewsItem[]; pagination: PaginationInfo }>(endpoint);
    return response.noticias; // Extraer solo el array de noticias
  },

  // Obtener una noticia específica
  async getNewsById(id: string): Promise<NewsItem> {
    return apiRequest<NewsItem>(`/news/${id}`);
  },

  // Obtener estadísticas del dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>('/news/stats');
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

  async verifyToken(): Promise<{ valid: boolean }> {
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
};

export default apiService; 