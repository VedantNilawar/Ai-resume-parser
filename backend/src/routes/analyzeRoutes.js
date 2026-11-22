import { Router } from 'express';
import { analyzeResume } from '../controllers/analyzeController.js';
import { uploadResumeMiddleware } from '../middlewares/upload.js';
import { validateAnalyzeRequest } from '../middlewares/validator.js';

const router = Router();

// POST /api/analyze - Accepts multipart/form-data with 'resume' (PDF) and 'jobDescription'
router.post('/', uploadResumeMiddleware, validateAnalyzeRequest, analyzeResume);

export default router;
