import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromPDF } from '../src/services/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  const filePath = path.resolve(__dirname, '../../sample_resumes/sample_developer_resume.pdf');
  const buffer = fs.readFileSync(filePath);
  console.log(`Reading test PDF: ${filePath} (${buffer.length} bytes)`);

  const result = await extractTextFromPDF(buffer);
  console.log('PDF Extraction Result:');
  console.log('Pages:', result.numPages);
  console.log('Character Count:', result.characterCount);
  console.log('Sample Extracted Text Preview:');
  console.log(result.text.slice(0, 300));
  console.log('\n✅ PDF text extraction test passed successfully!');
}

test().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
