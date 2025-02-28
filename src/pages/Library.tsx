
import { useState, useEffect } from 'react';
import { getFilms } from '@/lib/storage';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Film, SortOption } from '@/types/film';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const Library = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const getSortedFilms = () => {
    return [...films].sort((a, b) => {
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

  const sortedFilms = getSortedFilms();

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Your Film Library</h1>
        <p className="text-gray-600 mb-6">
          {films.length} {films.length === 1 ? 'film' : 'films'} in your collection
        </p>
        
        {/* Sort Dropdown */}
        {films.length > 0 && (
          <div className="relative mb-6 inline-block">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 border px-3 py-2 rounded-full hover:bg-gray-50"
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
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-soft">Loading your films...</div>
        </div>
      ) : films.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fade-in">
          {sortedFilms.map(film => (
            <FilmCard 
              key={film.id} 
              film={film} 
              onFilmUpdated={handleRefresh} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-600 mb-4">Your library is empty. Start adding films!</p>
          <a href="/add-film" className="filmora-button-primary inline-block">
            Add Your First Film
          </a>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Library;
