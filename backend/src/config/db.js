import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;

export const connectDB = async () => {
  if (!config.mongoUri) {
    console.log('[DB] No MONGODB_URI configured. Running in memory-store mode.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[DB] MongoDB connection failed (${error.message}). Running with in-memory fallback store.`);
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'mongodb' : 'in-memory-fallback',
  uri: isConnected ? config.mongoUri.replace(/:([^:@]+)@/, ':****@') : null
});
