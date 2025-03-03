
import { useState } from 'react';
import { ChevronDown, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Film, SortOption, FilterOption } from '@/types/film';
import { toast } from 'sonner';
import SearchBar from '@/components/SearchBar';

interface FilterComponentProps {
  films: Film[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedDirector: string | null;
  setSelectedDirector: (director: string | null) => void;
  selectedActor: string | null;
  setSelectedActor: (actor: string | null) => void;
  filterType: FilterOption;
  setFilterType: (type: FilterOption) => void;
  viewMode: 'grid' | 'list';
  toggleViewMode: () => void;
}

const FilterComponent = ({
  films,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  selectedYear,
  setSelectedYear,
  selectedDirector,
  setSelectedDirector,
  selectedActor,
  setSelectedActor,
  filterType,
  setFilterType,
  viewMode,
  toggleViewMode,
}: FilterComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState(false);

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setIsDropdownOpen(false);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleYearChange = (year: string | null) => {
    setSelectedYear(year);
    setIsFilterOptionsOpen(false);
  };

  const handleDirectorChange = (director: string | null) => {
    setSelectedDirector(director);
    setIsFilterOptionsOpen(false);
  };

  const handleActorChange = (actor: string | null) => {
    setSelectedActor(actor);
    setIsFilterOptionsOpen(false);
  };

  const handleFilterTypeChange = (type: FilterOption) => {
    setFilterType(type);
    setIsFilterOptionsOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isCategoryDropdownOpen) setIsCategoryDropdownOpen(false);
    if (isFilterOptionsOpen) setIsFilterOptionsOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
    if (isFilterOptionsOpen) setIsFilterOptionsOpen(false);
  };

