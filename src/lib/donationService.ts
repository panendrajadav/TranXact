const API_BASE_URL = 'http://localhost:3002/api';

export interface Donation {
  id: string;
  donorWallet: string;
  amount: number;
  allocatedAmount: number;
  reason: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  transactionHash?: string;
}

export const donationService = {
  // Create new donation
  async createDonation(donation: Omit<Donation, 'id'>): Promise<Donation> {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...donation,
        id: `donation_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create donation');
    }

    return response.json();
  },

  // Get donations by wallet address
  async getDonationsByWallet(walletAddress: string): Promise<Donation[]> {
    const response = await fetch(`${API_BASE_URL}/donations/donor/${walletAddress}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }

    return response.json();
  },

  // Update donation allocated amount
  async updateDonation(donationId: string, updates: Partial<Donation>): Promise<Donation> {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update donation');
    }

    return response.json();
  },
};