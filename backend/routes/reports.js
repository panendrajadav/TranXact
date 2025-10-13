const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const pvtreportContainer = database.container('pvtreport');

// Store/Update funding statistics
router.post('/funding-statistics', async (req, res) => {
  try {
    const stats = {
      id: req.body.walletAddress || 'global_stats',
      walletAddress: req.body.walletAddress,
      totalFunds: req.body.totalFunds,
      totalAllocated: req.body.totalAllocated,
      remainingFunds: req.body.remainingFunds,
      uniqueOrganizations: req.body.uniqueOrganizations,
      avgDonation: req.body.avgDonation,
      totalAllocationCount: req.body.totalAllocationCount,
      lastUpdated: new Date().toISOString(),
      type: 'funding_statistics'
    };

    const { resource } = await pvtreportContainer.items.upsert(stats);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error storing funding statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get funding statistics
router.get('/funding-statistics/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress AND c.type = "funding_statistics"',
      parameters: [{ name: '@walletAddress', value: walletAddress }]
    };

    const { resources } = await pvtreportContainer.items.query(querySpec).fetchAll();
    res.json(resources[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store category statistics
router.post('/category-statistics', async (req, res) => {
  try {
    const categoryStats = {
      id: `category_${req.body.walletAddress}_${Date.now()}`,
      walletAddress: req.body.walletAddress,
      categoryData: req.body.categoryData,
      lastUpdated: new Date().toISOString(),
      type: 'category_statistics'
    };

    const { resource } = await pvtreportContainer.items.create(categoryStats);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error storing category statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get latest category statistics
router.get('/category-statistics/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress AND c.type = "category_statistics" ORDER BY c.lastUpdated DESC',
      parameters: [{ name: '@walletAddress', value: walletAddress }]
    };

    const { resources } = await pvtreportContainer.items.query(querySpec).fetchAll();
    res.json(resources[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store donations over time data
router.post('/donations-timeline', async (req, res) => {
  try {
    const timeline = {
      id: `timeline_${req.body.walletAddress}_${Date.now()}`,
      walletAddress: req.body.walletAddress,
      timelineData: req.body.timelineData,
      lastUpdated: new Date().toISOString(),
      type: 'donations_timeline'
    };

    const { resource } = await pvtreportContainer.items.create(timeline);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error storing donations timeline:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get latest donations timeline
router.get('/donations-timeline/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress AND c.type = "donations_timeline" ORDER BY c.lastUpdated DESC',
      parameters: [{ name: '@walletAddress', value: walletAddress }]
    };

    const { resources } = await pvtreportContainer.items.query(querySpec).fetchAll();
    res.json(resources[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;