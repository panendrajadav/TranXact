const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔗 Testing Cosmos DB connection...');
    
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });

    const database = client.database(process.env.COSMOS_DATABASE);
    
    // List all containers
    const { resources: containers } = await database.containers.readAll().fetchAll();
    console.log('📦 Available containers:');
    containers.forEach(container => {
      console.log(`  - ${container.id}`);
    });

    // Check if pvtreports exists
    const pvtreportsExists = containers.some(c => c.id === 'pvtreports');
    console.log(`\n🎯 pvtreports container exists: ${pvtreportsExists}`);

    if (pvtreportsExists) {
      console.log('\n✅ Ready to store reports data in pvtreports container');
      
      // Show sample data structure that will be stored
      console.log('\n📋 SAMPLE REPORT DATA STRUCTURE:');
      console.log('================================');
      
      const sampleFundingStats = {
        id: 'WALLET_ADDRESS_123',
        walletAddress: 'WALLET_ADDRESS_123',
        totalFunds: 1500.50,
        totalAllocated: 800.25,
        remainingFunds: 700.25,
        uniqueOrganizations: 5,
        avgDonation: 300.10,
        totalAllocationCount: 8,
        lastUpdated: new Date().toISOString(),
        type: 'funding_statistics'
      };

      const sampleCategoryStats = {
        id: 'category_WALLET_123_1697123456789',
        walletAddress: 'WALLET_ADDRESS_123',
        categoryData: [
          { name: 'Healthcare', value: 40, amount: 320.10, color: 'hsl(147 86% 40%)' },
          { name: 'Education', value: 35, amount: 280.09, color: 'hsl(37 100% 55%)' },
          { name: 'Environment', value: 25, amount: 200.06, color: 'hsl(217 91% 60%)' }
        ],
        lastUpdated: new Date().toISOString(),
        type: 'category_statistics'
      };

      console.log('\n💰 Funding Statistics:');
      console.log(JSON.stringify(sampleFundingStats, null, 2));
      
      console.log('\n📊 Category Statistics:');
      console.log(JSON.stringify(sampleCategoryStats, null, 2));

      console.log('\n🚀 Implementation Ready!');
      console.log('When you allocate funds, the reports will be automatically updated in pvtreports container.');
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();