// API endpoint for individual cities
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

  const { cityId } = req.query;

  try {
    if (req.method === 'PATCH') {
      // Update city position
      const { posX, posY } = req.body;
      const city = await prisma.city.update({
        where: { id: cityId },
        data: {
          posX,
          posY
        },
        include: {
          activities: true
        }
      });
      return res.status(200).json(city);
    }
    else if (req.method === 'DELETE') {
      // Delete a city
      const result = await prisma.city.delete({
        where: { id: cityId }
      });
      return res.status(200).json({ success: true, deletedCity: result });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
