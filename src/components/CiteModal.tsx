import React, { useState } from 'react';
import { Paper } from '../types';
import { Copy, Check, Download, ExternalLink, X, RefreshCw, Bookmark } from 'lucide-react';

interface CiteModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CiteModal: React.FC<CiteModalProps> = ({ paper, isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'bibtex' | 'apa' | 'ieee' | 'mla' | 'ris'>('bibtex');
  const [copied, setCopied] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  if (!isOpen || !paper) return null;

  const apaCitation = `${paper.authors.map(a => a.name).join(', ')} (${paper.year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doi}`;
  const ieeeCitation = `${paper.authors.map(a => a.name.split(' ').map(n => n[0] + '.').slice(0, -1).join(' ') + ' ' + a.name.split(' ').slice(-1)).join(', ')}, "${paper.title}," in ${paper.venue}, ${paper.year}, doi: ${paper.doi}.`;
  const mlaCitation = `${paper.authors[0]?.name}, et al. "${paper.title}." ${paper.venue}, ${paper.year}. https://doi.org/${paper.doi}.`;
  
  const risFormat = `TY  - JOUR
TI  - ${paper.title}
${paper.authors.map(a => `AU  - ${a.name}`).join('\n')}
JO  - ${paper.venue}
PY  - ${paper.year}
DO  - ${paper.doi}
UR  - https://doi.org/${paper.doi}
ER  -`;

  let currentText = paper.bibtex;
  if (activeFormat === 'apa') currentText = apaCitation;
  else if (activeFormat === 'ieee') currentText = ieeeCitation;
  else if (activeFormat === 'mla') currentText = mlaCitation;
  else if (activeFormat === 'ris') currentText = risFormat;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const ext = activeFormat === 'ris' ? 'ris' : 'bib';
    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paper.key || 'citation'}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePushToZotero = () => {
    setPushStatus('Syncing item to local Zotero library...');
    setTimeout(() => {
      setPushStatus('Successfully added to Zotero collection: Efficient AI');
      setTimeout(() => setPushStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl max-w-2xl w-full border border-[#cbd5e1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f8f9ff] px-6 py-4 border-b border-[#cbd5e1] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#0051d5] font-semibold uppercase tracking-wider">
              CITATION & EXPORT MANAGER
            </div>
            <h3 className="font-serif font-bold text-lg text-[#002046] leading-snug">
              {paper.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748b] hover:text-[#002046] hover:bg-[#e2e8f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Format Tabs */}
          <div className="flex items-center gap-1 border-b border-[#e2e8f0] pb-2 mb-4 text-xs">
            <button
              onClick={() => setActiveFormat('bibtex')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeFormat === 'bibtex'
                  ? 'bg-[#002046] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              BibTeX
            </button>
            <button
              onClick={() => setActiveFormat('apa')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeFormat === 'apa'
                  ? 'bg-[#002046] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              APA (7th ed.)
            </button>
            <button
              onClick={() => setActiveFormat('ieee')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeFormat === 'ieee'
                  ? 'bg-[#002046] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              IEEE
            </button>
            <button
              onClick={() => setActiveFormat('mla')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeFormat === 'mla'
                  ? 'bg-[#002046] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              MLA (9th)
            </button>
            <button
              onClick={() => setActiveFormat('ris')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeFormat === 'ris'
                  ? 'bg-[#002046] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#f1f5f9]'
              }`}
            >
              RIS (EndNote)
            </button>
          </div>

          {/* Citation Text Area Box */}
          <div className="relative bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg p-4 font-mono text-xs text-[#1e293b] max-h-60 overflow-y-auto mb-4">
            <pre className="whitespace-pre-wrap leading-relaxed">{currentText}</pre>
          </div>

          {pushStatus && (
            <div className="mb-4 p-2.5 rounded-lg bg-[#e3fcef] text-[#00875a] border border-[#a3f3cb] text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{pushStatus}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePushToZotero}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] border border-[#cbd5e1] rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Push to Zotero / Mendeley</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#f8f9ff] text-[#1b365d] border border-[#cbd5e1] rounded-lg text-xs font-medium transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#85f8c4]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Citation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
