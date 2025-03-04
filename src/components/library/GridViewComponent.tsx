
import { Film } from '@/types/film';
import FilmCard from '@/components/FilmCard';

interface GridViewComponentProps {
  films: Film[];
  onFilmUpdated: () => void;
}

const GridViewComponent = ({ films, onFilmUpdated }: GridViewComponentProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
      {films.map(film => (
        <FilmCard 
          key={film.id} 
          film={film} 
          onFilmUpdated={onFilmUpdated} 
        />
      ))}
    </div>
  );
};

export default GridViewComponent;
