import React from 'react';
import { Activity, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const FooterStatusBar: React.FC = () => {
  return (
    <footer className="w-full bg-[#f1f5f9] border-t border-[#e2e8f0] px-4 lg:px-6 py-2 text-[11px] text-[#475569] flex flex-wrap items-center justify-between gap-3 font-mono">
      {/* Left: Indexes Connected */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5 font-sans font-semibold text-[#0d1c2e] uppercase tracking-wider text-[10px]">
          <Database className="w-3 h-3 text-[#0051d5]" />
          <span>INDEXES CONNECTED</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39b282]"></span>
          <span>Crossref <span className="text-[#39b282]">(Active)</span></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39b282]"></span>
          <span>PubMed <span className="text-[#39b282]">(Active)</span></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39b282]"></span>
          <span>arXiv <span className="text-[#39b282]">(Active)</span></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span>
          <span>IEEE Xplore <span className="text-[#0051d5]">(Live)</span></span>
        </div>
      </div>

      {/* Right: Telemetry & Version */}
      <div className="flex items-center gap-3 text-[#64748b]">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#39b282]" />
          <span>Latency: 38ms</span>
        </span>
        <span className="text-[#cbd5e1]">•</span>
        <span className="flex items-center gap-1 font-medium text-[#1e293b]">
          <ShieldCheck className="w-3 h-3 text-[#0051d5]" />
          <span>ScholarFlow Core v2.4</span>
        </span>
      </div>
    </footer>
  );
};
