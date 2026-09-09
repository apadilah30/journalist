import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, ShieldCheck, Database, Layers, ArrowRight } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose }) => {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [autoSyncPdfs, setAutoSyncPdfs] = useState(true);
  const [syncAnnotations, setSyncAnnotations] = useState(true);
  const [useBetterBibtex, setUseBetterBibtex] = useState(true);

  if (!isOpen) return null;

  const handleStartSync = () => {
    setSyncing(true);
    setProgress(15);
    setSyncSuccess(false);

    setTimeout(() => setProgress(45), 400);
    setTimeout(() => setProgress(75), 900);
    setTimeout(() => {
      setProgress(100);
      setSyncing(false);
      setSyncSuccess(true);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl max-w-xl w-full border border-[#cbd5e1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f8f9ff] px-6 py-4 border-b border-[#cbd5e1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#002046] flex items-center justify-center text-white">
              <RefreshCw className="w-4 h-4 text-[#85f8c4]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#002046]">
                External Reference Manager Sync
              </h3>
              <p className="text-xs text-[#64748b]">
                Bidirectional synchronization with Zotero Desktop & Mendeley Web
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748b] hover:text-[#002046] hover:bg-[#e2e8f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Services status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Zotero card */}
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#cbd5e1] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif font-bold text-[#002046] text-sm">Zotero Desktop</span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[#00875a] bg-[#e3fcef] px-2 py-0.5 rounded font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Connected</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-relaxed">
                  Local HTTP Bridge (127.0.0.1:23119). Better BibTeX plug-in active.
                </p>
              </div>
              <div className="mt-3 text-[11px] font-mono text-[#0051d5]">
                184 items synchronized
              </div>
            </div>

            {/* Mendeley card */}
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#cbd5e1] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif font-bold text-[#002046] text-sm">Mendeley Web</span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[#00875a] bg-[#e3fcef] px-2 py-0.5 rounded font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active OAuth</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-relaxed">
                  Cloud library link mapped to Dr. Aris Thorne (MIT CSAIL).
                </p>
              </div>
              <div className="mt-3 text-[11px] font-mono text-[#0051d5]">
                OAuth token valid (30d)
              </div>
            </div>
          </div>

          {/* Sync Preferences */}
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 space-y-2.5">
            <div className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-2">
              SYNCHRONIZATION PREFERENCES
            </div>

            <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
              <span className="text-xs font-medium text-[#1e293b]">
                Bi-directional PDF attachment sync
              </span>
              <input
                type="checkbox"
                checked={autoSyncPdfs}
                onChange={(e) => setAutoSyncPdfs(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#0051d5]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
              <span className="text-xs font-medium text-[#1e293b]">
                Sync highlights and marginalia notes
              </span>
              <input
                type="checkbox"
                checked={syncAnnotations}
                onChange={(e) => setSyncAnnotations(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#0051d5]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:text-[#002046]">
              <span className="text-xs font-medium text-[#1e293b]">
                Better BibTeX key formatting (@authorYearTitle)
              </span>
              <input
                type="checkbox"
                checked={useBetterBibtex}
                onChange={(e) => setUseBetterBibtex(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#0051d5]"
              />
            </label>
          </div>

          {/* Progress Bar (during sync) */}
          {syncing && (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#0051d5] font-semibold">
                <span>Synchronizing catalog & PDFs...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-[#0051d5] rounded-full transition-all duration-300"
                ></div>
              </div>
            </div>
          )}

          {syncSuccess && (
            <div className="p-3 rounded-lg bg-[#e3fcef] text-[#00875a] border border-[#a3f3cb] flex items-center gap-2 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Catalog index updated: 184 papers and 3 collections in sync.</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#475569] border border-[#cbd5e1] rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartSync}
              disabled={syncing}
              className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Catalog Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
