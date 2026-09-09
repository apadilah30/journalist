import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Search, Bell, RefreshCw, Command, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenQuickSearch: () => void;
  onOpenSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickSearch,
  onOpenSyncModal,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-xs">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand & Main Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
            title="ScholarFlow Home"
          >
            {/* Custom SVG logo matching Image 3 (book + infinity + pen nib) */}
            <div className="w-8 h-8 rounded bg-[#1b365d] flex items-center justify-center text-white shadow-xs group-hover:bg-[#2563eb] transition-colors">
              <svg
                viewBox="0 0 100 100"
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Book spine & pages */}
                <path d="M 22 25 C 36 18, 48 24, 50 30 C 52 24, 64 18, 78 25 L 78 72 C 64 66, 52 70, 50 78 C 48 70, 36 66, 22 72 Z" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Infinity path weaving through book */}
                <path d="M 33 48 C 33 40, 44 40, 50 48 C 56 56, 67 56, 67 48 C 67 40, 56 40, 50 48 C 44 56, 33 56, 33 48 Z" fill="none" stroke="#aec7f7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Pen nib */}
                <path d="M 72 20 L 85 33 L 80 40 L 67 27 Z" fill="#68dba9" />
                <polygon points="85,33 90,44 79,39" fill="#85f8c4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-tight text-lg font-bold text-[#002046] group-hover:text-[#2563eb] transition-colors leading-none">
                ScholarFlow
              </span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-[#002046] text-white shadow-xs font-semibold'
                  : 'text-[#44474e] hover:text-[#0d1c2e] hover:bg-[#eff4ff]'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-[#002046] text-white shadow-xs font-semibold'
                  : 'text-[#44474e] hover:text-[#0d1c2e] hover:bg-[#eff4ff]'
              }`}
            >
              Explore Papers
            </button>
            <button
              onClick={() => setActiveTab('paperview')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'paperview'
                  ? 'bg-[#002046] text-white shadow-xs font-semibold'
                  : 'text-[#44474e] hover:text-[#0d1c2e] hover:bg-[#eff4ff]'
              }`}
            >
              Paper View
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-[#002046] text-white shadow-xs font-semibold'
                  : 'text-[#44474e] hover:text-[#0d1c2e] hover:bg-[#eff4ff]'
              }`}
            >
              My Library
            </button>
          </nav>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div
            onClick={onOpenQuickSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#74777f] bg-[#f8f9ff] border border-[#cbd5e1] rounded-md hover:border-[#0051d5] hover:bg-white cursor-pointer transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#74777f]" />
              <span className="truncate">Search papers, DOIs, auth</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#44474e] bg-[#e6eeff] rounded border border-[#c4c6cf]">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* Right: Actions, Sync, Notification, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zotero / Mendeley Button */}
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#1b365d] bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#aec7f7] rounded-md transition-colors"
            title="External Reference Manager Sync"
          >
            <RefreshCw className="w-3 h-3 text-[#0051d5]" />
            <span className="hidden sm:inline">⇄ Zotero / Mendeley</span>
          </button>

          {/* Notifications */}
          <button
            className="relative p-1.5 text-[#44474e] hover:text-[#0d1c2e] hover:bg-[#eff4ff] rounded-md transition-colors"
            title="3 paper alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#0051d5] rounded-full border border-white"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-[#eff4ff] transition-colors focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-full ring-1 ring-[#cbd5e1] overflow-hidden bg-slate-200 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Dr. Aris Thorne"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-[#0d1c2e] leading-tight">Dr. Aris Thorne</div>
                <div className="text-[10px] text-[#74777f] leading-none">MIT · CS & AI</div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1.5 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#f1f5f9]">
                  <div className="font-semibold text-[#0d1c2e]">Dr. Aris Thorne</div>
                  <div className="text-[#74777f]">aris.thorne@csail.mit.edu</div>
                  <div className="mt-1 text-[11px] text-[#0051d5] font-medium">Principal Investigator · AI Lab</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('library');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9ff] text-[#44474e] hover:text-[#0d1c2e]"
                  >
                    My Library Collections (184 papers)
                  </button>
                  <button
                    onClick={() => {
                      onOpenSyncModal();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#f8f9ff] text-[#44474e] hover:text-[#0d1c2e]"
                  >
                    Academic Sync & Integrations
                  </button>
                  <a
                    href="https://scholar.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#f8f9ff] text-[#44474e] hover:text-[#0d1c2e]"
                  >
                    <span>Google Scholar Profile</span>
                    <ExternalLink className="w-3 h-3 text-[#74777f]" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sub-tabs if screen width is narrow */}
      <div className="md:hidden flex items-center justify-around border-t border-[#e2e8f0] bg-[#f8f9ff] px-2 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-2 py-1 rounded ${activeTab === 'search' ? 'bg-[#002046] text-white font-semibold' : 'text-[#44474e]'}`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-2 py-1 rounded ${activeTab === 'explore' ? 'bg-[#002046] text-white font-semibold' : 'text-[#44474e]'}`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab('paperview')}
          className={`px-2 py-1 rounded ${activeTab === 'paperview' ? 'bg-[#002046] text-white font-semibold' : 'text-[#44474e]'}`}
        >
          Paper View
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-2 py-1 rounded ${activeTab === 'library' ? 'bg-[#002046] text-white font-semibold' : 'text-[#44474e]'}`}
        >
          My Library
        </button>
      </div>
    </header>
  );
};
