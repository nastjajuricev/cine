
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Film } from '@/types/film';
import { getFilms, addFilm } from '@/lib/storage';
import FilmCard from '@/components/FilmCard';
import FilmModal from '@/components/FilmModal';
import ListViewComponent from '@/components/library/ListViewComponent';
import { Button } from '@/components/ui/button';

const Library = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [listView, setListView] = useState(false);

  useEffect(() => {
    const loadFilms = async () => {
      const loadedFilms = await getFilms();
      setFilms(loadedFilms);
    };
    
    loadFilms();
  }, []);

  const handleFilmAdded = (newFilm: Film) => {
    addFilm(newFilm);
    setFilms(prevFilms => [...prevFilms, newFilm]);
    setIsAddModalOpen(false);
  };

  const handleFilmUpdated = async () => {
    const updatedFilms = await getFilms();
    setFilms(updatedFilms);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Film Library</h1>
        <div>
          <Button onClick={() => setListView(!listView)}>
            {listView ? 'Show Grid' : 'Show List'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="ml-4">
            <Plus className="mr-2 h-4 w-4" /> Add Film
          </Button>
        </div>
      </div>

      {/* Film List or Grid View */}
      {listView ? (
        <ListViewComponent films={films} onFilmUpdated={handleFilmUpdated} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {films.map(film => (
            <FilmCard
              key={film.id}
              film={film}
              onFilmUpdated={handleFilmUpdated}
            />
          ))}
        </div>
      )}

      {/* Add Film Modal */}
      <FilmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFilmAdded={handleFilmAdded}
        isAddMode={true}
      />
    </div>
  );
};

export default Library;
