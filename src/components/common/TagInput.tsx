// TagInput.tsx (versión con variantes)
import {
  useCallback, useId, useMemo, useRef, useState,
  type ClipboardEvent, type KeyboardEvent,
} from "react";

interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  helperText?: string;
  inputId?: string;
  ariaLabel?: string;
  variant?: "dark" | "white";          // <-- NUEVO
}

const MAX_DEFAULT_TAGS = 10;
const SEPARATORS = /[\n,;\t]+/;

function normalizeTag(raw: string) { return raw.trim(); }

export default function TagInput({
  value,
  onChange,
  placeholder = "Añadir elementos",
  disabled = false,
  maxTags = MAX_DEFAULT_TAGS,
  helperText,
  inputId,
  ariaLabel,
  variant = "white",                     // <-- por defecto caja blanca
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const resolvedId = inputId ?? `${generatedId}-input`;
  const helperMessage = helperText ?? `Máximo ${maxTags} elementos. Escribí y presioná Enter o pegá una lista.`;
  const helperId = `${resolvedId}-help`;

  const hasReachedLimit = value.length >= maxTags;
  const remaining = useMemo(() => Math.max(maxTags - value.length, 0), [maxTags, value.length]);

  const emitChange = useCallback((next: string[]) => {
    onChange(next.slice(0, maxTags));
  }, [onChange, maxTags]);

  const addTag = useCallback((rawTag: string) => {
    if (disabled || hasReachedLimit) { setInputValue(""); return; }
    const tag = normalizeTag(rawTag);
    if (!tag) { setInputValue(""); return; }
    const exists = value.some((item) => item.toLowerCase() === tag.toLowerCase());
    if (exists) { setInputValue(""); return; }
    emitChange([...value, tag]);
    setInputValue("");
  }, [disabled, emitChange, hasReachedLimit, value]);

  const addFromBulk = useCallback((text: string) => {
    const parts = text.split(SEPARATORS).map(normalizeTag).filter(Boolean);
    if (!parts.length) return;
    // dedupe case-insensitive
    const lower = new Set(value.map(v => v.toLowerCase()));
    const next: string[] = [...value];
    for (const p of parts) {
      if (next.length >= maxTags) break;
      if (!lower.has(p.toLowerCase())) {
        next.push(p); lower.add(p.toLowerCase());
      }
    }
    emitChange(next);
    setInputValue("");
  }, [emitChange, maxTags, value]);

  const handleRemove = useCallback((tag: string) => {
    emitChange(value.filter((item) => item !== tag));
  }, [emitChange, value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      event.preventDefault(); addTag(inputValue); return;
    }
    if (event.key === "Backspace" && inputValue.length === 0 && value.length > 0) {
      event.preventDefault(); handleRemove(value[value.length - 1]);
    }
  };

  const handleBlur = () => { if (inputValue.trim()) addTag(inputValue); };
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (SEPARATORS.test(text)) { e.preventDefault(); addFromBulk(text); }
  };
  const focusInput = () => { inputRef.current?.focus(); };

  // ---------- CLASES POR VARIANTE ----------
  const styles = variant === "white"
    ? {
        wrapper: "rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm px-3 py-2 focus-within:ring-1 focus-within:ring-sky-400",
        chip: "bg-slate-100 text-slate-800 shadow-sm",
        closeBtn: "text-slate-500 hover:text-slate-800",
        input: "!bg-transparent !border-0 !shadow-none !ring-0 !outline-none appearance-none text-sm text-slate-900 placeholder:text-slate-400",
        helper: "text-xs text-slate-500",
        counter: "text-xs text-slate-500",
      }
    : {
        wrapper: "rounded-xl border border-white/25 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] px-3 py-2 focus-within:ring-2 focus-within:ring-sky-300/40",
        chip: "bg-sky-500/20 text-white shadow-sm shadow-sky-900/30",
        closeBtn: "text-white/80 hover:text-white hover:bg-sky-400/50 rounded-full px-1",
        input: "!bg-transparent !border-0 !shadow-none !ring-0 !outline-none appearance-none text-sm text-white placeholder:text-white/50",
        helper: "text-xs text-white/70",
        counter: "text-xs text-white/70",
      };

  return (
    <div className="space-y-2">
      <div
        role="group"
        aria-label={ariaLabel}
        className={`flex flex-wrap items-center gap-2 cursor-text ${styles.wrapper}`}
        onClick={focusInput}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles.chip}`}
          >
            <span className="truncate max-w-[300px]">{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className={styles.closeBtn}
              disabled={disabled}
              aria-label={`Eliminar ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        {/* input inline SIN borde ni fondo propio */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : undefined}
          id={resolvedId}
          aria-describedby={helperId}
          className={`min-w-[7.5rem] flex-1 ${styles.input} ${value.length === 0 ? "opacity-70" : "opacity-100"}`}
          disabled={disabled || hasReachedLimit}
          aria-label="Agregar elemento"
        />

        {/* contador a la derecha, dentro de la caja */}
        <span className={`ms-auto ${styles.counter}`}>{remaining} restantes</span>
      </div>

      <p id={helperId} className={styles.helper}>
        {helperMessage}
      </p>
    </div>
  );
}
