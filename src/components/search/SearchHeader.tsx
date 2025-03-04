
import { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

interface SearchHeaderProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

const SearchHeader: FC<SearchHeaderProps> = ({ initialQuery, onSearch }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Search</h1>
      </div>

      <div className="mb-8 animate-fade-in">
        <SearchBar 
          onSearch={onSearch} 
          placeholder="Search for films..." 
          initialValue={initialQuery}
        />
      </div>
    </>
  );
};

export default SearchHeader;
