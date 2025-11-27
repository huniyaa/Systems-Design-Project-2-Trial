// Test endpoint for API health check
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ 
    status: 'API is working', 
    timestamp: new Date().toISOString(),
    message: 'Backend is deployed and ready!'
  });
}
