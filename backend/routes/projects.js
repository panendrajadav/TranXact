const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const projectContainer = database.container('projects');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Project routes working!' });
});

// Store/Update project
router.post('/', async (req, res) => {
  try {
    const project = {
      id: req.body.id,
      title: req.body.title,
      organization: req.body.organization,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      target: req.body.target,
      raised: req.body.raised,
      backers: req.body.backers,
      wallet: req.body.wallet
    };

    const { resource } = await projectContainer.items.create(project);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.title'
    };

    const { resources } = await projectContainer.items.query(querySpec).fetchAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    // Find project using query
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: projectId }]
    };
    
    const { resources } = await projectContainer.items.query(querySpec).fetchAll();
    
    if (resources.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = { ...resources[0], ...updates };
    
    // Use upsert to update
    const { resource } = await projectContainer.items.upsert(project);
    res.json(resource);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update project funding
router.put('/:projectId/funding', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount } = req.body;

    // Find project using query
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: projectId }]
    };
    
    const { resources } = await projectContainer.items.query(querySpec).fetchAll();
    
    if (resources.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = resources[0];
    project.raised = (project.raised || 0) + amount;
    project.backers = (project.backers || 0) + 1;
    
    // Use upsert to update
    const { resource } = await projectContainer.items.upsert(project);
    res.json(resource);
  } catch (error) {
    console.error('Error updating project funding:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find project using query
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: projectId }]
    };
    
    const { resources } = await projectContainer.items.query(querySpec).fetchAll();
    
    if (resources.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = resources[0];
    await projectContainer.item(project.id).delete();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;