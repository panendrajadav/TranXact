const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const transactionContainer = database.container('transactions');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Transaction routes working!' });
});

// Store transaction
router.post('/', async (req, res) => {
  try {
    const transaction = {
      id: req.body.transactionId || `tx_${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toISOString(),
      type: req.body.type, // 'sent' or 'received'
      organization: req.body.organizationName || req.body.organization,
      amount: req.body.amount,
      status: req.body.status || 'confirmed',
      gasUsed: req.body.gasUsed || req.body.fees || 0.001,
      notes: req.body.notes || req.body.note || req.body.reason || ''
    };

    const { resource } = await transactionContainer.items.create(transaction);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions by wallet address  
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress ORDER BY c.timestamp DESC',
      parameters: [{ name: '@walletAddress', value: walletAddress }]
    };

    const { resources } = await transactionContainer.items.query(querySpec).fetchAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get funding statistics
router.get('/statistics', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.type IN ("allocation", "sent", "received")'
    };

    const { resources } = await transactionContainer.items.query(querySpec).fetchAll();
    
    const stats = {
      totalTransactions: resources.length,
      totalAmount: resources.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      allocationTransactions: resources.filter(tx => tx.type === 'allocation').length,
      sentTransactions: resources.filter(tx => tx.type === 'sent').length,
      receivedTransactions: resources.filter(tx => tx.type === 'received').length,
      byType: resources.reduce((acc, tx) => {
        acc[tx.type] = (acc[tx.type] || 0) + (tx.amount || 0);
        return acc;
      }, {})
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;