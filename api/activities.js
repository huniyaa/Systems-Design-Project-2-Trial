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
      const { cityId, name, activityDate } = req.body;
      const activity = await prisma.activity.create({
        data: { cityId, name, activityDate }
      });
      res.status(201).json(activity);
    } else if (req.method === 'PATCH') {
      const { activityId, name, activityDate } = req.body;
      const activity = await prisma.activity.update({
        where: { id: activityId },
        data: { name, activityDate }
      });
      res.status(200).json(activity);
    } else if (req.method === 'DELETE') {
      const { activityId } = req.body;
      const result = await prisma.activity.delete({ where: { id: activityId } });
      res.status(200).json({ success: true, deletedActivity: result });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
