/**
 * Middleware to validate incoming request data for resume analysis.
 */
export function validateAnalyzeRequest(req, res, next) {
  // Check if file is provided
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_FILE',
        message: 'A resume file in PDF format is required. Please attach a file under the "resume" field.'
      }
    });
  }

  // Check job description
  const { jobDescription, jobTitle } = req.body || {};

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_JOB_DESCRIPTION',
        message: 'Job description is required. Please provide the target job requirements or responsibilities.'
      }
    });
  }

  const trimmedJD = jobDescription.trim();
  if (trimmedJD.length < 30) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JOB_DESCRIPTION',
        message: 'Job description is too brief. Please provide at least 30 characters of job description context for accurate ATS analysis.'
      }
    });
  }

  if (trimmedJD.length > 25000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Job description exceeds maximum allowable length of 25,000 characters.'
      }
    });
  }

  if (jobTitle && typeof jobTitle === 'string' && jobTitle.length > 200) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JOB_TITLE',
        message: 'Job title must not exceed 200 characters.'
      }
    });
  }

  next();
}
