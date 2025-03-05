
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getDropboxConfig, saveDropboxConfig, clearDropboxConfig, isDropboxConfigured } from '@/lib/dropboxStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CloudOff, Save, X } from 'lucide-react';

const DropboxAuth = () => {
  const [accessToken, setAccessToken] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    // Check if Dropbox is already configured
    const config = getDropboxConfig();
    setIsConfigured(!!config);
    if (config) {
      setAccessToken(config.accessToken);
    }
  }, []);
  
  const handleSaveConfig = () => {
    if (!accessToken.trim()) {
      toast.error('Access token is required');
      return;
    }
    
    saveDropboxConfig({ accessToken: accessToken.trim() });
    setIsConfigured(true);
    toast.success('Dropbox configuration saved');
  };
  
  const handleClearConfig = () => {
    clearDropboxConfig();
    setIsConfigured(false);
    setAccessToken('');
    toast.success('Dropbox configuration cleared');
  };
  
  const getDropboxAuthUrl = () => {
    // Replace with your app key
    const appKey = 'YOUR_DROPBOX_APP_KEY';
    // The redirect URI should be set in your Dropbox app settings
    const redirectUri = window.location.origin;
    // Generate a random state for security
    const state = Math.random().toString(36).substring(2);
    // Store state for verification when user returns
    localStorage.setItem('dropbox-auth-state', state);
    
    return `https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Dropbox Integration</h2>
      
      {isConfigured ? (
        <div className="space-y-4">
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
            Your library is currently synced with Dropbox
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Access Token</label>
            <Input 
              type="password" 
              value={accessToken} 
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Dropbox access token" 
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSaveConfig}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Token
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleClearConfig}
              className="flex items-center"
            >
              <CloudOff className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm mb-4">
            Connect your Dropbox account to back up your film library and access it from multiple devices.
          </p>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Access Token</label>
            <Input 
              type="password" 
              value={accessToken} 
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your Dropbox access token" 
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              You can generate an access token from the Dropbox App Console.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleSaveConfig} className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Connect Dropbox
            </Button>
            
            <a 
              href={getDropboxAuthUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm flex items-center"
            >
              Get token from Dropbox
            </a>
          </div>
        </div>
      )}
      
      <Separator className="my-4" />
      
      <div className="text-xs text-gray-500">
        <p className="mb-1">Note: To use this feature, you need to:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Create a Dropbox app at the <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Dropbox Developer Console</a></li>
          <li>Generate an access token for your app</li>
          <li>Paste the token above and click Connect</li>
        </ol>
      </div>
    </div>
  );
};

export default DropboxAuth;
