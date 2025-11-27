// API endpoint for trips
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
    if (req.method === 'GET') {
      // Get all trips
      const trips = await prisma.trip.findMany({
        include: {
          cities: {
            include: {
              activities: true
            }
          }
        }
      });
      return res.status(200).json(trips);
    } 
    else if (req.method === 'POST') {
      // Create a new trip
      const { name, cities } = req.body;
      const trip = await prisma.trip.create({
        data: {
          name,
          cities: {
            create: cities.map(city => ({
              name: city.name,
              transport: city.transport,
              startDate: city.startDate,
              endDate: city.endDate,
              posX: city.position?.x || 100,
              posY: city.position?.y || 300
            }))
          }
        },
        include: {
          cities: {
            include: {
              activities: true
            }
          }
        }
      });
      return res.status(201).json(trip);
    }
    else if (req.method === 'DELETE') {
      // Delete a trip - handled by [tripId].js
      return res.status(405).json({ error: 'Use /api/trips/[id] to delete' });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
