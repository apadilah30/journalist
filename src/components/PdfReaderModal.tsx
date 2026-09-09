import React, { useState } from 'react';
import { Paper } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Highlighter,
  MessageSquare,
  Sparkles,
  Download,
  Bookmark,
  Share2,
  Check,
  Search,
  BookOpen,
  FileText,
} from 'lucide-react';

interface PdfReaderModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({ paper, isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 12;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeSection, setActiveSection] = useState('3. FlashAttention-2 Algorithm');
  const [activeHighlightColor, setActiveHighlightColor] = useState<'yellow' | 'green' | 'blue'>('yellow');
  const [showOutlineDrawer, setShowOutlineDrawer] = useState(true);
  const [outlineTab, setOutlineTab] = useState<'sections' | 'references' | 'metadata'>('sections');

  if (!isOpen || !paper) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/90 backdrop-blur-xs flex flex-col">
      {/* Top PDF Reader Control Bar */}
      <div className="bg-[#002046] text-white px-4 lg:px-6 py-2.5 flex items-center justify-between border-b border-[#1b365d] shadow-md shrink-0">
        {/* Left: Paper info & back */}
        <div className="flex items-center gap-3 truncate max-w-lg">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
            title="Close Reader"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <div className="text-[10px] font-mono text-[#85f8c4] flex items-center gap-1.5">
              <span>PDF VIEWER</span>
              <span>•</span>
              <span className="truncate">{paper.venue}</span>
            </div>
            <div className="text-xs font-serif font-bold text-white truncate">
              {paper.title}
            </div>
          </div>
        </div>

        {/* Center: Pagination & Zoom */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-0.5 hover:text-[#85f8c4] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-0.5 hover:text-[#85f8c4] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
            <button
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
              className="p-0.5 hover:text-[#85f8c4]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-0.5 hover:text-[#85f8c4]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Tools & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOutlineDrawer(!showOutlineDrawer)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              showOutlineDrawer
                ? 'bg-[#0051d5] text-white shadow-xs'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#85f8c4]" />
            <span className="hidden sm:inline">Index & References</span>
          </button>

          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
            title="Download Original PDF"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Outline / Sections */}
        <div className="w-64 bg-[#0d1c2e] text-gray-300 border-r border-[#1b365d] hidden md:flex flex-col p-4 text-xs font-mono shrink-0">
          <div className="text-[10px] uppercase font-bold text-[#85f8c4] tracking-wider mb-3">
            DOCUMENT OUTLINE
          </div>
          <div className="space-y-1 overflow-y-auto">
            {[
              '1. Introduction & Sequence Scaling',
              '2. GPU Architecture & Memory Hierarchy',
              '3. FlashAttention-2 Algorithm',
              '  3.1 Forward Pass Partitioning',
              '  3.2 Backward Pass Recomputation',
              '4. Empirical Evaluation & Benchmarks',
              '  4.1 Attention Microbenchmarks (A100)',
              '  4.2 End-to-End LLM Pretraining',
              '5. Discussion & Future Hardware',
              '6. References (58 Citations)',
            ].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section.trim())}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors truncate ${
                  activeSection === section.trim()
                    ? 'bg-[#002046] text-[#85f8c4] font-semibold border-l-2 border-[#85f8c4]'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Realistic Academic Document Page View */}
        <div className="flex-1 overflow-y-auto bg-[#334155]/60 p-4 sm:p-8 flex justify-center">
          <div
            style={{ width: `${Math.round(800 * (zoomLevel / 100))}px` }}
            className="bg-white text-[#0d1c2e] shadow-2xl rounded-sm p-8 sm:p-12 min-h-[1050px] transition-all flex flex-col justify-between select-text"
          >
            <div>
              {/* Document Header */}
              <div className="border-b border-gray-300 pb-3 mb-6 text-center">
                <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider">
                  Published in Proceedings of the 12th International Conference on Learning Representations (ICLR 2024)
                </div>
              </div>

              {/* Title & Authors on First/Current Page */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-center leading-tight mb-3">
                {paper.title}
              </h2>
              <div className="text-xs text-center text-gray-600 mb-6 font-medium">
                Tri Dao<sup>1,2*</sup>, Daniel Fu<sup>1</sup>, Christopher Ré<sup>1</sup>
                <div className="text-[11px] text-gray-500 font-sans mt-0.5">
                  <sup>1</sup>Stanford University, <sup>2</sup>Together AI
                </div>
              </div>

              {/* Two-Column Academic Paper Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-justify font-serif leading-relaxed text-gray-800">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-sans font-bold text-sm text-[#002046] mb-1">
                      3. FlashAttention-2 Algorithm
                    </h3>
                    <p>
                      In this section, we describe the algorithm changes that yield up to a 2× speedup compared to FlashAttention-1. We focus on two major areas: <span className="bg-yellow-200 px-0.5 rounded font-sans font-medium">tweaking the online softmax formulation</span> to eliminate non-matmul FLOPs, and <span className="bg-yellow-200 px-0.5 rounded font-sans font-medium">parallelizing along the sequence length dimension</span> across GPU thread blocks.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-sans font-semibold text-xs text-gray-900 mb-1">
                      3.1 Forward Pass Re-scaling
                    </h4>
                    <p>
                      {"Given queries Q in R^(N x d), keys K in R^(N x d), and values V in R^(N x d), standard attention computes:"}
                    </p>
                    {/* Math Equation Block */}
                    <div className="my-2 p-2 bg-gray-50 rounded border border-gray-200 text-center font-mono text-[11px] italic">
                      {"S = QK^T in R^(N x N),   P = softmax(S),   O = PV"}
                    </div>
                    <p>
                      FlashAttention computes O in blocks without materializing S in high-bandwidth memory (HBM). However, when updating the running softmax normalizer, v1 scaled both the intermediate output accumulator and the new block. In FlashAttention-2, we scale only the accumulator:
                    </p>
                    <div className="my-2 p-2 bg-gray-50 rounded border border-gray-200 text-center font-mono text-[10px]">
                      {"O^(j) = diag(l^(j-1) / l^(j)) O^(j-1) + P^(j) V_j"}
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-gray-900 mb-1">
                      3.2 Work Partitioning Across Warps
                    </h4>
                    <p className="bg-blue-50 p-2 rounded border border-blue-200 text-blue-950">
                      <strong>Highlight (Dao et al.):</strong> {"\"In FlashAttention-1, within each thread block, warps communicated via shared memory barriers. In FlashAttention-2, we partition Q across warps while keeping K, V in shared memory, allowing warps to compute independently without barrier synchronization.\""}
                    </p>
                  </div>

                  {/* Algorithm Box */}
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded text-[10px] font-mono">
                    <div className="font-bold border-b border-gray-300 pb-1 mb-1 text-gray-900">
                      Algorithm 1: FlashAttention-2 Forward
                    </div>
                    <div className="text-gray-700 space-y-0.5">
                      <div><strong>Require:</strong> {"Q, K, V in R^(N x d) in HBM, SRAM size M."}</div>
                      <div>1: Set block sizes Br = 64, Bc = 64.</div>
                      <div>2: {"Initialize O = (0)_(N x d), l = (0)_N, m = (-inf)_N."}</div>
                      <div>3: <strong>for</strong> {"i = 1 to T_r (Parallel over thread blocks)"} <strong>do</strong></div>
                      <div>4: &nbsp;&nbsp;Load Q_i from HBM to SRAM.</div>
                      <div>5: &nbsp;&nbsp;<strong>for</strong> {"j = 1 to T_c"} <strong>do</strong></div>
                      <div>6: &nbsp;&nbsp;&nbsp;&nbsp;{"Load K_j, V_j to SRAM; compute S_ij = Q_i K_j^T."}</div>
                      <div>7: &nbsp;&nbsp;&nbsp;&nbsp;Update running m_i, l_i, O_i.</div>
                      <div>8: &nbsp;&nbsp;<strong>end for</strong></div>
                      <div>9: &nbsp;&nbsp;Write O_i back to HBM.</div>
                      <div>10: <strong>end for</strong></div>
                    </div>
                  </div>

                  <p>
                    This avoids non-matmul FLOPs, lowering register usage and dramatically accelerating long-context training passes.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="border-t border-gray-200 pt-3 mt-8 flex justify-between items-center text-[10px] font-mono text-gray-500">
              <span>ScholarFlow High-Fidelity Reader · DOI: {paper.doi}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Right: Academic Document Index & References Drawer */}
        {showOutlineDrawer && (
          <div className="w-80 sm:w-96 bg-white border-l border-[#cbd5e1] flex flex-col h-full shrink-0 shadow-lg text-xs">
            {/* Header */}
            <div className="p-3 border-b border-[#e2e8f0] bg-[#f8f9ff] flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-[#002046]">
                <BookOpen className="w-4 h-4 text-[#0051d5]" />
                <span className="font-serif text-sm">Paper Navigation & Bibliography</span>
              </div>
              <button
                onClick={() => setShowOutlineDrawer(false)}
                className="text-[#64748b] hover:text-[#002046] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-[#e2e8f0] bg-white text-[11px] font-medium">
              <button
                onClick={() => setOutlineTab('sections')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  outlineTab === 'sections'
                    ? 'border-[#0051d5] text-[#002046] font-semibold bg-[#f8f9ff]'
                    : 'border-transparent text-[#64748b] hover:text-[#002046]'
                }`}
              >
                Outline ({totalPages}p)
              </button>
              <button
                onClick={() => setOutlineTab('references')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  outlineTab === 'references'
                    ? 'border-[#0051d5] text-[#002046] font-semibold bg-[#f8f9ff]'
                    : 'border-transparent text-[#64748b] hover:text-[#002046]'
                }`}
              >
                Citations ({paper.referencesCount || 35})
              </button>
              <button
                onClick={() => setOutlineTab('metadata')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  outlineTab === 'metadata'
                    ? 'border-[#0051d5] text-[#002046] font-semibold bg-[#f8f9ff]'
                    : 'border-transparent text-[#64748b] hover:text-[#002046]'
                }`}
              >
                Corpus Metadata
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {outlineTab === 'sections' && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                    DOCUMENT SECTIONS
                  </div>
                  {[
                    { title: '1. Introduction & Motivation', page: 1 },
                    { title: '2. Background: Memory Hierarchies & SRAM', page: 2 },
                    { title: '3. FlashAttention-2 Algorithm', page: 3 },
                    { title: '3.1 Forward Pass Work Partitioning', page: 4 },
                    { title: '3.2 Backward Pass Recomputation', page: 6 },
                    { title: '4. Empirical Evaluation & Benchmarks', page: 8 },
                    { title: '5. Related Work & Precedents', page: 10 },
                    { title: '6. Conclusion & Broader Impact', page: 11 },
                    { title: 'References & Appendices', page: 12 },
                  ].map((sec, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveSection(sec.title);
                        setCurrentPage(sec.page);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        activeSection === sec.title
                          ? 'bg-[#eff4ff] text-[#0051d5] font-semibold border border-[#cbd5e1]'
                          : 'hover:bg-[#f8f9ff] text-[#334155]'
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <span className="text-[10px] font-mono text-[#64748b] ml-2 shrink-0">p. {sec.page}</span>
                    </button>
                  ))}
                </div>
              )}

              {outlineTab === 'references' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                    KEY CITED REFERENCES
                  </div>
                  {[
                    { authors: 'Vaswani et al.', year: 2017, title: 'Attention Is All You Need', venue: 'NeurIPS', cites: 124800 },
                    { authors: 'Dao et al.', year: 2022, title: 'FlashAttention: Fast and Memory-Efficient Exact Attention', venue: 'NeurIPS Oral', cites: 3890 },
                    { authors: 'Kwon et al.', year: 2023, title: 'Efficient Memory Management with PagedAttention', venue: 'SOSP', cites: 1680 },
                    { authors: 'Touvron et al.', year: 2023, title: 'LLaMA: Open and Efficient Foundation Models', venue: 'arXiv', cites: 11400 },
                    { authors: 'Shoeybi et al.', year: 2019, title: 'Megatron-LM: Training Multi-Billion Parameter LLMs', venue: 'arXiv', cites: 3200 },
                  ].map((ref, i) => (
                    <div key={i} className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-semibold text-[#002046]">{ref.authors} ({ref.year})</span>
                        <span className="text-[#00875a] font-medium">{ref.cites.toLocaleString()} cites</span>
                      </div>
                      <div className="text-xs text-[#1e293b] font-serif font-medium leading-snug">{ref.title}</div>
                      <div className="text-[10px] text-[#64748b]">{ref.venue}</div>
                    </div>
                  ))}
                </div>
              )}

              {outlineTab === 'metadata' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] space-y-2">
                    <div>
                      <span className="text-[#64748b] text-[10px] block">SEMANTIC SCHOLAR ID:</span>
                      <span className="text-[#002046] text-[11px] break-all">{paper.id}</span>
                    </div>
                    {paper.corpusId && (
                      <div>
                        <span className="text-[#64748b] text-[10px] block">CORPUS ID:</span>
                        <span className="text-[#002046] text-[11px]">{paper.corpusId}</span>
                      </div>
                    )}
                    {paper.doi && (
                      <div>
                        <span className="text-[#64748b] text-[10px] block">DIGITAL OBJECT IDENTIFIER (DOI):</span>
                        <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="text-[#0051d5] hover:underline text-[11px]">
                          {paper.doi}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-[#64748b] text-[10px] block">TOTAL CITATION COUNT:</span>
                      <span className="text-[#00875a] font-bold text-sm">{paper.citations.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-[10px] block">INFLUENTIAL CITATIONS:</span>
                      <span className="text-[#002046] font-semibold">{paper.influentialCitations?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="p-3 border-t border-[#cbd5e1] bg-[#f8f9ff] text-[11px] text-[#64748b] flex items-center justify-between font-mono">
              <span>Pure Academic Index</span>
              <span>Semantic Scholar v1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
