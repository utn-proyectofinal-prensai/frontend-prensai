import React from 'react';
import type { AdminUser } from '../../services/api';

interface UserViewModalProps {
  usuario: AdminUser | null;
  onClose: () => void;
  onEdit: (usuario: AdminUser) => void;
  onDelete: (id: string) => void;
  getRolInfo: (role: string) => { icon: string; label: string; color: string };
}

export const UserViewModal: React.FC<UserViewModalProps> = ({
  usuario,
  onClose,
  onEdit,
  onDelete,
  getRolInfo
}) => {
  if (!usuario) return null;

  const handleEdit = () => {
    onClose();
    onEdit(usuario);
  };

  const handleDelete = () => {
    onClose();
    onDelete(usuario.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-3xl border border-white/20 p-8 w-full max-w-2xl shadow-2xl">
        {/* Header del modal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">
                {usuario.first_name?.charAt(0) || usuario.username?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {usuario.first_name || 'Sin nombre'} {usuario.last_name || 'Sin apellido'}
              </h3>
              <p className="text-white/70 text-lg">@{usuario.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Información del usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Información Personal */}
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">👤</span> Información Personal
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">ID:</span>
                <span className="text-white font-mono">{usuario.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Nombre:</span>
                <span className="text-white">{usuario.first_name || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Apellido:</span>
                <span className="text-white">{usuario.last_name || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Username:</span>
                <span className="text-white">@{usuario.username}</span>
              </div>
            </div>
          </div>

          {/* Credenciales */}
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🔐</span> Credenciales
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Email:</span>
                <span className="text-white">{usuario.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Rol:</span>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full border ${getRolInfo(usuario.role).color}`}>
                  <span className="mr-1">{getRolInfo(usuario.role).icon}</span>
                  {getRolInfo(usuario.role).label}
                </span>
              </div>
              {usuario.allow_password_change && (
                <div className="flex justify-between">
                  <span className="text-white/60">Estado:</span>
                  <span className="inline-flex px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-300/30">
                    🔑 Cambio de contraseña pendiente
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Métricas de Actividad */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">📊</span> Métricas de Actividad
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{usuario.sign_in_count || 0}</div>
              <div className="text-white/60 text-sm">Total de Logins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {usuario.last_sign_in_at ? new Date(usuario.last_sign_in_at).toLocaleDateString('es-ES') : 'Nunca'}
              </div>
              <div className="text-white/60 text-sm">Último Acceso</div>
            </div>
            <div className="text-center">
              {usuario.current_sign_in_at ? (
                <div className="text-lg font-semibold text-green-400">🟢 Activa</div>
              ) : (
                <div className="text-lg font-semibold text-white/60">⚫ Inactiva</div>
              )}
              <div className="text-white/60 text-sm">Sesión</div>
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Información del Sistema
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Creado:</span>
                <span className="text-white">{usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('es-ES') : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Modificado:</span>
                <span className="text-white">{usuario.updated_at ? new Date(usuario.updated_at).toLocaleDateString('es-ES') : 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              {usuario.last_sign_in_ip && (
                <div className="flex justify-between">
                  <span className="text-white/60">IP Último Acceso:</span>
                  <span className="text-white font-mono text-sm">{usuario.last_sign_in_ip}</span>
                </div>
              )}
              {usuario.current_sign_in_ip && (
                <div className="flex justify-between">
                  <span className="text-white/60">IP Sesión Actual:</span>
                  <span className="text-white font-mono text-sm">{usuario.current_sign_in_ip}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Click en la fila de la tabla para ver detalles</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
