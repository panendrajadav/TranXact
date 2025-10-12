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

// Update project funding
router.put('/:projectId/funding', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount } = req.body;

    const { resource: project } = await projectContainer.item(projectId, projectId).read();
    
    project.raised = (project.raised || 0) + amount;
    project.backers = (project.backers || 0) + 1;
    
    const { resource } = await projectContainer.item(projectId, projectId).replace(project);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;