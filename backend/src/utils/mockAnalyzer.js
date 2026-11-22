/**
 * Intelligent fallback heuristic analyzer when Gemini API key is not configured.
 * Performs keyword extraction, skill cross-matching, and generates structured analysis.
 */

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust',
  'react', 'react.js', 'vue', 'angular', 'next.js', 'node.js', 'express', 'express.js',
  'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest api', 'docker', 'kubernetes',
  'aws', 'azure', 'gcp', 'ci/cd', 'git', 'github', 'tailwind css', 'css3', 'html5',
  'redux', 'jest', 'cypress', 'microservices', 'system design', 'agile', 'scrum',
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp', 'llm', 'gemini api'
];

export function runMockAnalysis(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Extract skills present in JD
  const jdSkills = KNOWN_SKILLS.filter(skill => jdLower.includes(skill));
  // Extract skills present in Resume
  const matched = [];
  const missing = [];

  // Match against JD requirements
  if (jdSkills.length > 0) {
    for (const skill of jdSkills) {
      if (resumeLower.includes(skill)) {
        matched.push({
          skill: capitalizeSkill(skill),
          category: categorizeSkill(skill),
          context: `Found reference to ${skill} in resume content.`
        });
      } else {
        missing.push({
          skill: capitalizeSkill(skill),
          importance: isCriticalSkill(skill, jdLower) ? 'Critical' : 'Recommended',
          reason: `Required by job description (${skill}) but not explicitly mentioned in your resume.`
        });
      }
    }
  } else {
    // If no predefined skills match JD, extract common tech words
    const wordsInJd = Array.from(new Set(jdLower.match(/\b[a-z]{3,15}\b/g) || []));
    for (const word of wordsInJd.slice(0, 8)) {
      if (resumeLower.includes(word)) {
        matched.push({ skill: capitalizeSkill(word), category: 'General', context: 'Matched term' });
      } else {
        missing.push({ skill: capitalizeSkill(word), importance: 'Recommended', reason: 'Term featured in JD' });
      }
    }
  }

  // Calculate Match Score
  const total = matched.length + missing.length;
  let rawScore = total > 0 ? Math.round((matched.length / total) * 100) : 70;
  // Bound score between 25 and 95
  const matchScore = Math.max(30, Math.min(95, rawScore));

  let verdict = 'Moderate Match';
  if (matchScore >= 80) verdict = 'Strong Match';
  else if (matchScore >= 60) verdict = 'Good Match';
  else if (matchScore < 50) verdict = 'Low Match';

  const categoryScores = {
    technicalSkills: Math.min(100, Math.round(matchScore * 1.05)),
    experienceRelevance: Math.min(100, Math.max(35, Math.round(matchScore * 0.95))),
    softSkills: Math.min(100, Math.max(40, Math.round(matchScore * 0.9))),
    educationAndCertifications: Math.min(100, Math.max(50, Math.round(matchScore * 1.0)))
  };

  const strengths = [
    `Clear alignment in foundational skills: ${matched.slice(0, 3).map(m => m.skill).join(', ') || 'Software development'}`,
    'Strong structured project experience demonstrating full-stack problem solving',
    'Demonstrated competency with modern development toolchains and modern APIs'
  ];

  const improvementSuggestions = [
    {
      category: 'Target Keywords',
      title: 'Incorporate Missing High-Priority Keywords',
      actionableAdvice: `Explicitly include missing keywords (${missing.slice(0, 3).map(m => m.skill).join(', ') || 'core technologies'}) into your technical skills list and project descriptions.`,
      example: `e.g., "Architected scalable microservices using ${missing[0]?.skill || 'Express.js'} and implemented automated testing."`
    },
    {
      category: 'Metrics & Quantifiable Impact',
      title: 'Adopt the Google XYZ Resume Formula',
      actionableAdvice: 'Frame achievements as: Accomplished [X], as measured by [Y], by doing [Z]. Replace passive verbs with measurable metrics (e.g., % latency reduction, user count, or uptime).',
      example: 'e.g., "Optimized API response time by 42% through query indexing and Redis caching layer."'
    },
    {
      category: 'Job Description Tailoring',
      title: 'Mirror the Target Role Terminology',
      actionableAdvice: 'Review the job description qualifications and align your experience bullet points with the exact role title and domain expectations.',
      example: 'Align your summary header with the exact target position (e.g. "Full Stack Software Engineer").'
    }
  ];

  const summaryRewrite = `Results-driven Software Engineer with demonstrated expertise in ${matched.slice(0, 3).map(m => m.skill).join(', ') || 'full-stack web development'}. Proven track record designing RESTful APIs, scalable architectures, and modern web applications. Eager to contribute high-impact technical solutions aligning with your team's engineering standards.`;

  return {
    matchScore,
    verdict,
    categoryScores,
    matchedSkills: matched,
    missingSkills: missing,
    strengths,
    improvementSuggestions,
    summaryRewrite,
    analysisEngine: 'mock-engine (Configure GEMINI_API_KEY in .env for Gemini AI analysis)'
  };
}

function capitalizeSkill(skill) {
  return skill
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function categorizeSkill(skill) {
  if (['react', 'vue', 'angular', 'next.js', 'tailwind css', 'html5', 'css3'].includes(skill)) return 'Frontend';
  if (['node.js', 'express', 'express.js', 'golang', 'python', 'java', 'c#'].includes(skill)) return 'Backend';
  if (['mongodb', 'postgresql', 'mysql', 'redis', 'graphql'].includes(skill)) return 'Database & Cache';
  if (['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd'].includes(skill)) return 'DevOps & Cloud';
  return 'Core Engineering';
}

function isCriticalSkill(skill, jdText) {
  const criticalRegex = new RegExp(`(required|must have|proficiency in|mandatory|essential).*${skill}`, 'i');
  return criticalRegex.test(jdText);
}
