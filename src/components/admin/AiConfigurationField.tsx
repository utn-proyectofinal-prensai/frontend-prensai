import { useMemo } from 'react';
import { FileText } from 'lucide-react';
import TagInput from '../common/TagInput';
import { Select } from '../ui/input';
import type { AiConfiguration } from '../../services/api';
import { MAX_ARRAY_ITEMS, type DraftValue } from '../../utils/aiConfigurations';
import '../../styles/upload-news.css';

export interface AiConfigurationFieldProps {
  configuration: AiConfiguration;
  value: DraftValue;
  onChange: (value: DraftValue) => void;
  isSaving?: boolean;
  disabled?: boolean;
}

export default function AiConfigurationField({
  configuration,
  value: draftValue,
  onChange,
  isSaving = false,
  disabled = false,
}: AiConfigurationFieldProps) {
  const fieldId = useMemo(() => `ai-config-${configuration.key}`, [configuration.key]);

  const renderField = () => {
    switch (configuration.value_type) {
      case 'array':
        return (
          <TagInput
            value={Array.isArray(draftValue) ? draftValue : []}
            onChange={(tags) => onChange(tags)}
            disabled={disabled || isSaving}
            maxTags={MAX_ARRAY_ITEMS}
            helperText={`Máximo ${MAX_ARRAY_ITEMS} elementos. Escribí y presioná Enter o pegá una lista.`}
            inputId={fieldId}
            ariaLabel={`Editor de elementos para ${configuration.display_name}`}
            variant="dark"
            className="text-sm"
          />
        );
      case 'reference':
        if (configuration.options && configuration.options.length > 0) {
          return (
            <div className="space-y-3">
              <div className="relative">
                <Select
                  id={fieldId}
                  value={draftValue == null ? '' : String(draftValue)}
                  onChange={(event) => {
                    const raw = event.target.value;
                    const match = configuration.options?.find((option) => String(option.value) === raw);
                    onChange(match ? match.value : raw);
                  }}
                  disabled={disabled || isSaving}
                  options={configuration.options.map((option) => ({
                    value: String(option.value),
                    label: option.label,
                  }))}
                  placeholder="Seleccioná una opción"
                  size="default"
                  className="pr-10"
                />
              </div>
              <div className="upload-news-tip" style={{ marginTop: '0.5rem', marginBottom: '0', marginLeft: '0', marginRight: '0', flex: 'none' }}>
                <p className="upload-news-tip-text flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <strong>Tip:</strong> Actualizá el valor y recordá guardar los cambios.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-3">
            <input
              id={fieldId}
              type="text"
              value={draftValue == null ? '' : String(draftValue)}
              onChange={(event) => onChange(event.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15"
              placeholder="Ingresá el valor de referencia"
              disabled={disabled || isSaving}
              autoComplete="off"
              style={{ fontSize: '14px', padding: '12px 16px' }}
            />
            <div className="upload-news-tip" style={{ marginTop: '0.5rem', marginBottom: '0', marginLeft: '0', marginRight: '0', flex: 'none' }}>
              <p className="upload-news-tip-text flex items-center justify-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <strong>Tip:</strong> Actualizá el valor y recordá guardar los cambios.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <input
              id={fieldId}
              type="text"
              value={draftValue == null ? '' : String(draftValue)}
              onChange={(event) => onChange(event.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15"
              placeholder="Ingresá un valor"
              disabled={disabled || isSaving}
              autoComplete="off"
              style={{ fontSize: '14px', padding: '12px 16px' }}
            />
            <div className="upload-news-tip" style={{ marginTop: '0.5rem', marginBottom: '0', marginLeft: '0', marginRight: '0', flex: 'none' }}>
              <p className="upload-news-tip-text flex items-center justify-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <strong>Tip:</strong> Actualizá el valor y recordá guardar los cambios.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="upload-news-panel relative" style={{ padding: '0.75rem', minHeight: 'auto' }}>
      {/* Indicador de guardado */}
      {isSaving && (
        <div className="absolute top-2 right-2 flex items-center gap-2 text-blue-400 text-xs z-10">
          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Guardando...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4" style={{ marginBottom: '0.75rem' }}>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-white/70 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-white">
            {configuration.display_name}
          </h3>
        </div>
        <p className="text-sm text-white/70 text-right flex-shrink-0">
          {configuration.description}
        </p>
      </div>

      {/* Contenido del campo */}
      <div className="space-y-2">
        <label htmlFor={fieldId} className="sr-only">
          Campo de configuración
        </label>
        {renderField()}
      </div>
    </div>
  );
}
