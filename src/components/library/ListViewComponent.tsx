
import { Film } from '@/types/film';
import FilmCard from '@/components/FilmCard';
import { useState } from 'react';
import FilmModal from '@/components/FilmModal';

interface ListViewComponentProps {
  films: Film[];
  onFilmUpdated: () => void;
}

const ListViewComponent = ({ films, onFilmUpdated }: ListViewComponentProps) => {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFilmsByAlphabeticalGroups = () => {
    const groupedFilms: { [key: string]: Film[] } = {};
    
    films.forEach(film => {
      const firstLetter = film.title.charAt(0).toUpperCase();
      if (!groupedFilms[firstLetter]) {
        groupedFilms[firstLetter] = [];
      }
      groupedFilms[firstLetter].push(film);
    });
    
    return Object.entries(groupedFilms).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const alphabeticalGroups = getFilmsByAlphabeticalGroups();

  const handleFilmClick = (film: Film) => {
    setSelectedFilm(film);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      {alphabeticalGroups.map(([letter, films]) => (
        <div key={letter} className="mb-6">
          <h2 className="text-4xl font-bold mb-4">{letter}</h2>
          <div className="space-y-3">
            {films.map(film => (
              <div 
                key={film.id}
                onClick={() => handleFilmClick(film)}
                className="flex justify-between items-center p-4 bg-gray-300 rounded-full hover:bg-gray-400 cursor-pointer mx-1 my-1" // Added padding with mx-1 my-1
              >
                <span className="font-bold text-xl">{film.title}</span>
                <span className="font-bold text-xl">Nr #{film.idNumber}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedFilm && (
        <FilmModal
          film={selectedFilm}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFilmUpdated={onFilmUpdated}
        />
      )}
    </div>
  );
};

export default ListViewComponent;
