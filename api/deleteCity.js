import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
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
