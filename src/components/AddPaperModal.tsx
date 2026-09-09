import React, { useState } from 'react';
import { Paper } from '../types';
import { X, Plus, Search, Check, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaper: (paper: Paper) => void;
}

export const AddPaperModal: React.FC<AddPaperModalProps> = ({
  isOpen,
  onClose,
  onAddPaper,
}) => {
  const [identifier, setIdentifier] = useState('10.48550/arXiv.2405.04434');
  const [targetCollection, setTargetCollection] = useState('thesis');
  const [resolvedPaper, setResolvedPaper] = useState<Paper | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsResolving(true);
    setTimeout(() => {
      setIsResolving(false);
      setResolvedPaper({
        id: 'new-paper-' + Date.now(),
        title: 'You Only Cache Once: Decoder-Decoder Architectures for Efficient Context',
        authors: [
          { name: 'Yutao Sun', affiliation: 'Tsinghua University', superscript: '1' },
          { name: 'Li Dong', affiliation: 'Microsoft Research', superscript: '2' },
        ],
        authorsSummary: 'Y. Sun, L. Dong et al. (Microsoft Research)',
        venue: 'NeurIPS 2024 Spotlight',
        year: 2024,
        doi: '10.48550/arXiv.2405.04434',
        arxivId: 'arXiv:2405.04434',
        citations: 142,
        citationVelocity: 38,
        openAccess: true,
        hasPdf: true,
        pdfUrl: 'https://arxiv.org/pdf/2405.04434.pdf',
        collectionIds: [targetCollection],
        tags: ['transformers', 'benchmarks'],
        readStatus: 'unread',
        notesSummary: 'YOCO cross-layer KV caching methodology for 1M context',
        notesMarkdown: '# YOCO Notes\n- Caches Key-Value pairs once in the lower layers and reuses across upper layers.',
        key: '@sun2024yoco',
        bibtex: `@article{sun2024yoco,\n  title={You Only Cache Once: Decoder-Decoder Architectures for Efficient Context},\n  author={Sun, Yutao and Dong, Li and others},\n  journal={NeurIPS},\n  year={2024}\n}`,
        abstract:
          'We introduce YOCO, a decoder-decoder architecture that addresses high GPU memory bounds during LLM inference by caching KV states once in self-decoder layers.',
        quarterGrowth: 45,
      });
    }, 600);
  };

  const handleConfirmAdd = () => {
    if (resolvedPaper) {
      onAddPaper({ ...resolvedPaper, collectionIds: [targetCollection] });
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl max-w-xl w-full border border-[#cbd5e1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f8f9ff] px-6 py-4 border-b border-[#cbd5e1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#002046] flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#002046]">
                Add Paper to ScholarFlow Library
              </h3>
              <p className="text-xs text-[#64748b]">
                Import via DOI, arXiv ID, PubMed PMID, or paper URL
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <form onSubmit={handleResolve} className="space-y-3">
            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Enter Identifier (DOI, arXiv, PubMed ID, or URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 10.48550/arXiv.2307.08691 or arXiv:2307.08691"
                  className="flex-1 px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg text-xs font-mono focus:outline-hidden focus:border-[#0051d5]"
                />
                <button
                  type="submit"
                  disabled={isResolving}
                  className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white font-medium rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isResolving ? 'Resolving...' : 'Resolve'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Target Collection:
              </label>
              <select
                value={targetCollection}
                onChange={(e) => setTargetCollection(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg text-xs font-medium focus:outline-hidden"
              >
                <option value="thesis">Thesis: Efficient LLM Inference (48 papers)</option>
                <option value="reading">Currently Reading</option>
                <option value="grant">Grant Proposal: NSF AI Frontier</option>
                <option value="unread">Unread Queue</option>
              </select>
            </div>
          </form>

          {/* Resolved Preview Card */}
          {resolvedPaper && (
            <div className="p-4 bg-[#f8f9ff] border border-[#cbd5e1] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-[#002046] text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                  {resolvedPaper.venue}
                </span>
                <span className="text-[#00875a] font-mono text-[11px] font-medium">
                  {resolvedPaper.citations} citations resolved
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#002046]">
                {resolvedPaper.title}
              </h4>
              <p className="text-[#475569] text-xs">
                {resolvedPaper.authorsSummary}
              </p>
              <p className="text-[#64748b] text-[11px] line-clamp-2 leading-relaxed">
                {resolvedPaper.abstract}
              </p>
            </div>
          )}

          {added && (
            <div className="p-3 bg-[#e3fcef] text-[#00875a] border border-[#a3f3cb] rounded-lg flex items-center gap-2 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paper successfully added to collection and synced to Zotero!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#475569] border border-[#cbd5e1] rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAdd}
              disabled={!resolvedPaper || added}
              className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Add to Library</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
