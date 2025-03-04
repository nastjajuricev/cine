import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFilms, addSearchHistoryItem } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Film, FilterOption } from '@/types/film';
import { ChevronDown, ArrowLeft, Filter, Check, ArrowUpAZ } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<'title' | 'year'>('title');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const results = searchFilms(query, filterBy, sortBy);
      setSearchResults(results);
      setSearchQuery(query);
      setSearchParams({ q: query });
      
      if (results.length > 0) {
        addSearchHistoryItem(query, results.length);
      }
      
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    performSearch(query);
  };

  const handleFilterChange = (option: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(option)) {
      newFilters.delete(option);
    } else {
      newFilters.add(option);
    }
    setSelectedFilters(newFilters);
    setIsFilterDropdownOpen(false);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const handleSortChange = (option: 'title' | 'year') => {
    setSortBy(option);
    setIsSortDropdownOpen(false);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    if (isSortDropdownOpen) setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    if (isFilterDropdownOpen) setIsFilterDropdownOpen(false);
  };

  const handleRefresh = () => {
    if (searchQuery) {
      performSearch(searchQuery);
      toast.success('Search results refreshed');
    }
  };

  const filterOptions = [
    { value: 'director', label: 'Director' },
    { value: 'actor', label: 'Actor' },
    { value: 'genre', label: 'Genre' },
    { value: 'year', label: 'Year' },
  ];

  const sortOptions = [
    { value: 'title', label: 'Alphabetically (A-Z)' },
    { value: 'director', label: 'By Director' },
    { value: 'genre', label: 'By Genre' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Search</h1>
      </div>

      <div className="mb-8 animate-fade-in">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for films..." 
          initialValue={initialQuery}
        />
      </div>

      {searchQuery && (
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
                        onClick={() => handleFilterChange(option.value)}
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
                      onClick={() => handleSortChange(option.value as 'title' | 'year')}
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
      )}

      {searchQuery && (
        <div className="animate-fade-in">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-soft">Searching...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {searchResults.map(film => (
                  <FilmCard 
                    key={film.id} 
                    film={film} 
                    variant="search" 
                    onFilmUpdated={handleRefresh}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 mt-2">Try different keywords or filters</p>
            </div>
          )}
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-600 mb-2">Search for films in your library</p>
          <p className="text-gray-500">Use the search bar above to find films</p>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Search;
