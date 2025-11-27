import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
        include: { activities: true }
      });
      res.status(201).json(city);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { cityId, posX, posY } = req.body;
      const city = await prisma.city.update({
        where: { id: cityId },
        data: { posX, posY },
        include: { activities: true }
      });
      res.status(200).json(city);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { cityId } = req.body;
      const result = await prisma.city.delete({ where: { id: cityId } });
      res.status(200).json({ success: true, deletedCity: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
