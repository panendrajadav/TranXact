const API_BASE_URL = 'http://localhost:3002/api';

export interface TransactionData {
  transactionId?: string;
  timestamp?: string;
  type: 'sent' | 'received';
  organization: string;
  amount: number;
  status?: string;
  gasUsed?: number;
  notes?: string;
}

export interface DonationData {
  donationId?: string;
  donorAddress: string;
  organizationName: string;
  organizationWallet?: string;
  amount: number;
  reason: string;
  date?: string;
  transactionId: string;
  allocations?: any[];
  status?: string;
}

export class TransactionAPI {
  static async storeTransaction(data: TransactionData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionId: data.transactionId,
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type,
        organizationName: data.organization,
        amount: data.amount,
        status: data.status || 'confirmed',
        gasUsed: data.gasUsed || 0.001,
        notes: data.notes || ''
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to store transaction: ${response.statusText}`);
    }

    return response.json();
  }

  static async getTransactions(walletAddress: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/transactions/wallet/${walletAddress}`);

    if (!response.ok) {
      throw new Error(`Failed to get transactions: ${response.statusText}`);
    }

    return response.json();
  }

  static async storeDonation(data: DonationData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to store donation: ${response.statusText}`);
    }

    return response.json();
  }

  static async getDonations(donorAddress: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/donations/donor/${donorAddress}`);

    if (!response.ok) {
      throw new Error(`Failed to get donations: ${response.statusText}`);
    }

    return response.json();
  }

  static async addAllocation(donationId: string, allocation: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}/allocations`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ allocation }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add allocation: ${response.statusText}`);
    }

    return response.json();
  }

  static async storeProject(project: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error(`Failed to store project: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateProjectFunding(projectId: string, amount: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/funding`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project funding: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateProject(projectId: string, updates: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`);
    }

    return response.json();
  }

  static async getFundingStatistics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/transactions/statistics`);

    if (!response.ok) {
      throw new Error(`Failed to get funding statistics: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAllAllocations(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/donations/allocations`);

    if (!response.ok) {
      throw new Error(`Failed to get allocations: ${response.statusText}`);
    }

    return response.json();
  }

  static async storeRemainingFunds(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/donations/remaining-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to store remaining funds: ${response.statusText}`);
    }

    return response.json();
  }

  static async getRemainingFunds(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/donations/remaining-funds`);

    if (!response.ok) {
      throw new Error(`Failed to get remaining funds: ${response.statusText}`);
    }

    return response.json();
  }

  static async getPrivateFunds(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/donations/private-funds`);

    if (!response.ok) {
      throw new Error(`Failed to get private funds: ${response.statusText}`);
    }

    return response.json();
  }

  static async addPrivateDonation(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/donations/private-donation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to add private donation: ${response.statusText}`);
    }

    return response.json();
  }

  static async storeOrganizationDonation(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/donations/organization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to store organization donation: ${response.statusText}`);
    }

    return response.json();
  }

  static async getOrganizationDonations(organizationWallet: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/donations/organization/${organizationWallet}`);

    if (!response.ok) {
      throw new Error(`Failed to get organization donations: ${response.statusText}`);
    }

    return response.json();
  }
}