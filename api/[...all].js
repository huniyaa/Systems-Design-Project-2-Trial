import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Router for all API requests
export default async function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const path = pathname.replace('/api/', '').split('/')[0];

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    // Route to appropriate handler
    if (path === 'test') {
      return res.status(200).json({ status: 'API working', timestamp: new Date().toISOString() });
    }

    if (path === 'trips') {
      if (req.method === 'GET') {
        const trips = await prisma.trip.findMany({
          include: { cities: { include: { activities: true } } }
        });
        return res.status(200).json(trips);
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
        return res.status(201).json(trip);
      } else if (req.method === 'DELETE') {
        const { tripId } = req.body;
        const result = await prisma.trip.delete({ where: { id: tripId } });
        return res.status(200).json({ success: true, deletedTrip: result });
      }
    }

    if (path === 'cities') {
      if (req.method === 'POST') {
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
          include: { activities: true }
        });
        return res.status(201).json(city);
      } else if (req.method === 'PATCH') {
        const { cityId, posX, posY } = req.body;
        const city = await prisma.city.update({
          where: { id: cityId },
          data: { posX, posY },
          include: { activities: true }
        });
        return res.status(200).json(city);
      } else if (req.method === 'DELETE') {
        const { cityId } = req.body;
        const result = await prisma.city.delete({ where: { id: cityId } });
        return res.status(200).json({ success: true, deletedCity: result });
      }
    }

    if (path === 'activities') {
      if (req.method === 'POST') {
        const { cityId, name, activityDate } = req.body;
        const activity = await prisma.activity.create({
          data: { cityId, name, activityDate }
        });
        return res.status(201).json(activity);
      } else if (req.method === 'PATCH') {
        const { activityId, name, activityDate } = req.body;
        const activity = await prisma.activity.update({
          where: { id: activityId },
          data: { name, activityDate }
        });
        return res.status(200).json(activity);
      } else if (req.method === 'DELETE') {
        const { activityId } = req.body;
        const result = await prisma.activity.delete({ where: { id: activityId } });
        return res.status(200).json({ success: true, deletedActivity: result });
      }
    }

    res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
