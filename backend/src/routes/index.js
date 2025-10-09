import express from 'express';
import { getContainer, database } from '../config/cosmosClient.js';

const router = express.Router();

// GET / - Root endpoint
router.get('/', (req, res) => {
  res.json({ message: 'TranXact API is running' });
});

// GET /health - Test Cosmos DB connection
router.get('/health', async (req, res) => {
  try {
    const { resource: databaseInfo } = await database.read();
    res.json({ status: 'Connected to Cosmos DB', database: databaseInfo.id });
  } catch (error) {
    res.status(500).json({ status: 'Connection failed', error: error.message });
  }
});

// GET /projects/:id - Get project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const container = getContainer('projects');
    const { resource } = await container.item(req.params.id).read();
    res.json(resource);
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
});

// GET /transactions - Get all transactions
router.get('/transactions', async (req, res) => {
  try {
    const container = getContainer('transactions');
    const { resources: transactions } = await container.items.readAll().fetchAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /users - Create new user
router.post('/users', async (req, res) => {
  try {
    const container = getContainer('users');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /projects - Create new project
router.post('/projects', async (req, res) => {
  try {
    const container = getContainer('projects');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /donations - Create new donation
router.post('/donations', async (req, res) => {
  try {
    const container = getContainer('donations');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /allocations - Create new allocation
router.post('/allocations', async (req, res) => {
  try {
    const container = getContainer('allocations');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /transactions - Create new transaction
router.post('/transactions', async (req, res) => {
  try {
    const container = getContainer('transactions');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /settings - Create new setting
router.post('/settings', async (req, res) => {
  try {
    const container = getContainer('settings');
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const container = getContainer('users');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /projects/:id - Delete project
router.delete('/projects/:id', async (req, res) => {
  try {
    const container = getContainer('projects');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /donations/:id - Delete donation
router.delete('/donations/:id', async (req, res) => {
  try {
    const container = getContainer('donations');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /allocations/:id - Delete allocation
router.delete('/allocations/:id', async (req, res) => {
  try {
    const container = getContainer('allocations');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /transactions/:id - Delete transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const container = getContainer('transactions');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /settings/:id - Delete setting
router.delete('/settings/:id', async (req, res) => {
  try {
    const container = getContainer('settings');
    await container.item(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;