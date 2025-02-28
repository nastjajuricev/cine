
import { useRef, useState } from 'react';
import { X, Edit, Trash, Save, Camera, ArrowLeft } from 'lucide-react';
import { Film } from '@/types/film';
import { updateFilm, deleteFilm } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
        className="modal-content max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center text-gray-600 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Cancel</span>
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center text-filmora-coral font-medium hover:opacity-80"
            >
              <Save className="w-5 h-5 mr-1" />
              <span>Save</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Image */}
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

        {/* Title and ID */}
        <div className="mb-5">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedFilm.title}
              onChange={handleInputChange}
              placeholder="Film Title"
              className="w-full text-2xl font-bold mb-2 p-2 border-b focus:outline-none focus:border-filmora-coral"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-2">{film.title}</h2>
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

        {/* Details */}
        <div className="space-y-4 mb-6">
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
              <p>{film.director}</p>
            )}
          </div>

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
              <p>{film.year || 'Not specified'}</p>
            )}
          </div>

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
              <p>{film.producer || 'Not specified'}</p>
            )}
          </div>

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
              <p>{film.actors?.join(', ') || 'Not specified'}</p>
            )}
          </div>

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
              <p>{film.genre?.join(', ') || 'Not specified'}</p>
            )}
          </div>

          <div>
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
                )) || 'No tags'}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center bg-filmora-black text-white rounded-full px-4 py-2 hover:bg-opacity-80 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>

            {confirmDelete ? (
              <button
                onClick={handleDelete}
                className="flex items-center justify-center bg-red-500 text-white rounded-full px-4 py-2 hover:bg-opacity-80 transition-colors"
              >
                Confirm Delete
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className="flex items-center justify-center bg-gray-200 text-gray-700 rounded-full px-4 py-2 hover:bg-gray-300 transition-colors"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmModal;
