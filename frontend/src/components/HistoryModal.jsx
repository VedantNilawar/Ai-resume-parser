import React, { useEffect, useState } from 'react';
import { X, Trash2, ArrowUpRight, History, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { getAnalysisHistory, deleteAnalysisRecord } from '../api/client.js';

export default function HistoryModal({ isOpen, onClose, onSelectAnalysis }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getAnalysisHistory(30);
      setHistory(records);
    } catch (err) {
      setError(err.message || 'Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteAnalysisRecord(id);
      setHistory(prev => prev.filter(item => (item._id || item.id) !== id));
    } catch (err) {
      alert(`Could not delete record: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Scan History</h3>
              <p className="text-xs text-slate-400">Previous resume analysis reports</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading past scans...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-rose-400 text-xs">{error}</div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No previous analyses recorded yet. Scan a resume to see it here!
            </div>
          ) : (
            history.map((item) => {
              const id = item._id || item.id;
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Recent';

              return (
                <div
                  key={id}
                  onClick={() => {
                    onSelectAnalysis(item);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition">
                        {item.jobTitle || 'Target Position'}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="truncate max-w-[150px]">{item.fileName}</span>
                        <span>•</span>
                        <span>{dateStr}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-indigo-400">
                        {item.matchScore}%
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">
                        {item.verdict || 'Match'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, id)}
                      title="Delete record"
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
