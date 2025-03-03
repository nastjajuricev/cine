
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated based on localStorage
    const authStatus = localStorage.getItem('filmora-isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    // Load user name if authenticated
    if (authStatus) {
      const storedName = localStorage.getItem('filmora-userName') || '';
      setUserName(storedName);
    }
    
    // Redirect to login if not authenticated and not already on login page
    if (!authStatus && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const login = (name: string) => {
    localStorage.setItem('filmora-isAuthenticated', 'true');
    localStorage.setItem('filmora-userName', name);
    setIsAuthenticated(true);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('filmora-isAuthenticated');
    localStorage.removeItem('filmora-userName');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
