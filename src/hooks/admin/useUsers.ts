import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import type { AdminUser, CreateUserData, UpdateUserData } from '../../services/api';
import { USER_MESSAGES } from '../../constants/admin/userMessages';

interface UseUsersReturn {
  // Estado
  usuarios: AdminUser[];
  loading: boolean;
  error: string | null;
  
  // Estados de formularios
  showUserForm: boolean;
  editingUser: AdminUser | null;
  viewingUser: AdminUser | null;
  
  // Estados de filtros
  searchTerm: string;
  filterRol: 'todos' | 'admin' | 'user';
  
  // Estadísticas
  totalUsers: number;
  adminUsers: number;
  
  // Acciones
  loadUsers: () => Promise<void>;
  createUser: (data: CreateUserData) => Promise<void>;
  updateUser: (id: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Gestión de estado
  setShowUserForm: (show: boolean) => void;
  setEditingUser: (user: AdminUser | null) => void;
  setViewingUser: (user: AdminUser | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterRol: (role: 'todos' | 'admin' | 'user') => void;
  
  // Utilidades
  filteredUsuarios: AdminUser[];
  clearFilters: () => void;
}

export function useUsers(): UseUsersReturn {
  // Estados principales
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de formularios
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'user'>('todos');

  // Cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { users } = await apiService.getUsers();
      
      // Convertir el formato de la API al formato del componente
      const usuariosFormateados: AdminUser[] = users.map(user => ({
        ...user,
        role: user.role === 'admin' ? 'admin' : 'user'
      }));
      
      setUsuarios(usuariosFormateados);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError(USER_MESSAGES.ERRORS.LOAD_USERS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear usuario
  const createUser = useCallback(async (data: CreateUserData) => {
    try {
      const { user: newUser } = await apiService.createUser(data);
      setUsuarios(prev => [...prev, newUser]);
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw new Error(USER_MESSAGES.ERRORS.CREATE_USER);
    }
  }, []);

  // Actualizar usuario
  const updateUser = useCallback(async (id: string, data: UpdateUserData) => {
    try {
      const { user: updatedUser } = await apiService.updateUser(id, data);
      setUsuarios(prev => prev.map(u => u.id === id ? updatedUser : u));
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new Error(USER_MESSAGES.ERRORS.UPDATE_USER);
    }
  }, []);

  // Eliminar usuario
  const deleteUser = useCallback(async (id: string) => {
    try {
      await apiService.deleteUser(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw new Error(USER_MESSAGES.ERRORS.DELETE_USER);
    }
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterRol('todos');
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Calcular estadísticas
  const totalUsers = usuarios.length;
  const adminUsers = usuarios.filter(u => u.role === 'admin').length;

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = (usuario.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (usuario.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = filterRol === 'todos' || usuario.role === filterRol;

    return matchesSearch && matchesRol;
  });

  return {
    // Estado
    usuarios,
    loading,
    error,
    
    // Estados de formularios
    showUserForm,
    editingUser,
    viewingUser,
    
    // Estados de filtros
    searchTerm,
    filterRol,
    
    // Estadísticas
    totalUsers,
    adminUsers,
    
    // Acciones
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Gestión de estado
    setShowUserForm,
    setEditingUser,
    setViewingUser,
    setSearchTerm,
    setFilterRol,
    
    // Utilidades
    filteredUsuarios,
    clearFilters
  };
}
