
import { FC } from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedFilters: Set<string>;
  searchQuery: string;
  onRemoveFilter: (filter: string) => void;
  onClearSearch: () => void;
}

const ActiveFilters: FC<ActiveFiltersProps> = ({
  selectedFilters,
  searchQuery,
  onRemoveFilter,
  onClearSearch,
}) => {
  if (!selectedFilters.size && !searchQuery) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Array.from(selectedFilters).map(filter => (
        <div 
          key={filter} 
          className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center"
        >
          <span>{filter}</span>
          <button onClick={() => onRemoveFilter(filter)} className="ml-2">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {searchQuery && (
        <div className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center">
          <span>Search: {searchQuery}</span>
          <button onClick={onClearSearch} className="ml-2">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;
