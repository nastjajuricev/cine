
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyAddedFilms, getSearchHistory } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Film, SearchHistory } from '@/types/film';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const [recentFilms, setRecentFilms] = useState<Film[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRecentFilms(getRecentlyAddedFilms());
    setRecentSearches(getSearchHistory());
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Data refreshed');
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="animate-fade-in">
        {/* Top Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/add-film" className="filmora-button-primary">
            Add Film
          </Link>
          <Link to="/library" className="filmora-button-secondary">
            View Library
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search for films..." />
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold mb-4">Last {recentSearches.length} searches</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {recentSearches.map((search, index) => (
                <Link 
                  key={search.id} 
                  to={`/search?q=${encodeURIComponent(search.term)}`}
                  className="filmora-card bg-filmora-light-pink p-4 hover:shadow-md transition-all"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <p className="text-center font-medium line-clamp-1">
                    {search.term}
                  </p>
                  <p className="text-center text-sm text-gray-600 mt-1">
                    {search.resultCount} results
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Added Films */}
        {recentFilms.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-4">Last {recentFilms.length} added</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {recentFilms.map((film, index) => (
                <FilmCard 
                  key={film.id} 
                  film={film} 
                  variant="recent" 
                  onFilmUpdated={handleRefresh}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {recentFilms.length === 0 && recentSearches.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Welcome to your Film Library</h2>
            <p className="text-gray-600 mb-8">Start by adding your first film or searching for movies</p>
            <Link to="/add-film" className="filmora-button-primary inline-block">
              Add Your First Film
            </Link>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
