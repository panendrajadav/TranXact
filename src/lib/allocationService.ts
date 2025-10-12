const API_BASE_URL = 'http://localhost:3002/api';

export interface Allocation {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  purpose: string;
  allocatedBy: string;
  walletAddress: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export const allocationService = {
  // Create new allocation
  async createAllocation(allocation: Omit<Allocation, 'id' | 'createdAt'>): Promise<Allocation> {
    const response = await fetch(`${API_BASE_URL}/allocations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...allocation,
        id: `allocation_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create allocation');
    }

    return response.json();
  },

  // Get all allocations
  async getAllocations(): Promise<Allocation[]> {
    const response = await fetch(`${API_BASE_URL}/allocations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch allocations');
    }

    return response.json();
  },

  // Get allocations by wallet address
  async getAllocationsByWallet(walletAddress: string): Promise<Allocation[]> {
    const allocations = await this.getAllocations();
    return allocations.filter(allocation => allocation.walletAddress === walletAddress);
  },

  // Update allocation
  async updateAllocation(allocationId: string, allocation: Partial<Allocation>): Promise<Allocation> {
    const response = await fetch(`${API_BASE_URL}/allocations/${allocationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allocation),
    });

    if (!response.ok) {
      throw new Error('Failed to update allocation');
    }

    return response.json();
  },
};