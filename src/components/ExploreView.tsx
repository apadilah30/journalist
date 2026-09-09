import React, { useState } from 'react';
import { Paper, SearchFilters } from '../types';
import {
  Filter,
  RotateCcw,
  FileText,
  Bookmark,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Download,
  Bell,
  Check,
  Search,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Database,
} from 'lucide-react';

interface ExploreViewProps {
  papers: Paper[];
  selectedPaper: Paper;
  onSelectPaper: (paper: Paper) => void;
  onOpenPaperView: (paper: Paper) => void;
  onOpenCiteModal: (paper: Paper) => void;
  onToggleLibrary: (paperId: string) => void;
  isInLibrary: (paperId: string) => boolean;
  onOpenPdfReader?: (paper: Paper) => void;
  searchQuery?: string;
  totalResults?: number;
  isLoading?: boolean;
  isRateLimited?: boolean;
  searchMessage?: string;
  onSearch?: (query: string, filters?: Partial<SearchFilters>) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  papers,
  selectedPaper,
  onSelectPaper,
  onOpenPaperView,
  onOpenCiteModal,
  onToggleLibrary,
  isInLibrary,
  onOpenPdfReader,
  searchQuery = 'FlashAttention',
  totalResults = papers.length,
  isLoading = false,
  isRateLimited = false,
  searchMessage,
  onSearch,
  currentPage = 1,
  onPageChange,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [density, setDensity] = useState<'compact' | 'standard'>('compact');
  const [selectedYearRange, setSelectedYearRange] = useState<string>('all');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [minCitations, setMinCitations] = useState(0);
  const [activeFieldOfStudy, setActiveFieldOfStudy] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'citations' | 'date'>('relevance');
  const [citationAlertCreated, setCitationAlertCreated] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && localQuery.trim()) {
      onSearch(localQuery.trim(), {
        year: selectedYearRange !== 'all' ? selectedYearRange : undefined,
        openAccessPdf: openAccessOnly ? true : undefined,
        minCitationCount: minCitations > 0 ? minCitations : undefined,
        fieldsOfStudy: activeFieldOfStudy || undefined,
      });
    }
  };

  const handleApplyYearFilter = (range: string) => {
    setSelectedYearRange(range);
    if (onSearch) {
      onSearch(localQuery.trim() || searchQuery, {
        year: range !== 'all' ? range : undefined,
        openAccessPdf: openAccessOnly ? true : undefined,
        minCitationCount: minCitations > 0 ? minCitations : undefined,
        fieldsOfStudy: activeFieldOfStudy || undefined,
      });
    }
  };

  const handleApplyField = (field: string) => {
    const nextField = activeFieldOfStudy === field ? null : field;
    setActiveFieldOfStudy(nextField);
    if (onSearch) {
      onSearch(localQuery.trim() || searchQuery, {
        year: selectedYearRange !== 'all' ? selectedYearRange : undefined,
        openAccessPdf: openAccessOnly ? true : undefined,
        minCitationCount: minCitations > 0 ? minCitations : undefined,
        fieldsOfStudy: nextField || undefined,
      });
    }
  };

  // Sort papers
  const sortedPapers = [...papers].sort((a, b) => {
    if (sortBy === 'citations') {
      return (b.citations || 0) - (a.citations || 0);
    }
    if (sortBy === 'date') {
      return (b.year || 0) - (a.year || 0);
    }
    return 0; // relevance / graph order
  });

  return (
    <div className="flex-1 w-full bg-[#f8f9ff] flex flex-col">
      {/* Sub-Header: Live Search & Semantic Scholar Status */}
      <div className="bg-white border-b border-[#e2e8f0] px-4 lg:px-6 py-2.5">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Query Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-xl">
            <span className="font-sans font-semibold text-[#002046] tracking-wide text-[11px] uppercase shrink-0">
              QUERY GRAPH:
            </span>
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#74777f] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search Semantic Scholar corpus..."
                className="w-full pl-8 pr-3 py-1 bg-[#f8f9ff] text-[#1e293b] border border-[#cbd5e1] rounded-md text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0051d5]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1 bg-[#002046] hover:bg-[#1b365d] text-white rounded-md font-medium text-xs flex items-center gap-1 shrink-0"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
              <span>Search</span>
            </button>
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[#64748b] font-mono text-[11px] hidden sm:inline">
              {totalResults > 0 ? `${totalResults.toLocaleString()} records indexed` : 'Graph queried'}
            </span>

            <button
              onClick={() => {
                setCitationAlertCreated(true);
                setTimeout(() => setCitationAlertCreated(false), 3000);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#f8f9ff] text-[#1b365d] border border-[#cbd5e1] rounded-md font-medium transition-colors shadow-2xs"
            >
              {citationAlertCreated ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00875a]" />
                  <span className="text-[#00875a]">Alert Created</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span>Citation Alert</span>
                </>
              )}
            </button>

            {selectedPaper && (
              <button
                onClick={() => onOpenCiteModal(selectedPaper)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#002046] hover:bg-[#1b365d] text-white rounded-md font-medium transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Citations</span>
              </button>
            )}
          </div>
        </div>

        {/* Informative Rate Limit Warning Banner if applicable */}
        {isRateLimited && (
          <div className="max-w-[1720px] mx-auto mt-2 p-2 bg-[#fffbeb] border border-[#fef3c7] rounded-md text-[11px] text-[#92400e] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
              <span>
                <strong>Semantic Scholar Quota Note:</strong> Public shared IP rate limit reached. Displaying verified local academic graph records.
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#b45309]">
              API Key can be configured in Search tab for 100 req/sec
            </span>
          </div>
        )}
      </div>

      {/* Main 3-Column Content Layout */}
      <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-6 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* COLUMN 1: Refine Corpus Sidebar (col-span-3) */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-[#cbd5e1] p-4 h-fit shadow-xs text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
            <div className="flex items-center gap-1.5 font-semibold text-[#002046] text-sm">
              <Filter className="w-4 h-4 text-[#0051d5]" />
              <span>Refine Corpus</span>
            </div>
            <button
              onClick={() => {
                setSelectedYearRange('all');
                setOpenAccessOnly(false);
                setMinCitations(0);
                setActiveFieldOfStudy(null);
                if (onSearch) onSearch(searchQuery, {});
              }}
              className="flex items-center gap-1 text-[#0051d5] hover:underline text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>

          {/* Publication Year Filter */}
          <div className="mb-5 pb-4 border-b border-[#f1f5f9]">
            <div className="font-semibold text-[#44474e] uppercase text-[10px] tracking-wider mb-2">
              PUBLICATION YEAR
            </div>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {[
                { label: 'All Years', val: 'all' },
                { label: '2024 - 2025', val: '2024-2025' },
                { label: '2022 - 2023', val: '2022-2023' },
                { label: '2019 - 2021', val: '2019-2021' },
              ].map((yr) => (
                <button
                  key={yr.val}
                  type="button"
                  onClick={() => handleApplyYearFilter(yr.val)}
                  className={`py-1 text-center rounded text-[11px] font-medium transition-colors ${
                    selectedYearRange === yr.val
                      ? 'bg-[#002046] text-white'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {yr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Open Access & Citations */}
          <div className="mb-5 pb-4 border-b border-[#f1f5f9]">
            <div className="font-semibold text-[#44474e] uppercase text-[10px] tracking-wider mb-2">
              AVAILABILITY & CITATIONS
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer hover:text-[#0d1c2e]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={openAccessOnly}
                    onChange={(e) => {
                      setOpenAccessOnly(e.target.checked);
                      if (onSearch) {
                        onSearch(localQuery || searchQuery, {
                          openAccessPdf: e.target.checked ? true : undefined,
                          year: selectedYearRange !== 'all' ? selectedYearRange : undefined,
                          minCitationCount: minCitations > 0 ? minCitations : undefined,
                          fieldsOfStudy: activeFieldOfStudy || undefined,
                        });
                      }
                    }}
                    className="rounded border-[#cbd5e1] text-[#0051d5] focus:ring-[#0051d5]"
                  />
                  <span>Open Access PDF Only</span>
                </span>
                <span className="text-[#00875a] font-mono text-[11px]">Free</span>
              </label>

              <div className="pt-2">
                <span className="text-[10px] font-semibold text-[#64748b] block mb-1">
                  MINIMUM CITATIONS: {minCitations > 0 ? `${minCitations}+` : 'Any'}
                </span>
                <div className="flex gap-1">
                  {[0, 10, 50, 100, 500].map((cit) => (
                    <button
                      key={cit}
                      type="button"
                      onClick={() => {
                        setMinCitations(cit);
                        if (onSearch) {
                          onSearch(localQuery || searchQuery, {
                            minCitationCount: cit > 0 ? cit : undefined,
                            year: selectedYearRange !== 'all' ? selectedYearRange : undefined,
                            openAccessPdf: openAccessOnly ? true : undefined,
                            fieldsOfStudy: activeFieldOfStudy || undefined,
                          });
                        }
                      }}
                      className={`flex-1 py-1 text-center rounded text-[10px] font-mono font-medium transition-colors ${
                        minCitations === cit
                          ? 'bg-[#002046] text-white'
                          : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                      }`}
                    >
                      {cit === 0 ? 'Any' : `${cit}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fields of Study Badges */}
          <div>
            <div className="font-semibold text-[#44474e] uppercase text-[10px] tracking-wider mb-2">
              FIELDS OF STUDY
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Computer Science',
                'Mathematics',
                'Physics',
                'Biology',
                'Medicine',
                'Engineering',
              ].map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => handleApplyField(field)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    activeFieldOfStudy === field
                      ? 'bg-[#002046] text-white'
                      : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0] border border-[#cbd5e1]'
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* COLUMN 2: Search Results Feed (col-span-5) */}
        <main className="lg:col-span-5 flex flex-col gap-3">
          {/* Sorting & Density Bar */}
          <div className="bg-white rounded-lg border border-[#cbd5e1] px-4 py-2 flex items-center justify-between text-xs text-[#64748b]">
            <div className="flex items-center gap-2">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-[#0d1c2e] focus:outline-hidden cursor-pointer"
              >
                <option value="relevance">Most Relevant (Academic Graph)</option>
                <option value="citations">Citation Count (Highest First)</option>
                <option value="date">Publication Year (Newest First)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px]">
                Showing {sortedPapers.length} results
              </span>
              <div className="flex items-center gap-1 border-l border-[#e2e8f0] pl-2 text-[11px]">
                <span>Density:</span>
                <button
                  onClick={() => setDensity(density === 'compact' ? 'standard' : 'compact')}
                  className="font-medium text-[#0051d5] hover:underline capitalize"
                >
                  {density}
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-[#cbd5e1] p-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                  <div className="h-12 bg-slate-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && sortedPapers.length === 0 && (
            <div className="bg-white rounded-xl border border-[#cbd5e1] p-8 text-center">
              <BookOpen className="w-10 h-10 text-[#64748b] mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#002046] mb-1">
                No matching academic papers found
              </h3>
              <p className="text-xs text-[#475569] max-w-sm mx-auto mb-4">
                Try searching for broad keywords (e.g. "Transformer attention", "AlphaFold", "Quantum computing") or removing specific year filters.
              </p>
              <button
                onClick={() => {
                  setLocalQuery('FlashAttention');
                  if (onSearch) onSearch('FlashAttention');
                }}
                className="px-4 py-2 bg-[#002046] text-white rounded-lg text-xs font-medium hover:bg-[#1b365d]"
              >
                Search FlashAttention Sample
              </button>
            </div>
          )}

          {/* Paper Cards List */}
          {!isLoading && (
            <div className="space-y-3">
              {sortedPapers.map((paper) => {
                const isSelected = paper.id === selectedPaper?.id;
                const inLib = isInLibrary(paper.id);

                return (
                  <article
                    key={paper.id}
                    onClick={() => onSelectPaper(paper)}
                    className={`bg-white rounded-xl border p-4 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#0051d5] ring-2 ring-[#0051d5]/20 shadow-md'
                        : 'border-[#cbd5e1] hover:border-[#93c5fd] shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Top Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-[#002046] text-white px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase">
                          {paper.venue || 'Journal'}
                        </span>
                        {paper.openAccess && (
                          <span className="bg-[#e3fcef] text-[#00875a] border border-[#a3f3cb] px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Open Access PDF</span>
                          </span>
                        )}
                        <span className="bg-[#eff4ff] text-[#0051d5] px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                          {paper.citations ? `${paper.citations.toLocaleString()} Citations` : 'Citation Record'}
                        </span>
                        {paper.influentialCitations && paper.influentialCitations > 0 && (
                          <span className="bg-[#fdf4ff] text-[#a21caf] border border-[#f5d0fe] px-2 py-0.5 rounded text-[10px] font-mono">
                            ★ {paper.influentialCitations} Influential
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#64748b]">
                          {paper.year}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLibrary(paper.id);
                          }}
                          className="p-1 hover:bg-[#f1f5f9] rounded text-[#475569]"
                          title={inLib ? 'Remove from Library' : 'Save to Library'}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              inLib ? 'fill-[#0051d5] text-[#0051d5]' : 'text-[#64748b]'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h3 className="font-serif font-bold text-base text-[#002046] hover:text-[#0051d5] transition-colors leading-snug mb-1">
                      {paper.title}
                    </h3>

                    {/* Authors and Venue */}
                    <div className="text-xs text-[#475569] mb-2 font-medium">
                      {paper.authorsSummary} · <span className="italic">{paper.venue}</span>
                    </div>

                    {/* Abstract Snippet */}
                    <p className={`text-xs text-[#334155] leading-relaxed mb-3 ${
                      density === 'compact' ? 'line-clamp-2' : 'line-clamp-3'
                    }`}>
                      {paper.abstract}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f1f5f9] text-xs">
                      <div className="flex items-center gap-3 text-[#64748b] font-mono text-[11px]">
                        {paper.corpusId && (
                          <span>Corpus ID: {paper.corpusId}</span>
                        )}
                        {paper.doi && (
                          <span className="truncate max-w-[140px] sm:max-w-none">
                            DOI: {paper.doi}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onOpenPdfReader && paper.hasPdf && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPdfReader(paper);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] rounded text-xs font-medium"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Read PDF</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCiteModal(paper);
                          }}
                          className="px-2.5 py-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] rounded text-xs font-medium"
                        >
                          Cite
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPaperView(paper);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#002046] hover:bg-[#1b365d] text-white rounded text-xs font-medium"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {sortedPapers.length > 0 && (
            <div className="bg-white rounded-lg border border-[#cbd5e1] p-3 flex items-center justify-between text-xs text-[#64748b] mt-2">
              <button
                disabled={currentPage <= 1 || isLoading}
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                className="px-3 py-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] rounded font-medium disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 font-mono">
                <span className="text-xs text-[#002046] font-semibold">
                  Page {currentPage}
                </span>
              </div>
              <button
                disabled={isLoading}
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                className="px-3 py-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] rounded font-medium"
              >
                Next Page
              </button>
            </div>
          )}
        </main>

        {/* COLUMN 3: Bibliographic Inspector (col-span-4) */}
        <aside className="lg:col-span-4 bg-white rounded-xl border border-[#cbd5e1] p-4 h-fit sticky top-20 shadow-xs text-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-1.5 font-semibold text-[#002046]">
              <BookOpen className="w-4 h-4 text-[#0051d5]" />
              <span>Bibliographic Inspector</span>
            </div>
            <span className="text-[10px] font-mono text-[#0051d5] bg-[#eff4ff] px-2 py-0.5 rounded font-semibold">
              Selected Item
            </span>
          </div>

          {/* Selected Paper Details */}
          {selectedPaper && (
            <div>
              <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                ACADEMIC RECORD
              </div>
              <h4 className="font-serif font-bold text-lg text-[#002046] leading-snug mb-1">
                {selectedPaper.title}
              </h4>
              <div className="text-xs text-[#475569] mb-3">
                {selectedPaper.authorsSummary} · {selectedPaper.venue} ({selectedPaper.year})
              </div>

              {/* Bibliographic Attributes */}
              <div className="bg-[#f8f9ff] border border-[#e6eeff] rounded-lg p-3 mb-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#64748b] block text-[10px] uppercase font-mono">Citations</span>
                    <span className="font-semibold text-[#002046] font-mono text-sm">
                      {selectedPaper.citations?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px] uppercase font-mono">Influential</span>
                    <span className="font-semibold text-[#0051d5] font-mono text-sm">
                      {selectedPaper.influentialCitations?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px] uppercase font-mono">Corpus ID</span>
                    <span className="font-mono text-[#002046]">
                      {selectedPaper.corpusId || selectedPaper.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px] uppercase font-mono">Open Access</span>
                    <span className={`font-semibold ${selectedPaper.openAccess ? 'text-[#00875a]' : 'text-[#64748b]'}`}>
                      {selectedPaper.openAccess ? 'Available PDF' : 'Subscription'}
                    </span>
                  </div>
                </div>

                {selectedPaper.doi && (
                  <div className="pt-2 border-t border-[#e2e8f0] text-[11px] font-mono text-[#475569] truncate">
                    DOI: {selectedPaper.doi}
                  </div>
                )}
              </div>

              {/* Abstract Section */}
              <div className="mb-4">
                <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                  ABSTRACT EXCERPT
                </div>
                <p className="text-xs text-[#334155] leading-relaxed max-h-48 overflow-y-auto font-sans p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] text-justify">
                  {selectedPaper.abstract}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => onOpenPaperView(selectedPaper)}
                  className="w-full py-2 bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Open Full Paper View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {onOpenPdfReader && (
                    <button
                      onClick={() => onOpenPdfReader(selectedPaper)}
                      className="py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0051d5] rounded-lg font-medium text-xs flex items-center justify-center gap-1 border border-[#aec7f7] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read PDF</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenCiteModal(selectedPaper)}
                    className="py-1.5 bg-white hover:bg-[#f1f5f9] text-[#1e293b] rounded-lg font-medium text-xs flex items-center justify-center gap-1 border border-[#cbd5e1] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Cite / BibTeX</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
