import React from 'react';
import { Sparkles, Cpu, ShieldCheck, BookOpen, Layers, Zap } from 'lucide-react';
import { EngineId } from '../types/pipeline';
import { ENGINES } from '../data/constants';

interface HeaderProps {
  activeTab: 'orchestrator' | 'pipeline' | 'lab' | 'vault' | 'slides';
  setActiveTab: (tab: 'orchestrator' | 'pipeline' | 'lab' | 'vault' | 'slides') => void;
  activeEngine: EngineId;
  totalAssetsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeEngine,
  totalAssetsCount,
}) => {
  const currentEngineSpec = ENGINES.find((e) => e.id === activeEngine) || ENGINES[0];

  return (
    <header className="border-b border-slate-800 bg-[#090d14]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-indigo-950/50 to-slate-900 border-b border-cyan-900/40 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>DECODELABS // INDUSTRIAL TRAINING KIT</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">BATCH 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-medium">PROJECT 3: MULTIMODAL IMAGE GENERATION STUDIO</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px] font-mono">
          <span>SPLIT-TIMEOUT: 3.05s / 60s</span>
          <span>STREAM CHUNK: 65.5 KB</span>
          <span>QA THRESHOLD: ≥ 7.0/10</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-['Space_Grotesk']">
                Multimodal Image Generation Studio
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                v3.2 Production
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visual Orchestration Pipeline • Strict Aspect Ratios • Memory-Safe Binary Streaming
            </p>
          </div>
        </div>

        {/* Engine Badge & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-500">Active Engine:</span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentEngineSpec.color }}
              />
              {currentEngineSpec.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({currentEngineSpec.outputFormat})
            </span>
          </div>

          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('orchestrator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'orchestrator'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Orchestrator</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>6-Stage Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'lab'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Integrity Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'vault'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vault</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {totalAssetsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'slides'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Training Blueprint</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
