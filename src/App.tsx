import React, { useState, useEffect, useCallback } from 'react';
import { NavigationTab, Paper, EmergingTopic, SearchFilters } from './types';
import { mockPapers } from './data/mockData';
import { searchSemanticScholar } from './services/semanticScholar';
import { Header } from './components/Header';
import { SearchView } from './components/SearchView';
import { ExploreView } from './components/ExploreView';
import { PaperView } from './components/PaperView';
import { LibraryView } from './components/LibraryView';
import { FooterStatusBar } from './components/FooterStatusBar';
import { CiteModal } from './components/CiteModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { SyncModal } from './components/SyncModal';
import { AddPaperModal } from './components/AddPaperModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('search');
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [selectedPaper, setSelectedPaper] = useState<Paper>(mockPapers[0]);

  // Semantic Scholar Search State
  const [searchQuery, setSearchQuery] = useState<string>('FlashAttention');
  const [searchResults, setSearchResults] = useState<Paper[]>(mockPapers);
  const [totalResults, setTotalResults] = useState<number>(14820);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [searchMessage, setSearchMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentFilters, setCurrentFilters] = useState<Partial<SearchFilters>>({});

  // Modals state
  const [citeModalPaper, setCiteModalPaper] = useState<Paper | null>(null);
  const [pdfReaderPaper, setPdfReaderPaper] = useState<Paper | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isAddPaperModalOpen, setIsAddPaperModalOpen] = useState(false);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Semantic Scholar Academic Graph Search
  const executeSearch = useCallback(
    async (query: string, filters?: Partial<SearchFilters>, page: number = 1) => {
      const trimmed = query.trim() || 'FlashAttention';
      setSearchLoading(true);
      setSearchQuery(trimmed);
      if (filters) {
        setCurrentFilters(filters);
      }
      setCurrentPage(page);
      setActiveTab('explore');

      // Persist recent search to localStorage
      try {
        const stored = localStorage.getItem('scholarflow_recent_searches');
        const list: string[] = stored ? JSON.parse(stored) : [];
        const normalized = Array.isArray(list)
          ? list
              .map((item) => (typeof item === 'string' ? item.trim() : (item as any)?.text?.trim() || ''))
              .filter((item) => item && item.toLowerCase() !== trimmed.toLowerCase())
          : [];
        const updated = [trimmed, ...normalized].slice(0, 8);
        localStorage.setItem('scholarflow_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore localStorage error
      }

      const offset = (page - 1) * 10;
      const appliedFilters = { ...(filters || currentFilters), offset, limit: 10 };

      try {
        const res = await searchSemanticScholar({
          query: trimmed,
          ...appliedFilters,
        });

        setSearchResults(res.papers);
        setTotalResults(res.total);
        setIsRateLimited(Boolean(res.rateLimited));
        setSearchMessage(res.message || '');
        if (res.papers.length > 0) {
          setSelectedPaper(res.papers[0]);
        }
      } catch (err) {
        console.error('Semantic Scholar search failed:', err);
      } finally {
        setSearchLoading(false);
      }
    },
    [currentFilters]
  );

  // Handlers
  const handleSearch = (query: string, filters?: Partial<SearchFilters>) => {
    executeSearch(query, filters, 1);
  };

  const handleSelectTopic = (topic: EmergingTopic) => {
    executeSearch(topic.title, {}, 1);
  };

  const handleOpenPaperView = (paper: Paper) => {
    setSelectedPaper(paper);
    setActiveTab('paperview');
  };

  const handleOpenCiteModal = (paper: Paper) => {
    setCiteModalPaper(paper);
  };

  const handleOpenPdfReader = (paper: Paper) => {
    setPdfReaderPaper(paper);
  };

  const handleToggleLibrary = (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id === paperId) {
          const has = p.collectionIds.includes('thesis');
          return {
            ...p,
            collectionIds: has
              ? p.collectionIds.filter((c) => c !== 'thesis')
              : [...p.collectionIds, 'thesis'],
          };
        }
        return p;
      })
    );
  };

  const isInLibrary = (paperId: string) => {
    const p = papers.find((item) => item.id === paperId);
    return p ? p.collectionIds.length > 0 : false;
  };

  const handleUpdateNotes = (paperId: string, notes: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, notesMarkdown: notes } : p))
    );
    if (selectedPaper.id === paperId) {
      setSelectedPaper((prev) => ({ ...prev, notesMarkdown: notes }));
    }
  };

  const handleAddPaper = (newPaper: Paper) => {
    setPapers((prev) => [newPaper, ...prev]);
    setSelectedPaper(newPaper);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] font-sans flex flex-col selection:bg-[#aec7f7] selection:text-[#002046]">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickSearch={() => setActiveTab('search')}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'search' && (
          <SearchView
            onSearch={handleSearch}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            papers={searchResults}
            selectedPaper={selectedPaper}
            onSelectPaper={setSelectedPaper}
            onOpenPaperView={handleOpenPaperView}
            onOpenCiteModal={handleOpenCiteModal}
            onOpenPdfReader={handleOpenPdfReader}
            onToggleLibrary={handleToggleLibrary}
            isInLibrary={isInLibrary}
            searchQuery={searchQuery}
            totalResults={totalResults}
            isLoading={searchLoading}
            isRateLimited={isRateLimited}
            searchMessage={searchMessage}
            onSearch={(q, f) => executeSearch(q, f, 1)}
            currentPage={currentPage}
            onPageChange={(p) => executeSearch(searchQuery, currentFilters, p)}
          />
        )}

        {activeTab === 'paperview' && (
          <PaperView
            paper={selectedPaper}
            onOpenCiteModal={handleOpenCiteModal}
            onOpenPdfReader={handleOpenPdfReader}
            onToggleLibrary={handleToggleLibrary}
            isInLibrary={isInLibrary}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            papers={papers}
            selectedPaper={selectedPaper}
            onSelectPaper={setSelectedPaper}
            onOpenPaperView={handleOpenPaperView}
            onOpenCiteModal={handleOpenCiteModal}
            onOpenPdfReader={handleOpenPdfReader}
            onOpenAddPaperModal={() => setIsAddPaperModalOpen(true)}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onUpdateNotes={handleUpdateNotes}
          />
        )}
      </main>

      {/* Persistent Technical Status Bar */}
      <FooterStatusBar />

      {/* Interactive Modals */}
      <CiteModal
        paper={citeModalPaper}
        isOpen={Boolean(citeModalPaper)}
        onClose={() => setCiteModalPaper(null)}
      />

      <PdfReaderModal
        paper={pdfReaderPaper}
        isOpen={Boolean(pdfReaderPaper)}
        onClose={() => setPdfReaderPaper(null)}
      />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      <AddPaperModal
        isOpen={isAddPaperModalOpen}
        onClose={() => setIsAddPaperModalOpen(false)}
        onAddPaper={handleAddPaper}
      />
    </div>
  );
}
