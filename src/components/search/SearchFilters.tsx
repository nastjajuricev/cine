
import { FC, useState } from 'react';
import { ChevronDown, Filter, Check, ArrowUpAZ } from 'lucide-react';
import { FilterOption } from '@/types/film';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFiltersProps {
  selectedFilters: Set<string>;
  sortBy: 'title' | 'year' | 'director' | 'genre';
  onFilterChange: (option: string) => void;
  onSortChange: (option: 'title' | 'year' | 'director' | 'genre') => void;
}

const SearchFilters: FC<SearchFiltersProps> = ({
  selectedFilters,
  sortBy,
  onFilterChange,
  onSortChange
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    if (isSortDropdownOpen) setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    if (isFilterDropdownOpen) setIsFilterDropdownOpen(false);
  };

  const filterOptions: FilterOption[] = [
    { value: 'director', label: 'Director' },
    { value: 'actor', label: 'Actor' },
    { value: 'genre', label: 'Genre' },
    { value: 'year', label: 'Year' },
  ];

  const sortOptions: FilterOption[] = [
    { value: 'title', label: 'Alphabetically (A-Z)' },
    { value: 'director', label: 'By Director' },
    { value: 'genre', label: 'By Genre' },
  ];

  const handleFilterSelect = (option: string) => {
    onFilterChange(option);
    setIsFilterDropdownOpen(false);
  };

  const handleSortSelect = (option: string) => {
    onSortChange(option as 'title' | 'year' | 'director' | 'genre');
    setIsSortDropdownOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6 animate-slide-up">
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="col-span-2">
          <div className="relative inline-block w-full">
            <button
              onClick={toggleFilterDropdown}
              className="flex items-center justify-between w-full space-x-2 text-sm font-medium text-gray-700 border px-3 py-2 rounded-full hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter: {selectedFilters.size > 0 ? `${selectedFilters.size} selected` : 'All'}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedFilters.has(option.value) ? 'font-medium text-filmora-coral' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex-grow">{option.label}</span>
                    {selectedFilters.has(option.value) && (
                      <Check className="w-4 h-4 text-filmora-coral" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative inline-block w-full">
          <button
            onClick={toggleSortDropdown}
            className="flex items-center justify-between w-full space-x-2 text-sm font-medium text-gray-700 border px-3 py-2 rounded-full hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <ArrowUpAZ className="w-4 h-4" />
              <span>Sort: {sortOptions.find(option => option.value === sortBy)?.label}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortBy === option.value ? 'font-medium text-filmora-coral' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
