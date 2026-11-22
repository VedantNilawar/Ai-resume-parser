import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertTriangle, FileCode } from 'lucide-react';

export default function ResumeUpload({ selectedFile, setSelectedFile, error, setError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please upload a PDF file (.pdf only).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async () => {
    setIsLoadingSample(true);
    setError(null);
    try {
      const response = await fetch('/sample_developer_resume.pdf');
      if (!response.ok) throw new Error('Could not fetch sample resume PDF');
      const blob = await response.blob();
      const sampleFile = new File([blob], 'Alex_Morgan_Senior_FullStack_Resume.pdf', {
        type: 'application/pdf'
      });
      setSelectedFile(sampleFile);
    } catch (err) {
      setError(`Failed to load sample resume: ${err.message}`);
    } finally {
      setIsLoadingSample(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-400" />
          1. Upload Resume PDF
        </label>
        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isLoadingSample}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 underline underline-offset-2 transition"
        >
          <FileCode className="w-3.5 h-3.5" />
          {isLoadingSample ? 'Loading sample...' : 'Use Sample Resume'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[220px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-200 mb-1">
            Drag & drop your resume PDF here
          </p>
          <p className="text-xs text-slate-400 mb-3">
            or <span className="text-indigo-400 font-medium underline">browse files</span> from your computer
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Supports standard PDF</span>
            <span>•</span>
            <span>Max 10MB</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-[220px] rounded-2xl border border-indigo-500/40 bg-slate-900/70 p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs" title={selectedFile.name}>
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for ATS scan
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              Change file
            </button>
            <span className="text-slate-500 text-[11px]">PDF text will be extracted via pdf-parse</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
