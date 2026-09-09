import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Bookmark,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  SlidersHorizontal,
  Grid3X3,
  TrendingUp,
  Key,
  Database,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { mockEmergingTopics } from '../data/mockData';
import { EmergingTopic, SearchFilters } from '../types';
import { getSemanticAutocomplete, getStoredApiKey, setStoredApiKey } from '../services/semanticScholar';

interface SearchViewProps {
  onSearch: (query: string, filters?: Partial<SearchFilters>) => void;
  onSelectTopic: (topic: EmergingTopic) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onSearch, onSelectTopic }) => {
  const [activeSearchTab, setActiveSearchTab] = useState<'all' | 'title' | 'authors' | 'doi'>('all');
  const [query, setQuery] = useState(
    'FlashAttention-2'
  );
  const [peerReviewedOnly, setPeerReviewedOnly] = useState(false);
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [highlyCitedOnly, setHighlyCitedOnly] = useState(false);
  const [yearRange, setYearRange] = useState('All Years');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedKey, setSavedKey] = useState('');

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<{ id: string; title: string; authors?: string; year?: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const RECENT_SEARCHES_KEY = 'scholarflow_recent_searches';
  const DEFAULT_RECENT_SEARCHES = [
    'FlashAttention-2',
    'Attention Is All You Need',
    'PagedAttention vLLM',
    'AlphaFold protein structure',
  ];

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .map((item) => (typeof item === 'string' ? item.trim() : item?.text?.trim() || ''))
            .filter(Boolean);
        }
      }
    } catch {
      // ignore JSON parse or localStorage errors
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const addRecentSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setSavedKey(getStoredApiKey());
  }, []);

  // Debounced Autocomplete
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const matches = await getSemanticAutocomplete(query.trim());
        setSuggestions(matches.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowYearDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buildFilters = (): Partial<SearchFilters> => {
    const filters: Partial<SearchFilters> = {};
    if (yearRange === '2023 - 2025') filters.year = '2023-2025';
    else if (yearRange === '2020 - 2025') filters.year = '2020-2025';
    else if (yearRange === '2015 - 2025') filters.year = '2015-2025';

    if (openAccessOnly) filters.openAccessPdf = true;
    if (highlyCitedOnly) filters.minCitationCount = 100;
    if (peerReviewedOnly) filters.publicationTypes = 'JournalArticle,Conference';

    return filters;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      addRecentSearch(query.trim());
      onSearch(query.trim(), buildFilters());
    }
  };

  const handleSelectSuggestion = (item: { id: string; title: string }) => {
    setQuery(item.title);
    setShowSuggestions(false);
    addRecentSearch(item.title);
    onSearch(item.title, buildFilters());
  };

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKeyInput);
    setSavedKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
      {/* Engine Version & Semantic Scholar Status Badge */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6eeff] border border-[#cbd5e1] text-[11px] font-mono font-medium text-[#1b365d] shadow-2xs">
          <Database className="w-3 h-3 text-[#0051d5]" />
          <span>SEMANTIC SCHOLAR ACADEMIC GRAPH API V1</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]"></span>
        </div>

        <button
          onClick={() => {
            setApiKeyInput(savedKey);
            setShowApiKeyModal(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[11px] font-mono text-[#475569] transition-colors"
          title="Configure Semantic Scholar API Key for high rate limits"
        >
          <Key className="w-3 h-3 text-[#0051d5]" />
          <span>{savedKey ? 'API Key Configured' : 'Add API Key'}</span>
        </button>
      </div>

      {/* Hero Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-medium text-[#002046] text-center tracking-tight max-w-3xl leading-snug mb-8">
        Search, explore, and cite{' '}
        <span className="italic text-[#0051d5] font-serif">210M+ papers</span>{' '}
        via Semantic Scholar.
      </h1>

      {/* Search Input Container */}
      <div ref={searchContainerRef} className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-[#cbd5e1] p-4 sm:p-5 mb-8 relative">
        {/* Search Field Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3 mb-3 text-xs">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveSearchTab('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSearchTab === 'all'
                  ? 'bg-[#002046] text-white'
                  : 'text-[#44474e] hover:bg-[#eff4ff]'
              }`}
            >
              All Academic Fields
            </button>
            <button
              onClick={() => setActiveSearchTab('title')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSearchTab === 'title'
                  ? 'bg-[#002046] text-white'
                  : 'text-[#44474e] hover:bg-[#eff4ff]'
              }`}
            >
              Title / Abstract
            </button>
            <button
              onClick={() => setActiveSearchTab('authors')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSearchTab === 'authors'
                  ? 'bg-[#002046] text-white'
                  : 'text-[#44474e] hover:bg-[#eff4ff]'
              }`}
            >
              Authors & Affiliations
            </button>
            <button
              onClick={() => setActiveSearchTab('doi')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeSearchTab === 'doi'
                  ? 'bg-[#002046] text-white'
                  : 'text-[#44474e] hover:bg-[#eff4ff]'
              }`}
            >
              DOI / Corpus ID
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#0051d5] relative">
            <span>Academic Search</span>
            <button
              type="button"
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="flex items-center gap-0.5 hover:underline text-[#0051d5] font-medium"
            >
              <Info className="w-3 h-3" />
              <span>Query Tips</span>
            </button>

            {/* Cheat Sheet Popover */}
            {showCheatSheet && (
              <div className="absolute right-0 top-6 w-72 bg-[#002046] text-white text-xs p-3 rounded-lg shadow-xl z-50 font-mono">
                <div className="font-semibold text-white mb-2 font-sans flex justify-between items-center">
                  <span>Semantic Scholar Query Tips</span>
                  <button onClick={() => setShowCheatSheet(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div><span className="text-[#85f8c4]">Exact title</span> : "Attention Is All You Need"</div>
                  <div><span className="text-[#85f8c4]">Keywords</span> : transformer attention memory</div>
                  <div><span className="text-[#85f8c4]">Author query</span> : Tri Dao attention</div>
                  <div><span className="text-[#85f8c4]">Corpus ID / DOI</span> : 259954082 or 10.48550/arXiv...</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#74777f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search papers by keyword, title, author, or DOI..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f8f9ff] text-[#0d1c2e] border border-[#cbd5e1] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0051d5] focus:bg-white font-mono text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#002046] hover:bg-[#1b365d] text-white text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <span>Search</span>
            <kbd className="text-[10px] text-gray-300 font-mono hidden sm:inline">↵ Enter</kbd>
          </button>
        </form>

        {/* Live Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-4 right-4 sm:left-5 sm:right-5 top-[115px] bg-white rounded-xl shadow-xl border border-[#cbd5e1] z-50 overflow-hidden divide-y divide-[#f1f5f9]">
            <div className="px-3 py-1.5 bg-[#f8f9ff] text-[10px] font-mono text-[#64748b] uppercase tracking-wider flex items-center justify-between">
              <span>SEMANTIC SCHOLAR AUTOCOMPLETE SUGGESTIONS</span>
              {isLoadingSuggestions && <span className="text-[#0051d5]">Fetching...</span>}
            </div>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(item)}
                className="p-3 hover:bg-[#eff4ff] cursor-pointer flex items-center justify-between gap-3 text-left transition-colors"
              >
                <div className="flex items-start gap-2.5 truncate">
                  <BookOpen className="w-4 h-4 text-[#0051d5] shrink-0 mt-0.5" />
                  <div className="truncate">
                    <div className="font-serif font-semibold text-xs text-[#002046] truncate">
                      {item.title}
                    </div>
                    {item.authors && (
                      <div className="text-[11px] text-[#64748b] truncate">
                        {item.authors}
                      </div>
                    )}
                  </div>
                </div>
                {item.year && (
                  <span className="font-mono text-[11px] text-[#0051d5] bg-[#e6eeff] px-1.5 py-0.5 rounded shrink-0">
                    {item.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Search Refinement Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 mt-3 pt-3 border-t border-[#f1f5f9] text-xs text-[#44474e]">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0d1c2e]">
              <input
                type="checkbox"
                checked={peerReviewedOnly}
                onChange={(e) => setPeerReviewedOnly(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#0051d5] focus:ring-[#0051d5]"
              />
              <span className="font-medium">Peer-Reviewed Only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0d1c2e]">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#0051d5] focus:ring-[#0051d5]"
              />
              <span>Open Access PDF</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded text-[11px] text-[#1b365d] font-medium hover:bg-[#dce9ff]"
              >
                <span>Years: {yearRange}</span>
                <ChevronDown className="w-3 h-3 text-[#0051d5]" />
              </button>
              {showYearDropdown && (
                <div className="absolute left-0 top-6 bg-white border border-[#cbd5e1] rounded-lg shadow-lg z-50 py-1 w-36 text-xs">
                  {['All Years', '2023 - 2025', '2020 - 2025', '2015 - 2025'].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYearRange(y);
                        setShowYearDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9ff] text-[#1e293b]"
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0d1c2e]">
              <input
                type="checkbox"
                checked={highlyCitedOnly}
                onChange={(e) => setHighlyCitedOnly(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#0051d5] focus:ring-[#0051d5]"
              />
              <span>Min 100 Citations</span>
            </label>
          </div>

          <div className="text-[11px] text-[#74777f] flex items-center gap-1 font-mono">
            <span>Graph API v1 Enabled</span>
          </div>
        </div>

        {/* Recent Searches Bar */}
        <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-[#74777f] uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-[#64748b]" />
              <span>RECENT SEARCHES:</span>
            </span>

            {recentSearches.length === 0 ? (
              <span className="text-[11px] text-[#94a3b8] italic">No recent queries</span>
            ) : (
              recentSearches.map((term, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] rounded-full text-xs transition-colors pl-2.5 pr-1 py-0.5 group border border-[#e2e8f0]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      addRecentSearch(term);
                      onSearch(term, buildFilters());
                    }}
                    className="hover:text-[#0051d5] font-medium text-xs truncate max-w-[180px] sm:max-w-[240px]"
                    title={`Search for "${term}"`}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => removeRecentSearch(e, term)}
                    className="ml-1 p-0.5 text-[#94a3b8] hover:text-[#ba1a1a] rounded-full hover:bg-white transition-colors"
                    title={`Remove "${term}" from recent searches`}
                    aria-label={`Remove ${term}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={clearAllRecentSearches}
              className="text-[11px] font-medium text-[#94a3b8] hover:text-[#ba1a1a] hover:underline transition-colors shrink-0 ml-auto"
              title="Clear all recent searches"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Semantic Scholar API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#cbd5e1] max-w-md w-full p-5 text-xs text-[#1e293b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-3">
              <div className="flex items-center gap-2 font-serif text-base font-bold text-[#002046]">
                <Key className="w-4 h-4 text-[#0051d5]" />
                <span>Semantic Scholar API Key</span>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-[#64748b] hover:text-[#002046] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed mb-3">
              ScholarFlow connects directly to the official <strong>Semantic Scholar Academic Graph API</strong>. An API key is optional, but providing one grants up to 100 requests/second with zero rate limits.
            </p>

            <div className="mb-4">
              <label className="font-semibold text-[11px] text-[#002046] block mb-1">
                API Key (x-api-key)
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste your Semantic Scholar API key here..."
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#0051d5] focus:outline-hidden"
              />
              <p className="text-[10px] text-[#64748b] mt-1.5">
                Stored securely in your browser's localStorage and attached to all Semantic Scholar requests.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#e2e8f0]">
              <a
                href="https://www.semanticscholar.org/product/api#api-key-form"
                target="_blank"
                rel="noreferrer"
                className="text-[#0051d5] hover:underline text-[11px] inline-flex items-center gap-1"
              >
                <span>Request Free API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3 py-1.5 text-xs text-[#64748b] hover:bg-[#f1f5f9] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 text-xs bg-[#002046] hover:bg-[#1b365d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISCOVERY STREAMS SECTION */}
      <div className="w-full mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 pb-2 border-b border-[#e2e8f0]">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-[#0051d5] uppercase font-mono flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>DISCOVERY STREAMS</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#002046] mt-0.5">
              Quick Research Starters & Emerging Topics
            </h2>
            <p className="text-xs text-[#475569]">
              Identified via exponential citation velocity across arXiv preprints, Crossref records, and IEEE peer reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white hover:bg-[#f8f9ff] text-[#1b365d] border border-[#cbd5e1] rounded-md font-medium transition-colors shadow-2xs">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filter Domains</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white hover:bg-[#f8f9ff] text-[#1b365d] border border-[#cbd5e1] rounded-md font-medium transition-colors shadow-2xs">
              <Grid3X3 className="w-3 h-3" />
              <span>View Citation Matrix</span>
            </button>
          </div>
        </div>

        {/* Emerging Topic Cards (4 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockEmergingTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-xl border border-[#cbd5e1] hover:border-[#0051d5] p-4 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div>
                {/* Header tag and growth */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[11px] font-medium text-[#475569] bg-[#f1f5f9] px-2 py-0.5 rounded">
                    {topic.domain}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#00875a] bg-[#e3fcef] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    ↗ {topic.growth}
                  </span>
                </div>

                {/* Topic Title */}
                <h3 className="font-serif font-bold text-[#002046] text-base leading-snug group-hover:text-[#0051d5] transition-colors mb-1.5">
                  {topic.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed mb-3">
                  {topic.description}
                </p>

                {/* Citation Momentum Sparkline */}
                <div className="bg-[#f8f9ff] rounded-lg p-2.5 mb-3 border border-[#e6eeff]">
                  <div className="flex items-center justify-between text-[10px] text-[#64748b] mb-1">
                    <span>Citation Momentum (30d)</span>
                    <span className="font-semibold text-[#002046]">{topic.momentum30d}</span>
                  </div>
                  {/* SVG Sparkline */}
                  <div className="h-6 w-full flex items-end gap-1 pt-1">
                    {topic.trendPoints.map((val, i) => (
                      <div
                        key={i}
                        style={{ height: `${val}%` }}
                        className={`flex-1 rounded-xs transition-all ${
                          i === topic.trendPoints.length - 1
                            ? 'bg-[#0051d5]'
                            : 'bg-[#93c5fd] hover:bg-[#3b82f6]'
                        }`}
                        title={`Score: ${val}`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Key Researchers */}
                <div className="text-[11px] text-[#475569] mb-4">
                  <span className="font-semibold text-[#64748b] uppercase text-[9px] block tracking-wider mb-0.5">
                    KEY RESEARCHERS
                  </span>
                  <div className="flex items-center gap-1 truncate text-xs text-[#1e293b] font-medium">
                    <span>{topic.keyResearchers.join(', ')}</span>
                    <span className="text-[#64748b]">+{topic.keyResearchersCount}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#64748b] font-mono">
                  {topic.manuscriptsCount}
                </span>
                <button
                  onClick={() => {
                    onSelectTopic(topic);
                    onSearch(topic.title);
                  }}
                  className="flex items-center gap-1 text-[#0051d5] font-semibold hover:underline group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore in Graph</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SYNCHRONIZED REPOSITORIES & PEER-REVIEW PARTNERS */}
      <div className="w-full pt-8 border-t border-[#e2e8f0] text-center">
        <div className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest mb-6">
          SYNCHRONIZED REPOSITORIES & PEER-REVIEW PARTNERS VIA SEMANTIC SCHOLAR
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
          {/* Semantic Scholar */}
          <div className="p-3 bg-white rounded-lg border border-[#0051d5] shadow-xs">
            <div className="font-serif font-bold text-base text-[#002046]">Semantic Scholar</div>
            <div className="text-[10px] text-[#0051d5] font-mono mt-0.5">● Graph API v1</div>
          </div>

          {/* arXiv */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs hover:border-[#0051d5] transition-colors">
            <div className="font-serif font-bold text-lg text-[#002046]">arXiv</div>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5">● 2.4M Preprints</div>
          </div>

          {/* PubMed */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs hover:border-[#0051d5] transition-colors">
            <div className="font-sans font-bold text-base text-[#0051d5]">PubMed</div>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5">● 36M Biomedical</div>
          </div>

          {/* IEEE Xplore */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs hover:border-[#0051d5] transition-colors">
            <div className="font-sans font-bold text-sm text-[#0d1c2e]">IEEE Xplore</div>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5">● 6.1M Articles</div>
          </div>

          {/* Nature */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs hover:border-[#0051d5] transition-colors">
            <div className="font-serif font-black italic text-lg text-[#ba1a1a]">nature</div>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5">● Complete Archive</div>
          </div>

          {/* Crossref */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs hover:border-[#0051d5] transition-colors">
            <div className="font-sans font-bold text-base text-[#39b282]">Crossref</div>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5">● 152M DOIs</div>
          </div>

          {/* ACM DL */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-2xs hover:border-[#0051d5] transition-colors">
            <div className="font-sans font-extrabold text-sm text-[#1e293b]">ACM DL</div>
            <div className="text-[10px] text-[#64748b] font-mono mt-0.5">● 3.5M Records</div>
          </div>
        </div>
      </div>
    </div>
  );
};
