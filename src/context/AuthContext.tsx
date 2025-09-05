import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';
import { AUTH_MESSAGES } from '../constants/messages';

import type { AuthUser } from '../types/auth';

interface User extends AuthUser {}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
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
      const jwtToken = localStorage.getItem('jwt-token');
      
      if (jwtToken) {
        try {
          // Verificar si el token es válido
          const { valid } = await apiService.verifyToken();
          if (valid) {
            // Token válido, obtener información del usuario
            try {
              const userData = await apiService.getCurrentUser();
              if (userData && userData.user) {
                const userInfo: User = {
                  id: userData.user.id.toString(),
                  username: userData.user.username || userData.user.email,
                  email: userData.user.email,
                  first_name: userData.user.first_name,
                  last_name: userData.user.last_name,
                  role: userData.user.role || 'user'
                };
                setUser(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
              }
            } catch (userError) {
              console.error('Error obteniendo usuario:', userError);
              // Si no se puede obtener el usuario, limpiar localStorage
              localStorage.clear();
              setUser(null);
            }
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
      const { token } = await apiService.login(email, password);
      
      localStorage.setItem('jwt-token', token);
      
      const userData = await apiService.getCurrentUser();
      
      if (userData && userData.user) {
        // Crear objeto de usuario con la estructura del backend
        const userInfo: User = {
          id: userData.user.id.toString(),
          username: userData.user.username || userData.user.email,
          email: userData.user.email,
          first_name: userData.user.first_name,
          last_name: userData.user.last_name,
          role: userData.user.role || 'user'
        };
        
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        return true;
      } else {
        throw new Error('No se pudo obtener la información del usuario');
      }
      
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
    setTimeout(() => {
      setError(null);
    }, 5000); 
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 