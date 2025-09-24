import type { AiConfiguration, AiOption } from '../services/api';

export const MAX_ARRAY_ITEMS = 10;

export type DraftValue = string | string[] | number | boolean | null;

export function normalizeValue(config: AiConfiguration): DraftValue {
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
      return (value ?? null) as DraftValue;
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

export function valuesAreEqual(a: DraftValue, b: DraftValue, valueType: AiConfiguration['value_type']) {
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

export function serializeValue(
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
