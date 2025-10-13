const express = require('express');
const cors = require('cors');
require('dotenv').config();

const transactionRoutes = require('./routes/transactions');
const donationRoutes = require('./routes/donations');
const projectRoutes = require('./routes/projects');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'TranXact Backend Server', status: 'running' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', port: PORT });
});

// Transaction routes
app.use('/api/transactions', transactionRoutes);

// Donation routes
app.use('/api/donations', donationRoutes);

// Project routes
app.use('/api/projects', projectRoutes);

// Report routes
app.use('/api/reports', reportRoutes);

// Catch all route (must be last)
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/health`);
  console.log(`   - http://localhost:${PORT}/api/transactions`);
});