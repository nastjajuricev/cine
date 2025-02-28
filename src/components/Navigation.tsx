
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, Film, Home } from 'lucide-react';
import FilmoraLogo from './FilmoraLogo';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Function to determine if a route is active
  const isActive = (route: string) => path === route;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-filmora-black py-4 px-6 shadow-lg z-10">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center justify-between">
          <Link 
            to="/add-film" 
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
            aria-label="Add Film"
          >
            <Plus 
              className={cn("nav-icon text-white", isActive('/add-film') && "text-filmora-coral")} 
              strokeWidth={2.5} 
            />
          </Link>
          
          <Link 
            to="/search" 
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
            aria-label="Search"
          >
            <Search 
              className={cn("nav-icon text-white", isActive('/search') && "text-filmora-coral")} 
              strokeWidth={2.5} 
            />
          </Link>
          
          <Link 
            to="/" 
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
            aria-label="Home"
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center", 
              isActive('/') ? "bg-filmora-coral" : "bg-white"
            )}>
              <FilmoraLogo size={24} />
            </div>
          </Link>
          
          <Link 
            to="/library" 
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
            aria-label="Library"
          >
            <Film 
              className={cn("nav-icon text-white", isActive('/library') && "text-filmora-coral")} 
              strokeWidth={2.5} 
            />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
