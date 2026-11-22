<div align="center">

# 📄 AI Resume Analyzer (2026 Edition)

An intelligent full-stack **MERN** application powered by **Google Gemini API** and automated **PDF text extraction**. Upload any candidate resume PDF and a target job description to get an instant ATS match score, skill alignment breakdown, gap analysis, and tailored improvement recommendations.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google%20Gemini%20API-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-blue.style=for-the-badge" alt="License" />
</p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Resume / Portfolio Highlights](#-resume--portfolio-highlights)
- [License](#-license)

---

## 🔍 Overview

Modern Applicant Tracking Systems (ATS) filter out over 75% of qualified resumes before a recruiter ever reads them due to keyword mismatches, formatting quirks, and untargeted phrasing.

**AI Resume Analyzer** solves this by:
1. Parsing raw text streams from uploaded PDF resumes in memory.
2. Cross-referencing candidate experience against target job descriptions using Google Gemini AI.
3. Returning structured JSON data featuring match scores, keyword parity, critical skill gaps, and actionable before/after resume rewrites.

---

## 🏛️ System Architecture

```
[ User Browser / React 18 UI ]
            │
            ▼ (multipart/form-data: PDF + Job Description)
[ Node.js / Express REST API ]
   ├── Multer (In-Memory Buffer Stream)
   ├── Validator Middleware (Input validation & bounds check)
   ├── PDF Extraction Service (pdf-parse via isolated Uint8Array)
   │
   ├── AI Analysis Engine (Orchestrator)
   │     ├─► Google Gemini API (gemini-2.5-flash with structured JSON schema)
   │     └─► Intelligent Heuristic Analyzer (Automatic offline/mock fallback)
   │
   ├── Centralized Error Handler (400, 413, 415, 422, 500, 502)
   └── Persistence Layer (MongoDB Mongoose + In-Memory Replica Store)
```

---

## ✨ Key Features

- **🚀 Automated PDF Text Extraction**: Reads and cleans text from PDF documents directly in memory using isolated `Uint8Array` allocations to prevent memory leaks and V8 buffer pooling issues.
- **🤖 Structured Gemini AI Integration**: Enforces a strict JSON response schema using `@google/generative-ai` with `gemini-2.5-flash`, avoiding hallucinations and guaranteeing typed output.
- **🛡️ Resilient Dual-Mode Operation**: Runs out of the box immediately with a smart heuristic analyzer when offline, and automatically unlocks deep Gemini AI evaluations when an API key is provided.
- **⚡ Centralized Validation & Error Handling**: Provides clear HTTP status codes (`400 Bad Request`, `413 File Too Large`, `415 Unsupported Media Type`, `422 Unprocessable Scan`, `502 Upstream AI Failure`).
- **📊 Modern 2026 Developer UI**:
  - Circular SVG ATS match gauge with color-coded gradients.
  - Categorized skill chips (*Matched* vs *Missing Gaps* tagged with priority levels: *Critical*, *Recommended*, *Nice-to-have*).
  - Concrete *"Before & After"* bullet point tailoring examples.
  - Tailored professional summary rewrite with 1-click clipboard copy.
  - 1-click *"Use Sample Resume"* loader for immediate zero-setup testing.
  - Scan history viewer to review or delete past analyses.

---

## 💻 Tech Stack

### Frontend
- **React 18** — Component architecture & state hooks
- **Vite 6** — Ultra-fast HMR and optimized production bundling
- **Tailwind CSS** — Modern dark-mode interface with glassmorphism styling
- **Lucide React** — Crisp vector icons

### Backend
- **Node.js (v20+ / v26)** — High-performance JavaScript runtime
- **Express.js 4** — Modular REST API routing and middleware pipeline
- **Multer** — In-memory multipart buffer processing
- **pdf-parse** — PDF binary parsing
- **MongoDB & Mongoose** — Document persistence with seamless fallback store

### AI Engine
- **Google Gemini API** (`@google/generative-ai`) — Generative AI models (`gemini-2.5-flash`) with structured JSON schema mode

---

## 📁 Project Structure

```text
├── backend/
│   ├── scripts/
│   │   ├── generateSamplePdf.js    # Generates a standard PDF resume
│   │   ├── testPdfService.js       # Unit test for PDF extraction
│   │   └── integrationTest.js      # End-to-end API integration test suite
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js           # Env variables & configuration
│   │   │   └── db.js               # MongoDB connection with graceful fallback
│   │   ├── controllers/
│   │   │   ├── analyzeController.js# Upload & AI analysis handler
│   │   │   └── historyController.js# Scan history CRUD operations
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js     # Centralized error & 404 handler
│   │   │   ├── upload.js           # Multer PDF filter (10MB limit)
│   │   │   └── validator.js        # Request input validation
│   │   ├── models/
│   │   │   └── Analysis.js         # Mongoose Schema & fallback store
│   │   ├── routes/
│   │   │   ├── analyzeRoutes.js    # POST /api/analyze
│   │   │   ├── historyRoutes.js    # GET, DELETE /api/history
│   │   │   └── healthRoutes.js     # GET /api/health
│   │   ├── services/
│   │   │   ├── geminiService.js    # Gemini API prompt & schema parsing
│   │   │   └── pdfService.js       # Buffer text extraction
│   │   ├── utils/
│   │   │   └── mockAnalyzer.js     # Offline heuristic analysis engine
│   │   ├── app.js                  # Express application setup
│   │   └── server.js               # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── sample_developer_resume.pdf
│   ├── src/
│   │   ├── api/client.js           # Fetch client & localStorage helpers
│   │   ├── components/
│   │   │   ├── Header.jsx          # App navbar & health indicators
│   │   │   ├── ResumeUpload.jsx    # Drag-and-drop dropzone
│   │   │   ├── JobDescriptionInput.jsx # JD input & 1-click presets
│   │   │   ├── ScoreCard.jsx       # Circular SVG gauge & scores
│   │   │   ├── SkillsBreakdown.jsx # Matched vs missing skill chips
│   │   │   ├── SuggestionsList.jsx # Actionable advice with examples
│   │   │   ├── SummaryRewrite.jsx  # ATS tailored professional summary
│   │   │   ├── HistoryModal.jsx    # Previous scans viewer
│   │   │   └── ApiKeyModal.jsx     # UI Gemini API key manager
│   │   ├── App.jsx                 # Core state & layout
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── sample_resumes/
│   └── sample_developer_resume.pdf
├── .gitignore
├── start.bat                       # 1-Click launcher for Windows
├── package.json                    # Workspace root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher; tested on v20 and v26)
- [npm](https://www.npmjs.com/) (v9 or higher)
- *(Optional)* [MongoDB](https://www.mongodb.com/) running locally (in-memory mode engages automatically if MongoDB is offline)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ai-resume-parser.git
   cd ai-resume-parser
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

### Environment Variables

Configure the backend environment file:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# Google Gemini API Key (Get a free key at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# MongoDB URI (Optional: In-memory store activates if MongoDB is offline)
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer

# Client Origin (for CORS)
CLIENT_URL=http://localhost:5173
```

*(Note: You can also enter your Gemini API Key directly inside the web UI using the "Gemini Key" button!)*

### Running the App

#### Option A: 1-Click Launcher (Windows)
Double-click [`start.bat`](start.bat) in the project folder to start both servers and launch your browser automatically!

#### Option B: Terminal Commands
**Terminal 1 — Backend API**:
```bash
cd backend
npm start
```
*API runs at `http://localhost:5000`*

**Terminal 2 — Frontend App**:
```bash
cd frontend
npm run dev
```
*Frontend runs at `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser.

---

## 📡 API Documentation

### `POST /api/analyze`
Submits a resume PDF and a target job description for ATS analysis.

- **Content-Type**: `multipart/form-data`
- **Headers** *(optional)*: `x-gemini-api-key: <custom_key>`
- **Body**:
  - `resume` (File, required): PDF document, max 10MB.
  - `jobDescription` (Text, required): Target job description (min 30 characters).
  - `jobTitle` (Text, optional): Target job title.

#### Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "6740b...",
    "fileName": "Alex_Morgan_Resume.pdf",
    "jobTitle": "Senior Full-Stack MERN Developer",
    "pdfMeta": {
      "numPages": 1,
      "characterCount": 2044
    },
    "matchScore": 88,
    "verdict": "Strong Match",
    "categoryScores": {
      "technicalSkills": 92,
      "experienceRelevance": 85,
      "softSkills": 80,
      "educationAndCertifications": 90
    },
    "matchedSkills": [
      { "skill": "React", "category": "Frontend", "context": "Built reactive interfaces with React and Redux" },
      { "skill": "Node.js", "category": "Backend", "context": "Architected scalable Node.js REST APIs" }
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
        "actionableAdvice": "Include Kafka or event-driven patterns in backend bullet points.",
        "example": "e.g., 'Implemented asynchronous event streaming using Kafka to decouple microservices.'"
      }
    ],
    "summaryRewrite": "Results-driven Senior Full-Stack Engineer with 5+ years of experience...",
    "analysisEngine": "gemini-api",
    "createdAt": "2026-11-22T07:18:22.000Z"
  }
}
```

### Other Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check, DB connection state & Gemini configuration |
| `GET` | `/api/history` | List recent analyses |
| `GET` | `/api/history/:id` | Fetch complete report details by ID |
| `DELETE` | `/api/history/:id` | Remove an analysis record |

---

## 🧪 Testing

Run the automated integration test suite:
```bash
npm run test:integration
```

**Test Coverage**:
- [x] Service health check (`GET /api/health`)
- [x] Input validation: Rejects missing resume file with `400 Bad Request`
- [x] Input validation: Rejects brief job descriptions with `400 Bad Request`
- [x] PDF text extraction and ATS analysis pipeline with `200 OK`
- [x] Past scan retrieval (`GET /api/history`)
- [x] Detail lookup (`GET /api/history/:id`)

---

## 💼 Resume / Portfolio Highlights

If you are showcasing this project on your resume or in technical interviews:

- **Full-Stack Engineering (MERN)**: Architected end-to-end web application with React 18 frontend, Express REST API, and MongoDB persistence.
- **LLM Structured Output Engineering**: Formulated prompt contracts with Google Gemini API enforcing JSON schema parsing to eliminate output hallucinations.
- **Resilient Buffer Streaming**: Solved Node 20+/26 memory buffer pooling anomalies in legacy PDF parsers through isolated `Uint8Array` conversions.
- **High-Availability Architecture**: Engineered dual-mode persistence (MongoDB with in-memory replica fallback) ensuring zero downtime regardless of database state.
- **Defensive API Design**: Implemented strict input validation and centralized error handling with granular HTTP status codes (`400`, `413`, `415`, `422`, `502`).

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
