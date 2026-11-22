import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';
import { runMockAnalysis } from '../utils/mockAnalyzer.js';

const SYSTEM_INSTRUCTION = `
You are an expert ATS (Applicant Tracking System) algorithm and Senior Technical Recruiter.
Your task is to analyze an extracted candidate resume against a provided Job Description.

Analyze the resume objectively, rigorously, and constructively.
You MUST respond with ONLY valid JSON adhering strictly to the JSON schema provided below. Do not wrap in markdown quotes if possible, or provide raw JSON.

Output JSON Schema:
{
  "matchScore": number (0 to 100 integer representing holistic candidate fit),
  "verdict": string ("Strong Match" | "Good Match" | "Moderate Match" | "Low Match"),
  "categoryScores": {
    "technicalSkills": number (0-100),
    "experienceRelevance": number (0-100),
    "softSkills": number (0-100),
    "educationAndCertifications": number (0-100)
  },
  "matchedSkills": [
    {
      "skill": string,
      "category": string (e.g. "Frontend", "Backend", "Cloud/DevOps", "Database", "Methodology"),
      "context": string (brief note on where or how it appeared in resume)
    }
  ],
  "missingSkills": [
    {
      "skill": string,
      "importance": "Critical" | "Recommended" | "Nice-to-have",
      "reason": string (why this skill is required based on the JD)
    }
  ],
  "strengths": [
    string (3-5 key positive highlights of the resume matching the role)
  ],
  "improvementSuggestions": [
    {
      "category": string (e.g. "Action Verbs & Impact", "Missing Keywords", "Formatting & Structure", "Certifications"),
      "title": string,
      "actionableAdvice": string,
      "example": string (concrete before/after example tailored to their experience)
    }
  ],
  "summaryRewrite": string (A compelling 3-4 sentence professional summary tailored specifically to the target role)
}
`;

/**
 * Analyzes resume text against a job description using Google Gemini API.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @param {string} [customApiKey]
 * @returns {Promise<object>}
 */
export async function analyzeResumeWithGemini(resumeText, jobDescription, customApiKey = null) {
  const apiKey = customApiKey || config.geminiApiKey;

  // Fallback to intelligent mock analyzer if no API key is provided
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('[GeminiService] No valid GEMINI_API_KEY detected. Using intelligent heuristic analyzer.');
    return runMockAnalysis(resumeText, jobDescription);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: config.geminiModel || 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const prompt = `
=== TARGET JOB DESCRIPTION ===
${jobDescription.trim()}

=== EXTRACTED CANDIDATE RESUME TEXT ===
${resumeText.trim()}

Perform the ATS match analysis and return the strict JSON output.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON safely
    let parsedData;
    try {
      // Clean possible markdown code fences just in case
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('[GeminiService] JSON parse error on Gemini output:', responseText);
      const err = new Error('Failed to parse Gemini AI response into valid JSON.');
      err.statusCode = 502;
      throw err;
    }

    // Ensure structure integrity
    return {
      matchScore: Number(parsedData.matchScore) || 0,
      verdict: parsedData.verdict || 'Moderate Match',
      categoryScores: {
        technicalSkills: Number(parsedData.categoryScores?.technicalSkills) || 0,
        experienceRelevance: Number(parsedData.categoryScores?.experienceRelevance) || 0,
        softSkills: Number(parsedData.categoryScores?.softSkills) || 0,
        educationAndCertifications: Number(parsedData.categoryScores?.educationAndCertifications) || 0
      },
      matchedSkills: Array.isArray(parsedData.matchedSkills) ? parsedData.matchedSkills : [],
      missingSkills: Array.isArray(parsedData.missingSkills) ? parsedData.missingSkills : [],
      strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
      improvementSuggestions: Array.isArray(parsedData.improvementSuggestions) ? parsedData.improvementSuggestions : [],
      summaryRewrite: parsedData.summaryRewrite || '',
      analysisEngine: 'gemini-api'
    };
  } catch (error) {
    console.error('[GeminiService] Gemini API call error:', error.message);
    if (error.statusCode) throw error;

    // Handle common Gemini API errors
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      const err = new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY.');
      err.statusCode = 401;
      throw err;
    }

    if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota')) {
      const err = new Error('Gemini API quota exceeded. Please check your Google AI Studio plan or quota limits.');
      err.statusCode = 429;
      throw err;
    }

    // Wrap in 502 Bad Gateway
    const err = new Error(`Gemini AI service error: ${error.message}`);
    err.statusCode = 502;
    throw err;
  }
}
