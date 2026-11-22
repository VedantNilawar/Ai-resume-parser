import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Filter } from 'lucide-react';

export default function SkillsBreakdown({ matchedSkills = [], missingSkills = [] }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'matched' | 'missing'

  const getImportanceBadge = (importance) => {
    switch (importance) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Recommended':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Nice-to-have':
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Skills & Keyword Alignment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referenced with ATS keywords extracted from the job description
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({matchedSkills.length + missingSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('matched')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'matched'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matched ({matchedSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'missing'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Missing Gaps ({missingSkills.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {/* Matched Skills Column */}
        {(activeTab === 'all' || activeTab === 'matched') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Matched Skills ({matchedSkills.length})
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">Found in resume</span>
            </div>

            {matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                No overlapping core skills explicitly found.
              </p>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {matchedSkills.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-700/60 transition group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-emerald-200 group-hover:text-emerald-100">
                        {item.skill}
                      </span>
                      {item.category && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-300 border border-emerald-800/50">
                          {item.category}
                        </span>
                      )}
                    </div>
                    {item.context && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {item.context}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Missing Skills Column */}
        {(activeTab === 'all' || activeTab === 'missing') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Missing Skill Gaps ({missingSkills.length})
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">High priority for ATS</span>
            </div>

            {missingSkills.length === 0 ? (
              <p className="text-xs text-emerald-400 italic p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                Outstanding! No notable skill omissions identified from the job description.
              </p>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {missingSkills.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-rose-950/20 border border-rose-900/40 hover:border-rose-700/60 transition group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-rose-200 group-hover:text-rose-100">
                        {item.skill}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${getImportanceBadge(
                          item.importance
                        )}`}
                      >
                        {item.importance || 'Recommended'}
                      </span>
                    </div>
                    {item.reason && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {item.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
