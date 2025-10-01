import React, { useState } from 'react';
import type { Mention } from '../../services/api';
import { Button } from '../ui/button';

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Overlay de fondo semi-transparente */}
      <div 
        className="fixed inset-0 z-50 backdrop-blur-[2px]"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1), transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 204, 112, 0.1), transparent 50%),
            linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(59, 130, 246, 0.3) 25%, rgba(30, 64, 175, 0.3) 50%, rgba(30, 58, 138, 0.3) 75%, rgba(30, 64, 175, 0.3) 100%),
            rgba(0, 0, 0, 0.2)
          `,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <div 
          className="w-[600px] max-w-[90vw] max-h-[85vh] overflow-hidden bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 scale-100"
        >
          
          {/* Header del modal */}
          <div className="bg-black/30 border-b border-white/10" style={{ padding: '16px 24px' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">
                {isCreateMode ? 'Crear Nueva Mención' : 'Detalles de la Mención'}
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                icon="X"
                title="Cerrar"
              />
            </div>
          </div>

          {!isCreateMode && (
            <>
              {/* Header de la mención - Avatar y información básica */}
              <div className="flex items-center justify-center" style={{ padding: '12px 24px' }}>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-xl border-2 border-white/20">
                    <span className="text-white text-lg font-bold drop-shadow-lg">
                      👤
                    </span>
                  </div>
                  
                  <div className="flex flex-col" style={{ marginLeft: '32px' }}>
                    <h3 className="text-lg font-bold text-white/90 drop-shadow-lg mb-2">
                      {displayMention.name || 'Sin nombre'}
                    </h3>
                    <span 
                      className={`inline-flex items-center text-xs font-bold rounded-full border ${
                        displayMention.enabled 
                          ? 'text-green-400 border-green-400/30 bg-green-500/20' 
                          : 'text-red-400 border-red-400/30 bg-red-500/20'
                      }`}
                      style={{ padding: '4px 16px' }}
                    >
                      <span style={{ marginRight: '8px' }}>{displayMention.enabled ? '✅' : '❌'}</span>
                      {displayMention.enabled ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contenido del modal */}
          <div 
            className="overflow-y-auto max-h-[calc(85vh-280px)]" 
            style={{ 
              padding: '32px', 
              paddingTop: '16px', 
              paddingBottom: '24px', 
              paddingLeft: '32px', 
              paddingRight: '32px' 
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                rowGap: '24px'
              }}
            >

              {/* Nombre de la persona */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                  <div className="col-span-1 flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-base">👤</span>
                    </div>
                  </div>
                  <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                    <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Nombre</div>
                  </div>
                  <div className="col-span-8 flex items-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                        placeholder="Nombre completo de la persona"
                      />
                    ) : (
                      <div className="text-white/90 font-semibold text-sm">{displayMention.name || 'Sin nombre'}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                  <div className="col-span-1 flex justify-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="text-base">⚡</span>
                    </div>
                  </div>
                  <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                    <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Estado</div>
                  </div>
                  <div className="col-span-8 flex items-center">
                    {isEditing ? (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <select
                          value={editForm.enabled ? 'true' : 'false'}
                          onChange={(e) => handleInputChange('enabled', e.target.value === 'true')}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            paddingRight: '40px',
                            borderRadius: '12px',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backgroundColor: 'rgba(30, 41, 59, 0.8)',
                            backgroundImage: 'none',
                            backdropFilter: 'blur(10px)',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(34, 197, 94, 0.6)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="true" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                            ✅ Activa
                          </option>
                          <option value="false" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                            ❌ Inactiva
                          </option>
                        </select>
                        <div
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          ▼
                        </div>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        displayMention.enabled 
                          ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                          : 'bg-red-500/20 text-red-400 border-red-400/30'
                      }`}>
                        {displayMention.enabled ? '✅ Activa' : '❌ Inactiva'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isCreateMode && (
                <>
                  {/* Fecha de creación */}
                  <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                    <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                      <div className="col-span-1 flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-base">📅</span>
                        </div>
                      </div>
                      <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                        <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Creado</div>
                      </div>
                      <div className="col-span-8 flex items-center">
                        <div className="text-white/90 font-semibold text-sm">{formatDate(displayMention.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Fecha de modificación */}
                  <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl">
                    <div className="grid grid-cols-12 gap-4 items-center min-h-[48px]">
                      <div className="col-span-1 flex justify-center">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-base">✏️</span>
                        </div>
                      </div>
                      <div className="col-span-3" style={{ display: 'flex !important', alignItems: 'center !important', height: '100% !important' }}>
                        <div style={{ color: '#FFFFFF !important', fontWeight: '500 !important', fontSize: '14px !important', margin: '0 !important', padding: '0 !important' }}>Modificado</div>
                      </div>
                      <div className="col-span-8 flex items-center">
                        <div className="text-white/90 font-semibold text-sm">{formatDate(displayMention.updated_at)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Footer con botones de acción */}
          <div 
            className="bg-black/30 border-t border-white/10" 
            style={{ 
              padding: '32px',
              paddingTop: '24px', 
              paddingBottom: '24px', 
              paddingLeft: '32px', 
              paddingRight: '32px',
              flexShrink: 0
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                rowGap: '16px'
              }}
            >

              {/* Botones de editar/guardar y eliminar */}
              {(isEditing || isCreateMode) ? (
                <div 
                  className="grid grid-cols-2" 
                  style={{ 
                    gap: '16px',
                    columnGap: '16px'
                  }}
                >
                  <Button
                    onClick={() => {
                      if (isCreateMode) {
                        onClose();
                      } else {
                        // En modo edición, cerrar el modal completamente
                        onClose();
                      }
                    }}
                    variant="secondary"
                    size="default"
                    title={isCreateMode ? "Cancelar Creación" : "Cancelar Edición"}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="success"
                    size="default"
                    icon={isCreateMode ? "Plus" : "Save"}
                    title={isCreateMode ? "Crear Mención" : "Guardar Cambios"}
                  >
                    {isCreateMode ? 'Crear' : 'Guardar'}
                  </Button>
                </div>
              ) : !isCreateMode ? (
                <div 
                  className="grid grid-cols-2" 
                  style={{ 
                    gap: '24px',
                    columnGap: '24px'
                  }}
                >
                  <Button
                    onClick={handleDelete}
                    variant="danger"
                    size="default"
                    icon="Delete"
                    title="Eliminar Mención"
                  >
                    Eliminar
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="primary"
                    size="default"
                    icon="Edit"
                    title="Editar Mención"
                  >
                    Editar
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};