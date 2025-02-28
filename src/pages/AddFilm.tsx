
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
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">Add New Film</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        {/* Image Upload Section */}
        <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
          {imagePreview || imageUrl ? (
            <div className="w-full h-full relative">
              <img
                src={imagePreview || imageUrl}
                alt="Film preview"
                className="w-full h-full object-cover"
                onError={() => {
                  toast.error('Invalid image URL');
                  setImageUrl('');
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Camera className="w-8 h-8 text-gray-400 mb-3" />
              <p className="text-gray-500 mb-2">Add a film poster or image</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="filmora-button-primary text-sm py-2"
                >
                  Upload Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <span className="text-center text-gray-500">or</span>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={handleUrlImageChange}
                  placeholder="Paste image URL"
                  className="filmora-input text-sm py-2"
                />
              </div>
            </>
          )}
        </div>

        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={film.title || ''}
              onChange={handleInputChange}
              required
              className="filmora-input"
              placeholder="Enter film title"
            />
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-gray-700 font-medium mb-2">
              ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={film.idNumber || ''}
              onChange={handleInputChange}
              required
              className="filmora-input"
              placeholder="Enter unique ID number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="director" className="block text-gray-700 font-medium mb-2">
            Director <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="director"
            name="director"
            value={film.director || ''}
            onChange={handleInputChange}
            required
            className="filmora-input"
            placeholder="Enter director name"
          />
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
              Year
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={film.year || ''}
              onChange={handleInputChange}
              className="filmora-input"
              placeholder="Enter release year"
            />
          </div>

          <div>
            <label htmlFor="producer" className="block text-gray-700 font-medium mb-2">
              Producer
            </label>
            <input
              type="text"
              id="producer"
              name="producer"
              value={film.producer || ''}
              onChange={handleInputChange}
              className="filmora-input"
              placeholder="Enter producer name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="actors" className="block text-gray-700 font-medium mb-2">
            Actors (comma separated)
          </label>
          <input
            type="text"
            id="actors"
            value={actorsInput}
            onChange={(e) => {
              setActorsInput(e.target.value);
              setFilm({ ...film, actors: parseCommaSeparatedValues(e.target.value) });
            }}
            className="filmora-input"
            placeholder="E.g. Tom Hanks, Meryl Streep, Leonardo DiCaprio"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-gray-700 font-medium mb-2">
            Genres (comma separated)
          </label>
          <input
            type="text"
            id="genre"
            value={genreInput}
            onChange={(e) => {
              setGenreInput(e.target.value);
              setFilm({ ...film, genre: parseCommaSeparatedValues(e.target.value) });
            }}
            className="filmora-input"
            placeholder="E.g. Drama, Comedy, Sci-Fi"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tagsInput}
            onChange={(e) => {
              setTagsInput(e.target.value);
              setFilm({ ...film, tags: parseCommaSeparatedValues(e.target.value) });
            }}
            className="filmora-input"
            placeholder="E.g. oscar-winner, 90s, classic"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="filmora-button-primary w-full"
          >
            Add Film
          </button>
        </div>
      </form>

      <Navigation />
    </div>
  );
};

export default AddFilm;
