const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface UserProfile {
  walletAddress: string;
  email: string;
  phone: string;
  name: string;
  totalTransactions: number;
  totalDonated: number;
  lastActivity: number | null;
  updatedAt: string;
}

export const userService = {
  async getUserProfile(walletAddress: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('User service error:', error);
      throw error;
    }
  }
};