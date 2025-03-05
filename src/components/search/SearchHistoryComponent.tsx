
import { FC } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { SearchHistory } from '@/types/film';
import { formatDistanceToNow } from 'date-fns';

interface SearchHistoryComponentProps {
  searchHistory: SearchHistory[];
  onClearSearchHistory: () => void;
}

const SearchHistoryComponent: FC<SearchHistoryComponentProps> = ({
  searchHistory,
  onClearSearchHistory,
}) => {
  if (!searchHistory || searchHistory.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Searches</h2>
        <button
          onClick={onClearSearchHistory}
          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
        >
          <Trash2 size={16} />
          Clear History
        </button>
      </div>
      
      <div className="space-y-2">
        {searchHistory.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <div>
                <p className="font-medium">{item.term}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })} • 
                  {item.resultCount} result{item.resultCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SearchHistoryComponent;
