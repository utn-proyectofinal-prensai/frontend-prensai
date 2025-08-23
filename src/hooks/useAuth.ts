import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Hook helper para verificar si el usuario es admin
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};
