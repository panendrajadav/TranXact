const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const settingsContainer = database.container('settings');

// Get user settings
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const { resource } = await settingsContainer.item(walletAddress, walletAddress).read();
    
    if (resource) {
      res.json(resource);
    } else {
      res.json({ walletAddress, email: '', phone: '' });
    }
  } catch (error) {
    if (error.code === 404) {
      res.json({ walletAddress: req.params.walletAddress, email: '', phone: '' });
    } else {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
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
    
    const { resource } = await settingsContainer.items.upsert(settingsData);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;