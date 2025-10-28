import React, { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { ClippingItem } from '../../services/api';

interface EditClippingModalProps {
  clipping: ClippingItem | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<ClippingItem>) => void;
}

export function EditClippingModal({
  clipping,
  isOpen,
  isSaving,
  onClose,
  onSave
}: EditClippingModalProps) {
  const [formData, setFormData] = useState({
    name: ''
  });

  // Inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && clipping) {
      setFormData({
        name: clipping.name || ''
      });
    }
  }, [isOpen, clipping]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      return;
    }

    onSave(formData);
  };

  const modalIcon = (
    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
  );

  const footer = (
    <ModalFooter>
      <Button
        onClick={onClose}
        variant="secondary"
        size="lg"
        disabled={isSaving}
      >
        Cancelar
      </Button>
      <Button
        onClick={handleSubmit}
        variant="success"
        size="lg"
        icon="Save"
        disabled={isSaving}
      >
        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Clipping"
      icon={modalIcon}
      size="sm"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del clipping */}
        <Input
          label="Nombre del Clipping"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          placeholder="Ingresa el nombre del clipping"
        />

        {/* Información adicional */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 pb-8 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-3 text-sm">Información importante:</p>
              <p className="text-blue-200/90 leading-relaxed text-sm">
                Para garantizar consistencia en los datos, solo puedes editar el nombre. 
                Si necesitas cambiar otros parámetros, genera un nuevo clipping.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EditClippingModal;
