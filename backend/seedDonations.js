import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;

const cosmosClient = new CosmosClient({ endpoint, key });
const database = cosmosClient.database(databaseId);
const getContainer = (containerName) => database.container(containerName);

const sampleDonations = [
  {
    id: "donation001",
    donorWallet: "SAMPLE_WALLET_ADDRESS_1",
    amount: 100,
    allocatedAmount: 0,
    reason: "Supporting rural development projects",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    transactionHash: "0xabcdef1234567890"
  },
  {
    id: "donation002", 
    donorWallet: "SAMPLE_WALLET_ADDRESS_1",
    amount: 250,
    allocatedAmount: 0,
    reason: "Emergency food supplies donation",
    date: "2024-01-16T14:20:00Z",
    status: "completed",
    transactionHash: "0x1234567890abcdef"
  },
  {
    id: "donation003",
    donorWallet: "SAMPLE_WALLET_ADDRESS_2",
    amount: 75,
    allocatedAmount: 0,
    reason: "Healthcare support for children",
    date: "2024-01-17T09:15:00Z",
    status: "completed",
    transactionHash: "0x9876543210fedcba"
  }
];

async function seedDonations() {
  try {
    const container = getContainer('donations');
    
    for (const donation of sampleDonations) {
      const { resource } = await container.items.create(donation);
      console.log(`Created donation: ${resource.id} - ${resource.amount} ALGO`);
    }
    
    console.log('All sample donations created successfully!');
  } catch (error) {
    console.error('Error creating donations:', error.message);
  }
}

seedDonations();