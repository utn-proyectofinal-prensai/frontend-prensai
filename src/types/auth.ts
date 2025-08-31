export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Interfaz base para usuario
export interface BaseUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

// Interfaz extendida para usuario con información de sesión
export interface User extends BaseUser {
  name: string;
  last_sign_in_at?: string;
  current_sign_in_at?: string;
  sign_in_count?: number;
}

// Interfaz para usuario en contexto de autenticación (con ID como string para compatibilidad)
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
}

// Interfaz para datos de creación de usuario
export interface CreateUserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  password: string;
  password_confirmation: string;
}

// Interfaz para datos de actualización de usuario
export interface UpdateUserData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'user';
}
