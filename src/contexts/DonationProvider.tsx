import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  clearDonations: () => void;
}

const DonationContext = createContext<DonationContextType | null>(null);

export function useDonations() {
  const context = useContext(DonationContext);
  if (!context) throw new Error('useDonations must be used within DonationProvider');
  return context;
}

export function DonationProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>(() => {
    try {
      const saved = localStorage.getItem('tranxact-donations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tranxact-donations', JSON.stringify(donations));
  }, [donations]);

  const addDonation = (donation: Omit<Donation, 'id' | 'allocations'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      allocations: []
    };
    setDonations(prev => {
      const updated = [newDonation, ...prev];
      localStorage.setItem('tranxact-donations', JSON.stringify(updated));
      return updated;
    });
  };

  const addAllocation = (donationId: string, allocation: Allocation) => {
    setDonations(prev => {
      const updated = prev.map(donation => 
        donation.id === donationId
          ? { ...donation, allocations: [...donation.allocations, allocation] }
          : donation
      );
      localStorage.setItem('tranxact-donations', JSON.stringify(updated));
      return updated;
    });
  };

  const getDonationsByDonor = (address: string) => {
    return donations.filter(donation => donation.donorAddress === address);
  };

  const clearDonations = () => {
    setDonations([]);
    localStorage.removeItem('tranxact-donations');
  };

  return (
    <DonationContext.Provider value={{
      donations,
      addDonation,
      addAllocation,
      getDonationsByDonor,
      clearDonations
    }}>
      {children}
    </DonationContext.Provider>
  );
}