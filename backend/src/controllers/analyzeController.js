import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeResumeWithGemini } from '../services/geminiService.js';
import { AnalysisRepository } from '../models/Analysis.js';

export async function analyzeResume(req, res, next) {
  try {
    const { jobDescription, jobTitle } = req.body;
    const file = req.file;

    // Check optional custom Gemini API key from request headers (allows frontend key configuration)
    const customApiKey = req.headers['x-gemini-api-key'] || req.body.geminiApiKey || null;

    // 1. Extract text from PDF
    const { text: extractedText, numPages, characterCount } = await extractTextFromPDF(file.buffer);

    // 2. Perform AI analysis using Gemini API (or intelligent fallback)
    const analysisResult = await analyzeResumeWithGemini(extractedText, jobDescription, customApiKey);

    // 3. Save to MongoDB / Repository
    const savedRecord = await AnalysisRepository.create({
      fileName: file.originalname,
      fileSize: file.size,
      jobTitle: jobTitle?.trim() || 'Software Engineer',
      jobDescription: jobDescription.trim(),
      extractedResumeText: extractedText,
      ...analysisResult
    });

    // 4. Return structured JSON response
    return res.status(200).json({
      success: true,
      data: {
        id: savedRecord._id || savedRecord.id,
        fileName: file.originalname,
        jobTitle: savedRecord.jobTitle,
        pdfMeta: {
          numPages,
          characterCount
        },
        matchScore: analysisResult.matchScore,
        verdict: analysisResult.verdict,
        categoryScores: analysisResult.categoryScores,
        matchedSkills: analysisResult.matchedSkills,
        missingSkills: analysisResult.missingSkills,
        strengths: analysisResult.strengths,
        improvementSuggestions: analysisResult.improvementSuggestions,
        summaryRewrite: analysisResult.summaryRewrite,
        analysisEngine: analysisResult.analysisEngine,
        createdAt: savedRecord.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}
