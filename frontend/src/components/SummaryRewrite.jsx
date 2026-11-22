import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

export default function SummaryRewrite({ summaryRewrite }) {
  const [copied, setCopied] = useState(false);

  if (!summaryRewrite) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryRewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI-Tailored Professional Summary Rewrite
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimized with target keywords and high-impact phrasing for this exact position
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/25 self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="pt-4">
        <blockquote className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed italic">
          "{summaryRewrite}"
        </blockquote>
        <p className="text-[11px] text-slate-500 mt-2">
          Tip: Place this revised summary at the very top of your resume to immediately grab the recruiter's attention.
        </p>
      </div>
    </div>
  );
}
