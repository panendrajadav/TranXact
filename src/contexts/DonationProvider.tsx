import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TransactionAPI } from '@/lib/transactionAPI';

interface Donation {
  id: string;
  donorAddress: string;
  organizationName: string;
  amount: number;
  reason: string;
  date: string;
  transactionId: string;
  allocations: Allocation[];
}

interface Allocation {
  projectId?: string;
  projectName: string;
  amount: number;
  status: 'in-progress' | 'completed';
  date: string;
}

interface DonationContextType {
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'allocations'>) => void;
  addAllocation: (donationId: string, allocation: Allocation) => void;
  getDonationsByDonor: (address: string) => Donation[];
  getOrganizationDonations: (organizationWallet: string) => Promise<Donation[]>;
  loadDonationsFromDB: (walletAddress: string) => Promise<void>;
  clearDonations: () => void;
}

const DonationContext = createContext<DonationContextType | null>(null);

export function useDonations() {
  const context = useContext(DonationContext);
  if (!context) throw new Error('useDonations must be used within DonationProvider');
  return context;
}

export function DonationProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([]);



  const addDonation = (donation: Omit<Donation, 'id' | 'allocations'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      allocations: []
    };
    setDonations(prev => [newDonation, ...prev]);
    
    // Store in database
    TransactionAPI.storeDonation({
      donationId: newDonation.id,
      donorAddress: newDonation.donorAddress,
      organizationName: newDonation.organizationName,
      organizationWallet: 'OFDV5E5ZTP45MHXCQQ5EHIXAKIJ2BXGMFAAYU6Z2NG4MZTNCB3BOYXIBSQ', // United Nations wallet
      amount: newDonation.amount,
      reason: newDonation.reason,
      date: newDonation.date,
      transactionId: newDonation.transactionId,
      allocations: [],
      status: 'active'
    }).catch(error => console.error('Failed to store donation in DB:', error));
  };

  const addAllocation = (donationId: string, allocation: Allocation) => {
    setDonations(prev => prev.map(donation => 
      donation.id === donationId
        ? { ...donation, allocations: [...donation.allocations, allocation] }
        : donation
    ));
    
    TransactionAPI.addAllocation(donationId, allocation)
      .catch(error => console.error('Failed to update allocation in DB:', error));
  };

  const getDonationsByDonor = (address: string) => {
    return donations.filter(donation => donation.donorAddress === address);
  };

  const getOrganizationDonations = async (organizationWallet: string): Promise<Donation[]> => {
    try {
      const orgDonations = await TransactionAPI.getOrganizationDonations(organizationWallet);
      return orgDonations;
    } catch (error) {
      console.error('Failed to fetch organization donations:', error);
      return [];
    }
  };

  const loadDonationsFromDB = async (walletAddress: string) => {
    try {
      const dbDonations = await TransactionAPI.getDonations(walletAddress);
      setDonations(dbDonations);
    } catch (error) {
      console.error('Failed to load donations from DB:', error);
    }
  };

  const clearDonations = () => {
    setDonations([]);
  };

  return (
    <DonationContext.Provider value={{
      donations,
      addDonation,
      addAllocation,
      getDonationsByDonor,
      getOrganizationDonations,
      loadDonationsFromDB,
      clearDonations
    }}>
      {children}
    </DonationContext.Provider>
  );
}