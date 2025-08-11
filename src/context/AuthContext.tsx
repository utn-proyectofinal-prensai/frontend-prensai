import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';
import { AUTH_MESSAGES } from '../constants/messages';

interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  isAdmin: boolean; // Nueva propiedad para verificar si es admin
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Verificar si hay un usuario guardado en localStorage al inicializar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = localStorage.getItem('access-token');
      const uid = localStorage.getItem('uid');
      const client = localStorage.getItem('client');
      
      if (accessToken && uid && client) {
        try {
          const { valid, user: userData } = await apiService.verifyToken();
          if (valid && userData) {
            const userInfo: User = {
              id: userData.id.toString(),
              username: userData.username || userData.email,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: userData.role // Usar el rol real del backend
            };
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
          } else {
            // Token inválido, limpiar localStorage
            localStorage.clear();
            setUser(null);
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          localStorage.clear();
          setUser(null);
        }
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user: userData, headers } = await apiService.login(email, password);
      
      // Guardar headers de autenticación
      localStorage.setItem('access-token', headers['access-token']);
      localStorage.setItem('uid', headers['uid']);
      localStorage.setItem('client', headers['client']);
      
      // Crear objeto de usuario con la estructura del backend
      const userInfo: User = {
        id: userData.id.toString(),
        username: userData.username || userData.email,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role // Usar el rol real del backend
      };
      
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return true;
      
    } catch (error: any) {
      setError(error.message || AUTH_MESSAGES.VALIDATION.CREDENTIALS_INVALID);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local independientemente del resultado
      setUser(null);
      localStorage.clear();
    }
  };

  const clearError = () => {
    // Agregar un delay antes de limpiar el error para que el snackbar sea visible
    setTimeout(() => {
      setError(null);
    }, 5000); // 5 segundos de delay
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
    clearError,
    isAdmin: user?.role === 'admin' // Verificar si el usuario es admin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 