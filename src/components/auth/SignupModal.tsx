
import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ModalContainer from '@/components/modal/ModalContainer';
import { toast } from 'sonner';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void; // To switch to login modal if needed
}

const SignupModal = ({ isOpen, onClose, onLoginClick }: SignupModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup - in a real app, this would call an authentication API
    setTimeout(() => {
      // Login using the auth context
      login(name);
      
      setIsLoading(false);
      toast.success('Account created successfully');
      onClose();
    }, 1500);
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-center">Create your account</h2>
        <p className="text-center text-gray-500">Join Filmora to track and organize your film collection</p>
        
        <form onSubmit={handleSignup} className="w-full space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
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
          
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-filmora-coral hover:bg-filmora-coral/90 mt-6 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : (
              <>
                Create account
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{' '}
          <button 
            onClick={onLoginClick}
            className="font-medium text-filmora-coral hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default SignupModal;
