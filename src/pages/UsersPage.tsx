import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import type { User, CreateUserData, UpdateUserData } from '../types/auth';
import {
  AdminUsersHeader,
  SearchFilters,
  UserFormModal,
  UserModal,
  PasswordChangeModal
} from '../components/admin';
import Snackbar from '../components/common/Snackbar';
import { ConfirmationModal } from '../components/common';


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
  const [editModeActive, setEditModeActive] = useState(false);
  const [createModeActive, setCreateModeActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'user'>('todos');

  // Estados para snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('success');

  // Estados para modal de cambio de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = useState<User | null>(null);

  // Estados para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Función para mostrar snackbar
  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };



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

  const handleUserDelete = (id: number) => {
    const user = usuarios.find(u => u.id === id);
    if (user) {
      setUserToDelete(user);
      setShowConfirmModal(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      console.log('Intentando eliminar usuario con ID:', userToDelete.id);
      await apiService.deleteUser(userToDelete.id.toString());
      console.log('Usuario eliminado exitosamente');
      
      setUsuarios(usuarios.filter(u => u.id !== userToDelete.id));
      showSnackbar(`Usuario ${userToDelete.username} eliminado exitosamente`, 'success');
      
      // Cerrar modal si el usuario eliminado estaba siendo visto
      if (viewingUser?.id === userToDelete.id) {
        setViewingUser(null);
        setEditModeActive(false);
        setCreateModeActive(false);
      }
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
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  // Función para abrir el modal en modo edición (cuando se hace clic en el lapicito)
  const handleOpenEditModal = (usuario: User) => {
    setViewingUser(usuario);
    setEditModeActive(true);
    setCreateModeActive(false);
  };

  // Función para actualizar el usuario (cuando se guarda desde el modal)
  const handleUserUpdate = async (usuario: User) => {
    try {
      const updateData: UpdateUserData = {
        username: usuario.username,
        email: usuario.email,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        role: usuario.role
      };

      const { user: updatedUser } = await apiService.updateUser(usuario.id.toString(), updateData);
      
      // Actualizar estado local
      setUsuarios(usuarios.map(u => 
        u.id === usuario.id ? updatedUser : u
      ));
      
      // Cerrar el modal
      setViewingUser(null);
      setEditModeActive(false);
      setCreateModeActive(false);
      
      // Mostrar snackbar de éxito
      showSnackbar(`Usuario ${updatedUser.username} actualizado exitosamente`, 'success');
    } catch (err: any) {
      console.error('Error editando usuario:', err);
      
      // Extraer mensaje de error específico de la API
      let errorMessage = 'Error al editar el usuario';
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 422 && data.errors) {
          // Errores de validación del backend
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.map((error: any) => {
              if (typeof error === 'object') {
                return JSON.stringify(error);
              }
              return String(error);
            }).join(', ');
          } else if (typeof data.errors === 'object') {
            const fieldErrors = Object.entries(data.errors)
              .map(([field, messages]: [string, any]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                } else if (typeof messages === 'object') {
                  return `${field}: ${JSON.stringify(messages)}`;
                }
                return `${field}: ${String(messages)}`;
              })
              .join('; ');
            errorMessage = fieldErrors;
          } else {
            errorMessage = String(data.errors);
          }
        } else if (data.error) {
          errorMessage = typeof data.error === 'object' ? JSON.stringify(data.error) : String(data.error);
        } else if (data.message) {
          errorMessage = typeof data.message === 'object' ? JSON.stringify(data.message) : String(data.message);
        } else {
          errorMessage = data ? JSON.stringify(data) : `Error ${status}: ${err.response.statusText || 'Error del servidor'}`;
        }
      } else if (err.message) {
        if (err.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else {
          errorMessage = err.message;
        }
      }
      
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleUserView = (usuario: User) => {
    setViewingUser(usuario);
    setEditModeActive(false);
    setCreateModeActive(false);
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const createData = {
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        password: userData.password,
        password_confirmation: userData.password // Usar el mismo valor para confirmación
      };

      const { user: newUser } = await apiService.createUser(createData);
      
      // Agregar nuevo usuario al estado local
      setUsuarios([...usuarios, newUser]);
      setCreateModeActive(false);
      setViewingUser(null);
      
      // Mostrar snackbar de éxito
      showSnackbar(`Usuario ${newUser.username} creado exitosamente`, 'success');
    } catch (err: any) {
      console.error('Error creando usuario:', err);
      console.error('Error response data:', err.response?.data);
      
      // Extraer mensaje de error específico de la API
      let errorMessage = 'Error al crear el usuario';
      
      if (err.response) {
        // Error de respuesta HTTP
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 422 && data.errors) {
          // Errores de validación del backend
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.map((error: any) => {
              if (typeof error === 'object') {
                return JSON.stringify(error);
              }
              return String(error);
            }).join(', ');
          } else if (typeof data.errors === 'object') {
            // Errores por campo
            const fieldErrors = Object.entries(data.errors)
              .map(([field, messages]: [string, any]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                } else if (typeof messages === 'object') {
                  return `${field}: ${JSON.stringify(messages)}`;
                }
                return `${field}: ${String(messages)}`;
              })
              .join('; ');
            errorMessage = fieldErrors;
          } else {
            errorMessage = String(data.errors);
          }
        } else if (data.error) {
          errorMessage = typeof data.error === 'object' ? JSON.stringify(data.error) : String(data.error);
        } else if (data.message) {
          errorMessage = typeof data.message === 'object' ? JSON.stringify(data.message) : String(data.message);
        } else {
          // Si no hay estructura conocida, mostrar todo el objeto data
          errorMessage = data ? JSON.stringify(data) : `Error ${status}: ${err.response.statusText || 'Error del servidor'}`;
        }
      } else if (err.message) {
        // Error de red o otros errores
        if (err.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else {
          errorMessage = err.message;
        }
      }
      
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleAddUser = () => {
    setViewingUser(null); // No hay usuario para crear uno nuevo
    setCreateModeActive(true);
    setEditModeActive(false);
  };

  // Función para abrir el modal de cambio de contraseña
  const handleChangePassword = (user: User) => {
    setPasswordChangeUser(user);
    setShowPasswordModal(true);
  };

  // Función para confirmar el cambio de contraseña
  const handlePasswordChangeConfirm = async (newPassword: string) => {
    if (!passwordChangeUser) return;

    try {
      await apiService.changeUserPassword(passwordChangeUser.id.toString(), newPassword);
      showSnackbar(`Contraseña de ${passwordChangeUser.username} cambiada exitosamente`, 'success');
    } catch (error: any) {
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = 'Error al cambiar la contraseña';
      
      try {
        const errorData = error.response?.data;
        if (errorData) {
          if (Array.isArray(errorData)) {
            errorMessage = errorData.map((err: any) => typeof err === 'string' ? err : JSON.stringify(err)).join(', ');
          } else if (typeof errorData === 'object') {
            if (errorData.errors) {
              if (Array.isArray(errorData.errors)) {
                errorMessage = errorData.errors.map((err: any) => typeof err === 'string' ? err : JSON.stringify(err)).join(', ');
              } else if (typeof errorData.errors === 'object') {
                errorMessage = JSON.stringify(errorData.errors);
              } else {
                errorMessage = String(errorData.errors);
              }
            } else if (errorData.error) {
              errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
            } else if (errorData.message) {
              errorMessage = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
            } else {
              errorMessage = JSON.stringify(errorData);
            }
          } else {
            errorMessage = String(errorData);
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      showSnackbar(errorMessage, 'error');
      throw error; // Re-throw para que el modal maneje el error
    }
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
          onAddUser={handleAddUser}
          usuarios={filteredUsuarios}
          onViewUser={handleUserView}
          onEditUser={handleOpenEditModal}
          onChangePassword={handleChangePassword}
          onDeleteUser={handleUserDelete}
          loading={loading}
          error={error}
        />
      </div>

      {/* Modal para detalles del usuario */}
      <UserModal
        usuario={viewingUser}
        isOpen={!!viewingUser || createModeActive}
        onClose={() => {
          setViewingUser(null);
          setEditModeActive(false);
          setCreateModeActive(false);
        }}
        onEdit={handleUserUpdate}
        onDelete={handleUserDelete}
        onCreateUser={handleCreateUser}
        initialEditMode={editModeActive}
        isCreateMode={createModeActive}
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

      {/* Modal de cambio de contraseña */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordChangeUser(null);
        }}
        onConfirm={handlePasswordChangeConfirm}
        user={passwordChangeUser}
      />

      {/* Modal de confirmación para eliminación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Eliminar Usuario"
        message={userToDelete ? `¿Estás seguro de que quieres eliminar al usuario "${userToDelete.first_name} ${userToDelete.last_name}" (${userToDelete.email})?\n\nEsta acción no se puede deshacer.` : ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        message={snackbarMessage}
        isOpen={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        type={snackbarType}
        duration={3000}
      />
    </>
  );
} 