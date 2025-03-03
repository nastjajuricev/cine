
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FilmoraLogo from '@/components/FilmoraLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login - in a real app, this would call an authentication API
    setTimeout(() => {
      // Login using the auth context
      login(name);
      
      setIsLoading(false);
      toast.success('Logged in successfully');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-filmora-gray flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[20px] shadow-lg p-8 space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <FilmoraLogo size={50} />
          <h1 className="mt-6 text-3xl font-bold text-center">Sign in to your account</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-filmora-coral border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-filmora-coral hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-filmora-coral hover:bg-filmora-coral/90"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>{' '}
            <a href="#" className="font-medium text-filmora-coral hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
