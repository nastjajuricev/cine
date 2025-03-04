
import { useState, useEffect } from 'react';
import { getFilms } from '@/lib/storage';
import Navigation from '@/components/Navigation';
import { SortOption, FilterOption } from '@/types/film';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import FilterComponent from '@/components/library/FilterComponent';
import GridViewComponent from '@/components/library/GridViewComponent';
import ListViewComponent from '@/components/library/ListViewComponent';
import EmptyStateComponent from '@/components/library/EmptyStateComponent';
import { getFilteredAndSortedFilms } from '@/services/FilmListService';

const Library = () => {
  const [films, setFilms] = useState([]);
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [selectedActor, setSelectedActor] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { userName } = useAuth();

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = () => {
    setIsLoading(true);
    const allFilms = getFilms();
    setFilms(allFilms);
    setIsLoading(false);
  };

  const handleRefresh = () => {
    loadFilms();
    toast.success('Library refreshed');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedYear(null);
    setSelectedDirector(null);
    setSelectedActor(null);
    setFilterType('all');
    toast.success('Filters cleared');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const filteredAndSortedFilms = getFilteredAndSortedFilms(
    films,
    searchTerm,
    selectedCategory,
    selectedYear,
    selectedDirector,
    selectedActor,
    sortBy
  );

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <FilterComponent
          films={films}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedDirector={selectedDirector}
          setSelectedDirector={setSelectedDirector}
          selectedActor={selectedActor}
          setSelectedActor={setSelectedActor}
          filterType={filterType}
          setFilterType={setFilterType}
          viewMode={viewMode}
          toggleViewMode={toggleViewMode}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-soft">Loading your films...</div>
        </div>
      ) : filteredAndSortedFilms.length > 0 ? (
        viewMode === 'grid' ? (
          <GridViewComponent 
            films={filteredAndSortedFilms} 
            onFilmUpdated={handleRefresh} 
          />
        ) : (
          <ListViewComponent 
            films={filteredAndSortedFilms} 
            onFilmUpdated={handleRefresh} 
          />
        )
      ) : (
        <EmptyStateComponent 
          hasFilms={films.length > 0} 
          clearFilters={clearFilters} 
        />
      )}

      <Navigation />
    </div>
  );
};

export default Library;
