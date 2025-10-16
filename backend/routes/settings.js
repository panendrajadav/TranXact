const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const settingsContainer = database.container('settings');

// Get user settings
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Try a direct point-read first (fast when partition key matches)
    try {
      const { resource } = await settingsContainer.item(walletAddress, walletAddress).read();
      if (resource) {
        return res.json(resource);
      }
    } catch (readErr) {
      // If read returns 404 or partition key mismatch, fall through to query
      if (readErr.code && readErr.code !== 404) {
        console.warn('Point-read for settings failed (will fallback to query):', readErr.message || readErr);
      }
    }

    // Fallback: query by walletAddress property (works regardless of partition key configuration)
    try {
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress',
        parameters: [{ name: '@walletAddress', value: walletAddress }]
      };
      const { resources } = await settingsContainer.items.query(querySpec).fetchAll();
      if (resources && resources.length > 0) {
        return res.json(resources[0]);
      }
      return res.json({ walletAddress, email: '', phone: '' });
    } catch (queryErr) {
      console.error('Failed to query settings container:', queryErr);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } catch (error) {
    console.error('Unexpected error in settings GET:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user settings
router.put('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { email, phone, name } = req.body;
    
    const settingsData = {
      id: walletAddress,
      walletAddress,
      email: email || '',
      phone: phone || '',
      name: name || '',
      updatedAt: new Date().toISOString()
    };
    console.log('Upserting settings for', walletAddress, settingsData);
    const { resource } = await settingsContainer.items.upsert(settingsData);
    console.log('Upsert result:', resource && { id: resource.id, walletAddress: resource.walletAddress, email: resource.email });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;