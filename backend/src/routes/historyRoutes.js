import { Router } from 'express';
import { getHistory, getAnalysisById, deleteAnalysis } from '../controllers/historyController.js';

const router = Router();

// GET /api/history - Retrieve all recent analyses
router.get('/', getHistory);

// GET /api/history/:id - Retrieve specific analysis details
router.get('/:id', getAnalysisById);

// DELETE /api/history/:id - Remove an analysis
router.delete('/:id', deleteAnalysis);

export default router;
