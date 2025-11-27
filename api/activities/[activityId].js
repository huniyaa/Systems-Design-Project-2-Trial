// API endpoint for individual activities
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
};

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json(corsHeaders);
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { activityId } = req.query;

  try {
    if (req.method === 'PATCH') {
      // Update activity
      const { name, activityDate } = req.body;
      const activity = await prisma.activity.update({
        where: { id: activityId },
        data: {
          name: name || undefined,
          activityDate: activityDate || undefined
        }
      });
      return res.status(200).json(activity);
    }
    else if (req.method === 'DELETE') {
      // Delete an activity
      const result = await prisma.activity.delete({
        where: { id: activityId }
      });
      return res.status(200).json({ success: true, deletedActivity: result });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
