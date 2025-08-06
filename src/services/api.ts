// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

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
  position: number | null; // Changed to allow null
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
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

// Función helper para hacer requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Agregar el token de autorización si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token inválido, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
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
    
    const response = await apiRequest<{ noticias: NewsItem[]; pagination: any }>(endpoint);
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
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  // Autenticación
  async login(email: string, password: string): Promise<{ token: string }> {
    return apiRequest<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Verificar token
  async verifyToken(token: string): Promise<{ valid: boolean; user?: any }> {
    return apiRequest<{ valid: boolean; user?: any }>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
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
    return apiRequest<{ mentions: Mention[] }>('/mentions/all');
  },

  // CRUD de menciones individuales
  async createMention(name: string): Promise<{
    message: string;
    mention: Mention;
  }> {
    return apiRequest<{
      message: string;
      mention: Mention;
    }>('/mentions', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async updateMention(id: string, name: string): Promise<{
    message: string;
    mention: Mention;
  }> {
    return apiRequest<{
      message: string;
      mention: Mention;
    }>(`/mentions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async deleteMention(id: string): Promise<{
    message: string;
  }> {
    return apiRequest<{
      message: string;
    }>(`/mentions/${id}`, {
      method: 'DELETE',
    });
  },

  // Eventos/Temas
  async getAllEvents(): Promise<{ events: Event[] }> {
    return apiRequest<{ events: Event[] }>('/events');
  },

  async getActiveEvents(): Promise<{ activeEvents: Event[] }> {
    return apiRequest<{ activeEvents: Event[] }>('/events/active');
  },

  async createEvent(data: {
    name: string;
    description?: string;
    color?: string;
    tags?: string[];
  }): Promise<{ message: string; event: Event }> {
    return apiRequest<{ message: string; event: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEvent(id: string, data: {
    name: string;
    description?: string;
    color?: string;
    isActive?: boolean;
    tags?: string[];
  }): Promise<{ message: string; event: Event }> {
    return apiRequest<{ message: string; event: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEvent(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/events/${id}`, {
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