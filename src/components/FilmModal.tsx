
import { useRef, useState } from 'react';
import { Film } from '@/types/film';
import { updateFilm, deleteFilm } from '@/lib/storage';
import { toast } from 'sonner';
import ModalContainer from './modal/ModalContainer';
import FilmDetails from './film/FilmDetails';
import FilmActionButtons from './film/FilmActionButtons';

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
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <FilmDetails 
        film={film}
        editedFilm={editedFilm}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleArrayInputChange={handleArrayInputChange}
        handleImageUpload={handleImageUpload}
        handleImageUrlChange={handleImageUrlChange}
        triggerFileInput={triggerFileInput}
        fileInputRef={fileInputRef}
        imageError={imageError}
        handleImageError={handleImageError}
      />
      
      <FilmActionButtons 
        isEditing={isEditing}
        confirmDelete={confirmDelete}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </ModalContainer>
  );
};

export default FilmModal;
