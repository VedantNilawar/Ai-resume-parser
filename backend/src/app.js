import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import analyzeRoutes from './routes/analyzeRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

// HTTP Request Logger
app.use(morgan('dev'));

// CORS configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
  })
);

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Base root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Resume Analyzer API is running',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

// Unmatched route handler (404)
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
