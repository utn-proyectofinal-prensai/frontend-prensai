import React from 'react';
import type { AdminUser } from '../../services/api';

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: AdminUser | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  editingUser,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl rounded-3xl border border-white/20 p-8 w-full max-w-2xl shadow-2xl">
        {/* Header del modal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">
                {editingUser ? '✏️' : '➕'}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </h3>
              <p className="text-white/70 text-lg">
                {editingUser ? 'Modifica la información del usuario' : 'Crea un nuevo usuario en el sistema'}
              </p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Usuario y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Rol */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
};
