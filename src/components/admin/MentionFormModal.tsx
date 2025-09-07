import React from 'react';
import type { Mention } from '../../services/api';

interface MentionFormModalProps {
  isOpen: boolean;
  editingMention: Mention | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export const MentionFormModal: React.FC<MentionFormModalProps> = ({
  isOpen,
  editingMention,
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">
                {editingMention ? '✏️' : '👤'}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {editingMention ? 'Editar Mención' : 'Agregar Nueva Mención'}
              </h3>
              <p className="text-white/70 text-lg">
                {editingMention ? 'Modifica la información de la mención' : 'Agrega una nueva persona para monitorear'}
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
          {/* Nombre de la persona */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Nombre completo de la persona
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={editingMention?.name}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
              placeholder="Ej: Juan Pérez, María González, Dr. Carlos López..."
            />
            <p className="text-white/60 text-xs mt-1">
              Este nombre se buscará <strong>exactamente</strong> en todas las noticias procesadas, tal como lo escribas aquí
            </p>
          </div>

          {/* Estado activo/inactivo */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">
              Estado de la Mención
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="enabled"
                  value="true"
                  defaultChecked={editingMention?.enabled !== false}
                  className="w-4 h-4 text-green-600 bg-black/30 border-white/20 focus:ring-green-500"
                />
                <span className="text-white flex items-center space-x-2">
                  <span>✅</span>
                  <span>Activa</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="enabled"
                  value="false"
                  defaultChecked={editingMention?.enabled === false}
                  className="w-4 h-4 text-green-600 bg-black/30 border-white/20 focus:ring-green-500"
                />
                <span className="text-white flex items-center space-x-2">
                  <span>❌</span>
                  <span>Inactiva</span>
                </span>
              </label>
            </div>
            <p className="text-white/60 text-xs mt-1">
              Las menciones inactivas no se buscarán en las noticias nuevas
            </p>
          </div>

          {/* Información sobre el monitoreo */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-green-300 font-medium text-sm mb-1">🔍 Cómo funciona el monitoreo</h4>
                <ul className="text-green-200/80 text-xs space-y-1">
                  <li>• El sistema busca menciones exactas del nombre en las noticias</li>
                  <li>• Se busca en títulos, contenido y campos de mención</li>
                  <li>• Las búsquedas son sensibles a mayúsculas y minúsculas</li>
                  <li>• Puedes usar nombres completos o apellidos únicos</li>
                  <li>• Las menciones inactivas no aparecen en reportes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Consejos adicionales */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-blue-300 font-medium text-sm mb-1">💡 Consejos para menciones efectivas</h4>
                <ul className="text-blue-200/80 text-xs space-y-1">
                  <li>• Usa el nombre completo más común de la persona</li>
                  <li>• Considera crear variantes para nombres muy conocidos</li>
                  <li>• Para políticos, usa el nombre usado en medios</li>
                  <li>• Evita abreviaciones a menos que sean muy comunes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
            >
              <span>❌</span>
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>{editingMention ? '💾' : '👤'}</span>
              <span>{editingMention ? 'Actualizar Mención' : 'Crear Mención'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
