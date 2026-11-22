# AI Resume Analyzer (2026 Edition) 🚀

A modern full-stack **MERN** web application powered by **Google Gemini API** and automated **PDF text extraction**. It analyzes candidate resume PDFs against target job descriptions, providing an ATS match score, categorised skill alignments, identified gaps, and actionable improvement recommendations.

---

## 🌟 Key Highlights

- **Full-Stack Node.js REST API**: Modular Express architecture with endpoints for real-time analysis, health checks, and scan history.
- **Automated PDF Parsing**: Extracts and normalizes text from uploaded resume PDF documents in-memory using `pdf-parse`.
- **Structured Gemini API Integration**: Leverages structured prompting and JSON schema enforcement to return strictly formatted response objects.
- **Resilient Dual-Mode Operation**: Fully functional out-of-the-box with an intelligent heuristic fallback when offline, plus native Google Gemini AI mode when `GEMINI_API_KEY` is provided.
- **Centralized Error Handling & Input Validation**: Validates file types (`.pdf`), file size constraints (10MB limit), and minimum job description length, returning standardized HTTP status codes (`400`, `413`, `415`, `422`, `502`).
- **Modern 2026 Developer UI**: Sleek, responsive React frontend (Vite + Tailwind CSS + Lucide React) with circular SVG match gauges, skill category tags, and 1-click sample resume testing.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js (v20+ / v26), Express.js 4, REST API |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash`) via `@google/generative-ai` |
| **PDF Extraction** | `pdf-parse` (isolated `Uint8Array` memory buffers) |
| **Database** | MongoDB (Mongoose) with automatic in-memory fallback store |
| **File Handling** | Multer (in-memory buffer stream processing) |

---

## 📂 Project Structure

```text
├── backend/
│   ├── scripts/
│   │   ├── generateSamplePdf.js    # Generates standard PDF resume
│   │   ├── testPdfService.js       # Unit test for PDF extraction
│   │   └── integrationTest.js      # End-to-end API integration test suite
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js           # Environment & runtime constants
│   │   │   └── db.js               # MongoDB connection with graceful fallback
│   │   ├── controllers/
│   │   │   ├── analyzeController.js# Resume analysis orchestrator
│   │   │   └── historyController.js# Past scan retrieval & deletion
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js     # Centralized error & 404 handler
│   │   │   ├── upload.js           # Multer PDF filter & size bounds
│   │   │   └── validator.js        # Request payload & length validation
│   │   ├── models/
│   │   │   └── Analysis.js         # Mongoose schema & fallback store
│   │   ├── routes/
│   │   │   ├── analyzeRoutes.js    # POST /api/analyze
│   │   │   ├── historyRoutes.js    # GET, DELETE /api/history
│   │   │   └── healthRoutes.js     # GET /api/health
│   │   ├── services/
│   │   │   ├── geminiService.js    # Gemini API prompt & JSON schema parser
│   │   │   └── pdfService.js       # PDF buffer text extraction
│   │   ├── utils/
│   │   │   └── mockAnalyzer.js     # Intelligent heuristic analyzer fallback
│   │   ├── app.js                  # Express application setup
│   │   └── server.js               # Server bootstrap & graceful shutdown
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── sample_developer_resume.pdf
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js           # API client & localStorage key helper
│   │   ├── components/
│   │   │   ├── Header.jsx          # App navbar, health indicators & modals
│   │   │   ├── ResumeUpload.jsx    # Drag-and-drop PDF dropzone
│   │   │   ├── JobDescriptionInput.jsx # JD textarea & 1-click presets
│   │   │   ├── ScoreCard.jsx       # Circular SVG gauge & breakdown bars
│   │   │   ├── SkillsBreakdown.jsx # Matched vs missing skill chips
│   │   │   ├── SuggestionsList.jsx # Actionable advice with examples
│   │   │   ├── SummaryRewrite.jsx  # ATS tailored professional summary
│   │   │   ├── HistoryModal.jsx    # Previous scans viewer
│   │   │   └── ApiKeyModal.jsx     # UI Gemini key manager
│   │   ├── App.jsx                 # Core state & layout
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── sample_resumes/
│   └── sample_developer_resume.pdf
├── package.json                    # Workspace root scripts
└── README.md
```

---

## ⚡ Quickstart

### 1. Prerequisites
- **Node.js** (v18 or higher; tested on v26)
- **npm** (v9 or higher)
- *(Optional)* **MongoDB** running locally on port 27017 (an in-memory store activates automatically if MongoDB is not running)

### 2. Configuration
Copy the `.env.example` file in `backend`:
```bash
cp backend/.env.example backend/.env
```
To enable live Gemini AI analysis, set your API key in `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
```
*(You can also set your Gemini API Key directly in the web UI via the "Gemini Key" button without restarting the server!)*

### 3. Start Backend API
```bash
cd backend
npm run dev
```
The server will start at `http://localhost:5000`.

