import { Film, SearchHistory } from '@/types/film';

// Maximum number of search history items to keep
const MAX_SEARCH_HISTORY = 5;
// Maximum number of recently added films to keep
const MAX_RECENT_FILMS = 5;

// Keys for localStorage
const FILMS_STORAGE_KEY = 'filmora-films';
const SEARCH_HISTORY_KEY = 'filmora-search-history';

// Get all films from localStorage
export const getFilms = (): Film[] => {
  try {
    const films = localStorage.getItem(FILMS_STORAGE_KEY);
    return films ? JSON.parse(films) : [];
  } catch (error) {
    console.error('Error retrieving films from localStorage:', error);
    return [];
  }
};

// Save all films to localStorage
export const saveFilms = (films: Film[]): void => {
  try {
    localStorage.setItem(FILMS_STORAGE_KEY, JSON.stringify(films));
  } catch (error) {
    console.error('Error saving films to localStorage:', error);
  }
};

// Add a new film
export const addFilm = (film: Film): void => {
  const films = getFilms();
  films.push(film);
  saveFilms(films);
};

// Update an existing film
export const updateFilm = (updatedFilm: Film): void => {
  const films = getFilms();
  const index = films.findIndex(film => film.id === updatedFilm.id);
  
  if (index !== -1) {
    films[index] = updatedFilm;
    saveFilms(films);
  }
};

// Delete a film by id
export const deleteFilm = (id: string): void => {
  const films = getFilms();
  const filteredFilms = films.filter(film => film.id !== id);
  saveFilms(filteredFilms);
};

// Get a film by id
export const getFilmById = (id: string): Film | undefined => {
  const films = getFilms();
  return films.find(film => film.id === id);
};

// Get search history
export const getSearchHistory = (): SearchHistory[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return [];
  }
};

// Save search history
export const saveSearchHistory = (history: SearchHistory[]): void => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

// Add a new search history item
export const addSearchHistoryItem = (term: string, resultCount: number): void => {
  const history = getSearchHistory();
  
  // Create new history item
  const newItem: SearchHistory = {
    id: crypto.randomUUID(),
    term,
    timestamp: Date.now(),
    resultCount
  };
  
  // Remove duplicate searches (same term)
  const filteredHistory = history.filter(item => item.term.toLowerCase() !== term.toLowerCase());
  
  // Add new item to the beginning
  filteredHistory.unshift(newItem);
  
  // Trim to max length
  if (filteredHistory.length > MAX_SEARCH_HISTORY) {
    filteredHistory.length = MAX_SEARCH_HISTORY;
  }
  
  saveSearchHistory(filteredHistory);
};

// Get recently added films
export const getRecentlyAddedFilms = (): Film[] => {
  const films = getFilms();
  return [...films]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_RECENT_FILMS);
};

// Check if a film ID number already exists
export const isIdNumberExists = (idNumber: string, excludeFilmId?: string): boolean => {
  const films = getFilms();
  return films.some(film => 
    film.idNumber === idNumber && (!excludeFilmId || film.id !== excludeFilmId)
  );
};

// Search films based on query and filter
export const searchFilms = (
  query: string, 
  filter: string = 'all',
  sortBy: string = 'title'
): Film[] => {
  if (!query.trim()) return [];
  
  const films = getFilms();
  const searchTerm = query.toLowerCase();
  
  // Filter films based on the selected filter
  const filteredFilms = films.filter(film => {
    switch (filter) {
      case 'all':
        return (
          film.title.toLowerCase().includes(searchTerm) ||
          film.director.toLowerCase().includes(searchTerm) ||
          film.idNumber.toLowerCase().includes(searchTerm) ||
          (film.year && film.year.toLowerCase().includes(searchTerm)) ||
          (film.producer && film.producer.toLowerCase().includes(searchTerm)) ||
          (film.actors && film.actors.some(actor => actor.toLowerCase().includes(searchTerm))) ||
          (film.genre && film.genre.some(g => g.toLowerCase().includes(searchTerm))) ||
          (film.tags && film.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      case 'director':
        return film.director.toLowerCase().includes(searchTerm);
      case 'actor':
        return film.actors && film.actors.some(actor => actor.toLowerCase().includes(searchTerm));
      case 'producer':
        return film.producer && film.producer.toLowerCase().includes(searchTerm);
      case 'idNumber':
        return film.idNumber.toLowerCase().includes(searchTerm);
      case 'genre':
        return film.genre && film.genre.some(g => g.toLowerCase().includes(searchTerm));
      case 'year':
        return film.year && film.year.toLowerCase().includes(searchTerm);
      case 'tags':
        return film.tags && film.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      default:
        return false;
    }
  });
  
  // Sort the filtered films
  return filteredFilms.sort((a, b) => {
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
