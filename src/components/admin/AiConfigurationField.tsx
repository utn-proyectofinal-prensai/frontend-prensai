import React, { useState, useEffect, useRef } from 'react';
import type { AiConfiguration, AiOption } from '../../services/api';

interface AiConfigurationFieldProps {
  configuration: AiConfiguration;
  onUpdate: (key: string, value: string | string[], enabled: boolean) => Promise<boolean>;
  isUpdating: boolean;
}

const AiConfigurationField: React.FC<AiConfigurationFieldProps> = ({
  configuration,
  onUpdate,
  isUpdating
}) => {
  const [value, setValue] = useState<string | string[] | number>(
    Array.isArray(configuration.value) ? configuration.value : (configuration.value as string | number | undefined) ?? ''
  );
  const [chips, setChips] = useState<string[]>([]);
  const [newChip, setNewChip] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'synced' | 'error'>('idle');
  const chipInputRef = useRef<HTMLInputElement>(null);

  // Initialize chips for array types (backend might send string or string[])
  useEffect(() => {
    if (configuration.value_type === 'array') {
      const rawValue: unknown = (configuration as unknown as { value: unknown }).value;

      let initialChips: string[] = [];
      if (Array.isArray(rawValue)) {
        initialChips = rawValue
          .map((item) => (item == null ? '' : String(item).trim()))
          .filter((item) => item.length > 0);
      } else if (typeof rawValue === 'string') {
        initialChips = rawValue
          .split(/[\n,;\t,]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      } else if (rawValue != null) {
        initialChips = String(rawValue)
          .split(/[\n,;\t,]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      setChips(initialChips);
      setValue(initialChips);
    } else {
      // For non-array types, normalize to string once
      const rawValue: unknown = (configuration as unknown as { value: unknown }).value;
      setValue(rawValue == null ? '' : String(rawValue));
    }
  }, [configuration]);

  // Auto-save with debounce 600ms
  useEffect(() => {
    if (hasChanges) {
      setSavingState('saving');
      const timeoutId = setTimeout(async () => {
        const ok = await onUpdate(
          configuration.key,
          Array.isArray(value) ? value : (configuration.value_type === 'reference' ? value as number | string : String(value)),
          configuration.enabled
        );
        setHasChanges(false);
        setSavingState(ok ? 'synced' : 'error');
      }, 600);

      return () => clearTimeout(timeoutId);
    }
  }, [hasChanges, value, configuration.key, configuration.enabled, onUpdate]);

  const handleValueChange = (newValue: string | string[] | number) => {
    setValue(newValue);
    const previous = Array.isArray(configuration.value) ? configuration.value.join(',') : String(configuration.value ?? '');
    const current = Array.isArray(newValue) ? newValue.join(',') : String(newValue ?? '');
    setHasChanges(previous !== current);
  };

  const handleAddChip = () => {
    if (newChip.trim() && !chips.includes(newChip.trim())) {
      const updatedChips = [...chips, newChip.trim()];
      setChips(updatedChips);
      setNewChip('');
      const newValue: string[] = updatedChips;
      setValue(newValue);
      const previous = Array.isArray(configuration.value) ? configuration.value.join(',') : String(configuration.value ?? '');
      setHasChanges(previous !== newValue.join(','));
    }
  };

  const handleRemoveChip = (chipToRemove: string) => {
    const updatedChips = chips.filter(chip => chip !== chipToRemove);
    setChips(updatedChips);
    const newValue: string[] = updatedChips;
    setValue(newValue);
    const previous = Array.isArray(configuration.value) ? configuration.value.join(',') : String(configuration.value ?? '');
    setHasChanges(previous !== newValue.join(','));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddChip();
    }
  };

  // Helpers for modern token input UX
  const focusChipInput = () => {
    chipInputRef.current?.focus();
  };

  const handleKeyDownChips = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Create chip on comma, Enter or Tab
    if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && newChip.trim()) {
      e.preventDefault();
      handleAddChip();
      return;
    }

    // Remove last chip with Backspace when input is empty
    if (e.key === 'Backspace' && !newChip && chips.length > 0) {
      const last = chips[chips.length - 1];
      handleRemoveChip(last);
    }
  };

  const addChipsFromString = (raw: string) => {
    const parts = raw
      .split(/[\n,;\t]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (parts.length === 0) return;
    const set = new Set(chips);
    parts.forEach((p) => set.add(p));
    const updated = Array.from(set);
    setChips(updated);
    setValue(updated);
    const previous = Array.isArray(configuration.value) ? configuration.value.join(',') : String(configuration.value ?? '');
    setHasChanges(previous !== updated.join(','));
  };

  const handlePasteChips = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',') || text.includes('\n') || text.includes('\t') || text.includes(';')) {
      e.preventDefault();
      addChipsFromString(text);
    }
  };

  const renderField = () => {
    const baseClasses = "ai-input w-full px-4 py-3 bg-black/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm";
    
    switch (configuration.value_type) {
      case 'array':
        return (
          <div
            className="min-h-[44px] w-full bg-white border border-gray-300 rounded-lg text-gray-900 flex items-center flex-wrap gap-1.5 px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 shadow-sm"
            onClick={focusChipInput}
            role="textbox"
            aria-label="Lista de elementos"
          >
            {chips.map((chip, index) => (
              <div
                key={`${chip}-${index}`}
                className="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-300 rounded-full text-gray-800 text-xs font-medium hover:bg-gray-200 transition-all duration-150 group"
              >
                <span className="mr-1.5">{chip}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChip(chip)}
                  className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-red-500 text-white transition-all duration-150 group-hover:scale-110"
                  disabled={isUpdating}
                  aria-label={`Eliminar ${chip}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <input
              ref={chipInputRef}
              type="text"
              value={newChip}
              onChange={(e) => setNewChip(e.target.value)}
              onKeyDown={handleKeyDownChips}
              onKeyPress={handleKeyPress}
              onPaste={handlePasteChips}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-900 placeholder-gray-400 py-1 focus:ring-0 focus:border-transparent border-0"
              placeholder={chips.length === 0 ? 'Escribe y presiona Enter o Coma…' : ''}
              disabled={isUpdating}
            />
            <span className="ml-auto text-xs text-gray-500 select-none">{chips.length}/10</span>
          </div>
        );

      case 'reference':
        if (configuration.options && configuration.options.length > 0) {
          return (
            <select
              value={value == null ? '' : String(value)}
              onChange={(e) => {
                const raw = e.target.value;
                const hit = configuration.options!.find(opt => String(opt.value) === raw);
                const normalized = hit ? hit.value : raw;
                handleValueChange(normalized);
              }}
              className={baseClasses}
              disabled={isUpdating}
            >
              <option value="">Seleccionar una opción</option>
              {configuration.options.map((opt: AiOption, idx: number) => (
                <option key={`${opt.value}-${idx}`} value={String(opt.value)} className="bg-gray-800 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          );
        } else {
          return (
            <input
              type="text"
              value={value == null ? '' : String(value)}
              onChange={(e) => handleValueChange(e.target.value)}
              className={baseClasses}
              placeholder="Ingresa el ID de referencia"
              disabled={isUpdating}
            />
          );
        }

      default: // string type
        return (
          <input
            type="text"
            value={value == null ? '' : String(value)}
            onChange={(e) => handleValueChange(e.target.value)}
            className={baseClasses}
            disabled={isUpdating}
            placeholder="Ingresa el valor..."
          />
        );
    }
  };

  return (
    <div className="w-full">
      <div className="glass-card config-card rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {configuration.display_name}
          </h3>
          <p className="text-white/60 text-sm mt-1">
            {configuration.description}
          </p>

          {/* Status indicator */}
          <div className="mt-3">
            {savingState === 'saving' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-800 text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                Guardando…
              </span>
            )}
            {savingState === 'synced' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 border border-green-300 rounded-full text-green-800 text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                Sincronizado
              </span>
            )}
            {savingState === 'error' && (
              <span className="inline-flex items-center px-2.5 py-1 bg-red-100 border border-red-300 rounded-full text-red-800 text-xs font-medium">
                Error al guardar
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {renderField()}
        </div>
      </div>
    </div>
  );
};

export default AiConfigurationField;
