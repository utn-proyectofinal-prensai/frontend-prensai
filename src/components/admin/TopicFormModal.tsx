import React from 'react';
import type { Topic } from '../../services/api';

interface TopicFormModalProps {
  isOpen: boolean;
  editingTopic: Topic | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export const TopicFormModal: React.FC<TopicFormModalProps> = ({
  isOpen,
  editingTopic,
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-bold">
                {editingTopic ? '✏️' : '📝'}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {editingTopic ? 'Editar Tema' : 'Agregar Nuevo Tema'}
              </h3>
              <p className="text-white/70 text-lg">
                {editingTopic ? 'Modifica la información del tema' : 'Crea un nuevo tema para monitorear'}
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
          {/* Nombre del tema */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Nombre del Tema
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={editingTopic?.name}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
              placeholder="Ej: Elecciones 2024, Política, Economía..."
            />
            <p className="text-white/60 text-xs mt-1">
              El sistema intentará asociar las noticias a alguno de los temas cargados. <strong>SE RECOMIENDA REVISIÓN POSTERIOR.</strong>
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              defaultValue={editingTopic?.description}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Descripción detallada del tema y qué tipo de noticias incluye..."
            />
            <p className="text-white/60 text-xs mt-1">
              Una descripción clara ayuda a entender mejor el alcance del tema
            </p>
          </div>

          {/* Estado y configuración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado activo/inactivo */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">
                Estado del Tema
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="enabled"
                    value="true"
                    defaultChecked={editingTopic?.enabled !== false}
                    className="w-4 h-4 text-blue-600 bg-black/30 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-white flex items-center space-x-2">
                    <span>✅</span>
                    <span>Activo</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="enabled"
                    value="false"
                    defaultChecked={editingTopic?.enabled === false}
                    className="w-4 h-4 text-blue-600 bg-black/30 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-white flex items-center space-x-2">
                    <span>❌</span>
                    <span>Inactivo</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Marcador de crisis - Temporalmente deshabilitado */}
            <div className="opacity-50">
              <label className="block text-white/80 text-sm font-medium mb-3">
                Marcador de Crisis
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="crisis"
                    value="false"
                    defaultChecked={true}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-black/30 border-white/20"
                  />
                  <span className="text-white">Normal</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="crisis"
                    value="true"
                    disabled
                    className="w-4 h-4 text-red-600 bg-black/30 border-white/20"
                  />
                  <span className="text-white flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Crisis</span>
                  </span>
                </label>
              </div>
              <p className="text-white/60 text-xs mt-1">
                Funcionalidad no disponible en esta versión
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-blue-300 font-medium text-sm mb-1">💡 Consejos para crear temas efectivos</h4>
                <ul className="text-blue-200/80 text-xs space-y-1">
                  <li>• Usa nombres específicos y descriptivos</li>
                  <li>• Evita temas demasiado amplios o genéricos</li>
                  <li>• Considera el contexto temporal (ej: "Elecciones 2024")</li>
                  <li>• Los temas inactivos no aparecerán en la selección</li>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>{editingTopic ? '💾' : '📝'}</span>
              <span>{editingTopic ? 'Actualizar Tema' : 'Crear Tema'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
