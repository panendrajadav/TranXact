const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database(process.env.COSMOS_DATABASE);
const transactionContainer = database.container('transactions');
const pvtreportContainer = database.container('pvtreport');
const settingsContainer = database.container('settings');

module.exports = {
  client,
  database,
  transactionContainer,
  pvtreportContainer,
  settingsContainer
};