import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';

const AnalysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    jobTitle: {
      type: String,
      default: 'Not Specified'
    },
    jobDescription: {
      type: String,
      required: true
    },
    extractedResumeText: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    verdict: {
      type: String,
      required: true
    },
    categoryScores: {
      technicalSkills: { type: Number, default: 0 },
      experienceRelevance: { type: Number, default: 0 },
      softSkills: { type: Number, default: 0 },
      educationAndCertifications: { type: Number, default: 0 }
    },
    matchedSkills: [
      {
        skill: { type: String, required: true },
        category: { type: String, default: 'General' },
        context: { type: String, default: '' }
      }
    ],
    missingSkills: [
      {
        skill: { type: String, required: true },
        importance: { type: String, enum: ['Critical', 'Recommended', 'Nice-to-have'], default: 'Recommended' },
        reason: { type: String, default: '' }
      }
    ],
    strengths: [String],
    improvementSuggestions: [
      {
        category: { type: String, required: true },
        title: { type: String, required: true },
        actionableAdvice: { type: String, required: true },
        example: { type: String, default: '' }
      }
    ],
    summaryRewrite: {
      type: String,
      default: ''
    },
    analysisEngine: {
      type: String,
      default: 'gemini'
    }
  },
  {
    timestamps: true
  }
);

const MongoAnalysisModel = mongoose.model('Analysis', AnalysisSchema);

// In-Memory Repository Fallback (when MongoDB is not running locally)
const memoryStore = new Map();

export const AnalysisRepository = {
  async create(data) {
    const { connected } = getDBStatus();
    if (connected) {
      const doc = await MongoAnalysisModel.create(data);
      return doc.toObject();
    } else {
      const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const now = new Date();
      const record = {
        _id: id,
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      };
      memoryStore.set(id, record);
      return record;
    }
  },

  async findAll({ limit = 20 } = {}) {
    const { connected } = getDBStatus();
    if (connected) {
      return MongoAnalysisModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-extractedResumeText')
        .lean();
    } else {
      const records = Array.from(memoryStore.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .map(({ extractedResumeText, ...rest }) => rest);
      return records;
    }
  },

  async findById(id) {
    const { connected } = getDBStatus();
    if (connected && mongoose.isValidObjectId(id)) {
      return MongoAnalysisModel.findById(id).lean();
    } else {
      return memoryStore.get(id) || null;
    }
  },

  async deleteById(id) {
    const { connected } = getDBStatus();
    if (connected && mongoose.isValidObjectId(id)) {
      return MongoAnalysisModel.findByIdAndDelete(id).lean();
    } else {
      const exists = memoryStore.has(id);
      if (exists) {
        const deleted = memoryStore.get(id);
        memoryStore.delete(id);
        return deleted;
      }
      return null;
    }
  }
};
