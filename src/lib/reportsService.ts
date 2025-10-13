const API_BASE_URL = 'http://localhost:3002/api';

export interface FundingStatistics {
  walletAddress: string;
  totalFunds: number;
  totalAllocated: number;
  remainingFunds: number;
  uniqueOrganizations: number;
  avgDonation: number;
  totalAllocationCount: number;
  lastUpdated: string;
}

export interface CategoryStatistics {
  walletAddress: string;
  categoryData: Array<{
    name: string;
    value: number;
    amount: number;
    color: string;
  }>;
  lastUpdated: string;
}

export interface DonationsTimeline {
  walletAddress: string;
  timelineData: Array<{
    month: string;
    amount: number;
  }>;
  lastUpdated: string;
}

export class ReportsService {
  static async storeFundingStatistics(stats: FundingStatistics): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/funding-statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      throw new Error(`Failed to store funding statistics: ${response.statusText}`);
    }

    return response.json();
  }

  static async getFundingStatistics(walletAddress: string): Promise<FundingStatistics | null> {
    const response = await fetch(`${API_BASE_URL}/reports/funding-statistics/${walletAddress}`);

    if (!response.ok) {
      throw new Error(`Failed to get funding statistics: ${response.statusText}`);
    }

    return response.json();
  }

  static async storeCategoryStatistics(stats: CategoryStatistics): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/category-statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      throw new Error(`Failed to store category statistics: ${response.statusText}`);
    }

    return response.json();
  }

  static async getCategoryStatistics(walletAddress: string): Promise<CategoryStatistics | null> {
    const response = await fetch(`${API_BASE_URL}/reports/category-statistics/${walletAddress}`);

    if (!response.ok) {
      throw new Error(`Failed to get category statistics: ${response.statusText}`);
    }

    return response.json();
  }

  static async storeDonationsTimeline(timeline: DonationsTimeline): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/donations-timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timeline),
    });

    if (!response.ok) {
      throw new Error(`Failed to store donations timeline: ${response.statusText}`);
    }

    return response.json();
  }

  static async getDonationsTimeline(walletAddress: string): Promise<DonationsTimeline | null> {
    const response = await fetch(`${API_BASE_URL}/reports/donations-timeline/${walletAddress}`);

    if (!response.ok) {
      throw new Error(`Failed to get donations timeline: ${response.statusText}`);
    }

    return response.json();
  }
}