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
  
  const [canScrollLeftFilms, setCanScrollLeftFilms] = useState(false);
  const [canScrollRightFilms, setCanScrollRightFilms] = useState(false);
  
  const [canScrollLeftSearches, setCanScrollLeftSearches] = useState(false);
  const [canScrollRightSearches, setCanScrollRightSearches] = useState(false);

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

  const scrollLeftFilms = () => {
    const container = document.getElementById('recent-films-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightFilms = () => {
    const container = document.getElementById('recent-films-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeftSearches = () => {
    const container = document.getElementById('recent-searches-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightSearches = () => {
    const container = document.getElementById('recent-searches-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const checkScrollFilms = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setCanScrollLeftFilms(target.scrollLeft > 0);
    setCanScrollRightFilms(
      target.scrollLeft < target.scrollWidth - target.clientWidth - 5
    );
  };

  const checkScrollSearches = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setCanScrollLeftSearches(target.scrollLeft > 0);
    setCanScrollRightSearches(
      target.scrollLeft < target.scrollWidth - target.clientWidth - 5
    );
  };

  useEffect(() => {
    const filmsContainer = document.getElementById('recent-films-container');
    if (filmsContainer) {
      setCanScrollRightFilms(
        filmsContainer.scrollWidth > filmsContainer.clientWidth
      );
    }

    const searchesContainer = document.getElementById('recent-searches-container');
    if (searchesContainer) {
      setCanScrollRightSearches(
        searchesContainer.scrollWidth > searchesContainer.clientWidth
      );
    }
  }, [recentFilms, recentSearches]);

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="animate-fade-in">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link 
            to="/add-film" 
            className="bg-filmora-coral text-white py-2 px-4 rounded-[10px] text-center flex items-center justify-center font-medium transition-colors hover:bg-opacity-90"
          >
            Add Film
          </Link>
          <Link 
            to="/library" 
            className="bg-gray-100 text-gray-800 py-2 px-4 rounded-[10px] text-center flex items-center justify-center font-medium transition-colors hover:bg-gray-200"
          >
            View Library
          </Link>
        </div>

        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search for films..." />
        </div>

        {recentSearches.length > 0 && (
          <section className="mb-8 animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Last {recentSearches.length} searches</h2>
            </div>
            
            <div className="relative group">
              {canScrollLeftSearches && (
                <button 
                  onClick={scrollLeftSearches} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {canScrollRightSearches && (
                <button 
                  onClick={scrollRightSearches} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              
              <div 
                id="recent-searches-container"
                className="flex overflow-x-auto pb-4 gap-4 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                onScroll={checkScrollSearches}
              >
                {recentSearches.map((search, index) => (
                  <div key={search.id} className="flex-shrink-0 w-[180px]">
                    <Link 
                      to={`/search?q=${encodeURIComponent(search.term)}`}
                      className="filmora-card bg-filmora-light-pink p-4 hover:shadow-md transition-all block"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <p className="text-center font-medium line-clamp-1">
                        {search.term}
                      </p>
                      <p className="text-center text-sm text-gray-600 mt-1">
                        {search.resultCount} results
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {recentFilms.length > 0 && (
          <section className="animate-slide-up relative" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Last {recentFilms.length} added</h2>
            </div>
            
            <div className="relative group">
              {canScrollLeftFilms && (
                <button 
                  onClick={scrollLeftFilms} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {canScrollRightFilms && (
                <button 
                  onClick={scrollRightFilms} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              
              <div 
                id="recent-films-container"
                className="flex overflow-x-auto pb-4 gap-4 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                onScroll={checkScrollFilms}
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

        {recentFilms.length === 0 && recentSearches.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Welcome to your Film Library</h2>
            <p className="text-gray-600 mb-8">Start by adding your first film or searching for movies</p>
            <Link 
              to="/add-film" 
              className="bg-filmora-coral text-white py-2 px-4 rounded-[10px] text-center inline-flex items-center justify-center font-medium transition-colors hover:bg-opacity-90"
            >
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
