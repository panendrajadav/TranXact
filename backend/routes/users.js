const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const settingsContainer = database.container('settings');
const transactionContainer = database.container('transactions');

// Get complete user profile by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Fetch user settings
    let userSettings = {};
    try {
      const { resource } = await settingsContainer.item(walletAddress, walletAddress).read();
      userSettings = resource || {};
    } catch (error) {
      if (error.code !== 404) {
        console.error('Error fetching settings:', error);
      }
    }

    // Fetch user transactions to get additional profile data
    let transactionData = [];
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.walletAddress = @walletAddress",
        parameters: [{ name: "@walletAddress", value: walletAddress }]
      };
      const { resources } = await transactionContainer.items.query(querySpec).fetchAll();
      transactionData = resources;
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }

    // Compile user profile
    const userProfile = {
      walletAddress,
      email: userSettings.email || '',
      phone: userSettings.phone || '',
      name: userSettings.name || '',
      totalTransactions: transactionData.length,
      totalDonated: transactionData.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      lastActivity: transactionData.length > 0 ? 
        Math.max(...transactionData.map(tx => new Date(tx.createdAt || tx.timestamp).getTime())) : null,
      updatedAt: userSettings.updatedAt || new Date().toISOString()
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;