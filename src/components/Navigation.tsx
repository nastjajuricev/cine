
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import FilmoraLogo from './FilmoraLogo';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, Home, Film, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Navigation = () => {
  const location = useLocation();
  const path = location.pathname;
  const { logout } = useAuth();
  
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
            <div className={cn("w-7 h-7 flex items-center justify-center", 
                isActive('/add-film') ? "text-filmora-coral" : "text-white")}>
              <Plus size={24} strokeWidth={2.5} />
            </div>
          </Link>
          
          <Link 
            to="/search" 
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
            aria-label="Search"
          >
            <div className={cn("w-7 h-7 flex items-center justify-center", 
                isActive('/search') ? "text-filmora-coral" : "text-white")}>
              <Search size={24} strokeWidth={2.5} />
            </div>
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
            <div className={cn("w-7 h-7 flex items-center justify-center", 
                isActive('/library') ? "text-filmora-coral" : "text-white")}>
              <Film size={24} strokeWidth={2.5} />
            </div>
          </Link>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={logout}
                  className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
                  aria-label="Logout"
                >
                  <div className="w-7 h-7 flex items-center justify-center text-white">
                    <LogOut size={24} strokeWidth={2.5} />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
