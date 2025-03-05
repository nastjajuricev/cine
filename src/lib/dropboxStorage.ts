
import { Film, SearchHistory } from '@/types/film';

// Dropbox API configuration
export interface DropboxConfig {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Check if Dropbox is configured
export const isDropboxConfigured = (): boolean => {
  return !!localStorage.getItem('filmora-dropbox-config');
};

// Get Dropbox configuration
export const getDropboxConfig = (): DropboxConfig | null => {
  try {
    const config = localStorage.getItem('filmora-dropbox-config');
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Error retrieving Dropbox configuration:', error);
    return null;
  }
};

// Save Dropbox configuration
export const saveDropboxConfig = (config: DropboxConfig): void => {
  try {
    localStorage.setItem('filmora-dropbox-config', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving Dropbox configuration:', error);
  }
};

// Clear Dropbox configuration
export const clearDropboxConfig = (): void => {
  localStorage.removeItem('filmora-dropbox-config');
};

// Upload file to Dropbox
export const uploadToDropbox = async (path: string, content: string, config: DropboxConfig): Promise<boolean> => {
  try {
    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${path}`,
          mode: 'overwrite'
        })
      },
      body: content
    });

    if (!response.ok) {
      console.error('Dropbox upload failed:', await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error uploading to Dropbox:', error);
    return false;
  }
};

// Download file from Dropbox
export const downloadFromDropbox = async (path: string, config: DropboxConfig): Promise<string | null> => {
  try {
    const response = await fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${path}`
        })
      }
    });

    if (!response.ok) {
      // If file not found, return null instead of error
      if (response.status === 409) {
        return null;
      }
      console.error('Dropbox download failed:', await response.text());
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error downloading from Dropbox:', error);
    return null;
  }
};

// Save films to Dropbox
export const saveFilmsToDropbox = async (films: Film[]): Promise<boolean> => {
  const config = getDropboxConfig();
  if (!config) return false;
  
  return await uploadToDropbox('filmora-films.json', JSON.stringify(films), config);
};

// Load films from Dropbox
export const loadFilmsFromDropbox = async (): Promise<Film[] | null> => {
  const config = getDropboxConfig();
  if (!config) return null;
  
  const content = await downloadFromDropbox('filmora-films.json', config);
  if (!content) return null;
  
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing films from Dropbox:', error);
    return null;
  }
};

// Save search history to Dropbox
export const saveSearchHistoryToDropbox = async (history: SearchHistory[]): Promise<boolean> => {
  const config = getDropboxConfig();
  if (!config) return false;
  
  return await uploadToDropbox('filmora-search-history.json', JSON.stringify(history), config);
};

// Load search history from Dropbox
export const loadSearchHistoryFromDropbox = async (): Promise<SearchHistory[] | null> => {
  const config = getDropboxConfig();
  if (!config) return null;
  
  const content = await downloadFromDropbox('filmora-search-history.json', config);
  if (!content) return null;
  
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing search history from Dropbox:', error);
    return null;
  }
};
