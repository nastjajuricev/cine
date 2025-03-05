import { useState } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filter: string;
  sortBy: string;
  onFilterChange: (filter: string) => void;
  onSortByChange: (sortBy: string) => void;
}

const SearchFilters = ({ filter, sortBy, onFilterChange, onSortByChange }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleFilters}
        >
          <Filter className="h-5 w-5 text-gray-500" />
          Filters
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none",
          isOpen ? 'block' : 'hidden'
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {/* Filter options */}
          <button
            onClick={() => onFilterChange('all')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'all' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('director')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'director' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Director
          </button>
          <button
            onClick={() => onFilterChange('actor')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'actor' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Actor
          </button>
          <button
            onClick={() => onFilterChange('producer')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'producer' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Producer
          </button>
          <button
            onClick={() => onFilterChange('idNumber')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'idNumber' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            ID Number
          </button>
           <button
            onClick={() => onFilterChange('genre')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'genre' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Genre
          </button>
          <button
            onClick={() => onFilterChange('year')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'year' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Year
          </button>
          <button
            onClick={() => onFilterChange('tags')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              filter === 'tags' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Tags
          </button>

          {/* Sort By options */}
          <hr className="border-gray-200 my-1" />
          <button
            onClick={() => onSortByChange('title')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              sortBy === 'title' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Sort by Title
          </button>
          <button
            onClick={() => onSortByChange('director')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              sortBy === 'director' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Sort by Director
          </button>
          <button
            onClick={() => onSortByChange('year')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              sortBy === 'year' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Sort by Year
          </button>
          <button
            onClick={() => onSortByChange('idNumber')}
            className={cn(
              "text-gray-700 block w-full px-4 py-2 text-left text-sm",
              sortBy === 'idNumber' ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 hover:text-gray-900'
            )}
            role="menuitem"
            tabIndex={-1}
          >
            Sort by ID Number
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
