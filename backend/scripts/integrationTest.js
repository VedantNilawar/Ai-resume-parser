import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runIntegrationTests() {
  console.log('🚀 Starting Integration Tests for AI Resume Analyzer...');

  await connectDB();

  const server = app.listen(5099, async () => {
    const BASE_URL = 'http://localhost:5099';
    try {
      // 1. Health check test
      console.log('\n--- 1. Testing GET /api/health ---');
      const healthRes = await fetch(`${BASE_URL}/api/health`);
      const healthData = await healthRes.json();
      console.log('Health status:', healthData.status);
      console.log('DB mode:', healthData.database.mode);
      if (healthRes.status !== 200 || healthData.status !== 'healthy') {
        throw new Error('Health check endpoint failed');
      }
      console.log('✅ Health check passed.');

      // 2. Input validation: Missing file
      console.log('\n--- 2. Testing Validation: Missing File ---');
      const noFileFormData = new FormData();
      noFileFormData.append('jobDescription', 'Looking for a senior React engineer with Node.js experience');
      const noFileRes = await fetch(`${BASE_URL}/api/analyze`, {
        method: 'POST',
        body: noFileFormData
      });
      const noFileData = await noFileRes.json();
      console.log('Response status:', noFileRes.status, 'Error code:', noFileData.error?.code);
      if (noFileRes.status !== 400 || noFileData.error?.code !== 'MISSING_FILE') {
        throw new Error(`Expected 400 MISSING_FILE, got ${noFileRes.status}`);
      }
      console.log('✅ Missing file validation passed with 400.');

      // 3. Input validation: Short job description
      console.log('\n--- 3. Testing Validation: Short Job Description ---');
      const pdfPath = path.resolve(__dirname, '../../sample_resumes/sample_developer_resume.pdf');
      const pdfBuffer = fs.readFileSync(pdfPath);
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

      const shortJdForm = new FormData();
      shortJdForm.append('resume', pdfBlob, 'resume.pdf');
      shortJdForm.append('jobDescription', 'Short text');
      const shortJdRes = await fetch(`${BASE_URL}/api/analyze`, {
        method: 'POST',
        body: shortJdForm
      });
      const shortJdData = await shortJdRes.json();
      console.log('Response status:', shortJdRes.status, 'Error code:', shortJdData.error?.code);
      if (shortJdRes.status !== 400 || shortJdData.error?.code !== 'INVALID_JOB_DESCRIPTION') {
        throw new Error(`Expected 400 INVALID_JOB_DESCRIPTION, got ${shortJdRes.status}`);
      }
      console.log('✅ Short JD validation passed with 400.');

      // 4. Successful PDF upload & analysis
      console.log('\n--- 4. Testing Successful POST /api/analyze with PDF ---');
      const successForm = new FormData();
      successForm.append('resume', pdfBlob, 'Alex_Morgan_Resume.pdf');
      successForm.append('jobTitle', 'Senior Full-Stack MERN Developer');
      successForm.append(
        'jobDescription',
        'We are seeking a Senior Full-Stack Engineer with deep experience in React, Node.js, Express, MongoDB, Docker, AWS, and REST APIs. Experience with GraphQL and Redis caching is preferred.'
      );

      const analyzeRes = await fetch(`${BASE_URL}/api/analyze`, {
        method: 'POST',
        body: successForm
      });
      const analyzeJson = await analyzeRes.json();

      if (analyzeRes.status !== 200 || !analyzeJson.success) {
        throw new Error(`Analyze failed: ${JSON.stringify(analyzeJson)}`);
      }

      const report = analyzeJson.data;
      console.log('✅ Analysis Success!');
      console.log('ID:', report.id);
      console.log('Match Score:', report.matchScore);
      console.log('Verdict:', report.verdict);
      console.log('Matched Skills Count:', report.matchedSkills?.length);
      console.log('Sample Matched:', report.matchedSkills?.slice(0, 3).map(m => m.skill));
      console.log('Missing Skills Count:', report.missingSkills?.length);
      console.log('Strengths Count:', report.strengths?.length);
      console.log('Suggestions Count:', report.improvementSuggestions?.length);

      // 5. Test History endpoint
      console.log('\n--- 5. Testing GET /api/history ---');
      const historyRes = await fetch(`${BASE_URL}/api/history`);
      const historyJson = await historyRes.json();
      console.log('History count:', historyJson.count);
      if (historyRes.status !== 200 || historyJson.count < 1) {
        throw new Error('History check failed');
      }
      console.log('✅ History retrieved successfully.');

      // 6. Test GET by ID
      console.log('\n--- 6. Testing GET /api/history/:id ---');
      const detailRes = await fetch(`${BASE_URL}/api/history/${report.id}`);
      const detailJson = await detailRes.json();
      if (detailRes.status !== 200 || !detailJson.data) {
        throw new Error('Detail by ID check failed');
      }
      console.log('✅ Detail retrieved successfully by ID.');

      console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n');
    } catch (err) {
      console.error('\n❌ Test execution failed:', err);
      process.exitCode = 1;
    } finally {
      server.close(() => {
        process.exit(process.exitCode || 0);
      });
    }
  });
}

runIntegrationTests();
