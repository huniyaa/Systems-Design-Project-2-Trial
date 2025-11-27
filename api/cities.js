// API endpoint for cities
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
};

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json(corsHeaders);
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    if (req.method === 'POST') {
      // Create a new city
      const { tripId, name, transport, startDate, endDate, position } = req.body;
      const city = await prisma.city.create({
        data: {
          tripId,
          name,
          transport,
          startDate,
          endDate,
          posX: position?.x || 100,
          posY: position?.y || 300
        },
        include: {
          activities: true
        }
      });
      return res.status(201).json(city);
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
