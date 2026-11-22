import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ResumeUpload from './components/ResumeUpload.jsx';
import JobDescriptionInput from './components/JobDescriptionInput.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import SkillsBreakdown from './components/SkillsBreakdown.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import SummaryRewrite from './components/SummaryRewrite.jsx';
import HistoryModal from './components/HistoryModal.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import { analyzeResume, checkBackendHealth } from './api/client.js';
import { ArrowRight, Sparkles, Loader2, RefreshCw, Printer, AlertCircle } from 'lucide-react';

const ANALYSIS_STAGES = [
  'Extracting text streams from uploaded PDF...',
  'Evaluating technical skill alignments & experience depth...',
  'Interfacing with Gemini API for structured ATS evaluation...',
  'Synthesizing tailored recommendations & summary rewrite...'
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);

  // Errors
  const [fileError, setFileError] = useState(null);
  const [jdError, setJdError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // System & Modals
  const [health, setHealth] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // Initial Health Check
  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    const data = await checkBackendHealth();
    setHealth(data);
  };

  // Progress cycle during analysis
  useEffect(() => {
    let timer;
    if (isAnalyzing) {
      setLoadingStage(0);
      timer = setInterval(() => {
        setLoadingStage((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    setFileError(null);
    setJdError(null);
    setApiError(null);

    let hasError = false;
    if (!selectedFile) {
      setFileError('Please upload a resume PDF file to analyze.');
      hasError = true;
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      setJdError('Please enter at least 30 characters of the target job description.');
      hasError = true;
    }

    if (hasError) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume({
        file: selectedFile,
        jobTitle,
        jobDescription
      });
      setAnalysisData(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError(err.message || 'An error occurred during resume analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setSelectedFile(null);
    setJobDescription('');
    setFileError(null);
    setJdError(null);
    setApiError(null);
  };

  const handleSelectFromHistory = (item) => {
    setAnalysisData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        health={health}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        hasResults={Boolean(analysisData)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Analysis Request Failed</h4>
              <p className="text-xs text-rose-300/90 mt-0.5">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-xs text-rose-400 hover:text-white transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {!analysisData ? (
          /* Input / Scanner View */
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 p-8 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  MERN + Gemini AI Resume & ATS Match Engine
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Match your resume against any job description with precision.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                  Extracts raw text from resume PDFs, evaluates keyword parity and experience depth using Google Gemini AI, and delivers match scores with actionable suggestions to ace recruiter screenings.
                </p>

                {/* Tech Pills */}
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-400">
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
                    Node.js & Express REST API
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
                    PDF Text Extraction
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
                    Gemini API Structured JSON
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
                    MongoDB Persistence
                  </span>
                </div>
              </div>
            </div>

            {/* Upload & JD Input Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left: Resume Upload */}
              <div className="lg:col-span-5 glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <ResumeUpload
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  error={fileError}
                  setError={setFileError}
                />
              </div>

              {/* Right: Job Description */}
              <div className="lg:col-span-7 glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <JobDescriptionInput
                  jobTitle={jobTitle}
                  setJobTitle={setJobTitle}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  error={jdError}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-3xl shadow-xl">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Ready to analyze:</span>{' '}
                {selectedFile ? selectedFile.name : 'No resume selected'} •{' '}
                {jobDescription ? `${jobDescription.length} characters in JD` : 'No JD entered'}
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white transition shadow-xl glow-hover ${
                  isAnalyzing
                    ? 'bg-indigo-600/60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-600/30'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Candidate Fit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Resume Fit</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Loading Modal/Overlay */}
            {isAnalyzing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
                    <div className="relative w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/50">
                      <Sparkles className="w-8 h-8 animate-spin" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Analyzing Resume with Gemini AI
                    </h3>
                    <p className="text-xs text-indigo-400 font-mono mt-2 min-h-[20px] transition-all">
                      {ANALYSIS_STAGES[loadingStage]}
                    </p>
                  </div>

                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((loadingStage + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Cross-checking technical skills, responsibilities, and experience relevance...
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results View */
          <div className="space-y-8 animate-fade-in">
            {/* Top Results Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another Resume</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export / Print Report</span>
                </button>
              </div>
            </div>

            {/* Score Card Component */}
            <ScoreCard data={analysisData} />

            {/* Skills Breakdown Component */}
            <SkillsBreakdown
              matchedSkills={analysisData.matchedSkills}
              missingSkills={analysisData.missingSkills}
            />

            {/* Actionable Suggestions Component */}
            <SuggestionsList
              strengths={analysisData.strengths}
              improvementSuggestions={analysisData.improvementSuggestions}
            />

            {/* Summary Rewrite Component */}
            <SummaryRewrite summaryRewrite={analysisData.summaryRewrite} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>AI Resume Analyzer 2026 • Powered by MongoDB, Express, React, Node.js & Google Gemini API</p>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectAnalysis={handleSelectFromHistory}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        health={health}
        onKeyUpdated={fetchHealth}
      />
    </div>
  );
}
