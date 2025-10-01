import { useState, useEffect } from 'react';
import { type NewsItem, type Topic, type Mention } from '../../services/api';
import { Button } from '../ui/button';

interface EditNewsModalProps {
  newsItem: NewsItem;
  topics: Topic[];
  mentions: Mention[];
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<NewsItem>) => void;
}

export function EditNewsModal({
  newsItem,
  topics,
  mentions,
  isOpen,
  isSaving,
  onClose,
  onSave
}: EditNewsModalProps) {
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedMentionIds, setSelectedMentionIds] = useState<number[]>([]);

  // Estilos consistentes para inputs
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginTop: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  };


  // Inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && newsItem) {
      setFormData({
        title: newsItem.title,
        date: newsItem.date,
        media: newsItem.media,
        publication_type: newsItem.publication_type,
        support: newsItem.support,
        section: newsItem.section,
        valuation: newsItem.valuation,
        political_factor: newsItem.political_factor,
        crisis: newsItem.crisis,
        author: newsItem.author,
        interviewee: newsItem.interviewee,
        audience_size: newsItem.audience_size,
        quotation: newsItem.quotation,
      });
      setSelectedTopicId(newsItem.topic?.id || null);
      setSelectedMentionIds(newsItem.mentions?.map(m => m.id) || []);
    }
  }, [isOpen, newsItem]);

  const handleInputChange = (field: keyof NewsItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTopicChange = (topicId: number | null) => {
    setSelectedTopicId(topicId);
  };

  const handleMentionToggle = (mentionId: number) => {
    setSelectedMentionIds(prev => 
      prev.includes(mentionId)
        ? prev.filter(id => id !== mentionId)
        : [...prev, mentionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Solución para el problema de zona horaria: enviar la fecha con offset
    let formattedDate = formData.date;
    if (formData.date) {
      // Crear la fecha en zona horaria local y agregar un día para compensar
      // el desfase que causa Rails al interpretar como UTC
      const [year, month, day] = formData.date.split('-');
      const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day) + 1);
      formattedDate = localDate.toISOString().split('T')[0];
    }
    
    const updatedData: Partial<NewsItem> = {
      title: formData.title,
      publication_type: formData.publication_type,
      date: formattedDate,
      support: formData.support,
      media: formData.media,
      section: formData.section,
      author: formData.author,
      interviewee: formData.interviewee,
      audience_size: formData.audience_size,
      quotation: formData.quotation,
      valuation: formData.valuation,
      political_factor: formData.political_factor,
      crisis: formData.crisis,
      topic: selectedTopicId ? topics.find(t => t.id === selectedTopicId) || null : null,
      mentions: mentions.filter(m => selectedMentionIds.includes(m.id))
    };
    
    onSave(updatedData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        <div 
          className="w-[600px] max-w-[90vw] max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-300 scale-100"
        >
          
          {/* Header del modal */}
          <div className="bg-slate-800/50 border-b border-white/10" style={{ padding: '16px 24px' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90 flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Noticia
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

          {/* Contenido del modal */}
          <div 
            className="overflow-y-auto max-h-[calc(95vh-280px)]" 
            style={{ 
              padding: '32px', 
              paddingTop: '16px', 
              paddingBottom: '0px', 
              paddingLeft: '32px', 
              paddingRight: '32px' 
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título - Ocupa toda la fila */}
              <div style={{ marginBottom: '16px' }}>
                <div className="text-sm font-medium text-white mb-2">Título</div>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>
              
              {/* Fecha */}
              <div style={{ marginBottom: '16px' }}>
                <div className="text-sm font-medium text-white mb-2">
                  Fecha
                </div>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              {/* Medio y Sección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Medio
                  </div>
                  <input
                    type="text"
                    value={formData.media || ''}
                    onChange={(e) => handleInputChange('media', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Sección
                  </div>
                  <input
                    type="text"
                    value={formData.section || ''}
                    onChange={(e) => handleInputChange('section', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              {/* Tipo y Soporte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Tipo
                  </div>
                  <select
                    value={formData.publication_type || ''}
                    onChange={(e) => handleInputChange('publication_type', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="noticia">Noticia</option>
                    <option value="articulo">Artículo</option>
                    <option value="entrevista">Entrevista</option>
                    <option value="opinion">Opinión</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Soporte
                  </div>
                  <select
                    value={formData.support || ''}
                    onChange={(e) => handleInputChange('support', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="">Seleccionar soporte</option>
                    <option value="web">Web</option>
                    <option value="impreso">Impreso</option>
                    <option value="digital">Digital</option>
                    <option value="radio">Radio</option>
                    <option value="tv">TV</option>
                  </select>
                </div>
              </div>

              {/* Valoración y Tema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Valoración
                  </div>
                  <select
                    value={formData.valuation || ''}
                    onChange={(e) => handleInputChange('valuation', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="">Seleccionar valoración</option>
                    <option value="positive">Positiva</option>
                    <option value="negative">Negativa</option>
                    <option value="neutral">Neutra</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Tema
                  </div>
                  <select
                    value={selectedTopicId || ''}
                    onChange={(e) => handleTopicChange(e.target.value ? Number(e.target.value) : null)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="">Seleccionar tema</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Menciones */}
              <div style={{ marginBottom: '16px' }}>
                <div className="text-sm font-medium text-white mb-2">
                  Menciones
                </div>
                <div className="max-h-32 overflow-y-auto border border-white/20 rounded-lg p-2 bg-white/5" style={{ minHeight: '48px', padding: '12px 16px' }}>
                  {mentions.map(mention => (
                    <div key={mention.id} className="flex items-center gap-2 cursor-pointer" style={{ color: '#FFFFFF !important' }}>
                      <input
                        type="checkbox"
                        checked={selectedMentionIds.includes(mention.id)}
                        onChange={() => handleMentionToggle(mention.id)}
                        className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                      />
                        <span className="text-sm text-white">{mention.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Autor y Entrevistado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Autor
                  </div>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Entrevistado
                  </div>
                  <input
                    type="text"
                    value={formData.interviewee || ''}
                    onChange={(e) => handleInputChange('interviewee', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              {/* Crisis y Factor Político */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Crisis
                  </div>
                  <select
                    value={formData.crisis ? 'SÍ' : 'NO'}
                    onChange={(e) => handleInputChange('crisis', e.target.value === 'SÍ')}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="NO">NO</option>
                    <option value="SÍ">SÍ</option>
                  </select>
                </div>

                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Factor Político
                  </div>
                  <select
                    value={formData.political_factor || ''}
                    onChange={(e) => handleInputChange('political_factor', e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  >
                    <option value="">Seleccionar</option>
                    <option value="SÍ">SÍ</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>

              {/* Audiencia y Presupuesto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Audiencia
                  </div>
                  <input
                    type="number"
                    value={formData.audience_size || ''}
                    onChange={(e) => handleInputChange('audience_size', e.target.value ? Number(e.target.value) : null)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <div className="text-sm font-medium text-white mb-2">
                    Presupuesto
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quotation || ''}
                    onChange={(e) => handleInputChange('quotation', e.target.value ? Number(e.target.value) : null)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

            </form>
          </div>

          {/* Footer con botones de acción fijos */}
          <div className="bg-slate-800/30 border-t border-white/10" style={{ padding: '20px 32px' }}>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                size="default"
                title="Cancelar"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                onClick={handleSubmit}
                variant="success"
                size="default"
                icon="Save"
                title="Guardar Cambios"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}