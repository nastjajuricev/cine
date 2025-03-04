
import { Film } from '@/types/film';
import FilmCard from '@/components/FilmCard';
import { FC } from 'react';

interface SearchResultsProps {
  searchQuery: string;
  isLoading: boolean;
  searchResults: Film[];
  onFilmUpdated: () => void;
}

const SearchResults: FC<SearchResultsProps> = ({ 
  searchQuery, 
  isLoading, 
  searchResults, 
  onFilmUpdated 
}) => {
  if (!searchQuery) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-gray-600 mb-2">Search for films in your library</p>
        <p className="text-gray-500">Use the search bar above to find films</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fade-in">
        <div className="animate-pulse-soft">Searching...</div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-gray-600">No results found for "{searchQuery}"</p>
        <p className="text-gray-500 mt-2">Try different keywords or filters</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">
        Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {searchResults.map(film => (
          <FilmCard 
            key={film.id} 
            film={film} 
            variant="search" 
            onFilmUpdated={onFilmUpdated}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
