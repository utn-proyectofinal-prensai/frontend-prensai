import { useMemo } from 'react';
import TagInput from '../common/TagInput';
import type { AiConfiguration } from '../../services/api';
import { MAX_ARRAY_ITEMS, type DraftValue } from '../../utils/aiConfigurations';

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

  const baseInputClasses =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300/40 transition-colors h-12';

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
            variant="white"
            className="text-sm"
          />
        );
      case 'reference':
        if (configuration.options && configuration.options.length > 0) {
          return (
            <div className="relative w-full">
              <select
                id={fieldId}
                value={draftValue == null ? '' : String(draftValue)}
                onChange={(event) => {
                  const raw = event.target.value;
                  const match = configuration.options?.find((option) => String(option.value) === raw);
                  onChange(match ? match.value : raw);
                }}
                className={`${baseInputClasses} appearance-none pr-10 cursor-pointer text-sm`}
                disabled={disabled || isSaving}
                style={{ fontSize: '14px' }}
              >
                <option value="" style={{ fontSize: '14px' }}>Seleccioná una opción</option>
                {configuration.options.map((option) => (
                  <option key={option.value} value={String(option.value)} style={{ fontSize: '14px' }}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          );
        }
        return (
          <input
            id={fieldId}
            type="text"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => onChange(event.target.value)}
            className={`${baseInputClasses} text-sm`}
            placeholder="Ingresá el valor de referencia"
            disabled={disabled || isSaving}
            autoComplete="off"
            style={{ fontSize: '14px' }}
          />
        );
      default:
        return (
          <input
            id={fieldId}
            type="text"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => onChange(event.target.value)}
            className={`${baseInputClasses} text-sm`}
            placeholder="Ingresá un valor"
            disabled={disabled || isSaving}
            autoComplete="off"
            style={{ fontSize: '14px' }}
          />
        );
    }
  };

  const labelText = useMemo(() => {
    switch (configuration.value_type) {
      case 'array':
        return 'Elementos';
      case 'reference':
        return 'Seleccioná una opción';
      default:
        return 'Valor';
    }
  }, [configuration.value_type]);


  return (
    <section className="rounded-3xl border border-white/15 bg-white/8 p-6 text-white shadow-[0_18px_45px_-25px_rgba(15,23,42,0.6)] backdrop-blur">
      <header className="space-y-1">
        <h3 className="text-xl font-semibold text-white">{configuration.display_name}</h3>
        <p className="text-sm leading-6 text-white/70">{configuration.description}</p>
      </header>

      <div className="mt-4 space-y-3">
        <label htmlFor={fieldId} className="sr-only">
          {labelText}
        </label>
        {renderField()}
      </div>

      {configuration.value_type !== 'array' && (
        <p className="mt-2 text-xs text-white/60">
          {configuration.value_type === 'reference'
            ? 'Seleccioná una opción disponible y recordá guardar los cambios.'
            : 'Actualizá el valor y recordá guardar los cambios.'}
        </p>
      )}

    </section>
  );
}
