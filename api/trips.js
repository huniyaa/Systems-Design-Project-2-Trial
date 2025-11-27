import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    if (req.method === 'GET') {
      const trips = await prisma.trip.findMany({
        include: { cities: { include: { activities: true } } }
      });
      res.status(200).json(trips);
    } else if (req.method === 'POST') {
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
        include: { cities: { include: { activities: true } } }
      });
      res.status(201).json(trip);
    } else if (req.method === 'DELETE') {
      const { tripId } = req.body;
      const result = await prisma.trip.delete({ where: { id: tripId } });
      res.status(200).json({ success: true, deletedTrip: result });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
