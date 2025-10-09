import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CosmosClient } from '@azure/cosmos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Cosmos DB setup
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;

const cosmosClient = new CosmosClient({ endpoint, key });
const database = cosmosClient.database(databaseId);
const getContainer = (containerName) => database.container(containerName);

app.use(cors());
app.use(express.json());

// GET /api/ - Root endpoint
app.get('/api/', (req, res) => {
  res.json({ message: 'TranXact API is running' });
});

// POST /api/allocations - Create new allocation
app.post('/api/allocations', async (req, res) => {
  try {
    const container = getContainer('allocations');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/allocations - Get all allocations
app.get('/api/allocations', async (req, res) => {
  try {
    const container = getContainer('allocations');
    const { resources: allocations } = await container.items.readAll().fetchAll();
    console.log('Found allocations:', allocations.length);
    res.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const container = getContainer('projects');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects - Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const container = getContainer('projects');
    const { resources: projects } = await container.items.readAll().fetchAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id - Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const container = getContainer('projects');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});