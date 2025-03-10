
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FilmoraLogo from '@/components/FilmoraLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import SignupModal from '@/components/auth/SignupModal';
import { Mail, Lock, User } from 'lucide-react';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
              />
            </div>
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
            <button
              type="button"
              onClick={() => setShowSignupModal(true)}
              className="font-medium text-filmora-coral hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onLoginClick={() => setShowSignupModal(false)}
      />
    </div>
  );
};

export default Login;
