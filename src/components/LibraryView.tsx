import React, { useState } from 'react';
import { Paper, Collection } from '../types';
import { mockCollections, mockTags } from '../data/mockData';
import {
  Folder,
  BookOpen,
  GraduationCap,
  FileText,
  Hourglass,
  Archive,
  Plus,
  Share2,
  MoreHorizontal,
  Search,
  Table as TableIcon,
  LayoutGrid,
  Columns,
  Star,
  Lock,
  ExternalLink,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Edit3,
  Code,
  Bold,
  Italic,
  Highlighter,
  Check,
  Download,
} from 'lucide-react';

interface LibraryViewProps {
  papers: Paper[];
  selectedPaper: Paper;
  onSelectPaper: (paper: Paper) => void;
  onOpenPaperView: (paper: Paper) => void;
  onOpenCiteModal: (paper: Paper) => void;
  onOpenPdfReader: (paper: Paper) => void;
  onOpenAddPaperModal: () => void;
  onOpenSyncModal: () => void;
  onUpdateNotes: (paperId: string, notes: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  papers,
  selectedPaper,
  onSelectPaper,
  onOpenPaperView,
  onOpenCiteModal,
  onOpenPdfReader,
  onOpenAddPaperModal,
  onOpenSyncModal,
  onUpdateNotes,
}) => {
  const [activeCollectionId, setActiveCollectionId] = useState('thesis');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'split'>('table');
  const [filterAnnotated, setFilterAnnotated] = useState(false);
  const [filterHasPdf, setFilterHasPdf] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([selectedPaper.id]);
  const [activeNoteText, setActiveNoteText] = useState(
    selectedPaper.notesMarkdown ||
      `### Core Contribution & Chapter 4 Integration:\n- Key difference from v1: eliminates non-matmul FLOPs by rescheduling softmax scaling.\n- Directly addresses memory-bandwidth bottlenecks on NVIDIA Hopper`
  );
  const [savedNotesFeedback, setSavedNotesFeedback] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);

  // Filter papers for library
  const filteredPapers = papers.filter((p) => {
    if (activeCollectionId === 'thesis' && !p.collectionIds.includes('thesis')) return false;
    if (activeCollectionId === 'reading' && p.readStatus !== 'reading') return false;
    if (activeCollectionId === 'unread' && p.readStatus !== 'unread') return false;
    if (selectedTag && !p.tags.includes(selectedTag)) return false;
    if (filterAnnotated && !p.notesSummary) return false;
    if (filterHasPdf && !p.hasPdf) return false;
    if (filterUnread && p.readStatus !== 'unread') return false;
    if (
      searchKeyword &&
      !p.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !p.authorsSummary.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((item) => item !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleSelectPaperRow = (p: Paper) => {
    onSelectPaper(p);
    setSelectedRowIds([p.id]);
    setActiveNoteText(
      p.notesMarkdown ||
        `### Research Notes for ${p.title}:\n- Reviewing methodology and core citations.\n- Added to active synthesis queue.`
    );
  };

  const handleNotesChange = (text: string) => {
    setActiveNoteText(text);
    onUpdateNotes(selectedPaper.id, text);
    setSavedNotesFeedback(true);
    setTimeout(() => setSavedNotesFeedback(false), 2000);
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(selectedPaper.bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleReindex = () => {
    setIsReindexing(true);
    setTimeout(() => setIsReindexing(false), 1500);
  };

  return (
    <div className="flex-1 w-full bg-[#f8f9ff] flex flex-col">
      {/* Top Project Library Header (matching Image 1) */}
      <div className="bg-white border-b border-[#cbd5e1] px-4 lg:px-6 py-4">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#002046] flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-semibold text-[#0051d5] uppercase tracking-wider flex items-center gap-1.5">
                <span>PROJECT LIBRARY</span>
                <span>•</span>
                <span className="text-[#64748b]">Active Revision #14</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#002046]">
                  Thesis: Efficient LLM Inference
                </h1>
                <span className="bg-[#eff4ff] text-[#0051d5] border border-[#cbd5e1] px-2 py-0.5 rounded text-xs font-mono font-semibold">
                  48 Papers
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenAddPaperModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Paper by DOI / URL</span>
            </button>

            <button
              onClick={() => onOpenCiteModal(selectedPaper)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#f8f9ff] text-[#1b365d] border border-[#cbd5e1] rounded-lg text-xs font-medium transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Collection</span>
            </button>

            <button className="p-2 text-[#64748b] hover:text-[#002046] hover:bg-[#f1f5f9] rounded-lg border border-[#cbd5e1] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Left Sidebar + Center Table + Bottom Inspector */}
      <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-6 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Collections & Folders Sidebar (col-span-3) */}
        <aside className="lg:col-span-3 space-y-4 text-xs">
          {/* COLLECTIONS & FOLDERS */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#64748b] font-semibold text-[10px] uppercase tracking-wider mb-3">
              <span>COLLECTIONS & FOLDERS</span>
              <button
                onClick={onOpenAddPaperModal}
                className="text-[#0051d5] hover:text-[#002046]"
                title="New Collection"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {mockCollections.map((col) => {
                const isActive = col.id === activeCollectionId;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      setActiveCollectionId(col.id);
                      setSelectedTag(null);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[#002046] text-white font-semibold shadow-xs'
                        : 'text-[#44474e] hover:bg-[#eff4ff] hover:text-[#0d1c2e]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {col.icon === 'folder' && <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-[#85f8c4]' : 'text-[#64748b]'}`} />}
                      {col.icon === 'book-open' && <BookOpen className={`w-3.5 h-3.5 ${isActive ? 'text-[#85f8c4]' : 'text-[#64748b]'}`} />}
                      {col.icon === 'graduation-cap' && <GraduationCap className={`w-3.5 h-3.5 ${isActive ? 'text-[#85f8c4]' : 'text-[#0051d5]'}`} />}
                      {col.icon === 'file-text' && <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-[#85f8c4]' : 'text-[#64748b]'}`} />}
                      {col.icon === 'hourglass' && <Hourglass className={`w-3.5 h-3.5 ${isActive ? 'text-[#85f8c4]' : 'text-[#64748b]'}`} />}
                      {col.icon === 'archive' && <Archive className={`w-3.5 h-3.5 ${isActive ? 'text-[#85f8c4]' : 'text-[#64748b]'}`} />}
                      <span className="truncate">{col.name}</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f1f5f9] text-[#64748b]'
                      }`}
                    >
                      {col.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TAXONOMY TAGS */}
            <div className="pt-4 mt-4 border-t border-[#f1f5f9]">
              <div className="flex items-center justify-between text-[#64748b] font-semibold text-[10px] uppercase tracking-wider mb-2">
                <span>TAXONOMY TAGS</span>
                <span className="text-[#0051d5] font-mono">5 Active</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {mockTags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isSelected ? null : tag)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        isSelected
                          ? 'bg-[#002046] text-white'
                          : tag.includes('review')
                          ? 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]'
                          : 'bg-[#eff4ff] text-[#0051d5] hover:bg-[#dce9ff]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* EXTERNAL SYNC ENGINE */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#64748b] font-semibold text-[10px] uppercase tracking-wider mb-3">
              <span>EXTERNAL SYNC ENGINE</span>
              <span className="w-2 h-2 rounded-full bg-[#00875a]"></span>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e6eeff]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-[#002046] flex items-center gap-1.5">
                    <span>Zotero Desktop</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#0051d5] font-medium">184 items</span>
                </div>
                <div className="text-[11px] text-[#64748b]">
                  Last matched 4 mins ago · Bidirectional sync
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e6eeff]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-[#002046]">Mendeley Web</div>
                  <span className="text-[10px] font-mono text-[#00875a] bg-[#e3fcef] px-1.5 py-0.5 rounded font-semibold">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-[#64748b]">
                  Cloud library indexed automatically
                </div>
              </div>

              <button
                onClick={handleReindex}
                className="w-full py-1.5 text-center text-[#0051d5] hover:bg-[#eff4ff] rounded border border-[#cbd5e1] text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${isReindexing ? 'animate-spin text-[#0051d5]' : ''}`} />
                <span>{isReindexing ? 'Indexing catalog...' : 'Force Re-index Library Catalog'}</span>
              </button>
            </div>
          </div>

          {/* SYNTHESIS MILESTONE */}
          <div className="bg-[#002046] text-white rounded-xl p-4 shadow-xs">
            <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
              <span className="text-[#aec7f7] font-semibold uppercase tracking-wider">
                SYNTHESIS MILESTONE
              </span>
              <span className="text-[#85f8c4] font-bold">76% Ready</span>
            </div>

            <div className="font-serif font-bold text-sm mb-2 text-white">
              Chapter 3: Memory Bounds & KV-Cache
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#85f8c4] w-[76%] rounded-full"></div>
            </div>

            <p className="text-[11px] text-[#aec7f7] leading-tight">
              36 of 48 papers annotated and integrated in thesis drafts.
            </p>
          </div>
        </aside>

        {/* RIGHT AREA: Table View + Bottom Inspector (col-span-9) */}
        <main className="lg:col-span-9 flex flex-col gap-4">
          {/* Main Filter & View Bar (matching Image 1) */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            {/* Search within collection */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search within 'Thesis: Efficient LLM Inference' (keyword)"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8f9ff] text-[#0d1c2e] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:border-[#0051d5]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#f1f5f9] p-0.5 rounded-lg border border-[#cbd5e1]">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-[#002046] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0d1c2e]'
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#002046] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0d1c2e]'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white text-[#002046] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0d1c2e]'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span>Split</span>
              </button>
            </div>

            {/* Checkbox Quick Filters */}
            <div className="flex items-center gap-3 text-xs text-[#44474e]">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0d1c2e]">
                <input
                  type="checkbox"
                  checked={filterAnnotated}
                  onChange={(e) => setFilterAnnotated(e.target.checked)}
                  className="rounded border-[#cbd5e1] text-[#0051d5]"
                />
                <span>Annotated</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0d1c2e]">
                <input
                  type="checkbox"
                  checked={filterHasPdf}
                  onChange={(e) => setFilterHasPdf(e.target.checked)}
                  className="rounded border-[#cbd5e1] text-[#0051d5]"
                />
                <span>Has PDF</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0d1c2e]">
                <input
                  type="checkbox"
                  checked={filterUnread}
                  onChange={(e) => setFilterUnread(e.target.checked)}
                  className="rounded border-[#cbd5e1] text-[#0051d5]"
                />
                <span>Unread</span>
              </label>
            </div>
          </div>

          {/* Papers Table Container */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] overflow-hidden shadow-xs flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="bg-[#f8f9ff] text-[#64748b] font-mono border-b border-[#cbd5e1] text-[11px]">
                  <tr>
                    <th className="p-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length === filteredPapers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRowIds(filteredPapers.map((p) => p.id));
                          } else {
                            setSelectedRowIds([]);
                          }
                        }}
                        className="rounded border-[#cbd5e1] text-[#0051d5]"
                      />
                    </th>
                    <th className="p-3 w-8 text-center">
                      <Star className="w-3.5 h-3.5 text-[#94a3b8] mx-auto" />
                    </th>
                    <th className="p-3 font-semibold uppercase tracking-wider">PAPER TITLE & YEAR</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">AUTHORS</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">NOTES & SYNTHESIS</th>
                    <th className="p-3 font-semibold uppercase tracking-wider">VENUE</th>
                    <th className="p-3 font-semibold uppercase tracking-wider text-right pr-4">CITATIONS</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredPapers.map((paper) => {
                    const isSelected = selectedPaper.id === paper.id;
                    const isChecked = selectedRowIds.includes(paper.id);

                    return (
                      <tr
                        key={paper.id}
                        onClick={() => handleSelectPaperRow(paper)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? 'bg-[#eff4ff] border-l-4 border-l-[#0051d5]'
                            : 'hover:bg-[#f8f9ff]'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3 text-center" onClick={(e) => handleToggleSelectRow(paper.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-[#cbd5e1] text-[#0051d5]"
                          />
                        </td>

                        {/* Star / Lock */}
                        <td className="p-3 text-center">
                          {paper.isStarred ? (
                            <Star className="w-3.5 h-3.5 text-[#0051d5] fill-[#0051d5] mx-auto" />
                          ) : (
                            <Star className="w-3.5 h-3.5 text-[#cbd5e1] mx-auto group-hover:text-[#94a3b8]" />
                          )}
                        </td>

                        {/* Paper Title & Year */}
                        <td className="p-3 max-w-sm">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif font-bold text-sm text-[#002046] group-hover:text-[#0051d5] transition-colors leading-snug">
                              {paper.title}
                            </span>
                            {paper.hasPdf && (
                              <Lock className="w-2.5 h-2.5 text-[#64748b] shrink-0" />
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-[#64748b] mt-0.5">
                            {paper.year} · {paper.arxivId || paper.doi}
                          </div>
                        </td>

                        {/* Authors */}
                        <td className="p-3 text-[#334155] whitespace-nowrap">
                          {paper.authorsSummary}
                        </td>

                        {/* Notes & Synthesis */}
                        <td className="p-3 max-w-xs">
                          {paper.highlightsCount ? (
                            <div>
                              <div className="font-mono text-[10px] text-[#0051d5] flex items-center gap-1 font-semibold">
                                <span>≈ {paper.highlightsCount} highlights</span>
                                {paper.notesCount && <span>· {paper.notesCount} notes</span>}
                              </div>
                              <div className="text-[11px] text-[#475569] italic truncate">
                                {paper.notesSummary}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="font-mono text-[10px] text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.5 rounded font-semibold">
                                Unread Queue
                              </span>
                              <div className="text-[11px] text-[#64748b] italic truncate mt-0.5">
                                {paper.notesSummary}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Venue */}
                        <td className="p-3 font-mono font-semibold text-[#002046] whitespace-nowrap">
                          {paper.venue}
                        </td>

                        {/* Citations */}
                        <td className="p-3 text-right pr-4 font-mono font-bold text-[#002046]">
                          {paper.citations.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selection Status & Pagination Bar */}
            <div className="bg-[#f8f9ff] border-t border-[#cbd5e1] px-4 py-2 flex flex-wrap items-center justify-between text-xs text-[#64748b] font-mono">
              <div className="flex items-center gap-4">
                <span>{selectedRowIds.length} of 48 selected</span>
                <div className="flex items-center gap-3 border-l border-[#cbd5e1] pl-3 text-[#0051d5] font-sans font-medium">
                  <button className="hover:underline">Tag</button>
                  <button className="hover:underline">Move</button>
                  <button
                    onClick={() => onOpenCiteModal(selectedPaper)}
                    className="hover:underline font-semibold"
                  >
                    Batch Cite
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span>Showing 1-4 of 48</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-[#e2e8f0] disabled:opacity-50">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-[#e2e8f0]">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM INSPECTOR PANEL: Active Note & Synthesis Inspector (matching Image 1) */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-sm space-y-4">
            {/* Header: Key & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="bg-[#002046] text-white p-1 rounded">
                  <Edit3 className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="font-semibold text-[#0051d5] uppercase tracking-wider">
                      ACTIVE NOTE & SYNTHESIS INSPECTOR
                    </span>
                    <span className="text-[#64748b]">Key: {selectedPaper.key}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#002046] leading-snug">
                    {selectedPaper.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyBibtex}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#f8f9ff] hover:bg-[#e6eeff] text-[#002046] border border-[#cbd5e1] rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5 text-[#00875a]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBibtex ? 'Copied' : 'Copy BibTeX'}</span>
                </button>

                <button
                  onClick={() => onOpenPdfReader(selectedPaper)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open in Reader</span>
                </button>
              </div>
            </div>

            {/* Inspector Body: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Research Markdown Notes & Extracted Highlights (col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Notes Editor */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-[#64748b] uppercase tracking-wider">
                      MY RESEARCH MARKDOWN NOTES
                    </span>
                    <span className="text-[#00875a] flex items-center gap-1 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]"></span>
                      <span>{savedNotesFeedback ? 'Saving...' : 'Auto-saved to Cloud'}</span>
                    </span>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-[#f8f9ff] border border-[#cbd5e1] border-b-0 rounded-t-lg px-2 py-1 text-xs text-[#475569]">
                    <button
                      onClick={() => setActiveNoteText(activeNoteText + '**bold** ')}
                      className="p-1 hover:bg-[#e2e8f0] rounded font-bold"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      onClick={() => setActiveNoteText(activeNoteText + '*italic* ')}
                      className="p-1 hover:bg-[#e2e8f0] rounded italic font-serif"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      onClick={() => setActiveNoteText(activeNoteText + '`code` ')}
                      className="p-1 hover:bg-[#e2e8f0] rounded font-mono"
                      title="Code"
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      onClick={() => setActiveNoteText(activeNoteText + '==Highlight== ')}
                      className="p-1 hover:bg-[#e2e8f0] rounded text-[#0051d5]"
                      title="Highlight"
                    >
                      ==Mark==
                    </button>
                    <span className="text-[#94a3b8] text-[10px] ml-auto font-mono">
                      Markdown syntax supported
                    </span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={activeNoteText}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    rows={4}
                    className="w-full p-3 text-xs font-mono bg-white text-[#0d1c2e] border border-[#cbd5e1] rounded-b-lg focus:outline-hidden focus:ring-1 focus:ring-[#0051d5] leading-relaxed"
                  />
                </div>

                {/* EXTRACTED PDF HIGHLIGHTS (3) */}
                <div>
                  <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                    EXTRACTED PDF HIGHLIGHTS ({selectedPaper.extractedHighlights?.length || 2})
                  </div>

                  <div className="space-y-2 text-xs">
                    {selectedPaper.extractedHighlights?.map((hl) => (
                      <div
                        key={hl.id}
                        className="p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e6eeff] hover:border-[#cbd5e1] transition-colors"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#0051d5] font-semibold mb-1">
                          <span>Page {hl.page} · {hl.section}</span>
                          <span className="text-[#64748b]">{hl.col}</span>
                        </div>
                        <p className="text-xs text-[#1e293b] italic leading-relaxed">
                          "{hl.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: BibTeX Citation Block & Velocity (col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                {/* BibTeX Entry */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-[#64748b] uppercase tracking-wider">
                      CITATION KEY & REFERENCE
                    </span>
                    <span className="text-[#00875a] font-mono text-[10px] font-semibold">
                      Verified
                    </span>
                  </div>

                  <div className="bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg p-3 relative group font-mono text-[11px] text-[#0d1c2e] overflow-x-auto max-h-48">
                    <button
                      onClick={handleCopyBibtex}
                      className="absolute top-2 right-2 p-1 bg-white hover:bg-[#eff4ff] border border-[#cbd5e1] rounded text-[#0051d5]"
                      title="Copy BibTeX"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <pre className="whitespace-pre-wrap leading-relaxed text-[#1e293b]">
                      {selectedPaper.bibtex}
                    </pre>
                  </div>
                </div>

                {/* Citation Velocity Sparkline */}
                <div className="bg-[#f8f9ff] border border-[#e6eeff] rounded-lg p-3">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">
                      CITATION VELOCITY
                    </span>
                    <span className="text-xs font-mono font-bold text-[#00875a]">
                      +{selectedPaper.quarterGrowth || 184} this quarter
                    </span>
                  </div>

                  <div className="text-xl font-bold font-mono text-[#002046] mb-2">
                    1,420
                  </div>

                  {/* SVG line chart sparkline matching Image 1 */}
                  <div className="h-10 w-full relative">
                    <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
                      <path
                        d="M 0 35 Q 50 32, 100 24 T 200 8"
                        fill="none"
                        stroke="#0051d5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="200" cy="8" r="3.5" fill="#0051d5" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[10px] text-[#64748b] font-mono mt-1">
                    <span>Jul 2023</span>
                    <span>Present</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
