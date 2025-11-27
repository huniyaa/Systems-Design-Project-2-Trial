import express from 'express';
import { PrismaClient } from '@prisma/client';

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

// Serve static files from /public folder
app.use(express.static('public'));

// Define index2.html as the root
app.get('/', (req, res) => {
  res.redirect('/index2.html');
});

// Enable express to parse JSON data
app.use(express.json());

// Connect to database
prisma.$connect()
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ Failed to connect to MongoDB:', err.message));

// Import routes
import apiRoutes from '../routes/api.js';
app.use('/api', apiRoutes);

export default app;
