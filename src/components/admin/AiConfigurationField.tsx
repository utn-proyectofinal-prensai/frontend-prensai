import { useCallback, useEffect, useMemo, useState } from 'react';
import TagInput from '../common/TagInput';
import type { AiConfiguration, AiOption } from '../../services/api';

interface AiConfigurationFieldProps {
  configuration: AiConfiguration;
  onUpdate: (key: string, value: AiConfiguration['value']) => Promise<AiConfiguration>;
}

const MAX_ARRAY_ITEMS = 10;

type DraftValue = AiConfiguration['value'];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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
      return Boolean(value);
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
      return Boolean(value);
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

  useEffect(() => {
    setDraftValue(normalized);
    setStatus('idle');
    setFieldError(null);
    setIsDirty(false);
  }, [normalized]);

  const handleChange = useCallback(
    (value: DraftValue) => {
      setDraftValue(value);
      setIsDirty(!valuesAreEqual(value, normalized, configuration.value_type));
      setStatus('idle');
      setFieldError(null);
    },
    [configuration.value_type, normalized]
  );

  const handleSave = useCallback(async () => {
    if (!isDirty || status === 'saving') {
      return;
    }

    setStatus('saving');
    try {
      const payload = serializeValue(draftValue, configuration.value_type, configuration.options);
      await onUpdate(configuration.key, payload);
      setStatus('saved');
      setIsDirty(false);
    } catch (error) {
      setStatus('error');
      setFieldError(error instanceof Error ? error.message : 'No se pudo guardar el cambio.');
    }
  }, [configuration.key, configuration.options, configuration.value_type, draftValue, isDirty, onUpdate, status]);

  const handleReset = useCallback(() => {
    setDraftValue(normalized);
    setIsDirty(false);
    setStatus('idle');
    setFieldError(null);
  }, [normalized]);

  const renderField = () => {
    const baseInputClasses = 'w-full rounded-md border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30';

    switch (configuration.value_type) {
      case 'array':
        return (
          <TagInput
            value={Array.isArray(draftValue) ? draftValue : []}
            onChange={(tags) => handleChange(tags)}
            disabled={status === 'saving'}
            placeholder="Agregar palabra y presionar Enter"
            maxTags={MAX_ARRAY_ITEMS}
            helperText={`Máximo ${MAX_ARRAY_ITEMS} elementos`}
          />
        );
      case 'reference':
        if (configuration.options && configuration.options.length > 0) {
          return (
            <select
              value={draftValue == null ? '' : String(draftValue)}
              onChange={(event) => {
                const raw = event.target.value;
                const match = configuration.options?.find((option) => String(option.value) === raw);
                handleChange(match ? match.value : raw);
              }}
              className={baseInputClasses}
              disabled={status === 'saving'}
            >
              <option value="">Seleccionar una opción</option>
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
            type="text"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => handleChange(event.target.value)}
            className={baseInputClasses}
            placeholder="Ingrese el valor de referencia"
            disabled={status === 'saving'}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={draftValue == null ? '' : String(draftValue)}
            onChange={(event) => handleChange(event.target.value)}
            className={baseInputClasses}
            placeholder="Ingrese un valor numérico"
            disabled={status === 'saving'}
          />
        );
      case 'boolean':
        return (
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={draftValue === true}
              onChange={(event) => handleChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900/60 text-blue-600 focus:ring-blue-500"
              disabled={status === 'saving'}
            />
            <span>{draftValue === true ? 'Activado' : 'Desactivado'}</span>
          </label>
        );
      default:
        return (
          <input
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

  const statusInfo = useMemo(() => {
    if (status === 'saving') {
      return { label: 'Guardando…', tone: 'text-amber-200', accent: 'bg-amber-500/30' };
    }
    if (status === 'error') {
      return { label: fieldError ?? 'Error al guardar', tone: 'text-rose-200', accent: 'bg-rose-500/30' };
    }
    if (status === 'saved') {
      return { label: 'Cambios guardados', tone: 'text-emerald-200', accent: 'bg-emerald-500/30' };
    }
    if (isDirty) {
      return { label: 'Cambios pendientes', tone: 'text-amber-100', accent: 'bg-amber-500/20' };
    }
    return { label: 'Sin cambios', tone: 'text-slate-200', accent: 'bg-slate-600/30' };
  }, [fieldError, isDirty, status]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_-30px_rgba(8,47,73,0.45)] backdrop-blur">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white">{configuration.display_name}</h3>
        <p className="text-sm leading-6 text-white/70">{configuration.description}</p>
      </div>

      <div className="mt-6">{renderField()}</div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || status === 'saving'}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                !isDirty || status === 'saving'
                  ? 'bg-white/10 text-white/70'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {status === 'saving' ? 'Guardando…' : 'Guardar cambios'}
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                Deshacer
              </button>
            )}
          </div>

          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.accent} ${statusInfo.tone}`}>
            <span className="h-2 w-2 rounded-full bg-current"></span>
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
