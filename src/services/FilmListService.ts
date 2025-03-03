
import { Film, SortOption } from '@/types/film';

export const getFilteredAndSortedFilms = (
  films: Film[],
  searchTerm: string,
  selectedCategory: string | null,
  selectedYear: string | null,
  selectedDirector: string | null,
  selectedActor: string | null,
  sortBy: SortOption
): Film[] => {
  let filtered = [...films];
  
  if (searchTerm) {
    filtered = filtered.filter(film => 
      film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (film.year && film.year.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  if (selectedCategory) {
    filtered = filtered.filter(film => 
      film.genre && film.genre.includes(selectedCategory)
    );
  }

  if (selectedYear) {
    filtered = filtered.filter(film => 
      film.year === selectedYear
    );
  }

  if (selectedDirector) {
    filtered = filtered.filter(film => 
      film.director === selectedDirector
    );
  }

  if (selectedActor) {
    filtered = filtered.filter(film => 
      film.actors && film.actors.includes(selectedActor)
    );
  }
  
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
