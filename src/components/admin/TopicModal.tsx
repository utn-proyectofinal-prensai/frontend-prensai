import React, { useState } from 'react';
import type { Topic } from '../../services/api';
import { Button, Modal, ModalFooter, Input } from '../ui';
import { Check, X } from 'lucide-react';

interface TopicModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (topic: Topic) => void;
  onDelete: (id: number) => void;
  onCreateTopic?: (topicData: any) => void;
  initialEditMode?: boolean;
  isCreateMode?: boolean;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  topic,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onCreateTopic,
  initialEditMode = false,
  isCreateMode = false
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode || isCreateMode);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    enabled: true
  });

  // Inicializar formulario de edición
  React.useEffect(() => {
    if (isCreateMode) {
      // Modo creación: formulario vacío
      setEditForm({
        name: '',
        description: '',
        enabled: true
      });
    } else if (topic) {
      // Modo edición: cargar datos del tema
      setEditForm({
        name: topic.name || '',
        description: topic.description || '',
        enabled: topic.enabled
      });
    }
  }, [topic, isCreateMode]);

  // Actualizar modo de edición cuando cambie initialEditMode o isCreateMode
  React.useEffect(() => {
    setIsEditing(initialEditMode || isCreateMode);
  }, [initialEditMode, isCreateMode]);

  if (!isOpen || (!topic && !isCreateMode)) return null;

  // Datos del tema para mostrar (con valores por defecto en modo creación)
  const displayTopic = topic || {
    id: 0,
    name: '',
    description: '',
    enabled: true,
    crisis: false,
    created_at: '',
    updated_at: ''
  };

  const handleEdit = async () => {
    if (isEditing) {
      if (isCreateMode) {
        // Crear nuevo tema
        if (onCreateTopic) {
          onCreateTopic(editForm);
          onClose();
        }
      } else {
        // Editar tema existente
        const updatedTopic = {
          ...displayTopic,
          ...editForm
        };
        await onEdit(updatedTopic);
        onClose(); // Cerrar modal después de editar
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    onClose(); // Cerrar modal primero
    onDelete(displayTopic.id); // Llamar a la función que mostrará el modal de confirmación
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statusOptions = [
    { value: 'true', label: 'Activo', icon: Check },
    { value: 'false', label: 'Inactivo', icon: X }
  ];

  const modalIcon = (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );


  const footer = (
    <ModalFooter>
      {(isEditing || isCreateMode) ? (
        <>
          <Button
            onClick={onClose}
            variant="secondary"
            size="lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEdit}
            variant="success"
            size="lg"
            icon={isCreateMode ? "Plus" : "Save"}
          >
            {isCreateMode ? 'Crear' : 'Guardar'}
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={handleDelete}
            variant="danger"
            size="lg"
            icon="Delete"
          >
            Eliminar
          </Button>
          <Button
            onClick={handleEdit}
            variant="primary"
            size="lg"
            icon="Edit"
          >
            Editar
          </Button>
        </>
      )}
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreateMode ? 'Crear Nuevo Tema' : 'Detalles del Tema'}
      icon={modalIcon}
      size="default"
      footer={footer}
    >
      <div className="space-y-6" style={{ paddingBottom: '1rem' }}>
                    {isEditing ? (
          <>
            {/* Nombre */}
            <Input
              label="Nombre"
              type="text"
              value={editForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nombre del tema"
              required
            />

            {/* Descripción */}
            <Input
              label="Descripción"
              type="text"
              value={editForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del tema"
            />

            {/* Estado */}
            <div style={{ marginBottom: '2rem' }}>
              <div className="text-sm font-medium text-white mb-2">Estado</div>
              <div className="relative">
                <select
                  value={editForm.enabled ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('enabled', e.target.value === 'true')}
                  className="w-full"
                  style={{
                    padding: '12px 16px',
                    paddingLeft: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    appearance: 'none',
                    backgroundImage: 'none'
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* Icono del diseño del sistema */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {editForm.enabled ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Nombre */}
            <div style={{ marginBottom: '16px' }}>
              <div className="text-sm font-medium text-white mb-2">Nombre</div>
              <p className="text-white/80 text-sm">{displayTopic.name || 'Sin nombre'}</p>
                        </div>
            
            {/* Descripción */}
            <div style={{ marginBottom: '16px' }}>
              <div className="text-sm font-medium text-white mb-2">Descripción</div>
              <p className="text-white/80 text-sm">{displayTopic.description || 'Sin descripción'}</p>
                      </div>
            
            {/* Estado */}
            <div style={{ marginBottom: '16px' }}>
              <div className="text-sm font-medium text-white mb-2">Estado</div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        displayTopic.enabled 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {displayTopic.enabled ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </div>
                  </div>
                </>
              )}
      </div>
    </Modal>
  );
};