import React, { useState } from 'react';
import { Paper } from '../types';
import { mockReferences, benchmarkData } from '../data/mockData';
import {
  FileText,
  Quote,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  GitBranch,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Search,
  Download,
  Copy,
  Check,
  Code,
  Layers,
  Cpu,
  BarChart3,
  Maximize2,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

interface PaperViewProps {
  paper: Paper;
  onOpenCiteModal: (paper: Paper) => void;
  onOpenPdfReader: (paper: Paper) => void;
  onToggleLibrary: (paperId: string) => void;
  isInLibrary: (paperId: string) => boolean;
}

export const PaperView: React.FC<PaperViewProps> = ({
  paper,
  onOpenCiteModal,
  onOpenPdfReader,
  onToggleLibrary,
  isInLibrary,
}) => {
  const [refSearch, setRefSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFigureModal, setActiveFigureModal] = useState<string | null>(null);

  const filteredReferences = mockReferences.filter(
    (ref) =>
      ref.title.toLowerCase().includes(refSearch.toLowerCase()) ||
      ref.authorsYear.toLowerCase().includes(refSearch.toLowerCase()) ||
      ref.role.toLowerCase().includes(refSearch.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex-1 w-full bg-[#f8f9ff]">
      {/* Sub-Navbar / Breadcrumb */}
      <div className="bg-white border-b border-[#e2e8f0] px-4 lg:px-6 py-2.5">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[#64748b] font-medium truncate">
            <span>Computer Science</span>
            <ChevronRight className="w-3 h-3 text-[#94a3b8]" />
            <span>Machine Learning & Hardware</span>
            <ChevronRight className="w-3 h-3 text-[#94a3b8]" />
            <span>Transformer Acceleration</span>
            <ChevronRight className="w-3 h-3 text-[#94a3b8]" />
            <span className="font-mono text-[#002046] font-semibold">{paper.arxivId || paper.doi}</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3fcef] text-[#00875a] border border-[#a3f3cb] font-medium text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Open Access</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eff4ff] text-[#0051d5] border border-[#cbd5e1] font-medium text-[11px]">
              <Sparkles className="w-3 h-3" />
              <span>Peer-Reviewed (ICLR 2024 Spotlight)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 py-6">
        {/* Paper Title Header */}
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 mb-6 shadow-xs">
          {/* Conference Presentation Flag */}
          <div className="inline-block px-2.5 py-0.5 mb-3 bg-[#e6eeff] border border-[#cbd5e1] text-[11px] font-mono font-semibold text-[#002046] uppercase tracking-wider rounded">
            {paper.presentationType || "ICLR 2024 ORAL PRESENTATION"} · Received July 17, 2023 · Published in Conference Proceedings March 2024
          </div>

          {/* Headline Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#002046] tracking-tight leading-tight mb-3">
            {paper.title}
          </h1>

          {/* Authors with Affiliations */}
          <div className="text-sm text-[#1e293b] mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {paper.authors.map((author, index) => (
              <span key={index} className="inline-flex items-center gap-0.5">
                <span className="font-semibold text-[#0051d5] hover:underline cursor-pointer">
                  {author.name}
                </span>
                <sup className="text-[10px] text-[#64748b] font-mono">{author.superscript}</sup>
                {index < paper.authors.length - 1 && <span className="text-[#cbd5e1] ml-2">·</span>}
              </span>
            ))}
          </div>

          {/* Institutional Affiliation footnotes */}
          <div className="text-xs text-[#64748b] mb-4 space-x-3">
            <span><sup>1</sup> Department of Computer Science, Stanford University</span>
            <span><sup>2</sup> Together AI</span>
            <span className="text-[#0051d5]"><sup>*</sup> Corresponding author (trid@cs.stanford.edu)</span>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-[#f1f5f9] text-xs font-mono text-[#475569]">
            <div>
              <span className="text-[#94a3b8]">DOI: </span>
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#0051d5] hover:underline"
              >
                {paper.doi}
              </a>
            </div>
            <span>•</span>
            <div>
              <span className="text-[#94a3b8]">CORPUS ID: </span>
              <span>{paper.corpusId || '259954082'}</span>
            </div>
            <span>•</span>
            <div>
              <span className="text-[#94a3b8]">SUBJECT: </span>
              <span>{paper.subject || 'cs.LG · cs.AR · cs.PF'}</span>
            </div>
            <span>•</span>
            <div>
              <span className="text-[#94a3b8]">LICENSE: </span>
              <span>{paper.license || 'Apache-2.0 Open Source'}</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Citations */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#64748b] text-[10px] font-semibold uppercase tracking-wider mb-1">
              <span>TOTAL CITATIONS</span>
              <Quote className="w-3.5 h-3.5 text-[#0051d5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-[#002046]">
                {paper.citations.toLocaleString()}
              </span>
              <span className="text-xs font-mono font-semibold text-[#00875a]">
                +{paper.citationVelocity || 84}/mo
              </span>
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">Semantic Scholar & CrossRef</div>
          </div>

          {/* Influential Citations */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#64748b] text-[10px] font-semibold uppercase tracking-wider mb-1">
              <span>INFLUENTIAL CITATIONS</span>
              <Sparkles className="w-3.5 h-3.5 text-[#0051d5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-[#002046]">
                {paper.influentialCitations || 312}
              </span>
              <span className="text-xs font-mono text-[#0051d5]">17.0% ratio</span>
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">Direct methodology adoption</div>
          </div>

          {/* References */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#64748b] text-[10px] font-semibold uppercase tracking-wider mb-1">
              <span>REFERENCES</span>
              <Layers className="w-3.5 h-3.5 text-[#0051d5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-[#002046]">
                {paper.referencesCount || 58}
              </span>
              <span className="text-xs font-mono text-[#00875a]">All resolved</span>
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">12 seminal core anchors</div>
          </div>

          {/* Altmetric Attention */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#64748b] text-[10px] font-semibold uppercase tracking-wider mb-1">
              <span>ALTMETRIC ATTENTION</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#0051d5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-[#002046]">
                {paper.altmetricScore || 420}
              </span>
              <span className="text-xs font-mono text-[#0051d5]">Top 2%</span>
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">11.4k GitHub Stars · 142 repos</div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white rounded-xl border border-[#cbd5e1] px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenPdfReader(paper)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg font-medium transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read Full PDF in Viewer</span>
            </button>

            <button
              onClick={() => onOpenCiteModal(paper)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#f8f9ff] text-[#002046] border border-[#cbd5e1] rounded-lg font-medium transition-colors"
            >
              <Quote className="w-3.5 h-3.5 text-[#0051d5]" />
              <span>Cite / Export</span>
            </button>

            <button
              onClick={() => onToggleLibrary(paper.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#e3fcef] text-[#00875a] border border-[#a3f3cb] rounded-lg font-medium transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00875a]" />
              <span>Saved in: Efficient AI</span>
            </button>

            <button
              onClick={() => onOpenPdfReader(paper)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#f8f9ff] text-[#475569] border border-[#cbd5e1] rounded-lg font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#0051d5]" />
              <span>Add Annotation</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Dao-AILab/flash-attention"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] rounded-lg font-mono text-xs transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Dao-AILab/flash-attention ★ 16.2k</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="p-2 text-[#475569] hover:text-[#002046] hover:bg-[#f1f5f9] rounded-lg border border-[#cbd5e1] transition-colors"
              title="Share Paper"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00875a]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2-Column Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Takeaways & Core Breakthroughs Card (from Image 11) */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
                <div className="flex items-center gap-2 font-semibold text-[#002046] text-sm">
                  <Sparkles className="w-4 h-4 text-[#0051d5]" />
                  <span>Key Takeaways & Core Breakthroughs</span>
                </div>
                <span className="text-[11px] font-mono text-[#0051d5] bg-[#eff4ff] px-2 py-0.5 rounded font-medium">
                  Synthesized from Paper Text
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#e6eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#002046] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#002046] mb-1">
                      Better Work Partitioning across Thread Blocks
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Parallelizes along the sequence length dimension instead of solely batch and head counts. When sequence lengths are large, this yields 2x higher SM occupancy and prevents GPU compute underutilization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#e6eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#002046] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#002046] mb-1">
                      Elimination of Shared Memory Synchronization Overheads
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Reduces the number of non-matmul FLOPs specifically online softmax scaling passes and skips intermediate memory barrier operations inside the inner warp iteration loop.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#e6eeff]">
                  <span className="w-6 h-6 rounded-full bg-[#002046] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#002046] mb-1">
                      Up to 73% Theoretical Hardware Maximum on NVIDIA A100
                    </h4>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Reaches up to 230 TFLOPs/s per A100 GPU (FP16/BF16 precision), achieving 2x speedup compared to standard FlashAttention 1, and 5-9x faster than textbook PyTorch scaled dot-product implementations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Abstract Section */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] mb-3">
                <h3 className="font-serif font-bold text-base text-[#002046]">Abstract</h3>
                <span className="text-[11px] font-mono text-[#64748b]">English Original</span>
              </div>
              <p className="text-sm text-[#334155] leading-relaxed font-sans whitespace-pre-line text-justify">
                {paper.abstract}
              </p>
            </div>

            {/* Forward Pass Computational Throughput (Bar Chart from Image 5) */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9] mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#002046]">
                    Forward Pass Computational Throughput
                  </h3>
                  <div className="text-xs text-[#64748b]">
                    Measured on NVIDIA A100 SXM4 80GB (FP16, Head Dim = 128, Batch Size = 8)
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0051d5]"></span>
                    <span>FlashAttention-2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></span>
                    <span>FlashAttention-1</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="space-y-4 font-mono text-xs">
                {benchmarkData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#475569]">
                      <span className="font-medium">Sequence Length: {item.seqLen}</span>
                      <span className="font-bold text-[#002046]">
                        {item.tflopsFA2} TFLOPs/s{' '}
                        <span className="text-[#00875a] font-semibold">({item.speedupText})</span>
                      </span>
                    </div>
                    {/* Bar visualization */}
                    <div className="w-full bg-[#f1f5f9] h-6 rounded overflow-hidden flex items-center relative">
                      {/* FA-2 Bar */}
                      <div
                        style={{ width: `${(item.tflopsFA2 / 312) * 100}%` }}
                        className="bg-[#0051d5] h-full rounded-l transition-all flex items-center justify-end pr-2 text-white text-[10px] font-bold"
                      >
                        {item.tflopsFA2}
                      </div>
                      {/* FA-1 Comparison indicator */}
                      <div
                        style={{
                          left: `${((item.tflopsFA2 * 0.52) / 312) * 100}%`,
                        }}
                        className="absolute h-full w-0.5 bg-white shadow-xs z-10"
                        title="FA-1 Baseline"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between text-[11px] text-[#64748b]">
                <span>Baseline Standard Attention OOMs at Seq Len ≥ 4,096</span>
                <button className="text-[#0051d5] hover:underline flex items-center gap-1 font-sans font-medium">
                  <span>View Raw Benchmark Logs & Scripts</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Extracted Figures & Data Tables (7) (from Image 5) */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-[#002046]">
                    Extracted Figures & Data Tables (7)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#64748b]">
                  OCR & High-Res Vector Extracted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fig 1 */}
                <div
                  onClick={() => setActiveFigureModal('fig1')}
                  className="bg-[#f8f9ff] border border-[#cbd5e1] hover:border-[#0051d5] rounded-xl p-3 cursor-pointer transition-all hover:shadow-sm group"
                >
                  <div className="h-44 bg-white rounded-lg border border-[#e2e8f0] p-2 mb-2.5 flex flex-col justify-between overflow-hidden relative">
                    <span className="text-[10px] font-mono font-bold bg-[#002046] text-white px-2 py-0.5 rounded w-fit">
                      Fig 1
                    </span>

                    {/* Diagram preview */}
                    <div className="flex-1 flex items-center justify-center p-2">
                      <div className="w-full grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
                        <div className="p-1.5 bg-[#eff4ff] border border-[#cbd5e1] rounded">
                          <div className="font-bold text-[#002046]">Thread Block Q</div>
                          <div className="text-[8px] text-[#64748b]">Warp 0..3</div>
                        </div>
                        <div className="p-1.5 bg-[#e3fcef] border border-[#a3f3cb] rounded">
                          <div className="font-bold text-[#00875a]">SRAM Cache</div>
                          <div className="text-[8px] text-[#64748b]">Br = 64, Bc = 64</div>
                        </div>
                        <div className="p-1.5 bg-[#eff4ff] border border-[#cbd5e1] rounded">
                          <div className="font-bold text-[#002046]">HBM Writeback</div>
                          <div className="text-[8px] text-[#64748b]">O = Softmax(S)V</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-[#64748b]">
                      <span>Parallel Warp Decomposition</span>
                      <Maximize2 className="w-3 h-3 text-[#0051d5] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-xs text-[#002046] mb-1">
                    Warp-Level Tiling & Parallelism
                  </h4>
                  <p className="text-[11px] text-[#64748b] line-clamp-2">
                    Illustration of work partitioning among thread blocks and inner warps without inter-warp synchronization.
                  </p>
                </div>

                {/* Table 1 */}
                <div
                  onClick={() => setActiveFigureModal('table1')}
                  className="bg-[#f8f9ff] border border-[#cbd5e1] hover:border-[#0051d5] rounded-xl p-3 cursor-pointer transition-all hover:shadow-sm group"
                >
                  <div className="h-44 bg-white rounded-lg border border-[#e2e8f0] p-2 mb-2.5 flex flex-col justify-between overflow-hidden relative">
                    <span className="text-[10px] font-mono font-bold bg-[#002046] text-white px-2 py-0.5 rounded w-fit">
                      Table 1
                    </span>

                    {/* Table preview */}
                    <div className="flex-1 flex items-center justify-center p-1">
                      <table className="w-full text-[9px] font-mono text-left">
                        <thead>
                          <tr className="border-b border-[#cbd5e1] text-[#64748b]">
                            <th>Seq Len</th>
                            <th>Time (hr)</th>
                            <th>Speedup</th>
                            <th>Peak Mem</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#0d1c2e]">
                          <tr><td>4k</td><td>14.8</td><td>-</td><td>28.5 GB</td></tr>
                          <tr><td>8k</td><td>25.6</td><td className="text-[#00875a] font-bold">1.8x</td><td>52.1 GB</td></tr>
                          <tr><td>16k</td><td>48.9</td><td className="text-[#00875a] font-bold">2.4x</td><td>104.5 GB</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-[#64748b]">
                      <span>Table 1: End-to-End LLaMA-7B</span>
                      <Maximize2 className="w-3 h-3 text-[#0051d5] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-xs text-[#002046] mb-1">
                    End-to-End LLaMA-7B Training Speedup
                  </h4>
                  <p className="text-[11px] text-[#64748b] line-clamp-2">
                    Wall-clock time comparisons on 8x A100 cluster for standard 7B parameter architectures across varied sequence lengths.
                  </p>
                </div>
              </div>
            </div>

            {/* References Cited in this Paper (58) (from Image 5) */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9] mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#002046]">
                    References Cited in this Paper ({paper.referencesCount || 58})
                  </h3>
                  <div className="text-xs text-[#64748b]">
                    Structured citation graph anchors with direct cross-platform links
                  </div>
                </div>

                <div className="relative w-48">
                  <Search className="w-3 h-3 text-[#94a3b8] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={refSearch}
                    onChange={(e) => setRefSearch(e.target.value)}
                    placeholder="Search References"
                    className="w-full pl-7 pr-2.5 py-1 text-xs bg-[#f8f9ff] border border-[#cbd5e1] rounded focus:outline-hidden focus:border-[#0051d5]"
                  />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {filteredReferences.map((ref) => (
                  <div key={ref.id} className="p-3 rounded-lg border border-[#f1f5f9] hover:border-[#cbd5e1] transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-[#0051d5] hover:underline cursor-pointer">
                        [{ref.id}] {ref.authorsYear}
                      </div>
                      <span className="font-mono text-[11px] text-[#64748b]">{ref.venue}</span>
                    </div>
                    <div className="font-serif text-[#002046] font-medium text-sm mb-1.5">
                      {ref.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#64748b]">
                      <span className="text-[#0051d5]">{ref.doi}</span>
                      <span>•</span>
                      <span className="bg-[#eff4ff] text-[#1b365d] px-2 py-0.5 rounded font-sans font-medium">
                        {ref.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-center">
                <button
                  onClick={() => onOpenCiteModal(paper)}
                  className="px-4 py-2 bg-[#f8f9ff] hover:bg-[#e6eeff] text-[#002046] border border-[#cbd5e1] rounded-lg font-medium text-xs transition-colors"
                >
                  View All 58 References (Download BibTeX Batch)
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Citation Lineage (Live Graph) */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] mb-3">
                <div className="flex items-center gap-1.5 font-semibold text-[#002046] text-xs">
                  <GitBranch className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span>Citation Lineage</span>
                </div>
                <span className="text-[10px] font-mono text-[#00875a] bg-[#e3fcef] px-2 py-0.5 rounded font-semibold">
                  Live Graph
                </span>
              </div>

              {/* Lineage Tree Visualization */}
              <div className="space-y-2 text-xs">
                {/* Foundations */}
                <div>
                  <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                    FOUNDATIONS
                  </div>
                  <div className="space-y-1">
                    <div className="p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0] flex items-center justify-between">
                      <span className="font-medium text-[#1e293b]">FlashAttention-1 (2022)</span>
                      <span className="font-mono text-[11px] text-[#0051d5]">4.1k</span>
                    </div>
                    <div className="p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0] flex items-center justify-between">
                      <span className="font-medium text-[#1e293b]">Online Softmax (2018)</span>
                      <span className="font-mono text-[11px] text-[#0051d5]">482</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center py-1 text-[#0051d5]">
                  ↓
                </div>

                {/* Target Focus (This Paper) */}
                <div className="p-3 bg-[#002046] text-white rounded-lg shadow-xs border border-[#1b365d]">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#85f8c4] mb-1">
                    <span>TARGET FOCUS</span>
                    <span>ICLR 2024</span>
                  </div>
                  <div className="font-serif font-bold text-sm leading-snug">
                    FlashAttention-2
                  </div>
                  <div className="text-[11px] text-[#aec7f7] font-mono mt-1">
                    Dao, 2023 · 1,842 citations
                  </div>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center py-1 text-[#0051d5]">
                  ↓
                </div>

                {/* Direct High-Impact Derivatives */}
                <div>
                  <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                    DIRECT HIGH-IMPACT DERIVATIVES
                  </div>
                  <div className="space-y-1">
                    <div className="p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0] flex items-center justify-between">
                      <span className="font-medium text-[#1e293b]">vLLM: PagedAttention Engine</span>
                      <span className="font-mono text-[11px] text-[#0051d5] font-semibold">2.8k cit.</span>
                    </div>
                    <div className="p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0] flex items-center justify-between">
                      <span className="font-medium text-[#1e293b]">Megatron-LM v4 (NVIDIA)</span>
                      <span className="font-mono text-[11px] text-[#0051d5] font-semibold">1.2k cit.</span>
                    </div>
                    <div className="p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0] flex items-center justify-between">
                      <span className="font-medium text-[#1e293b]">FlashDecoding & FA-3 (Hopper)</span>
                      <span className="font-mono text-[11px] text-[#0051d5] font-semibold">380 cit.</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-colors">
                <Sparkles className="w-3 h-3" />
                <span>Explore 3D Citation Constellation</span>
              </button>
            </div>

            {/* Methodology Taxonomy */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-xs">
              <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                METHODOLOGY TAXONOMY
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'CUDA Kernel Optimization',
                  'Memory Bandwidth Saturation',
                  'Online Softmax',
                  'Warp-Level Tiling',
                  'Transformer Inference',
                  'SRAM Caching',
                  'A100 Tensor Cores',
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#1e293b] border border-[#e2e8f0] text-[11px] font-mono hover:bg-[#e2e8f0] cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Work Clustered (Embeddings cosine) */}
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] mb-3">
                <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">
                  RELATED WORK CLUSTERED
                </span>
                <span className="text-[10px] font-mono text-[#64748b]">Embeddings cosine</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg border border-[#e2e8f0] hover:border-[#0051d5] transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-serif font-bold text-[#002046]">
                      RingAttention: Blockwise Transformer...
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#00875a] bg-[#e3fcef] px-1.5 py-0.5 rounded shrink-0">
                      98% Match
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748b]">Liu et al. (UC Berkeley, 2023)</div>
                </div>

                <div className="p-2.5 rounded-lg border border-[#e2e8f0] hover:border-[#0051d5] transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-serif font-bold text-[#002046]">
                      PagedAttention: Virtual Memory Alloc...
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#00875a] bg-[#e3fcef] px-1.5 py-0.5 rounded shrink-0">
                      95% Match
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748b]">Kwon et al. (SOSP 2023)</div>
                </div>

                <div className="p-2.5 rounded-lg border border-[#e2e8f0] hover:border-[#0051d5] transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-serif font-bold text-[#002046]">
                      FlashDecoding++: Faster LLM Inferen...
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#00875a] bg-[#e3fcef] px-1.5 py-0.5 rounded shrink-0">
                      92% Match
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748b]">Hong et al. (2023)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Figure Preview Modal */}
      {activeFigureModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveFigureModal(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-[#cbd5e1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#f1f5f9]">
              <h3 className="font-serif font-bold text-lg text-[#002046]">
                {activeFigureModal === 'fig1'
                  ? 'Fig 1: Warp-Level Tiling & Parallelism Diagram'
                  : 'Table 1: End-to-End LLaMA-7B Training Speedup'}
              </h3>
              <button
                onClick={() => setActiveFigureModal(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {activeFigureModal === 'fig1' ? (
              <div className="space-y-4">
                <div className="bg-[#f8f9ff] p-6 rounded-lg border border-[#cbd5e1] text-center font-mono text-xs">
                  <div className="font-bold text-[#002046] text-sm mb-2">GPU SM Kernel Partitioning (A100)</div>
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="bg-white p-3 border rounded shadow-xs">
                      <div className="font-bold text-[#0051d5]">SRAM Shared Memory (164 KB)</div>
                      <p className="text-[11px] text-[#64748b] mt-1">Br = 64 rows, Bc = 64 cols of Q, K, V blocks</p>
                    </div>
                    <div className="bg-white p-3 border rounded shadow-xs">
                      <div className="font-bold text-[#00875a]">Register File (256 KB)</div>
                      <p className="text-[11px] text-[#64748b] mt-1">Accumulating online softmax normalizers (m_i, l_i)</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    By parallelizing along sequence length, each thread block handles distinct key-value chunks, eliminating inter-warp synchronization fences.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <table className="w-full text-xs font-mono text-left border">
                  <thead className="bg-[#f1f5f9] border-b">
                    <tr>
                      <th className="p-2">Sequence Length</th>
                      <th className="p-2">Training Runtime (hrs)</th>
                      <th className="p-2">Speedup vs Baseline</th>
                      <th className="p-2">Peak Memory (GB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="p-2">4k</td><td className="p-2">14.8</td><td className="p-2">-</td><td className="p-2">28.5</td></tr>
                    <tr className="border-b"><td className="p-2">8k</td><td className="p-2">25.6</td><td className="p-2 text-[#00875a] font-bold">1.8x</td><td className="p-2">52.1</td></tr>
                    <tr><td className="p-2">16k</td><td className="p-2">48.9</td><td className="p-2 text-[#00875a] font-bold">2.4x</td><td className="p-2">104.5</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
