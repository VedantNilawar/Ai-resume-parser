import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createPdfFile(filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Title / Header
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e1b4b').text('ALEX MORGAN', { align: 'center' });
    doc.fontSize(11).font('Helvetica').fillColor('#4338ca').text('Senior Full-Stack Software Engineer', { align: 'center' });
    doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Email: alex.morgan@example.com | Phone: (555) 234-5678 | Austin, TX | GitHub: github.com/alexmorgan', { align: 'center' });
    doc.moveDown(1.2);

    // Divider
    doc.moveTo(50, doc.y).lineTo(562, doc.y).strokeColor('#cbd5e1').lineWidth(1).stroke();
    doc.moveDown(0.8);

    // Summary
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('PROFESSIONAL SUMMARY');
    doc.moveDown(0.4);
    doc.fontSize(9.5).font('Helvetica').fillColor('#334155').text(
      'Innovative Full-Stack Software Engineer with 5+ years of experience engineering high-throughput web applications specializing in JavaScript, TypeScript, React.js, Node.js, Express, and MongoDB. Proven track record building secure RESTful APIs, microservices, and AI-assisted tooling while cutting cloud infrastructure costs by 28% and increasing API responsiveness by 40%.'
    );
    doc.moveDown(0.8);

    // Technical Skills
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('TECHNICAL SKILLS');
    doc.moveDown(0.4);
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#334155').text('Languages: ', { continued: true })
      .font('Helvetica').text('JavaScript (ES6+), TypeScript, Python, HTML5, CSS3, SQL');
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#334155').text('Frontend: ', { continued: true })
      .font('Helvetica').text('React, Next.js, Redux Toolkit, Tailwind CSS, Vite, Jest, React Query');
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#334155').text('Backend: ', { continued: true })
      .font('Helvetica').text('Node.js, Express.js, REST APIs, GraphQL, Socket.io, JWT, Microservices');
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#334155').text('Databases & Caching: ', { continued: true })
      .font('Helvetica').text('MongoDB, Mongoose, PostgreSQL, Redis, DynamoDB');
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#334155').text('DevOps & Cloud: ', { continued: true })
      .font('Helvetica').text('Docker, Kubernetes, AWS (S3, EC2, Lambda), Git, GitHub Actions, CI/CD');
    doc.moveDown(0.8);

    // Work Experience
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('PROFESSIONAL EXPERIENCE');
    doc.moveDown(0.4);

    // Job 1
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b').text('Senior Full-Stack Engineer | CloudNova Solutions', { continued: true })
      .font('Helvetica-Oblique').fillColor('#64748b').text(' (2022 - Present)');
    doc.moveDown(0.2);
    doc.fontSize(9).font('Helvetica').fillColor('#334155')
      .text('- Architected scalable Node.js and Express REST API handling over 12 million monthly requests with 99.98% uptime.')
      .text('- Designed responsive React frontend web application with real-time analytics dashboards, cutting page load by 45%.')
      .text('- Streamlined MongoDB query indexes and Redis caching layer, reducing database p95 response latency from 450ms to 65ms.')
      .text('- Mentored 6 junior engineers and led code reviews focusing on clean architecture, security, and unit test coverage.');
    doc.moveDown(0.6);

    // Job 2
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b').text('Software Engineer | Apex Tech Innovations', { continued: true })
      .font('Helvetica-Oblique').fillColor('#64748b').text(' (2019 - 2022)');
    doc.moveDown(0.2);
    doc.fontSize(9).font('Helvetica').fillColor('#334155')
      .text('- Built RESTful microservices using Express, Node.js, and MongoDB with centralized error handling and input validation.')
      .text('- Implemented automated CI/CD pipeline using GitHub Actions and Docker containers, accelerating deployment cycles by 3x.')
      .text('- Integrated third-party payment gateways and webhook listeners with comprehensive automated test suites.');
    doc.moveDown(0.8);

    // Education
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('EDUCATION & CERTIFICATIONS');
    doc.moveDown(0.4);
    doc.fontSize(9.5).font('Helvetica').fillColor('#334155')
      .text('- Bachelor of Science in Computer Science - State University (2019)')
      .text('- AWS Certified Solutions Architect - Associate');

    doc.end();

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
}

async function run() {
  const sampleDir = path.resolve(__dirname, '../../sample_resumes');
  if (!fs.existsSync(sampleDir)) fs.mkdirSync(sampleDir, { recursive: true });

  const targetPath = path.join(sampleDir, 'sample_developer_resume.pdf');
  await createPdfFile(targetPath);
  console.log(`Generated resume PDF: ${targetPath}`);

  const frontendPublicDir = path.resolve(__dirname, '../../frontend/public');
  if (!fs.existsSync(frontendPublicDir)) fs.mkdirSync(frontendPublicDir, { recursive: true });

  fs.copyFileSync(targetPath, path.join(frontendPublicDir, 'sample_developer_resume.pdf'));
  console.log(`Copied to frontend/public/sample_developer_resume.pdf`);
}

run().catch(console.error);
