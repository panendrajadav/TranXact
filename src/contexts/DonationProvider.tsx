import { createContext, useContext, useState, ReactNode } from 'react';

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
  };

  const addAllocation = (donationId: string, allocation: Allocation) => {
    setDonations(prev => prev.map(donation => 
      donation.id === donationId
        ? { ...donation, allocations: [...donation.allocations, allocation] }
        : donation
    ));
  };

  const getDonationsByDonor = (address: string) => {
    return donations.filter(donation => donation.donorAddress === address);
  };

  return (
    <DonationContext.Provider value={{
      donations,
      addDonation,
      addAllocation,
      getDonationsByDonor
    }}>
      {children}
    </DonationContext.Provider>
  );
}