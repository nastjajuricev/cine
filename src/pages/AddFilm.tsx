import { useState, useRef } from 'react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Film } from '@/types/film';
import { addFilm, isIdNumberExists } from '@/lib/storage';
import { Camera, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddFilm = () => {
  const navigate = useNavigate();
  const [film, setFilm] = useState<Partial<Film>>({
    title: '',
    director: '',
    idNumber: '',
    year: '',
    producer: '',
    actors: [],
    genre: [],
    tags: [],
  });
  const [actorsInput, setActorsInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilm({ ...film, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImagePreview(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseCommaSeparatedValues = (input: string) => {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!film.title || !film.director || !film.idNumber) {
      toast.error('Title, director, and ID number are required');
      return;
    }

    if (isIdNumberExists(film.idNumber || '')) {
      toast.error('This ID number already exists. Please use a unique ID.');
      return;
    }

    const newFilm: Film = {
      id: crypto.randomUUID(),
      title: film.title || '',
      director: film.director || '',
      idNumber: film.idNumber || '',
      year: film.year,
      producer: film.producer,
      actors: film.actors,
      genre: film.genre,
      tags: film.tags,
      image: imagePreview || imageUrl || undefined,
      createdAt: Date.now(),
    };

    addFilm(newFilm);
    toast.success('Film added successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 mx-auto">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-[10px] border border-red-300 p-6 shadow-sm animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Add</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <input
              type="text"
              id="title"
              name="title"
              value={film.title || ''}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
              placeholder="Film Title"
            />
          </div>

          {/* Director Field */}
          <div>
            <input
              type="text"
              id="director"
              name="director"
              value={film.director || ''}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
              placeholder="Director"
            />
          </div>

          {/* Actors Field */}
          <div>
            <input
              type="text"
              id="actors"
              value={actorsInput}
              onChange={(e) => {
                setActorsInput(e.target.value);
                setFilm({ ...film, actors: parseCommaSeparatedValues(e.target.value) });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
              placeholder="Actor"
            />
          </div>

          {/* Two-column layout for Genre and ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="genre"
                value={genreInput}
                onChange={(e) => {
                  setGenreInput(e.target.value);
                  setFilm({ ...film, genre: parseCommaSeparatedValues(e.target.value) });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
                placeholder="Genre"
              />
            </div>

            <div>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={film.idNumber || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
                placeholder="ID number"
              />
            </div>
          </div>

          {/* Two-column layout for Tags and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="tags"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  setFilm({ ...film, tags: parseCommaSeparatedValues(e.target.value) });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
                placeholder="Tags"
              />
            </div>

            <div>
              <input
                type="text"
                id="year"
                name="year"
                value={film.year || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
                placeholder="Year"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div 
            className="border-2 border-gray-300 border-dashed rounded-[10px] p-6 mt-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {imagePreview || imageUrl ? (
              <div className="w-full relative">
                <img
                  src={imagePreview || imageUrl}
                  alt="Film preview"
                  className="w-full h-32 object-cover rounded-[10px]"
                  onError={() => {
                    toast.error('Invalid image URL');
                    setImageUrl('');
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-2">Drag & drop for upload</p>
              </div>
            )}
          </div>

          {/* URL Input */}
          <div>
            <input
              type="text"
              value={imageUrl}
              onChange={handleUrlImageChange}
              placeholder="Upload image via URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-6 border-2 border-black text-black rounded-[10px] font-bold hover:bg-opacity-90 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-6 bg-green-500 text-white rounded-[10px] font-bold hover:bg-opacity-90 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      <Navigation />
    </div>
  );
};

export default AddFilm;
