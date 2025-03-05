
import { Film } from '@/types/film';
import { useState } from 'react';
import { Camera } from 'lucide-react';

interface FilmDetailsProps {
  film: Film;
  editedFilm: Film;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleArrayInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Film) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageError: boolean;
  handleImageError: () => void;
}

const FilmDetails = ({ 
  film, 
  editedFilm, 
  isEditing, 
  handleInputChange, 
  handleArrayInputChange,
  handleImageUpload,
  handleImageUrlChange,
  triggerFileInput,
  fileInputRef,
  imageError,
  handleImageError
}: FilmDetailsProps) => {
  return (
    <>
      {/* Title */}
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
    </>
  );
};

export default FilmDetails;
