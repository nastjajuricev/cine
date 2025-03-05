
interface FilmActionButtonsProps {
  isEditing: boolean;
  confirmDelete: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const FilmActionButtons = ({
  isEditing,
  confirmDelete,
  onEdit,
  onCancel,
  onSave,
  onDelete
}: FilmActionButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {!isEditing ? (
        <>
          <button
            onClick={onEdit}
            className="bg-filmora-black text-white rounded-full py-2 text-center hover:bg-opacity-80 transition-colors"
          >
            Edit
          </button>

          {confirmDelete ? (
            <button
              onClick={onDelete}
              className="bg-red-500 text-white rounded-full py-2 text-center hover:bg-opacity-80 transition-colors"
            >
              Confirm Delete
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="bg-gray-200 text-gray-700 rounded-full py-2 text-center hover:bg-gray-300 transition-colors"
            >
              Delete
            </button>
          )}
        </>
      ) : (
        <>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 rounded-full py-2 text-center hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={onSave}
            className="bg-filmora-coral text-white rounded-full py-2 text-center hover:bg-opacity-80 transition-colors"
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default FilmActionButtons;
