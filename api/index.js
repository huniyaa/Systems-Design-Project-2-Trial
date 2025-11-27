import express from 'express';
import { PrismaClient } from '@prisma/client';

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

// Body parser
app.use(express.json());

// Connect to database
await prisma.$connect();

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'API working', timestamp: new Date().toISOString() });
});

// ===== TRIPS =====
app.get('/trips', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        cities: {
          include: {
            activities: true
          }
        }
      }
    });
    res.json(trips);
  } catch (err) {
    console.error('GET /trips error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/trips', async (req, res) => {
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
      include: {
        cities: {
          include: {
            activities: true
          }
        }
      }
    });
    res.status(201).json(trip);
  } catch (err) {
    console.error('POST /trips error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/trips/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await prisma.trip.delete({
      where: { id: tripId }
    });
    res.json({ success: true, deletedTrip: result });
  } catch (err) {
    console.error('DELETE /trips/:tripId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== CITIES =====
app.post('/cities', async (req, res) => {
  try {
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
    res.status(201).json(city);
  } catch (err) {
    console.error('POST /cities error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/cities/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
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
    res.json(city);
  } catch (err) {
    console.error('PATCH /cities/:cityId error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cities/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const result = await prisma.city.delete({
      where: { id: cityId }
    });
    res.json({ success: true, deletedCity: result });
  } catch (err) {
    console.error('DELETE /cities/:cityId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== ACTIVITIES =====
app.post('/activities', async (req, res) => {
  try {
    const { cityId, name, activityDate } = req.body;
    const activity = await prisma.activity.create({
      data: {
        cityId,
        name,
        activityDate
      }
    });
    res.status(201).json(activity);
  } catch (err) {
    console.error('POST /activities error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const { name, activityDate } = req.body;
    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        name: name || undefined,
        activityDate: activityDate || undefined
      }
    });
    res.json(activity);
  } catch (err) {
    console.error('PATCH /activities/:activityId error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const result = await prisma.activity.delete({
      where: { id: activityId }
    });
    res.json({ success: true, deletedActivity: result });
  } catch (err) {
    console.error('DELETE /activities/:activityId error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
