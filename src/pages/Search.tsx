
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFilms, addSearchHistoryItem } from '@/lib/storage';
import Navigation from '@/components/Navigation';
import { Film, FilterOption } from '@/types/film';
import { toast } from 'sonner';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters from '@/components/search/SearchFilters';
import ActiveFilters from '@/components/search/ActiveFilters';
import SearchResults from '@/components/search/SearchResults';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'director' | 'genre'>('title');
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
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const handleSortChange = (option: 'title' | 'year' | 'director' | 'genre') => {
    setSortBy(option);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters);
    newFilters.delete(filter);
    setSelectedFilters(newFilters);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchParams({});
  };

  const handleRefresh = () => {
    if (searchQuery) {
      performSearch(searchQuery);
      toast.success('Search results refreshed');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <SearchHeader 
        initialQuery={initialQuery} 
        onSearch={handleSearch}
      />

      {searchQuery && (
        <SearchFilters
          selectedFilters={selectedFilters}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      )}

      {searchQuery && (
        <ActiveFilters
          selectedFilters={selectedFilters}
          searchQuery={searchQuery}
          onRemoveFilter={handleRemoveFilter}
          onClearSearch={handleClearSearch}
        />
      )}

      <SearchResults 
        searchQuery={searchQuery}
        isLoading={isLoading}
        searchResults={searchResults}
        onFilmUpdated={handleRefresh}
      />

      <Navigation />
    </div>
  );
};

export default Search;
