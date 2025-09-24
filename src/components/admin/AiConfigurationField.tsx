import { useCallback, useEffect, useMemo, useState } from 'react';
import TagInput from '../common/TagInput';
import type { AiConfiguration, AiOption } from '../../services/api';

interface AiConfigurationFieldProps {
  configuration: AiConfiguration;
  onUpdate: (key: string, value: AiConfiguration['value']) => Promise<AiConfiguration>;
}

const MAX_ARRAY_ITEMS = 10;

type DraftValue = AiConfiguration['value'];
type SaveStatus = 'idle' | 'pending' | 'saving' | 'synced' | 'error';

function normalizeValue(config: AiConfiguration): DraftValue {
  const { value, value_type: valueType } = config;

  switch (valueType) {
    case 'array':
      if (Array.isArray(value)) {
        return value.map((item) => (item == null ? '' : String(item))).filter(Boolean).slice(0, MAX_ARRAY_ITEMS);
      }
      if (typeof value === 'string') {
        return value
          .split(/[\n,;,\t]/)
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, MAX_ARRAY_ITEMS);
      }
      return [];
    case 'reference':
      return value ?? null;
    case 'number':
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return value ?? null;
    case 'boolean':
      return value === true;
    default:
      return value == null ? '' : String(value);
  }
}

