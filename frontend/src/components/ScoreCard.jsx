import React from 'react';
import { Award, Cpu, Layers, CheckCircle2, TrendingUp, BookOpen, UserCheck } from 'lucide-react';

export default function ScoreCard({ data }) {
  const {
    matchScore = 0,
    verdict = 'Analysis Complete',
    categoryScores = {},
    fileName,
    jobTitle,
    pdfMeta,
    analysisEngine
  } = data || {};

  // Determine color scheme based on match score
  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        text: 'text-emerald-400',
        stroke: '#34d399',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        bar: 'bg-emerald-500'
      };
    } else if (score >= 60) {
      return {
        text: 'text-indigo-400',
        stroke: '#818cf8',
        badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        bar: 'bg-indigo-500'
      };
    } else if (score >= 45) {
      return {
        text: 'text-amber-400',
        stroke: '#fbbf24',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        bar: 'bg-amber-500'
      };
    } else {
      return {
        text: 'text-rose-400',
        stroke: '#f87171',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        bar: 'bg-rose-500'
      };
    }
  };

  const theme = getScoreTheme(matchScore);

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  const categories = [
    {
      name: 'Technical Skills Fit',
      score: categoryScores.technicalSkills || matchScore,
      icon: Cpu
    },
    {
      name: 'Experience Relevance',
      score: categoryScores.experienceRelevance || Math.round(matchScore * 0.95),
      icon: TrendingUp
    },
    {
      name: 'Soft Skills & Leadership',
      score: categoryScores.softSkills || Math.round(matchScore * 0.9),
      icon: UserCheck
    },
    {
      name: 'Education & Credentials',
      score: categoryScores.educationAndCertifications || Math.round(matchScore * 1.0),
      icon: BookOpen
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 mb-1 block">
            ATS Match Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {jobTitle || 'Target Position'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Resume: <span className="text-slate-200 font-medium">{fileName}</span>
            {pdfMeta && (
              <span className="ml-2 text-slate-500">
                ({pdfMeta.numPages} page{pdfMeta.numPages > 1 ? 's' : ''} • {pdfMeta.characterCount} chars)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            {analysisEngine?.includes('gemini') ? 'Gemini 2.5 Flash' : 'Smart Heuristic Engine'}
          </span>
        </div>
      </div>

      {/* Main Score Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6">
        {/* Circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#1e293b"
                strokeWidth="11"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>

            <div className="absolute flex flex-col items-center text-center">
              <span className={`text-4xl font-extrabold tracking-tight ${theme.text}`}>
                {matchScore}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                Match Score
              </span>
            </div>
          </div>

          <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-bold border ${theme.badgeBg}`}>
            {verdict}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Detailed Fit Breakdown
          </h4>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const catTheme = getScoreTheme(cat.score);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    {cat.name}
                  </span>
                  <span className={`font-bold ${catTheme.text}`}>{cat.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${catTheme.bar}`}
                    style={{ width: `${Math.min(100, Math.max(5, cat.score))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
