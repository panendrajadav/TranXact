const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database(process.env.COSMOS_DATABASE);
const pvtreportContainer = database.container('pvtreport');

async function demoReports() {
  try {
    console.log('🚀 Starting Reports Demo...\n');

    const demoWallet = 'DEMO_WALLET_123';

    // 1. Store Funding Statistics
    console.log('📊 Storing Funding Statistics...');
    const fundingStats = {
      id: demoWallet,
      walletAddress: demoWallet,
      totalFunds: 1500.50,
      totalAllocated: 800.25,
      remainingFunds: 700.25,
      uniqueOrganizations: 5,
      avgDonation: 300.10,
      totalAllocationCount: 8,
      lastUpdated: new Date().toISOString(),
      type: 'funding_statistics'
    };

    const { resource: storedStats } = await pvtreportContainer.items.upsert(fundingStats);
    console.log('✅ Funding Statistics stored:', {
      id: storedStats.id,
      totalFunds: storedStats.totalFunds,
      totalAllocated: storedStats.totalAllocated,
      remainingFunds: storedStats.remainingFunds
    });

    // 2. Store Category Statistics
    console.log('\n📈 Storing Category Statistics...');
    const categoryStats = {
      id: `category_${demoWallet}_${Date.now()}`,
      walletAddress: demoWallet,
      categoryData: [
        { name: 'Healthcare', value: 40, amount: 320.10, color: 'hsl(147 86% 40%)' },
        { name: 'Education', value: 35, amount: 280.09, color: 'hsl(37 100% 55%)' },
        { name: 'Environment', value: 25, amount: 200.06, color: 'hsl(217 91% 60%)' }
      ],
      lastUpdated: new Date().toISOString(),
      type: 'category_statistics'
    };

    const { resource: storedCategory } = await pvtreportContainer.items.create(categoryStats);
    console.log('✅ Category Statistics stored:', {
      id: storedCategory.id,
      categories: storedCategory.categoryData.length
    });

    // 3. Store Donations Timeline
    console.log('\n📅 Storing Donations Timeline...');
    const timeline = {
      id: `timeline_${demoWallet}_${Date.now()}`,
      walletAddress: demoWallet,
      timelineData: [
        { month: 'Jan', amount: 250.00 },
        { month: 'Feb', amount: 300.25 },
        { month: 'Mar', amount: 450.50 },
        { month: 'Apr', amount: 500.75 }
      ],
      lastUpdated: new Date().toISOString(),
      type: 'donations_timeline'
    };

    const { resource: storedTimeline } = await pvtreportContainer.items.create(timeline);
    console.log('✅ Timeline stored:', {
      id: storedTimeline.id,
      months: storedTimeline.timelineData.length
    });

    // 4. Retrieve and Display Data
    console.log('\n🔍 Retrieving stored data...');

    // Get funding statistics
    const fundingQuery = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress AND c.type = "funding_statistics"',
      parameters: [{ name: '@walletAddress', value: demoWallet }]
    };
    const { resources: fundingResults } = await pvtreportContainer.items.query(fundingQuery).fetchAll();

    // Get category statistics
    const categoryQuery = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress AND c.type = "category_statistics" ORDER BY c.lastUpdated DESC',
      parameters: [{ name: '@walletAddress', value: demoWallet }]
    };
    const { resources: categoryResults } = await pvtreportContainer.items.query(categoryQuery).fetchAll();

    // Get timeline
    const timelineQuery = {
      query: 'SELECT * FROM c WHERE c.walletAddress = @walletAddress AND c.type = "donations_timeline" ORDER BY c.lastUpdated DESC',
      parameters: [{ name: '@walletAddress', value: demoWallet }]
    };
    const { resources: timelineResults } = await pvtreportContainer.items.query(timelineQuery).fetchAll();

    // Display Results
    console.log('\n📋 DEMO REPORT RESULTS:');
    console.log('========================');
    
    if (fundingResults[0]) {
      console.log('\n💰 FUNDING OVERVIEW:');
      console.log(`Total Funds: ${fundingResults[0].totalFunds} ALGO`);
      console.log(`Allocated: ${fundingResults[0].totalAllocated} ALGO`);
      console.log(`Remaining: ${fundingResults[0].remainingFunds} ALGO`);
      console.log(`Organizations: ${fundingResults[0].uniqueOrganizations}`);
      console.log(`Avg Donation: ${fundingResults[0].avgDonation} ALGO`);
    }

    if (categoryResults[0]) {
      console.log('\n📊 CATEGORY BREAKDOWN:');
      categoryResults[0].categoryData.forEach(cat => {
        console.log(`${cat.name}: ${cat.value}% (${cat.amount} ALGO)`);
      });
    }

    if (timelineResults[0]) {
      console.log('\n📈 MONTHLY DONATIONS:');
      timelineResults[0].timelineData.forEach(month => {
        console.log(`${month.month}: ${month.amount} ALGO`);
      });
    }

    console.log('\n✅ Demo completed successfully!');
    console.log('🎯 Reports are now dynamically stored in pvtreport container');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

demoReports();