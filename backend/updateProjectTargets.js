const { CosmosClient } = require("@azure/cosmos");
require('dotenv').config();

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || 'tranxactdb';

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container('projects');

async function updateProjectTargets() {
  try {
    const querySpec = {
      query: 'SELECT * FROM c'
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    
    for (const project of resources) {
      if (project.target === 15 || project.target === 5) {
        project.target = 30;
        await container.items.upsert(project);
        console.log(`Updated ${project.title} target to 30 ALGO`);
      }
    }
    
    console.log('All projects updated successfully');
  } catch (error) {
    console.error('Error updating projects:', error);
  }
}

updateProjectTargets();
