import React from 'react';
import { Sparkles, Key, History, Activity, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ health, onOpenApiKey, onOpenHistory, onReset, hasResults }) {
  const isHealthy = health?.status === 'healthy';
  const isGeminiReady = health?.gemini?.configured;
  const isDbLive = health?.database?.connected;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AI Resume Analyzer
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  2026 Edition
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Full-Stack MERN • PDF Parser • Gemini AI ATS Scoring
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Health Pill */}
          <div
            title={`API: ${isHealthy ? 'Online' : 'Connecting...'} | DB: ${isDbLive ? 'MongoDB Connected' : 'In-Memory Fallback'} | Gemini: ${isGeminiReady ? 'Configured' : 'Using Smart Fallback'}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 shadow-inner"
          >
            <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-400">Status:</span>
            <span className={isHealthy ? 'text-emerald-400' : 'text-amber-400'}>
              {isHealthy ? 'Active' : 'Offline'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-500" />
              {isDbLive ? 'MongoDB' : 'Memory'}
            </span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Past Scans</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKey}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-700/50 transition"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini Key</span>
          </button>

          {hasResults && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <span>+ New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
