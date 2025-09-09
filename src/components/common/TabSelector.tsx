import React from 'react';

interface TabOption {
  value: string;
  label: string;
}

interface TabSelectorProps {
  options: TabOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  selectedValue,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 ${className}`}>
      <div className="flex space-x-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              selectedValue === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSelector;
