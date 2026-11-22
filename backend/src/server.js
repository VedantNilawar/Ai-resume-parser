import app from './app.js';
import { config } from './config/config.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    // Attempt database connection (gracefully falls back if unavailable)
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(`🚀 AI Resume Analyzer API running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🩺 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`🤖 Gemini Model: ${config.geminiModel}`);
      console.log(`===============================================`);
    });

    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Fatal server startup error:', error);
    process.exit(1);
  }
};

startServer();
