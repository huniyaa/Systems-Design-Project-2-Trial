import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const trips = await prisma.trip.findMany({
        include: { cities: { include: { activities: true } } }
      });
      res.status(200).json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
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
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