function valuesAreEqual(a: DraftValue, b: DraftValue, valueType: AiConfiguration['value_type']) {
  switch (valueType) {
    case 'array':
      if (!Array.isArray(a) || !Array.isArray(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      return a.every((item, index) => item === b[index]);
    case 'reference':
      if (a == null && b == null) {
        return true;
      }
      return String(a ?? '') === String(b ?? '');
    case 'number':
      if (a == null && b == null) {
        return true;
      }
      return Number(a ?? '') === Number(b ?? '');
    case 'boolean':
      return Boolean(a) === Boolean(b);
    default:
      return String(a ?? '') === String(b ?? '');
  }
}

function serializeValue(
  value: DraftValue,
  valueType: AiConfiguration['value_type'],
  options?: AiOption[]
): AiConfiguration['value'] {
  switch (valueType) {
    case 'array':
      return Array.isArray(value)
        ? value.map((item) => item.trim()).filter(Boolean).slice(0, MAX_ARRAY_ITEMS)
        : [];
    case 'reference': {
      if (value == null || value === '') {
        return null;
      }
      if (options && options.length > 0) {
        const match = options.find((option) => String(option.value) === String(value));
        if (match) {
          return match.value;
        }
      }
      return typeof value === 'number' || typeof value === 'boolean'
        ? value
        : isNaN(Number(value))
          ? String(value)
          : Number(value);
    }
    case 'number': {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
          return null;
        }
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return value ?? null;
    }
    case 'boolean':
      return value === true;
    default:
      return value == null ? '' : String(value);
  }
}

export default function AiConfigurationField({ configuration, onUpdate }: AiConfigurationFieldProps) {
  const normalized = useMemo(() => normalizeValue(configuration), [configuration]);
  const [draftValue, setDraftValue] = useState<DraftValue>(normalized);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fieldId = useMemo(() => `ai-config-${configuration.key}`, [configuration.key]);

  useEffect(() => {
    setDraftValue(normalized);
    setStatus('idle');
    setFieldError(null);
    setIsDirty(false);
  }, [normalized]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    setStatus('pending');

    const handler = setTimeout(async () => {
      setStatus('saving');
      try {
        const payload = serializeValue(draftValue, configuration.value_type, configuration.options);
        await onUpdate(configuration.key, payload);
        setStatus('synced');
        setIsDirty(false);
        setFieldError(null);
      } catch (error) {
        setStatus('error');
        setFieldError(error instanceof Error ? error.message : 'No se pudo guardar el cambio.');
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [draftValue, isDirty, configuration.key, configuration.options, configuration.value_type, onUpdate]);

  useEffect(() => {
    if (status !== 'synced') {
      return;
    }
    const timeout = setTimeout(() => {
      setStatus('idle');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  const handleChange = useCallback(
    (value: DraftValue) => {
      setDraftValue(value);
      const dirty = !valuesAreEqual(value, normalized, configuration.value_type);
      setIsDirty(dirty);
      setStatus(dirty ? 'pending' : 'idle');
      setFieldError(null);
    },
    [configuration.value_type, normalized]
  );

  const baseInputClasses =
    'h-10 w-full rounded-xl border border-white/25 bg-white/10 px-3 text-sm text-white placeholder:text-white/60 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300/40 backdrop-blur';

  const renderField = () => {
    switch (configuration.value_type) {
      case 'array':
        return (
          <TagInput
            value={Array.isArray(draftValue) ? draftValue : []}
            onChange={(tags) => handleChange(tags)}
            disabled={status === 'saving'}
            maxTags={MAX_ARRAY_ITEMS}
            helperText={`Máximo ${MAX_ARRAY_ITEMS} elementos. Escribí y presioná Enter o pegá una lista.`}
            inputId={fieldId}
            ariaLabel={`Editor de elementos para ${configuration.display_name}`}
          />
        );
      case 'reference':
        if (configuration.options && configuration.options.length > 0) {
          return (
            <select
              id={fieldId}
              value={draftValue == null ? '' : String(draftValue)}
              onChange={(event) => {
                const raw = event.target.value;
                const match = configuration.options?.find((option) => String(option.value) === raw);
                handleChange(match ? match.value : raw);
              }}
              className={baseInputClasses}
              disabled={status === 'saving'}
            >
              <option value="">Seleccioná una opción</option>
              {configuration.options.map((option) => (
                <option key={option.value} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            id={fieldId}
            type="text"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => handleChange(event.target.value)}
            className={baseInputClasses}
            placeholder="Ingresá el valor de referencia"
            disabled={status === 'saving'}
          />
        );
      case 'number':
        return (
          <input
            id={fieldId}
            type="number"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => handleChange(event.target.value)}
            className={baseInputClasses}
            placeholder="Ingresá un valor numérico"
            disabled={status === 'saving'}
          />
        );
      case 'boolean':
        return (
          <label htmlFor={fieldId} className="flex items-center gap-3 text-sm text-white/80">
            <input
              id={fieldId}
              type="checkbox"
              checked={draftValue === true}
              onChange={(event) => handleChange(event.target.checked)}
              className="h-4 w-4 rounded border-white/40 text-sky-300 focus:ring-sky-400"
              disabled={status === 'saving'}
            />
            <span>{draftValue === true ? 'Activado' : 'Desactivado'}</span>
          </label>
        );
      default:
        return (
          <input
            id={fieldId}
            type="text"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => handleChange(event.target.value)}
            className={baseInputClasses}
            placeholder="Ingresá un valor"
            disabled={status === 'saving'}
            autoComplete="off"
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
      case 'number':
        return 'Valor numérico';
      case 'boolean':
        return 'Estado';
      default:
        return 'Valor';
    }
  }, [configuration.value_type]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'pending':
      case 'saving':
        return 'Guardando…';
      case 'synced':
        return 'Sincronizado';
      case 'error':
        return 'Error al guardar';
      default:
        return 'Sin cambios';
    }
  }, [status]);

  const statusTone =
    status === 'error'
      ? 'text-rose-200'
      : status === 'synced'
        ? 'text-emerald-200'
        : status === 'pending' || status === 'saving'
          ? 'text-white/70'
          : 'text-white/60';

  return (
    <section className="rounded-3xl border border-white/15 bg-white/8 p-6 text-white shadow-[0_18px_45px_-25px_rgba(15,23,42,0.6)] backdrop-blur">
      <header className="space-y-1">
        <h3 className="text-xl font-semibold text-white">{configuration.display_name}</h3>
        <p className="text-sm leading-6 text-white/70">{configuration.description}</p>
      </header>

      <div className="mt-4 space-y-3">
        {configuration.value_type !== 'boolean' && (
          <label htmlFor={fieldId} className="sr-only">
            {labelText}
          </label>
        )}
        {renderField()}
      </div>

      {configuration.value_type !== 'array' && configuration.value_type !== 'boolean' && (
        <p className="mt-2 text-xs text-white/60">
          {configuration.value_type === 'reference'
            ? 'Seleccioná una opción disponible.'
            : 'Actualizá el valor y los cambios se guardan automáticamente.'}
        </p>
      )}

      <footer className="mt-5 flex items-center justify-end">
        <span className={`text-xs font-medium ${statusTone}`}>
          {status === 'error' && fieldError ? `${statusLabel}: ${fieldError}` : statusLabel}
        </span>
      </footer>
    </section>
  );
}
