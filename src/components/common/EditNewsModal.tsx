import { useState, useEffect } from 'react';
import { type NewsItem, type Topic, type Mention } from '../../services/api';
import { Button, Modal, ModalFooter, Input, Select } from '../ui';

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

  const modalIcon = (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const footer = (
    <ModalFooter>
      <Button
        onClick={onClose}
        variant="secondary"
        size="lg"
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
      title="Editar Noticia"
      icon={modalIcon}
      size="lg"
      footer={footer}
    >

      <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título - Ocupa toda la fila */}
              <Input
                label="Título"
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
              
              {/* Fecha */}
              <Input
                label="Fecha"
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />

              {/* Medio y Sección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Medio"
                  type="text"
                  value={formData.media || ''}
                  onChange={(e) => handleInputChange('media', e.target.value)}
                />
                <Input
                  label="Sección"
                  type="text"
                  value={formData.section || ''}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                />
              </div>

              {/* Tipo y Soporte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Tipo"
                  value={formData.publication_type || ''}
                  onChange={(e) => handleInputChange('publication_type', e.target.value)}
                  options={[
                    { value: '', label: 'Seleccionar tipo' },
                    { value: 'noticia', label: 'Noticia' },
                    { value: 'articulo', label: 'Artículo' },
                    { value: 'entrevista', label: 'Entrevista' },
                    { value: 'opinion', label: 'Opinión' }
                  ]}
                />
                <Select
                  label="Soporte"
                  value={formData.support || ''}
                  onChange={(e) => handleInputChange('support', e.target.value)}
                  options={[
                    { value: '', label: 'Seleccionar soporte' },
                    { value: 'web', label: 'Web' },
                    { value: 'impreso', label: 'Impreso' },
                    { value: 'digital', label: 'Digital' },
                    { value: 'radio', label: 'Radio' },
                    { value: 'tv', label: 'TV' }
                  ]}
                />
              </div>

              {/* Valoración y Tema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Valoración"
                  value={formData.valuation || ''}
                  onChange={(e) => handleInputChange('valuation', e.target.value)}
                  options={[
                    { value: '', label: 'Seleccionar valoración' },
                    { value: 'positive', label: 'Positiva' },
                    { value: 'negative', label: 'Negativa' },
                    { value: 'neutral', label: 'Neutra' }
                  ]}
                />
                <Select
                  label="Tema"
                  value={selectedTopicId || ''}
                  onChange={(e) => handleTopicChange(e.target.value ? Number(e.target.value) : null)}
                  options={[
                    { value: '', label: 'Seleccionar tema' },
                    ...topics.map(topic => ({ value: topic.id.toString(), label: topic.name }))
                  ]}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Autor"
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                />
                <Input
                  label="Entrevistado"
                  type="text"
                  value={formData.interviewee || ''}
                  onChange={(e) => handleInputChange('interviewee', e.target.value)}
                />
              </div>

              {/* Crisis y Factor Político */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Crisis"
                  value={formData.crisis ? 'SÍ' : 'NO'}
                  onChange={(e) => handleInputChange('crisis', e.target.value === 'SÍ')}
                  options={[
                    { value: 'NO', label: 'NO' },
                    { value: 'SÍ', label: 'SÍ' }
                  ]}
                />
                <Select
                  label="Factor Político"
                  value={formData.political_factor || ''}
                  onChange={(e) => handleInputChange('political_factor', e.target.value)}
                  options={[
                    { value: '', label: 'Seleccionar' },
                    { value: 'SÍ', label: 'SÍ' },
                    { value: 'NO', label: 'NO' }
                  ]}
                />
              </div>

              {/* Audiencia y Presupuesto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Audiencia"
                  type="number"
                  value={formData.audience_size || ''}
                  onChange={(e) => handleInputChange('audience_size', e.target.value ? Number(e.target.value) : null)}
                />
                <Input
                  label="Presupuesto"
                  type="number"
                  step="0.01"
                  value={formData.quotation || ''}
                  onChange={(e) => handleInputChange('quotation', e.target.value ? Number(e.target.value) : null)}
                />
              </div>

            </form>
    </Modal>
  );
}