
import { useRef, useState } from 'react';
import { X, Edit, Trash, Save, Camera, ArrowLeft } from 'lucide-react';
import { Film } from '@/types/film';
import { updateFilm, deleteFilm } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilmModalProps {
  film: Film;
  isOpen: boolean;
  onClose: () => void;
  onFilmUpdated?: () => void;
}

const FilmModal = ({ film, isOpen, onClose, onFilmUpdated }: FilmModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFilm, setEditedFilm] = useState<Film>({ ...film });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedFilm({ ...editedFilm, [name]: value });
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Film) => {
    const value = e.target.value;
    // Split by commas and trim whitespace
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setEditedFilm({ ...editedFilm, [field]: array });
  };

  const handleSave = () => {
    if (!editedFilm.title.trim() || !editedFilm.director.trim() || !editedFilm.idNumber.trim()) {
      toast.error('Title, director, and ID number are required');
      return;
    }
    
    updateFilm(editedFilm);
    setIsEditing(false);
    toast.success('Film updated successfully');
    onFilmUpdated?.();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    deleteFilm(film.id);
    toast.success('Film deleted successfully');
    onClose();
    onFilmUpdated?.();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditedFilm({ ...editedFilm, image: reader.result as string });
      setImageError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedFilm({ ...editedFilm, image: e.target.value });
    setImageError(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-md max-h-[90vh] w-[90%] overflow-y-auto overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title - Now moved above image */}
        <div className="mb-4 min-w-full">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedFilm.title}
              onChange={handleInputChange}
              placeholder="Film Title"
              className="w-full text-2xl font-bold p-2 border-b focus:outline-none focus:border-filmora-coral"
            />
          ) : (
            <h2 className="text-2xl font-bold">{film.title}</h2>
          )}
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">ID:</span>
            {isEditing ? (
              <input
                type="text"
                name="idNumber"
                value={editedFilm.idNumber}
                onChange={handleInputChange}
                placeholder="ID Number"
                className="p-1 border-b focus:outline-none focus:border-filmora-coral"
              />
            ) : (
              <span>{film.idNumber}</span>
            )}
          </div>
        </div>

        {/* Image - compressed slightly */}
        <div className="aspect-video relative rounded-xl overflow-hidden mb-5 bg-gray-100">
          {isEditing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {editedFilm.image && !imageError ? (
                <img
                  src={editedFilm.image}
                  alt={editedFilm.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-3">No image or invalid URL</p>
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="bg-white rounded-full p-3 mr-2"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <div className="mt-3 w-full">
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Or paste image URL"
                  value={editedFilm.image || ''}
                  onChange={handleImageUrlChange}
                  className="filmora-input text-sm py-2 bg-white bg-opacity-90"
                />
              </div>
            </div>
          ) : (
            <>
              {film.image && !imageError ? (
                <img
                  src={film.image}
                  alt={film.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Details section - 2 column grid, only populated entries */}
        <div className="grid grid-cols-2 gap-4 mb-6 min-w-full">
          {/* Director - Always show as it's required */}
          <div>
            <label className="block text-gray-500 text-sm mb-1">Director</label>
            {isEditing ? (
              <input
                type="text"
                name="director"
                value={editedFilm.director}
                onChange={handleInputChange}
                placeholder="Director"
                className="w-full p-2 border rounded focus:outline-none focus:border-filmora-coral"
              />
            ) : (
              <p className="break-words">{film.director}</p>
            )}
          </div>

          {/* Year - Only show if present or editing */}
          {(isEditing || film.year) && (
            <div>
              <label className="block text-gray-500 text-sm mb-1">Year</label>
              {isEditing ? (
                <input
                  type="text"
                  name="year"
                  value={editedFilm.year || ''}
                  onChange={handleInputChange}
                  placeholder="Year"
                  className="w-full p-2 border rounded focus:outline-none focus:border-filmora-coral"
                />
              ) : (
                <p>{film.year}</p>
              )}
            </div>
          )}

          {/* Producer - Only show if present or editing */}
          {(isEditing || film.producer) && (
            <div>
              <label className="block text-gray-500 text-sm mb-1">Producer</label>
              {isEditing ? (
                <input
                  type="text"
                  name="producer"
                  value={editedFilm.producer || ''}
                  onChange={handleInputChange}
                  placeholder="Producer"
                  className="w-full p-2 border rounded focus:outline-none focus:border-filmora-coral"
                />
              ) : (
                <p className="break-words">{film.producer}</p>
              )}
            </div>
          )}

          {/* Actors - Only show if present or editing */}
          {(isEditing || (film.actors && film.actors.length > 0)) && (
            <div>
              <label className="block text-gray-500 text-sm mb-1">Actors</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedFilm.actors?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange(e, 'actors')}
                  placeholder="Actors (comma separated)"
                  className="w-full p-2 border rounded focus:outline-none focus:border-filmora-coral"
                />
              ) : (
                <p className="break-words">{film.actors?.join(', ')}</p>
              )}
            </div>
          )}

          {/* Genres - Only show if present or editing */}
          {(isEditing || (film.genre && film.genre.length > 0)) && (
            <div>
              <label className="block text-gray-500 text-sm mb-1">Genres</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedFilm.genre?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange(e, 'genre')}
                  placeholder="Genres (comma separated)"
                  className="w-full p-2 border rounded focus:outline-none focus:border-filmora-coral"
                />
              ) : (
                <p className="break-words">{film.genre?.join(', ')}</p>
              )}
            </div>
          )}

          {/* Tags - Only show if present or editing */}
          {(isEditing || (film.tags && film.tags.length > 0)) && (
            <div className="col-span-2">
              <label className="block text-gray-500 text-sm mb-1">Tags</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedFilm.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange(e, 'tags')}
                  placeholder="Tags (comma separated)"
                  className="w-full p-2 border rounded focus:outline-none focus:border-filmora-coral"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {film.tags?.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - Equal width without icons */}
        {!isEditing ? (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-filmora-black text-white rounded-full py-2 text-center hover:bg-opacity-80 transition-colors"
            >
              Edit
            </button>

            {confirmDelete ? (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white rounded-full py-2 text-center hover:bg-opacity-80 transition-colors"
              >
                Confirm Delete
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className="bg-gray-200 text-gray-700 rounded-full py-2 text-center hover:bg-gray-300 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 rounded-full py-2 text-center hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="bg-filmora-coral text-white rounded-full py-2 text-center hover:bg-opacity-80 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmModal;
