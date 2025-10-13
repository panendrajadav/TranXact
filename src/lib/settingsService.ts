const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface UserSettings {
  walletAddress: string;
  email: string;
  phone: string;
  name?: string;
  updatedAt?: string;
}

export const settingsService = {
  async getUserSettings(walletAddress: string): Promise<UserSettings> {
    try {
      console.log('Fetching settings from:', `${API_BASE_URL}/settings/${walletAddress}`);
      const response = await fetch(`${API_BASE_URL}/settings/${walletAddress}`);
      if (!response.ok) {
        console.error('Settings fetch failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }
      const data = await response.json();
      console.log('Settings response:', data);
      return data;
    } catch (error) {
      console.error('Settings service error:', error);
      throw error;
    }
  },

  async updateUserSettings(walletAddress: string, email: string, phone: string, name?: string): Promise<UserSettings> {
    try {
      console.log('Updating settings for:', walletAddress, { email, phone });
      const response = await fetch(`${API_BASE_URL}/settings/${walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone, name }),
      });
      
      if (!response.ok) {
        console.error('Settings update failed:', response.status, response.statusText);
        throw new Error(`Failed to update settings: ${response.status}`);
      }
      const data = await response.json();
      console.log('Settings update response:', data);
      return data;
    } catch (error) {
      console.error('Settings update error:', error);
      throw error;
    }
  }
};