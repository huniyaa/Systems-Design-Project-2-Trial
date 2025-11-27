// API Handler for Vercel
import express from 'express';
import { PrismaClient } from '@prisma/client';
import apiRoutes from '../routes/api.js';

const prisma = new PrismaClient();
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Enable express to parse JSON data
app.use(express.json());

// Test database connection
prisma.$connect()
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => {
    console.error('✗ Failed to connect to MongoDB:', err.message);
  });

// Mount API routes (strip /api prefix since Vercel routes to this file for /api/*)
app.use('/', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
