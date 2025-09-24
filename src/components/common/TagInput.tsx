import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';

interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  helperText?: string;
}

const MAX_DEFAULT_TAGS = 10;

function normalizeTag(raw: string) {
  return raw.trim();
}

const SEPARATORS = /[\n,;\t]+/;

export default function TagInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  maxTags = MAX_DEFAULT_TAGS,
  helperText,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasReachedLimit = value.length >= maxTags;

  const remaining = useMemo(() => Math.max(maxTags - value.length, 0), [maxTags, value.length]);

  const emitChange = useCallback(
    (next: string[]) => {
      onChange(next.slice(0, maxTags));
    },
    [onChange, maxTags]
  );

  const addTag = useCallback(
    (rawTag: string) => {
      if (disabled || hasReachedLimit) {
        setInputValue('');
        return;
      }

      const tag = normalizeTag(rawTag);
      if (!tag) {
        setInputValue('');
        return;
      }

      const exists = value.some((item) => item.toLowerCase() === tag.toLowerCase());
      if (exists) {
        setInputValue('');
        return;
      }

      emitChange([...value, tag]);
      setInputValue('');
    },
    [disabled, emitChange, hasReachedLimit, value]
  );

  const addFromBulk = useCallback(
    (text: string) => {
      const parts = text
        .split(SEPARATORS)
        .map((part) => normalizeTag(part))
        .filter(Boolean);

      if (parts.length === 0) {
        return;
      }

      const unique = new Set(value);
      parts.forEach((part) => {
        if (unique.size < maxTags) {
          unique.add(part);
        }
      });

      emitChange(Array.from(unique));
      setInputValue('');
    },
    [emitChange, maxTags, value]
  );

  const handleRemove = useCallback(
    (tag: string) => {
      const next = value.filter((item) => item !== tag);
      emitChange(next);
    },
    [emitChange, value]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
      event.preventDefault();
      addTag(inputValue);
      return;
    }

    if (event.key === 'Backspace' && inputValue.length === 0 && value.length > 0) {
      event.preventDefault();
      const last = value[value.length - 1];
      handleRemove(last);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text');
    if (SEPARATORS.test(text)) {
      event.preventDefault();
      addFromBulk(text);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <div
        className={`
          flex min-h-[3.5rem] flex-wrap items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 shadow-inner shadow-slate-950/20 transition-colors
          focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30
          ${disabled ? 'pointer-events-none opacity-60' : 'cursor-text'}
        `}
        onClick={focusInput}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-100 shadow-sm shadow-blue-900/30"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="rounded-full bg-blue-500/25 px-1.5 text-blue-200 transition-colors hover:bg-blue-500/40 hover:text-white"
              disabled={disabled}
              aria-label={`Eliminar ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        {!hasReachedLimit && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPaste={handlePaste}
            placeholder={value.length === 0 ? placeholder : 'Agregar otro elemento'}
            className="flex-1 min-w-[8rem] border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            disabled={disabled}
            aria-label="Agregar elemento"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{helperText ?? 'Presioná Enter o coma para agregar un elemento'}</span>
        <span>{remaining} restantes</span>
      </div>
    </div>
  );
}
