
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import FilmoraLogo from './FilmoraLogo';

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
            <div className={cn("w-7 h-7 flex items-center justify-center", isActive('/add-film') && "text-filmora-coral")}>
              <img 
                src="/lovable-uploads/c1448882-2375-468f-8505-1afe7c43686e.png" 
                alt="Add Film" 
                className="w-full h-full object-contain rounded-[10px]"
              />
            </div>
          </Link>
          
          <Link 
            to="/search" 
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110"
            aria-label="Search"
          >
            <div className={cn("w-7 h-7 flex items-center justify-center", isActive('/search') && "text-filmora-coral")}>
              <img 
                src="/lovable-uploads/cc59a404-c1ec-464a-95ab-8730154a3bbc.png" 
                alt="Search" 
                className="w-full h-full object-contain rounded-[10px]"
              />
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
            <div className={cn("w-7 h-7 flex items-center justify-center", isActive('/library') && "text-filmora-coral")}>
              <img 
                src="/lovable-uploads/57c6be16-d930-40de-92aa-97e9ca5782f4.png" 
                alt="Library" 
                className="w-full h-full object-contain rounded-[10px]"
              />
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
