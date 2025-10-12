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
    title: "Rural Development",
    organization: "Rural Development Foundation",
    description: "Supporting rural communities with infrastructure development and livelihood programs.",
    category: "Community Development",
    location: "Rural Areas",
    target: 5,
    backers: 180,
    wallet: "C357R4KJBSBYRAE4XGV4LVNW5RR3AELXTTWNVEGJIEDK3HAM2GTIJTH5RU",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "project002",
    title: "Emergency Food Supplies",
    organization: "Food Security Initiative",
    description: "Providing emergency food supplies to communities affected by natural disasters and food insecurity.",
    category: "Food Security",
    location: "Disaster-affected Areas",
    target: 5,
    backers: 220,
    wallet: "U6XN23YTKDI6UT3FAE5ZIGJSOHUGHLI4Z4G5V77RPUSI3P5USYW5JFKH3I",
    status: "active",
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "project003",
    title: "Child Healthcare",
    organization: "Children's Health Foundation",
    description: "Providing essential healthcare services and medical support for children in underserved communities.",
    category: "Healthcare",
    location: "Underserved Communities",
    target: 5,
    backers: 165,
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