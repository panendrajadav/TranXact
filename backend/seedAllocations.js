import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;

const cosmosClient = new CosmosClient({ endpoint, key });
const database = cosmosClient.database(databaseId);
const getContainer = (containerName) => database.container(containerName);

const sampleAllocations = [
  {
    id: "allocation001",
    projectId: "water-project-001",
    projectName: "Clean Water Initiative",
    amount: 5000,
    purpose: "Water pump installation",
    allocatedBy: "user123",
    allocatorName: "John Doe",
    walletAddress: "0x1234567890abcdef",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "allocation002", 
    projectId: "education-project-001",
    projectName: "Rural School Development",
    amount: 3000,
    purpose: "School supplies and books",
    allocatedBy: "user456",
    allocatorName: "Jane Smith",
    walletAddress: "0xabcdef1234567890",
    status: "pending",
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "allocation003",
    projectId: "healthcare-project-001", 
    projectName: "Mobile Health Clinic",
    amount: 7500,
    purpose: "Medical equipment purchase",
    allocatedBy: "user789",
    allocatorName: "Mike Johnson",
    walletAddress: "0x9876543210fedcba",
    status: "completed",
    createdAt: "2024-01-17T09:15:00Z"
  }
];

async function seedAllocations() {
  try {
    const container = getContainer('allocations');
    
    for (const allocation of sampleAllocations) {
      const { resource } = await container.items.create(allocation);
      console.log(`Created allocation: ${resource.id}`);
    }
    
    console.log('All sample allocations created successfully!');
  } catch (error) {
    console.error('Error creating allocations:', error.message);
  }
}

seedAllocations();