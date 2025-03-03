
interface EmptyStateComponentProps {
  hasFilms: boolean;
  clearFilters: () => void;
}

const EmptyStateComponent = ({ hasFilms, clearFilters }: EmptyStateComponentProps) => {
  return (
    <div className="text-center py-12 animate-fade-in">
      {hasFilms ? (
        <>
          <p className="text-gray-600 mb-4">No films match your search criteria.</p>
          <button onClick={clearFilters} className="filmora-button-secondary inline-block">
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">Your library is empty. Start adding films!</p>
          <a href="/add-film" className="filmora-button-primary inline-block">
            Add Your First Film
          </a>
        </>
      )}
    </div>
  );
};

export default EmptyStateComponent;
