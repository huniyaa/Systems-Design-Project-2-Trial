import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
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
      res.status(201).json(city);
    } else if (req.method === 'PATCH') {
      const { cityId, posX, posY } = req.body;
      const city = await prisma.city.update({
        where: { id: cityId },
        data: { posX, posY },
        include: { activities: true }
      });
      res.status(200).json(city);
    } else if (req.method === 'DELETE') {
      const { cityId } = req.body;
      const result = await prisma.city.delete({ where: { id: cityId } });
      res.status(200).json({ success: true, deletedCity: result });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
