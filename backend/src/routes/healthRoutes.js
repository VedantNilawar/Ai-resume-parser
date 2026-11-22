import { Router } from 'express';
import { getDBStatus } from '../config/db.js';
import { config } from '../config/config.js';

const router = Router();

router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const geminiConfigured = Boolean(
    config.geminiApiKey &&
    config.geminiApiKey.trim() !== '' &&
    config.geminiApiKey !== 'your_gemini_api_key_here'
  );

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Resume Analyzer API',
    version: '1.0.0',
    database: dbStatus,
    gemini: {
      configured: geminiConfigured,
      model: config.geminiModel
    }
  });
});

export default router;
