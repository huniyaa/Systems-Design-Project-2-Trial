import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
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
