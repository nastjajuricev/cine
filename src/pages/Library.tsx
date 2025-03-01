
import { useState, useEffect } from 'react';
import { getFilms } from '@/lib/storage';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import SearchBar from '@/components/SearchBar';
import { Film, SortOption } from '@/types/film';
import { ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';

const Library = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = () => {
    setIsLoading(true);
    const allFilms = getFilms();
    setFilms(allFilms);
    setIsLoading(false);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setIsDropdownOpen(false);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    toast.success('Filters cleared');
  };

  const getFilteredAndSortedFilms = () => {
    let filtered = [...films];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(film => 
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (film.year && film.year.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(film => 
        film.genre && film.genre.includes(selectedCategory)
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'director':
          return a.director.localeCompare(b.director);
        case 'year':
          return (a.year || '').localeCompare(b.year || '');
        case 'idNumber':
          return a.idNumber.localeCompare(b.idNumber);
        default:
          return 0;
      }
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isCategoryDropdownOpen) setIsCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleRefresh = () => {
    loadFilms();
    toast.success('Library refreshed');
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'director', label: 'Director' },
    { value: 'year', label: 'Year' },
    { value: 'idNumber', label: 'ID Number' },
  ];

  // Get unique categories from all films
  const getAllCategories = () => {
    const categories = new Set<string>();
    films.forEach(film => {
      if (film.genre && film.genre.length > 0) {
        film.genre.forEach(genre => categories.add(genre));
      }
    });
    return Array.from(categories).sort();
  };

  const filteredAndSortedFilms = getFilteredAndSortedFilms();
  const allCategories = getAllCategories();
  const isFiltering = searchTerm || selectedCategory;

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Your Film Library</h1>
        <p className="text-gray-600 mb-6">
          {films.length} {films.length === 1 ? 'film' : 'films'} in your collection
          {isFiltering && filteredAndSortedFilms.length !== films.length && (
            <span> • Showing {filteredAndSortedFilms.length} results</span>
          )}
        </p>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search films..."
            initialValue={searchTerm}
          />
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Category Filter Dropdown */}
          {allCategories.length > 0 && (
            <div className="relative inline-block">
              <button
                onClick={toggleCategoryDropdown}
                className={`flex items-center space-x-2 text-sm font-medium border px-3 py-2 rounded-full hover:bg-gray-50 ${
                  selectedCategory ? 'text-filmora-coral border-filmora-coral' : 'text-gray-700 border-gray-300'
                }`}
              >
                <span>Category: {selectedCategory || 'All'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      !selectedCategory ? 'font-medium text-filmora-coral' : 'text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {allCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedCategory === category ? 'font-medium text-filmora-coral' : 'text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sort Dropdown */}
          {films.length > 0 && (
            <div className="relative inline-block">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 border border-gray-300 px-3 py-2 rounded-full hover:bg-gray-50"
              >
                <span>Sort by: {sortOptions.find(option => option.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
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
          )}
          
          {/* Clear Filters Button */}
          {isFiltering && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 border border-gray-300 px-3 py-2 rounded-full hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-soft">Loading your films...</div>
        </div>
      ) : filteredAndSortedFilms.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fade-in">
          {filteredAndSortedFilms.map(film => (
            <FilmCard 
              key={film.id} 
              film={film} 
              onFilmUpdated={handleRefresh} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in">
          {films.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">No films match your search criteria.</p>
              <button onClick={clearFilters} className="filmora-button-secondary inline-block">
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">Your library is empty. Start adding films!</p>
              <a href="/add-film" className="filmora-button-primary inline-block">
                Add Your First Film
              </a>
            </>
          )}
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Library;
