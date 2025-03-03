
import { Film } from '@/types/film';
import FilmCard from '@/components/FilmCard';

interface ListViewComponentProps {
  films: Film[];
  onFilmUpdated: () => void;
}

const ListViewComponent = ({ films, onFilmUpdated }: ListViewComponentProps) => {
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

  return (
    <div className="animate-fade-in">
      {alphabeticalGroups.map(([letter, films]) => (
        <div key={letter} className="mb-6">
          <h2 className="text-4xl font-bold mb-4">{letter}</h2>
          <div className="space-y-3">
            {films.map(film => (
              <div 
                key={film.id}
                onClick={() => {
                  const filmCard = document.getElementById(`film-${film.id}`);
                  if (filmCard) {
                    filmCard.click();
                  }
                }}
                className="flex justify-between items-center p-4 bg-gray-300 rounded-full hover:bg-gray-400 cursor-pointer"
              >
                <div id={`film-${film.id}`} className="hidden">
                  <FilmCard
                    film={film}
                    onFilmUpdated={onFilmUpdated}
                  />
                </div>
                <span className="font-bold text-xl">{film.title}</span>
                <span className="font-bold text-xl">Nr #{film.idNumber}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListViewComponent;
