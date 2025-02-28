
import { useState, FormEvent, ChangeEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search", 
  initialValue = "", 
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="filmora-input pr-12 transition-all duration-300"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-filmora-black rounded-r-full"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-filmora-white" />
      </button>
    </form>
  );
};

export default SearchBar;
