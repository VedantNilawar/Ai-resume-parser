import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { getSavedGeminiKey, saveGeminiKey } from '../api/client.js';

export default function ApiKeyModal({ isOpen, onClose, health, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getSavedGeminiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    saveGeminiKey(apiKey);
    setSavedSuccess(true);
    if (onKeyUpdated) onKeyUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    saveGeminiKey('');
    setApiKey('');
    if (onKeyUpdated) onKeyUpdated();
  };

  if (!isOpen) return null;

  const isServerConfigured = health?.gemini?.configured;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gemini API Settings</h3>
              <p className="text-xs text-slate-400">Configure AI analysis engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Server .env Status:</span>
              <span className={isServerConfigured ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isServerConfigured ? '✓ Configured in .env' : 'Not set in backend .env'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              You can set your Gemini key in <code className="text-indigo-300">backend/.env</code> or enter it below to run scans directly with your own Google AI key.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Gemini API Key (saved locally in browser)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 outline-none font-mono transition"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
            >
              <span>Get free key from Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-500 hover:text-rose-400 transition"
              >
                Clear
              </button>
            )}
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Key saved successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
