import { useState, useEffect } from 'react';
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

interface Usuario extends AdminUser {
  // Extendemos AdminUser sin campos adicionales
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'roles'>('usuarios');
  
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


  // Roles disponibles (coinciden con el backend)
  const roles = [
    { value: 'admin', label: 'Administrador', color: 'bg-red-500/20 text-red-400 border-red-300/30', icon: '👑' },
    { value: 'user', label: 'Usuario', color: 'bg-blue-500/20 text-blue-400 border-blue-300/30', icon: '👤' }
  ];

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
          <div className="w-full py-6 px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white/80 hover:text-blue-300 transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="w-24 h-24 flex items-center justify-center">
                  <img 
                    src="/images/fondoblanco.png" 
                    alt="PrensAI Logo" 
                    className="w-20 h-20 object-contain"
                    onError={(e) => {
                      console.log('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                    PrensAI
                  </h1>
                  <p className="text-white/90 text-lg font-medium">Panel de Administración</p>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium border border-white/20">
                      🚀 Sistema Activo
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-300/30">
                      {usuarios.length} Usuarios
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white/80">Administrador</p>
                  <p className="text-lg font-bold text-white">{user?.username}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span className="text-white text-lg font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full px-6 py-16 h-full">
          {/* Tabs modernos */}
          <div className="flex space-x-2 mb-8 bg-black/30 backdrop-blur-xl rounded-2xl p-2 w-fit border border-white/20 shadow-xl">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                activeTab === 'usuarios'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl">👥</span>
              <span>Usuarios</span>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                activeTab === 'roles'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl">🛡️</span>
              <span>Roles y Permisos</span>
            </button>
          </div>

          {/* Contenido de Usuarios */}
          {activeTab === 'usuarios' && (
            <div className="space-y-6">
              {/* Header con botón agregar y filtros */}
              <AdminUsersHeader
                onAddUser={() => setShowUserForm(true)}
              />

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
              />

              {/* Lista de usuarios */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white/80">Cargando usuarios...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 mb-4">⚠️</div>
                  <p className="text-white/80 mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <UsersTable
                  usuarios={filteredUsuarios}
                  onViewUser={handleUserView}
                  onEditUser={handleUserEdit}
                  onDeleteUser={handleUserDelete}
                  getRolInfo={getRolInfo}
                />
              )}
            </div>
          )}

          {/* Contenido de Roles */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-white mb-6">Roles y Permisos del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {roles.map((rol) => (
                    <div key={rol.value} className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-black/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{rol.label}</h4>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${rol.color}`}>
                          <span className="mr-1">{rol.icon}</span>
                          {rol.value}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-white/80">
                          <strong>Permisos:</strong>
                        </div>
                        <ul className="text-sm text-white/70 space-y-1">
                          {rol.value === 'admin' && (
                            <>
                              <li>• 👑 Gestión completa de usuarios</li>
                              <li>• ⚙️ Acceso a todas las funcionalidades</li>
                              <li>• 🔧 Configuración del sistema</li>
                              <li>• 📊 Analytics avanzados</li>
                              <li>• 🎯 Gestión de eventos y temas</li>
                            </>
                          )}
                          {rol.value === 'user' && (
                            <>
                              <li>• 📤 Subir y procesar noticias</li>
                              <li>• ✂️ Crear clippings</li>
                              <li>• 📚 Ver histórico completo</li>
                              <li>• 📈 Acceso a métricas básicas</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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