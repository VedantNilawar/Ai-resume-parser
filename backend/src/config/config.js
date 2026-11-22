import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-analyzer',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  maxUploadSizeBytes: 10 * 1024 * 1024 // 10MB
};
