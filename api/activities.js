import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { cityId, name, activityDate } = req.body;
      const activity = await prisma.activity.create({
        data: { cityId, name, activityDate }
      });
      res.status(201).json(activity);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { activityId, name, activityDate } = req.body;
      const activity = await prisma.activity.update({
        where: { id: activityId },
        data: { name, activityDate }
      });
      res.status(200).json(activity);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { activityId } = req.body;
      const result = await prisma.activity.delete({ where: { id: activityId } });
      res.status(200).json({ success: true, deletedActivity: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
