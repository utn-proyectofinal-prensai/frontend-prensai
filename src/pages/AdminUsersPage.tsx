import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_MESSAGES } from '../constants/messages';


interface Usuario {
  id: string;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'admin' | 'editor' | 'viewer';
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'roles'>('usuarios');
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verificar si hay autenticación de admin guardada en localStorage
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Estados para Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { 
      id: '1', 
      username: 'admin', 
      email: 'admin@prensai.com', 
      nombre: 'Administrador', 
      apellido: 'Sistema', 
      rol: 'admin', 
      activo: true, 
      fechaCreacion: '2024-01-01',
      ultimoAcceso: '2024-01-15'
    },
    { 
      id: '2', 
      username: 'editor1', 
      email: 'editor1@prensai.com', 
      nombre: 'María', 
      apellido: 'García', 
      rol: 'editor', 
      activo: true, 
      fechaCreacion: '2024-01-05',
      ultimoAcceso: '2024-01-14'
    },
    { 
      id: '3', 
      username: 'viewer1', 
      email: 'viewer1@prensai.com', 
      nombre: 'Carlos', 
      apellido: 'López', 
      rol: 'viewer', 
      activo: false, 
      fechaCreacion: '2024-01-10'
    },
  ]);

  // Estados para formularios
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'todos' | 'admin' | 'editor' | 'viewer'>('todos');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  // Roles disponibles
  const roles = [
    { value: 'admin', label: 'Administrador', color: 'bg-red-500/20 text-red-400 border-red-300/30' },
    { value: 'editor', label: 'Editor', color: 'bg-blue-500/20 text-blue-400 border-blue-300/30' },
    { value: 'viewer', label: 'Visualizador', color: 'bg-green-500/20 text-green-400 border-green-300/30' }
  ];

  // Funciones para Usuarios
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nuevoUsuario: Usuario = {
      id: editingUser?.id || Date.now().toString(),
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      rol: formData.get('rol') as 'admin' | 'editor' | 'viewer',
      activo: true,
      fechaCreacion: editingUser?.fechaCreacion || new Date().toISOString().split('T')[0],
      ultimoAcceso: editingUser?.ultimoAcceso
    };

    if (editingUser) {
      setUsuarios(usuarios.map(u => u.id === editingUser.id ? nuevoUsuario : u));
    } else {
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleUserDelete = (id: string) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  const handleUserEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowUserForm(true);
  };

  const handleUserToggleStatus = (id: string) => {
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  // Filtros
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRol = filterRol === 'todos' || usuario.rol === filterRol;
    const matchesEstado = filterEstado === 'todos' || 
                         (filterEstado === 'activo' && usuario.activo) ||
                         (filterEstado === 'inactivo' && !usuario.activo);

    return matchesSearch && matchesRol && matchesEstado;
  });

  const getRolInfo = (rol: string) => {
    return roles.find(r => r.value === rol) || roles[2];
  };

  // Funciones de autenticación de administrador
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // Simular autenticación de administrador
    setTimeout(() => {
      if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin123') {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');

        setLoginLoading(false);
      } else {
        setLoginError(ADMIN_MESSAGES.ERRORS.INVALID_CREDENTIALS);
        setLoginLoading(false);
      }
    }, 1000);
  };

  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (loginError) setLoginError('');
  };

  // Mostrar modal de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
              Administración de Usuarios
            </h3>
            <p className="text-gray-600 text-sm">Ingresa tus credenciales de administrador</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="admin-username" className="block text-sm font-semibold text-gray-700">
                Usuario Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="admin-username"
                  name="username"
                  value={adminCredentials.username}
                  onChange={handleAdminInputChange}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="admin-password"
                  name="password"
                  value={adminCredentials.password}
                  onChange={handleAdminInputChange}
                  placeholder="Ingresa la contraseña de administrador"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{loginError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Volver al Login
              </button>
              <button
                type="submit"
                disabled={loginLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <span>Acceder</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
                  <p className="text-white/80 text-sm font-medium">Administración de usuarios</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">
                      A
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white drop-shadow-md">Administrador</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem('adminAuthenticated');
                    navigate('/login');
                  }}
                  className="bg-red-600/40 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600/50 border border-red-300/30 hover:border-red-300/50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  <span className="text-white font-semibold">Cerrar sesión</span>
                </button>
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
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'roles'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Roles y Permisos
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
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  + Agregar Usuario
                </button>
              </div>

              {/* Filtros */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Buscar</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, usuario o email..."
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Rol</label>
                    <select
                      value={filterRol}
                      onChange={(e) => setFilterRol(e.target.value as 'todos' | 'admin' | 'editor' | 'viewer')}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="todos">Todos los roles</option>
                      <option value="admin">Administrador</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Visualizador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Estado</label>
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
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de usuarios */}
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
                              <div className="text-sm font-semibold text-white">{usuario.nombre} {usuario.apellido}</div>
                              <div className="text-sm text-white/70">@{usuario.username}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white/90">{usuario.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getRolInfo(usuario.rol).color}`}>
                              {getRolInfo(usuario.rol).label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                              usuario.activo 
                                ? 'bg-green-500/20 text-green-400 border border-green-300/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-300/30'
                            }`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white/70">
                              {usuario.ultimoAcceso ? usuario.ultimoAcceso : 'Nunca'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleUserEdit(usuario)}
                                className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleUserToggleStatus(usuario.id)}
                                className={`transition-colors p-1 ${
                                  usuario.activo 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-green-400 hover:text-green-300'
                                }`}
                                title={usuario.activo ? 'Desactivar' : 'Activar'}
                              >
                                {usuario.activo ? '⏸️' : '▶️'}
                              </button>
                              <button
                                onClick={() => handleUserDelete(usuario.id)}
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
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
            </div>
          )}

          {/* Contenido de Roles */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-white mb-6">Roles y Permisos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {roles.map((rol) => (
                    <div key={rol.value} className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{rol.label}</h4>
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${rol.color}`}>
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
                              <li>• Gestión completa de usuarios</li>
                              <li>• Acceso a todas las funcionalidades</li>
                              <li>• Configuración del sistema</li>
                            </>
                          )}
                          {rol.value === 'editor' && (
                            <>
                              <li>• Subir y procesar noticias</li>
                              <li>• Crear clippings</li>
                              <li>• Ver histórico</li>
                            </>
                          )}
                          {rol.value === 'viewer' && (
                            <>
                              <li>• Ver dashboard</li>
                              <li>• Consultar histórico</li>
                              <li>• Acceso de solo lectura</li>
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
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
              </h3>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingUser?.nombre}
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
                      name="apellido"
                      defaultValue={editingUser?.apellido}
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
                    name="rol"
                    defaultValue={editingUser?.rol || 'viewer'}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="viewer">Visualizador</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingUser ? 'Actualizar' : 'Agregar'}
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