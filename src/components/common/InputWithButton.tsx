import React from 'react';
import ActionButton from './ActionButton';

interface InputWithButtonProps {
  value: string;
  onChange: (value: string) => void;
  onButtonClick: () => void;
  placeholder?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  value,
  onChange,
  onButtonClick,
  placeholder = 'Ingresa tu texto aquí...',
  buttonText = 'Agregar',
  buttonDisabled = false,
  onKeyDown,
  className = ''
}) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
      />
      <ActionButton
        onClick={onButtonClick}
        disabled={buttonDisabled}
        variant="primary"
      >
        {buttonText}
      </ActionButton>
    </div>
  );
};

export default InputWithButton;
