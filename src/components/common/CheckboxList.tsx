import React from 'react';

interface CheckboxItem {
  id: string;
  name: string;
  description?: string;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  selectedItems: string[];
  onToggle: (itemName: string) => void;
  title: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  maxHeight?: string;
  className?: string;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  items,
  selectedItems,
  onToggle,
  title,
  loading = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay elementos disponibles',
  maxHeight = 'max-h-48',
  className = ''
}) => {
  return (
    <div className={className}>
      <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
      {loading ? (
        <div className="text-white/70">{loadingText}</div>
      ) : items.length === 0 ? (
        <div className="text-white/70">{emptyText}</div>
      ) : (
        <div className={`space-y-2 ${maxHeight} overflow-y-auto`}>
          {items.map((item) => (
            <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.name)}
                onChange={() => onToggle(item.name)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <span className="text-white font-medium">{item.name}</span>
                {item.description && (
                  <p className="text-white/60 text-sm">{item.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckboxList;
