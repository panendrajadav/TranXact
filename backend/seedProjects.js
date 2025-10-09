import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;

const cosmosClient = new CosmosClient({ endpoint, key });
const database = cosmosClient.database(databaseId);
const getContainer = (containerName) => database.container(containerName);

const sampleProjects = [
  {
    id: "project001",
    title: "Clean Water Initiative",
    organization: "Rural Development",
    description: "Providing clean water access to rural communities through well construction and water purification systems",
    category: "Environment",
    location: "Rural Kenya",
    target: 50000,
    raised: 12500,
    backers: 45,
    wallet: "C357R4KJBSBYRAE4XGV4LVNW5RR3AELXTTWNVEGJIEDK3HAM2GTIJTH5RU",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "project002",
    title: "Emergency Food Distribution",
    organization: "Emergency Food Supplies",
    description: "Distributing emergency food supplies to families affected by natural disasters",
    category: "Food Security",
    location: "Bangladesh",
    target: 30000,
    raised: 8750,
    backers: 32,
    wallet: "U6XN23YTKDI6UT3FAE5ZIGJSOHUGHLI4Z4G5V77RPUSI3P5USYW5JFKH3I",
    status: "active",
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "project003",
    title: "Mobile Health Clinic",
    organization: "Child Healthcare",
    description: "Mobile healthcare services for remote communities with focus on maternal and child health",
    category: "Healthcare",
    location: "Rural India",
    target: 75000,
    raised: 22500,
    backers: 67,
    wallet: "Q2DY24TCFJHIFQO7QAPKMETED5BKKVKQ7UVOCIEREIUUZ7DDKMZMJ2RHRI",
    status: "active",
    createdAt: "2024-01-17T09:15:00Z"
  }
];

async function seedProjects() {
  try {
    const container = getContainer('projects');
    
    for (const project of sampleProjects) {
      const { resource } = await container.items.create(project);
      console.log(`Created project: ${resource.title}`);
    }
    
    console.log('All sample projects created successfully!');
  } catch (error) {
    console.error('Error creating projects:', error.message);
  }
}

seedProjects();