import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import type { User, UpdateUserData } from '../types/auth';
import {
  AdminUsersHeader,
  SearchFilters,
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
      
      // Preservar fechas si el backend no las devuelve
      const usuarioAnterior = usuarios.find(u => u.id === usuario.id);
      const usuarioActualizado = {
        ...updatedUser,
        created_at: updatedUser.created_at || usuarioAnterior?.created_at || '',
        updated_at: updatedUser.updated_at || usuarioAnterior?.updated_at || ''
      };
      
      // Actualizar estado local
      setUsuarios(usuarios.map(u => 
        u.id === usuario.id ? usuarioActualizado : u
      ));
      
      // Cerrar el modal
      setViewingUser(null);
      setEditModeActive(false);
      setCreateModeActive(false);
      
      // Mostrar snackbar de éxito
      showSnackbar(`Usuario ${updatedUser.username} actualizado exitosamente`, 'success');
    } catch (err: any) {
      console.error('Error editando usuario:', err);
      
      let errorMessage = 'Error al editar el usuario';
      
      if (err.message) {
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
      
      let errorMessage = 'Error al crear el usuario';
      
      if (err.message) {
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
      console.error('Error cambiando contraseña:', error);
      

      let errorMessage = 'Error al cambiar la contraseña';
      
      if (error.message) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else {
          errorMessage = error.message;
        }
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
        <div className="h-6"></div>

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
        variant={snackbarType}
        duration={3000}
      />
    </>
  );
} 