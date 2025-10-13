const express = require('express');
const { database } = require('../config/cosmos');
const router = express.Router();

const donationContainer = database.container('donations');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Donation routes working!' });
});

// Store donation
router.post('/', async (req, res) => {
  try {
    console.log('Received donation data:', req.body);
    
    const donation = {
      id: req.body.donationId || `donation_${Date.now()}`,
      donorAddress: req.body.donorAddress,
      organizationName: req.body.organizationName,
      organizationWallet: req.body.organizationWallet,
      amount: req.body.amount,
      reason: req.body.reason,
      date: req.body.date || new Date().toISOString(),
      transactionId: req.body.transactionId,
      allocations: req.body.allocations || [],
      status: req.body.status || 'active'
    };

    console.log('Creating donation:', donation);
    const { resource } = await donationContainer.items.create(donation);
    console.log('Donation created successfully:', resource.id);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: error.message, details: error.toString() });
  }
});

// Get donations by donor address
router.get('/donor/:donorAddress', async (req, res) => {
  try {
    const { donorAddress } = req.params;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.donorAddress = @donorAddress ORDER BY c.date DESC',
      parameters: [{ name: '@donorAddress', value: donorAddress }]
    };

    const { resources } = await donationContainer.items.query(querySpec).fetchAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update donation allocations
router.put('/:donationId/allocations', async (req, res) => {
  try {
    const { donationId } = req.params;
    const { allocation } = req.body;

    console.log('Adding allocation to donation:', donationId);
    console.log('Allocation data:', allocation);

    // First, find the donation using query
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: donationId }]
    };
    
    const { resources } = await donationContainer.items.query(querySpec).fetchAll();
    
    if (resources.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    const donation = resources[0];
    
    if (!donation.allocations) {
      donation.allocations = [];
    }
    
    donation.allocations.push(allocation);
    
    // Use upsert to update the document
    const { resource } = await donationContainer.items.upsert(donation);
    console.log('Allocation added successfully');
    res.json(resource);
  } catch (error) {
    console.error('Error adding allocation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all allocations across all donations
router.get('/allocations', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE ARRAY_LENGTH(c.allocations) > 0'
    };

    const { resources } = await donationContainer.items.query(querySpec).fetchAll();
    
    // Flatten all allocations from all donations
    const allAllocations = resources.reduce((acc, donation) => {
      if (donation.allocations && donation.allocations.length > 0) {
        const allocationsWithDonationInfo = donation.allocations.map(alloc => ({
          ...alloc,
          donationId: donation.id,
          donorAddress: donation.donorAddress
        }));
        acc.push(...allocationsWithDonationInfo);
      }
      return acc;
    }, []);
    
    res.json(allAllocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store remaining funds data
router.post('/remaining-funds', async (req, res) => {
  try {
    const remainingFunds = {
      id: `remaining_${req.body.donationId}_${Date.now()}`,
      donationId: req.body.donationId,
      totalAmount: req.body.totalAmount,
      allocatedAmount: req.body.allocatedAmount,
      remainingAmount: req.body.remainingAmount,
      lastUpdated: req.body.lastUpdated || new Date().toISOString(),
      type: 'remaining_funds'
    };

    const { resource } = await donationContainer.items.create(remainingFunds);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error storing remaining funds:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get remaining funds data
router.get('/remaining-funds', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.type = "remaining_funds" ORDER BY c.lastUpdated DESC'
    };

    const { resources } = await donationContainer.items.query(querySpec).fetchAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get private funds total
router.get('/private-funds', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.donorAddress != null AND c.type != "remaining_funds"'
    };

    const { resources } = await donationContainer.items.query(querySpec).fetchAll();
    
    const totalPrivateFunds = resources.reduce((sum, donation) => {
      return sum + (donation.amount || 0);
    }, 0);
    
    res.json({ 
      totalPrivateFunds,
      donationCount: resources.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add private donation
router.post('/private-donation', async (req, res) => {
  try {
    const privateDonation = {
      id: `private_donation_${Date.now()}`,
      donorAddress: req.body.donorAddress || 'anonymous',
      organizationName: req.body.organizationName || 'Private Donor',
      amount: req.body.amount,
      reason: req.body.reason || 'Private donation',
      date: req.body.date || new Date().toISOString(),
      transactionId: req.body.transactionId || `private_${Date.now()}`,
      allocations: [],
      status: 'active',
      type: 'private_donation'
    };

    const { resource } = await donationContainer.items.create(privateDonation);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating private donation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Store organization-specific donation
router.post('/organization', async (req, res) => {
  try {
    const orgDonation = {
      id: `org_donation_${Date.now()}`,
      donorAddress: req.body.donorAddress,
      organizationName: req.body.organizationName,
      organizationWallet: req.body.organizationWallet,
      amount: req.body.amount,
      reason: req.body.reason,
      date: req.body.date || new Date().toISOString(),
      transactionId: req.body.transactionId,
      allocations: req.body.allocations || [],
      status: req.body.status || 'active',
      type: 'organization_donation'
    };

    const { resource } = await donationContainer.items.create(orgDonation);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating organization donation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get donations for specific organization wallet
router.get('/organization/:organizationWallet', async (req, res) => {
  try {
    const { organizationWallet } = req.params;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.organizationWallet = @organizationWallet AND c.type = "organization_donation" ORDER BY c.date DESC',
      parameters: [{ name: '@organizationWallet', value: organizationWallet }]
    };

    const { resources } = await donationContainer.items.query(querySpec).fetchAll();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching organization donations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;