const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

async function initReportsContainer() {
  try {
    const database = client.database(process.env.COSMOS_DATABASE);
    
    // Create pvtreports container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({
      id: 'pvtreports',
      partitionKey: {
        paths: ['/walletAddress']
      }
    });
    
    console.log('✅ Private reports container initialized successfully');
    console.log(`Container ID: ${container.id}`);
    
  } catch (error) {
    console.error('❌ Error initializing pvtreports container:', error);
  }
}

initReportsContainer();