import React from 'react';
import { Lightbulb, CheckCircle2, ArrowRight, Zap, Target } from 'lucide-react';

export default function SuggestionsList({ strengths = [], improvementSuggestions = [] }) {
  return (
    <div className="space-y-6">
      {/* Strengths Section */}
      {strengths.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Identified Resume Strengths
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Highlights that strongly support your candidacy for this role
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strengths.map((str, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Suggestions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Actionable ATS Improvement Recommendations
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Step-by-step revisions to significantly raise your ATS score and interview callback rate
        </p>

        <div className="space-y-4">
          {improvementSuggestions.map((sug, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {sug.title}
                  </h4>
                </div>
                {sug.category && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-800/40 self-start sm:self-auto">
                    {sug.category}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {sug.actionableAdvice}
              </p>

              {sug.example && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-indigo-200/90 leading-relaxed">
                  <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
                    Concrete Tailoring Example:
                  </span>
                  {sug.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
