import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import type { AdminUser, CreateUserData, UpdateUserData } from '../services/api';
import {
  AdminUsersHeader,
  SearchFilters,
  UsersTable,
  UserFormModal,
  UserViewModal
} from '../components/admin';
import { UserDropdown } from '../components/common';

interface Usuario extends AdminUser {
  // Extendemos AdminUser sin campos adicionales
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  // Estados para Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para formularios
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [viewingUser, setViewingUser] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'user'>('todos');

  // Estado para el dropdown del usuario
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Referencia para el botón del usuario
  const userButtonRef = useRef<HTMLDivElement>(null);

  // Roles disponibles (coinciden con el backend)
  const roles = [
    { value: 'admin', label: 'Administrador', color: 'bg-red-500/20 text-red-400 border-red-300/30', icon: '👑' },
    { value: 'user', label: 'Usuario', color: 'bg-blue-500/20 text-blue-400 border-blue-300/30', icon: '👤' }
  ];

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
        const usuariosFormateados: Usuario[] = users.map(user => ({
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

        const { user: updatedUser } = await apiService.updateUser(editingUser.id, updateData);
        
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

  const handleUserDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        console.log('Intentando eliminar usuario con ID:', id);
        await apiService.deleteUser(id);
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

  const handleUserEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  const handleUserView = (usuario: Usuario) => {
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

  const getRolInfo = (rol: string) => {
    return roles.find(r => r.value === rol) || roles[2];
  };

  // Redirigir si no es admin
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="dashboard-container w-full h-screen relative overflow-x-hidden" style={{ backgroundColor: '#1e293b' }}>
      {/* Fondo que cubre TODA la pantalla */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen"
        style={{
          backgroundImage: `url('/images/fondodashboard.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}
      ></div>

      {/* Overlay muy sutil */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-black/5" 
        style={{ zIndex: 1 }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full">
        {/* Header moderno con gradiente */}
        <div className="bg-gradient-to-r from-slate-900/90 via-blue-900/70 to-indigo-900/90 backdrop-blur-xl shadow-2xl border-b border-white/20 w-full">
          <div className="w-full py-6 px-12">
            <div className="flex justify-between items-center">
              {/* Lado izquierdo: Navegación y logo */}
              <div className="flex items-center space-x-8">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white/80 hover:text-blue-300 transition-all duration-300 p-3 rounded-xl hover:bg-white/10 hover:shadow-lg"
                  title="Volver al Dashboard"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src="/images/fondoblanco.png" 
                    alt="PrensAI Logo" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      console.log('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                    PrensAI
                  </h1>
                  <p className="text-white/90 text-lg font-medium">Panel de Administración</p>
                </div>
              </div>
              
              {/* Lado derecho: Información del usuario */}
              <div className="flex items-center space-x-6 relative user-section">
                <div className="text-right mr-3">
                  <p className="text-sm font-semibold text-white drop-shadow-md mb-2">Bienvenido, {user?.username}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center px-8 py-4 text-sm font-bold rounded-full border border-red-300/30 bg-red-500/20 text-red-400">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="relative" ref={userButtonRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-white/20"
                  >
                    <span className="text-white text-xl font-bold drop-shadow-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </button>
                  <svg 
                    className={`absolute -bottom-2 -right-2 w-6 h-6 text-white bg-gray-800 rounded-full p-1.5 transition-all duration-300 shadow-lg border border-gray-700 ${isDropdownOpen ? 'rotate-180 scale-110' : 'hover:scale-110'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown del usuario */}
                <UserDropdown 
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  triggerRef={userButtonRef}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full px-12 py-6 h-full">
          {/* Contenido principal de gestión de usuarios */}
          <div className="w-full max-w-none">
            {/* Header con título y estadísticas */}
            <AdminUsersHeader
              onAddUser={() => setShowUserForm(true)}
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
              getRolInfo={getRolInfo}
              loading={loading}
              error={error}
            />
          </div>
        </div>

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

        {/* Modal para Ver Usuario */}
        <UserViewModal
          usuario={viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={handleUserEdit}
          onDelete={handleUserDelete}
          getRolInfo={getRolInfo}
        />
      </div>
    </div>
  );
} 