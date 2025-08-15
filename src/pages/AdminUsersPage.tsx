import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';
import type { AdminUser, CreateUserData, UpdateUserData } from '../services/api';

interface Usuario extends AdminUser {
  is_active: boolean; // Calculado basado en last_sign_in_at
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'user'>('todos');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

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
          is_active: !!user.last_sign_in_at, // Usuario activo si tiene último acceso
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
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
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
          u.id === editingUser.id 
            ? { ...updatedUser, is_active: !!updatedUser.last_sign_in_at }
            : u
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
        setUsuarios([...usuarios, { ...newUser, is_active: false }]);
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
        await apiService.deleteUser(id);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario. Intenta nuevamente.');
      }
    }
  };

  const handleUserEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  const handleUserToggleStatus = async (id: string) => {
    try {
      // Por ahora solo actualizamos el estado local
      // En el futuro se podría implementar un endpoint para activar/desactivar usuarios
      setUsuarios(usuarios.map(u => 
        u.id === id ? { ...u, is_active: !u.is_active } : u
      ));
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      alert('Error al cambiar el estado del usuario. Intenta nuevamente.');
    }
  };

  // Filtros
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = (usuario.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (usuario.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = filterRol === 'todos' || usuario.role === filterRol;
    const matchesEstado = filterEstado === 'todos' || 
                         (filterEstado === 'activo' && usuario.is_active) ||
                         (filterEstado === 'inactivo' && !usuario.is_active);

    return matchesSearch && matchesRol && matchesEstado;
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
        {/* Header transparente */}
        <div className="bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10 w-full">
          <div className="w-full py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="w-32 h-32 flex items-center justify-center">
                  <img 
                    src="/images/fondoblanco.png" 
                    alt="PrensAI Logo" 
                    className="w-28 h-28 object-contain"
                    onError={(e) => {
                      console.log('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    PrensAI
                  </h1>
                  <p className="text-white/80 text-sm font-medium">Gestión de Usuarios</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white drop-shadow-md">Bienvenido, {user?.username}</p>
                  <span className="inline-flex px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold border border-red-300/30">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full px-6 py-16 h-full">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-black/20 backdrop-blur-sm rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'usuarios'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              👥 Usuarios
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'roles'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              🛡️ Roles y Permisos
            </button>
          </div>

          {/* Contenido de Usuarios */}
          {activeTab === 'usuarios' && (
            <div className="space-y-6">
              {/* Header con botón agregar y filtros */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Gestión de Usuarios</h2>
                <button
                  onClick={() => setShowUserForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Agregar Usuario</span>
                </button>
              </div>

              {/* Filtros */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">🔍 Buscar</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, usuario o email..."
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">🎭 Rol</label>
                    <select
                      value={filterRol}
                      onChange={(e) => setFilterRol(e.target.value as 'todos' | 'admin' | 'user')}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="todos">Todos los roles</option>
                      <option value="admin">Administrador</option>
                      <option value="user">Usuario</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">📊 Estado</label>
                    <select
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value as 'todos' | 'activo' | 'inactivo')}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterRol('todos');
                        setFilterEstado('todos');
                      }}
                      className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                      🧹 Limpiar
                    </button>
                  </div>
                </div>
              </div>

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
                <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-black/20">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Usuario</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Rol</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Último Acceso</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-white/80 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredUsuarios.map((usuario) => (
                          <tr key={usuario.id} className="hover:bg-black/20 transition-colors duration-200">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  {usuario.first_name} {usuario.last_name}
                                </div>
                                <div className="text-sm text-white/70">@{usuario.username}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-white/90">{usuario.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getRolInfo(usuario.role).color}`}>
                                <span className="mr-1">{getRolInfo(usuario.role).icon}</span>
                                {getRolInfo(usuario.role).label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                                usuario.is_active 
                                  ? 'bg-green-500/20 text-green-400 border border-green-300/30' 
                                  : 'bg-red-500/20 text-red-400 border border-red-300/30'
                              }`}>
                                {usuario.is_active ? '✅ Activo' : '❌ Inactivo'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-white/70">
                                {usuario.last_sign_in_at ? usuario.last_sign_in_at : 'Nunca'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleUserEdit(usuario)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/20 rounded-lg"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleUserToggleStatus(usuario.id)}
                                  className={`transition-colors p-2 hover:bg-yellow-500/20 rounded-lg ${
                                    usuario.is_active 
                                      ? 'text-yellow-400 hover:text-yellow-300' 
                                      : 'text-green-400 hover:text-green-300'
                                  }`}
                                  title={usuario.is_active ? 'Desactivar' : 'Activar'}
                                >
                                  {usuario.is_active ? '⏸️' : '▶️'}
                                </button>
                                <button
                                  onClick={() => handleUserDelete(usuario.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded-lg"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
        {showUserForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingUser ? '✏️ Editar Usuario' : '➕ Agregar Usuario'}
              </h3>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      defaultValue={editingUser?.first_name}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      defaultValue={editingUser?.last_name}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                      placeholder="Apellido"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={editingUser?.username}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="usuario"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    placeholder="usuario@empresa.com"
                  />
                </div>
                                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Rol
                    </label>
                    <select
                      name="role"
                      defaultValue={editingUser?.role || 'user'}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="user">👤 Usuario</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                  </div>
                  
                  {/* Campos de contraseña solo para nuevos usuarios */}
                  {!editingUser && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Contraseña
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                          placeholder="Contraseña"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Confirmar Contraseña
                        </label>
                        <input
                          type="password"
                          name="password_confirmation"
                          required
                          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                          placeholder="Confirmar contraseña"
                        />
                      </div>
                    </>
                  )}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    ❌ Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingUser ? '💾 Actualizar' : '➕ Agregar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 