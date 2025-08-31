import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import type { User, CreateUserData, UpdateUserData } from '../types/auth';
import {
  AdminUsersHeader,
  SearchFilters,
  UserFormModal,
  UserSidePanel
} from '../components/admin';


export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // Estados para Usuarios
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para formularios
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'user'>('todos');



  // Calcular estadísticas para el header
  const totalUsers = usuarios.length;
  const adminUsers = usuarios.filter(u => u.role === 'admin').length;

  // Cargar usuarios desde la API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar usuarios desde la API
        const { users } = await apiService.getUsers();
        
        // Convertir el formato de la API al formato del componente
        const usuariosFormateados: User[] = users.map(user => ({
          ...user,
          role: user.role === 'admin' ? 'admin' : 'user' // Mapear roles del backend
        }));
        
        setUsuarios(usuariosFormateados);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
        setError('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Funciones para Usuarios
  const handleUserSubmit = async (formData: FormData) => {
    
    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updateData: UpdateUserData = {
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          first_name: formData.get('first_name') as string,
          last_name: formData.get('last_name') as string,
          role: (formData.get('role') as 'admin' | 'user') || 'user'
        };

        const { user: updatedUser } = await apiService.updateUser(editingUser.id.toString(), updateData);
        
        // Actualizar estado local
        setUsuarios(usuarios.map(u => 
          u.id === editingUser.id ? updatedUser : u
        ));
      } else {
        // Crear nuevo usuario
        const createData: CreateUserData = {
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          first_name: formData.get('first_name') as string,
          last_name: formData.get('last_name') as string,
          role: (formData.get('role') as 'admin' | 'user') || 'user',
          password: formData.get('password') as string,
          password_confirmation: formData.get('password_confirmation') as string
        };

        const { user: newUser } = await apiService.createUser(createData);
        
        // Agregar nuevo usuario al estado local
        setUsuarios([...usuarios, newUser]);
      }
      
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error al guardar el usuario. Intenta nuevamente.');
    }
  };

  const handleUserDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        console.log('Intentando eliminar usuario con ID:', id);
        await apiService.deleteUser(id.toString());
        console.log('Usuario eliminado exitosamente');
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error: any) {
        console.error('Error eliminando usuario:', error);
        
        // Mostrar mensaje de error más específico
        let errorMessage = 'Error al eliminar el usuario.';
        
        if (error.message?.includes('401')) {
          errorMessage = 'No tienes permisos para eliminar usuarios o tu sesión expiró.';
        } else if (error.message?.includes('404')) {
          errorMessage = 'Usuario no encontrado o endpoint no disponible.';
        } else if (error.message?.includes('500')) {
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
        }
        
        alert(errorMessage);
      }
    }
  };

  const handleUserEdit = (usuario: User) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  const handleUserView = (usuario: User) => {
    setViewingUser(usuario);
  };

  // Filtros
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = (usuario.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (usuario.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = filterRol === 'todos' || usuario.role === filterRol;
    

    return matchesSearch && matchesRol;
  });

  // Redirigir si no es admin
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  return (
    <>
      {/* Contenido principal */}
      <div className="px-6 py-6 h-full">
        {/* Header con título y estadísticas */}
        <AdminUsersHeader
          totalUsers={totalUsers}
          adminUsers={adminUsers}
        />

        {/* Espacio entre secciones */}
        <div className="h-12"></div>

        {/* Filtros modernos */}
        <SearchFilters
          searchTerm={searchTerm}
          filterRol={filterRol}
          onSearchChange={setSearchTerm}
          onRolChange={setFilterRol}
          onClearFilters={() => {
            setSearchTerm('');
            setFilterRol('todos');
          }}
          onAddUser={() => setShowUserForm(true)}
          usuarios={filteredUsuarios}
          onViewUser={handleUserView}
          onEditUser={handleUserEdit}
          onDeleteUser={handleUserDelete}
          loading={loading}
          error={error}
        />
      </div>

      {/* Modal para detalles del usuario */}
      <UserSidePanel
        usuario={viewingUser}
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        onEdit={handleUserEdit}
        onDelete={handleUserDelete}
      />

      {/* Modal para Usuario */}
      <UserFormModal
        isOpen={showUserForm}
        editingUser={editingUser}
        onClose={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
      />
    </>
  );
} 