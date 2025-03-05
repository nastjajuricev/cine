import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Film } from '@/types/film';
import FilmCard from '@/components/FilmCard';
import SearchBar from '@/components/search/SearchBar';
import { getRecentlyAddedFilms, getSearchHistory, addSearchHistoryItem, searchFilms } from '@/lib/storage';
import SearchHistoryComponent from '@/components/search/SearchHistoryComponent';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

const Index = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [searchFilter, setSearchFilter] = useState('all');
	const [sortBy, setSortBy] = useState('title');
  const [recentlyAdded, setRecentlyAdded] = useState<Film[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadSearchHistory = async () => {
      const history = await getSearchHistory();
      setSearchHistory(history);
    };
    
    loadSearchHistory();
  }, []);

  useEffect(() => {
    const recentlyAddedFilms = getRecentlyAddedFilms();
    setRecentlyAdded(recentlyAddedFilms);
  }, []);

  const handleSearch = (term: string, filter: string, sortBy: string) => {
    setSearchTerm(term);
    setSearchFilter(filter);
		setSortBy(sortBy);
    
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = searchFilms(term, filter, sortBy);
    setSearchResults(results);
    
    // Add to search history if results are found
    if (results.length > 0) {
      addSearchHistoryItem(term, results.length);
      
      // Update search history state
      getSearchHistory()
        .then(history => setSearchHistory(history))
        .catch(error => console.error("Error updating search history:", error));
    } else {
      toast.info('No results found. Please try a different search term.');
    }
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem('filmora-search-history');
    setSearchHistory([]);
    toast.success('Search history cleared successfully!');
  };

  const handleFilmUpdated = () => {
    setRecentlyAdded(getRecentlyAddedFilms());
  };

  return (
    <>
      <Head>
        <title>Filmora</title>
        <meta name="description" content="Manage your film library" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Filmora</h1>

        <SearchBar onSearch={handleSearch} />

        {searchTerm && searchResults.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Search Results for "{searchTerm}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map(film => (
                <FilmCard key={film.id} film={film} variant="search" onFilmUpdated={handleFilmUpdated} />
              ))}
            </div>
          </section>
        )}

        {searchTerm && searchResults.length === 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">No results found for "{searchTerm}"</h2>
          </section>
        )}

        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recently Added</h2>
            <button 
              onClick={() => router.push('/library')}
              className="text-filmora-coral hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentlyAdded.map(film => (
              <FilmCard key={film.id} film={film} variant="recent" onFilmUpdated={handleFilmUpdated} />
            ))}
          </div>
        </section>

        <SearchHistoryComponent 
          searchHistory={searchHistory} 
          onClearSearchHistory={handleClearSearchHistory} 
        />
      </main>
    </>
  );
};

export default Index;
