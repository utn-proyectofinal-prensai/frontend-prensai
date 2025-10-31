import { useMemo } from 'react';
import TagInput from '../common/TagInput';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select } from '../ui/input';
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
            <div>
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
                  helperText="Actualizá el valor y recordá guardar los cambios."
                  size="default"
                  className="pr-10"
                />
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
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-4 py-3 outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15"
              placeholder="Ingresá el valor de referencia"
              disabled={disabled || isSaving}
              autoComplete="off"
              style={{ fontSize: '14px' }}
            />
            <p className="text-xs text-white/60">
              Actualizá el valor y recordá guardar los cambios.
            </p>
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
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white text-sm px-4 py-3 outline-none transition-all duration-300 placeholder:text-white/50 focus:border-blue-500/50 focus:bg-white/15"
              placeholder="Ingresá un valor"
              disabled={disabled || isSaving}
              autoComplete="off"
              style={{ fontSize: '14px' }}
            />
            <p className="text-xs text-white/60">
              Actualizá el valor y recordá guardar los cambios.
            </p>
          </div>
        );
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="relative overflow-hidden">
      {/* Indicador de guardado */}
      {isSaving && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-blue-400 text-xs">
          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Guardando...</span>
        </div>
      )}

      <CardHeader className="!px-8 !pt-6 !pb-3">
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold text-white !mb-3">
            {configuration.display_name}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-white/70 !mt-1.5">
            {configuration.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="!px-8 !pt-1 !pb-6">
        <div className="space-y-5">
          <label htmlFor={fieldId} className="sr-only">
            Campo de configuración
          </label>
          {renderField()}
        </div>
      </CardContent>
    </Card>
  );
}
