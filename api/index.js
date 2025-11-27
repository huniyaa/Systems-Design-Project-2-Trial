// API Handler for Vercel - Serverless Function
import express from 'express';
import { PrismaClient } from '@prisma/client';
import apiRoutes from '../routes/api.js';

const prisma = new PrismaClient();
const app = express();

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body parser middleware
app.use(express.json());

// Database connection
prisma.$connect()
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ Failed to connect to MongoDB:', err.message));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

export default app;
