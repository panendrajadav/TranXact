# TranXact Backend

Node.js + Express backend with Azure Cosmos DB integration.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm run dev  # Development mode with nodemon
npm start    # Production mode
```

## Cosmos DB Integration

The `cosmosClient.js` module provides:
- Connected `CosmosClient` instance
- Database reference
- `getContainer(name)` function for accessing containers

### Available Containers
- users
- projects  
- donations
- allocations
- transactions
- settings

### Usage Example
```javascript
import { getContainer } from './config/cosmosClient.js';

const usersContainer = getContainer('users');
const { resources: users } = await usersContainer.items.readAll().fetchAll();
```

## API Endpoints

- `GET /api/health` - Test Cosmos DB connection
- `GET /api/users` - Example users endpoint