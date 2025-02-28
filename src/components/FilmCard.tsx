
import { useState } from 'react';
import { Film } from '@/types/film';
import { cn } from '@/lib/utils';
import FilmModal from './FilmModal';

interface FilmCardProps {
  film: Film;
  variant?: 'search' | 'recent' | 'library';
  onFilmUpdated?: () => void;
}

const FilmCard = ({ film, variant = 'library', onFilmUpdated }: FilmCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getBgColor = () => {
    switch (variant) {
      case 'search':
        return 'bg-filmora-light-pink';
      case 'recent':
        return 'bg-filmora-light-green';
      default:
        return 'bg-white';
    }
  };

  const cardClasses = cn(
    'filmora-card group',
    getBgColor(),
    'transform transition-all duration-300 hover:scale-[1.02]'
  );

  return (
    <>
      <div 
        className={cardClasses}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-square relative overflow-hidden">
          {film.image && !imageError ? (
            <img
              src={film.image}
              alt={film.title}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-lg font-medium">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{film.title}</h3>
          <p className="text-gray-600 mt-1">ID: {film.idNumber}</p>
        </div>
      </div>

      <FilmModal
        film={film}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFilmUpdated={onFilmUpdated}
      />
    </>
  );
};

export default FilmCard;
