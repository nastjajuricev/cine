
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyAddedFilms, getSearchHistory } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Film, SearchHistory } from '@/types/film';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const [recentFilms, setRecentFilms] = useState<Film[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  // Scroll functions for horizontal scrolling
  const scrollLeft = () => {
    const container = document.getElementById('recent-films-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('recent-films-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Check scroll position to show/hide arrows
  const checkScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setCanScrollLeft(target.scrollLeft > 0);
    setCanScrollRight(
      target.scrollLeft < target.scrollWidth - target.clientWidth - 5
    );
  };

  // Set initial scroll state when component loads
  useEffect(() => {
    const container = document.getElementById('recent-films-container');
    if (container) {
      setCanScrollRight(
        container.scrollWidth > container.clientWidth
      );
    }
  }, [recentFilms]);

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

        {/* Recently Added Films - with horizontal scroll */}
        {recentFilms.length > 0 && (
          <section className="animate-slide-up relative" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Last {recentFilms.length} added</h2>
            </div>
            
            <div className="relative group">
              {/* Left scroll button */}
              {canScrollLeft && (
                <button 
                  onClick={scrollLeft} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {/* Right scroll button */}
              {canScrollRight && (
                <button 
                  onClick={scrollRight} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              
              {/* Horizontal scrolling container */}
              <div 
                id="recent-films-container"
                className="flex overflow-x-auto pb-4 gap-4 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                onScroll={checkScroll}
              >
                {recentFilms.map((film) => (
                  <div key={film.id} className="flex-shrink-0 w-[200px]">
                    <FilmCard 
                      film={film} 
                      variant="recent" 
                      onFilmUpdated={handleRefresh}
                    />
                  </div>
                ))}
              </div>
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