  const toggleFilterOptions = () => {
    setIsFilterOptionsOpen(!isFilterOptionsOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
    if (isCategoryDropdownOpen) setIsCategoryDropdownOpen(false);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'director', label: 'Director' },
    { value: 'year', label: 'Year' },
    { value: 'idNumber', label: 'ID Number' },
  ];

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All Filters' },
    { value: 'director', label: 'Directors' },
    { value: 'actor', label: 'Actors' },
    { value: 'genre', label: 'Genres' },
    { value: 'year', label: 'Years' },
  ];

  const getAllCategories = () => {
    const categories = new Set<string>();
    films.forEach(film => {
      if (film.genre && film.genre.length > 0) {
        film.genre.forEach(genre => categories.add(genre));
      }
    });
    return Array.from(categories).sort();
  };

  const getAllYears = () => {
    const years = new Set<string>();
    films.forEach(film => {
      if (film.year) {
        years.add(film.year);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  };

  const getAllDirectors = () => {
    const directors = new Set<string>();
    films.forEach(film => {
      if (film.director) {
        directors.add(film.director);
      }
    });
    return Array.from(directors).sort();
  };

  const getAllActors = () => {
    const actors = new Set<string>();
    films.forEach(film => {
      if (film.actors && film.actors.length > 0) {
        film.actors.forEach(actor => actors.add(actor));
      }
    });
    return Array.from(actors).sort();
  };

  const allCategories = getAllCategories();
  const allYears = getAllYears();
  const allDirectors = getAllDirectors();
  const allActors = getAllActors();
  
  const isFiltering = searchTerm || selectedCategory || selectedYear || selectedDirector || selectedActor;

  return (
    <>
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search films..."
          initialValue={searchTerm}
        />
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative inline-block">
          <button
            onClick={toggleFilterOptions}
            className={`flex items-center space-x-2 text-sm font-bold border px-3 py-2 rounded-[10px] hover:bg-gray-50 ${
              selectedYear || selectedDirector || selectedActor ? 'text-filmora-coral border-filmora-coral' : 'text-gray-700 border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {isFilterOptionsOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 py-1 border">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by:</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterTypeChange(option.value)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        filterType === option.value 
                          ? 'bg-filmora-coral text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {(filterType === 'all' || filterType === 'year') && allYears.length > 0 && (
                <div className="px-4 py-2 border-b">
                  <p className="text-xs font-medium text-gray-500 mb-1">Years</p>
                  <div className="max-h-32 overflow-y-auto">
                    <button
                      onClick={() => handleYearChange(null)}
                      className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${
                        !selectedYear ? 'font-medium text-filmora-coral' : 'text-gray-700'
                      }`}
                    >
                      All Years
                    </button>
                    {allYears.map(year => (
                      <button
                        key={year}
                        onClick={() => handleYearChange(year)}
                        className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${
                          selectedYear === year ? 'font-medium text-filmora-coral' : 'text-gray-700'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(filterType === 'all' || filterType === 'director') && allDirectors.length > 0 && (
                <div className="px-4 py-2 border-b">
                  <p className="text-xs font-medium text-gray-500 mb-1">Directors</p>
                  <div className="max-h-32 overflow-y-auto">
                    <button
                      onClick={() => handleDirectorChange(null)}
                      className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${
                        !selectedDirector ? 'font-medium text-filmora-coral' : 'text-gray-700'
                      }`}
                    >
                      All Directors
                    </button>
                    {allDirectors.map(director => (
                      <button
                        key={director}
                        onClick={() => handleDirectorChange(director)}
                        className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${
                          selectedDirector === director ? 'font-medium text-filmora-coral' : 'text-gray-700'
                        }`}
                      >
                        {director}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(filterType === 'all' || filterType === 'actor') && allActors.length > 0 && (
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Actors</p>
                  <div className="max-h-32 overflow-y-auto">
                    <button
                      onClick={() => handleActorChange(null)}
                      className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${
                        !selectedActor ? 'font-medium text-filmora-coral' : 'text-gray-700'
                      }`}
                    >
                      All Actors
                    </button>
                    {allActors.map(actor => (
                      <button
                        key={actor}
                        onClick={() => handleActorChange(actor)}
                        className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${
                          selectedActor === actor ? 'font-medium text-filmora-coral' : 'text-gray-700'
                        }`}
                      >
                        {actor}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {allCategories.length > 0 && (
          <div className="relative inline-block">
            <button
              onClick={toggleCategoryDropdown}
              className={`flex items-center space-x-2 text-sm font-bold border px-3 py-2 rounded-[10px] hover:bg-gray-50 ${
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

        {films.length > 0 && (
          <div className="relative inline-block">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-sm font-bold text-gray-700 border border-gray-300 px-3 py-2 rounded-[10px] hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Sort: {sortOptions.find(option => option.value === sortBy)?.label}</span>
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
        
        <button
          onClick={toggleViewMode}
          className="flex items-center space-x-2 text-sm font-bold text-gray-700 border border-gray-300 px-3 py-2 rounded-[10px] hover:bg-gray-50"
        >
          <span>View: {viewMode === 'grid' ? 'Grid' : 'List'}</span>
        </button>
        
        {isFiltering && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-sm font-bold text-gray-700 border border-gray-300 px-3 py-2 rounded-[10px] hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {isFiltering && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategory && (
            <div className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center">
              <span>Genre: {selectedCategory}</span>
              <button onClick={() => setSelectedCategory(null)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {selectedYear && (
            <div className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center">
              <span>Year: {selectedYear}</span>
              <button onClick={() => setSelectedYear(null)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {selectedDirector && (
            <div className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center">
              <span>Director: {selectedDirector}</span>
              <button onClick={() => setSelectedDirector(null)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {selectedActor && (
            <div className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center">
              <span>Actor: {selectedActor}</span>
              <button onClick={() => setSelectedActor(null)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {searchTerm && (
            <div className="bg-filmora-light-pink text-filmora-coral px-3 py-1 rounded-full text-sm flex items-center">
              <span>Search: {searchTerm}</span>
              <button onClick={() => setSearchTerm('')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-white text-black font-bold py-4 px-6 rounded-full border border-black text-xl">
            Alphabetically
          </button>
          <button className="bg-black text-white font-bold py-4 px-6 rounded-full text-xl">
            By Director
          </button>
          <button className="bg-black text-white font-bold py-4 px-6 rounded-full text-xl">
            By Actor
          </button>
          <button className="bg-black text-white font-bold py-4 px-6 rounded-full text-xl">
            By Genre
          </button>
        </div>
      )}
    </>
  );
};

export default FilterComponent;
