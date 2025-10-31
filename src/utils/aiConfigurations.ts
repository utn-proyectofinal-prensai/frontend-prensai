import type { AiConfiguration, AiOption } from '../services/api';

export const MAX_ARRAY_ITEMS = 10;

export type DraftValue = string | string[] | number | null;

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
          // El backend espera un Integer para reference
          return typeof match.value === 'number' ? match.value : Number(match.value);
        }
      }
      // Intentar convertir a número si es posible
      const numValue = Number(value);
      return isNaN(numValue) ? null : numValue;
    }
    default:
      return value == null ? '' : String(value);
  }
}
