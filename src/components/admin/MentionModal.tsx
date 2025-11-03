import React, { useState } from 'react';
import type { Mention } from '../../services/api';
import { Button } from '../ui/button';
import { Modal, ModalFooter } from '../ui/modal';
import { Input } from '../ui/input';
import { Check, X } from 'lucide-react';

interface MentionModalProps {
  mention: Mention | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (mention: Mention) => void;
  onDelete: (id: number) => void;
  onCreateMention?: (mentionData: any) => void;
  initialEditMode?: boolean;
  isCreateMode?: boolean;
}

export const MentionModal: React.FC<MentionModalProps> = ({
  mention,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onCreateMention,
  initialEditMode = false,
  isCreateMode = false
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode || isCreateMode);
  const [editForm, setEditForm] = useState({
    name: '',
    enabled: true
  });

  // Inicializar formulario de edición
  React.useEffect(() => {
    if (isCreateMode) {
      // Modo creación: formulario vacío
      setEditForm({
        name: '',
        enabled: true
      });
    } else if (mention) {
      // Modo edición: cargar datos de la mención
      setEditForm({
        name: mention.name || '',
        enabled: mention.enabled
      });
    }
  }, [mention, isCreateMode]);

  // Actualizar modo de edición cuando cambie initialEditMode o isCreateMode
  React.useEffect(() => {
    setIsEditing(initialEditMode || isCreateMode);
  }, [initialEditMode, isCreateMode]);

  if (!isOpen || (!mention && !isCreateMode)) return null;

  // Datos de la mención para mostrar (con valores por defecto en modo creación)
  const displayMention = mention || {
    id: 0,
    name: '',
    enabled: true,
    created_at: '',
    updated_at: ''
  };

  const handleEdit = async () => {
    if (isEditing) {
      if (isCreateMode) {
        // Crear nueva mención
        if (onCreateMention) {
          onCreateMention(editForm);
          onClose();
        }
      } else {
        // Editar mención existente
        const updatedMention = {
          ...displayMention,
          ...editForm
        };
        await onEdit(updatedMention);
        onClose(); // Cerrar modal después de editar
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    onClose(); // Cerrar modal primero
    onDelete(displayMention.id); // Llamar a la función que mostrará el modal de confirmación
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  // Icono del modal
  const modalIcon = (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  );

  // Footer del modal
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
      ) : !isCreateMode ? (
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
      ) : null}
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreateMode ? 'Crear Nueva Mención' : 'Detalles de la Mención'}
      icon={modalIcon}
      footer={footer}
      size="default"
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
              placeholder="Nombre completo de la persona"
              required
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
                  <option value="true" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Activa</option>
                  <option value="false" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Inactiva</option>
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
            {/* Nombre (solo lectura) */}
            <div style={{ marginBottom: '16px' }}>
              <div className="text-sm font-medium text-white mb-2">Nombre</div>
              <div className="text-white/90 font-semibold text-sm">{displayMention.name || 'Sin nombre'}</div>
            </div>

            {/* Estado (solo lectura) */}
            <div style={{ marginBottom: '16px' }}>
              <div className="text-sm font-medium text-white mb-2">Estado</div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                displayMention.enabled 
                  ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                  : 'bg-red-500/20 text-red-400 border-red-400/30'
              }`}>
                <span className="mr-2">{displayMention.enabled ? '✅' : '❌'}</span>
                {displayMention.enabled ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};