### 4. Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```
The application will open at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

Run the full end-to-end integration test suite:
```bash
npm run test:integration
```
This tests:
1. `GET /api/health` — service status and database state
2. `POST /api/analyze` — 400 Bad Request on missing file
3. `POST /api/analyze` — 400 Bad Request on short/invalid job description
4. `POST /api/analyze` — Successful 200 OK parsing PDF buffer and generating structured ATS score
5. `GET /api/history` — Retrieval of past scans
6. `GET /api/history/:id` — Specific report detail lookup

---

## 📡 REST API Reference

### 1. Analyze Resume
`POST /api/analyze`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `resume`: File (`.pdf` required, max 10MB)
  - `jobDescription`: String (minimum 30 chars)
  - `jobTitle`: String (optional, e.g. "Senior Full-Stack Developer")
- **Optional Header**: `x-gemini-api-key: <custom_key>`

**Sample Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "6740b...",
    "fileName": "Alex_Morgan_Resume.pdf",
    "jobTitle": "Senior Full-Stack MERN Developer",
    "pdfMeta": { "numPages": 1, "characterCount": 2044 },
    "matchScore": 88,
    "verdict": "Strong Match",
    "categoryScores": {
      "technicalSkills": 92,
      "experienceRelevance": 85,
      "softSkills": 80,
      "educationAndCertifications": 90
    },
    "matchedSkills": [
      { "skill": "React", "category": "Frontend", "context": "Designed responsive React frontend..." },
      { "skill": "Node.js", "category": "Backend", "context": "Architected scalable Node.js REST API..." }
    ],
    "missingSkills": [
      { "skill": "Kafka", "importance": "Recommended", "reason": "Mentioned in JD for event processing" }
    ],
    "strengths": [
      "Extensive experience in Node.js microservices and React web applications",
      "Demonstrated quantifiable performance optimization"
    ],
    "improvementSuggestions": [
      {
        "category": "Target Keywords",
        "title": "Incorporate Distributed Messaging Keywords",
        "actionableAdvice": "Include Kafka or event-driven patterns in backend project bullet points.",
        "example": "e.g., 'Implemented asynchronous event streaming using Kafka to decouple microservices.'"
      }
    ],
    "summaryRewrite": "Senior Full-Stack Software Engineer with 5+ years of experience engineering high-throughput React and Node.js applications...",
    "analysisEngine": "gemini-api",
    "createdAt": "2026-11-22T07:18:22.000Z"
  }
}
```

### 2. History & Health Endpoints
- `GET /api/history` — List recent resume analyses
- `GET /api/history/:id` — Retrieve full analysis by ID
- `DELETE /api/history/:id` — Delete an analysis record
- `GET /api/health` — System health and config status

---

## 🎯 Resume & Interview Value (For Candidates)

If you are showcasing this project on your resume or in technical interviews, highlight:
- **Resilient Buffer Streaming**: Solving Node 20+ memory buffer isolation when interfacing with binary PDF parser streams (`Uint8Array` allocation).
- **Graceful Degradation Architecture**: Hybrid persistence (MongoDB with in-memory replica fallback) ensuring zero downtime regardless of local daemon availability.
- **LLM Structured Output Engineering**: Enforcing strict JSON schema contracts with Gemini API (`responseMimeType: "application/json"`) preventing hallucinations and malformed responses.
- **Clean Architecture & SOLID Principles**: Clean separation across Controllers, Services, Middlewares, and Repositories.
