
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFilms, addSearchHistoryItem } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Film, FilterOption } from '@/types/film';
import { ChevronDown, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Delay to simulate network request
    setTimeout(() => {
      const results = searchFilms(query, filterBy, sortBy);
      setSearchResults(results);
      setSearchQuery(query);
      setSearchParams({ q: query });
      
      // Add to search history
      if (results.length > 0) {
        addSearchHistoryItem(query, results.length);
      }
      
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    performSearch(query);
  };

  const handleFilterChange = (option: FilterOption) => {
    setFilterBy(option);
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

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All Fields' },
    { value: 'director', label: 'Director' },
    { value: 'actor', label: 'Actor' },
    { value: 'producer', label: 'Producer' },
    { value: 'idNumber', label: 'ID Number' },
    { value: 'genre', label: 'Genre' },
    { value: 'year', label: 'Year' },
    { value: 'tags', label: 'Tags' },
  ];

  const sortOptions = [
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">Search Films</h1>
      </div>

      <div className="mb-8 animate-fade-in">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for films..." 
          initialValue={initialQuery}
        />
      </div>

      {/* Filter & Sort Controls */}
      {searchQuery && (
        <div className="flex flex-wrap gap-3 mb-6 animate-slide-up">
          {/* Filter Dropdown */}
          <div className="relative inline-block">
            <button
              onClick={toggleFilterDropdown}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 border px-3 py-2 rounded-full hover:bg-gray-50"
            >
              <span>Filter: {filterOptions.find(option => option.value === filterBy)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      filterBy === option.value ? 'font-medium text-filmora-coral' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-block">
            <button
              onClick={toggleSortDropdown}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 border px-3 py-2 rounded-full hover:bg-gray-50"
            >
              <span>Sort: {sortOptions.find(option => option.value === sortBy)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isSortDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
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
      )}

      {/* Search Results */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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

      {/* Empty State */}
      {!searchQuery && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-600 mb-2">Search for films in your library</p>
          <p className="text-gray-500">Use the search bar above to find films by title, director, actors, etc.</p>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Search;
