import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Shield,
  Layers,
  Code,
  RefreshCw,
  Copy,
  Check,
  Info,
  Clock,
  Terminal,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import {
  EngineId,
  AspectRatioId,
  ArtworkAsset,
  GenerationRequestParams,
} from '../types/pipeline';
import { ENGINES, ASPECT_RATIOS, STYLE_PRESETS } from '../data/constants';

interface VisualOrchestratorProps {
  onGenerate: (params: GenerationRequestParams) => Promise<ArtworkAsset | null>;
  isGenerating: boolean;
  activeEngine: EngineId;
  setActiveEngine: (engine: EngineId) => void;
  activeAsset: ArtworkAsset | null;
  onSelectAsset: (asset: ArtworkAsset) => void;
}

export const VisualOrchestrator: React.FC<VisualOrchestratorProps> = ({
  onGenerate,
  isGenerating,
  activeEngine,
  setActiveEngine,
  activeAsset,
  onSelectAsset,
}) => {
  const [prompt, setPrompt] = useState(
    'Ultra high detail cyberpunk metropolis at night, rain-slicked neon reflective streets, towering holographic billboards, cinematic atmospheric mist, volumetric cyan and magenta lighting'
  );
  const [negativePrompt, setNegativePrompt] = useState(
    'blurry, low quality, distorted anatomy, oversaturated noise, watermark, signature'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('16:9');
  const [selectedStyle, setSelectedStyle] = useState('cyberpunk');
  const [seed, setSeed] = useState(4920194);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(30);

  // Network & Safety knobs from slides
  const [connectTimeout, setConnectTimeout] = useState(3.05);
  const [readTimeout, setReadTimeout] = useState(60);
  const [enableJitter, setEnableJitter] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Engineering simulation test triggers
  const [simulationMode, setSimulationMode] = useState<
    'normal' | 'gate1_sentinel' | 'gate2_moderation' | 'corrupt_stream'
  >('normal');

  const currentEngine = ENGINES.find((e) => e.id === activeEngine) || ENGINES[0];
  const currentRatio = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  const charCount = prompt.length;
  const isOverCharLimit = charCount > currentEngine.charLimit;

  // Build live serialized payload matching Slide 6 & 7
  const serializedPayload = {
    engine: currentEngine.id,
    target_endpoint: currentEngine.endpointMock,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Timeout-Connect': `${connectTimeout}s`,
      'X-Client-Timeout-Read': `${readTimeout}s`,
    },
    payload: {
      prompt: prompt + (STYLE_PRESETS.find((s) => s.id === selectedStyle)?.promptSuffix || ''),
      negative_prompt: negativePrompt,
      resolution: {
        aspect_ratio: currentRatio.ratio,
        width: currentRatio.width,
        height: currentRatio.height,
        pixel_volume: currentRatio.totalPixels,
      },
      hyperparameters: {
        seed,
        cfg_scale: cfgScale,
        steps,
        response_format: currentEngine.outputFormat,
      },
      resilience: {
        exponential_backoff: true,
        jitter_enabled: enableJitter,
      },
    },
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(serializedPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleApplyPreset = (presetId: string) => {
    setSelectedStyle(presetId);
    const preset = STYLE_PRESETS.find((s) => s.id === presetId);
    if (preset) {
      setNegativePrompt(preset.negativeDefault);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 9000000) + 1000000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverCharLimit) return;

    await onGenerate({
      prompt,
      negativePrompt,
      engine: activeEngine,
      aspectRatio,
      stylePreset: selectedStyle,
      seed,
      cfgScale,
      steps,
      connectTimeout,
      readTimeout,
      enableJitter,
      simulateCorruptStream: simulationMode === 'corrupt_stream',
      simulateSafetyViolation:
        simulationMode === 'gate1_sentinel'
          ? 'gate1_sentinel'
          : simulationMode === 'gate2_moderation'
          ? 'gate2_moderation'
          : 'none',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Form & Configuration (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Engine Matrix Selector (Slide 6) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/20">
                  1
                </span>
                <label className="text-sm font-semibold text-white tracking-wide">
                  Multimodal Engine Matrix
                </label>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Slide 6 Blueprint
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ENGINES.map((engine) => {
                const isSelected = engine.id === activeEngine;
                return (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => setActiveEngine(engine.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: engine.color }}
                        />
                        <span className="text-[10px] font-mono text-slate-500">
                          {engine.outputFormat}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold mt-2 truncate ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {engine.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {engine.provider}
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Max limit:</span>
                      <span className="text-cyan-400 font-semibold">{engine.charLimit}c</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 truncate">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{currentEngine.constraint}</span>
              </span>
              <span className="text-slate-500 shrink-0 font-mono text-[10px]">
                Format: <strong className="text-slate-300">{currentEngine.outputFormat}</strong>
              </span>
            </div>
          </div>

          {/* Prompt & Negative Prompt */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/20">
                  2
                </span>
                <label className="text-sm font-semibold text-white tracking-wide">
                  Natural Language Prompt Formulation
                </label>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className={`${
                    isOverCharLimit
                      ? 'text-rose-400 font-bold'
                      : charCount > currentEngine.charLimit * 0.85
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {charCount.toLocaleString()} / {currentEngine.charLimit.toLocaleString()} chars
                </span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your visual concept in vivid detail..."
                className={`w-full bg-[#0b0f17] border rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none font-sans ${
                  isOverCharLimit
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                }`}
              />
              {isOverCharLimit && (
                <div className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Exceeds maximum character limit for {currentEngine.name} ({currentEngine.charLimit} chars).
                  </span>
                </div>
              )}
            </div>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-mono">Quick ideas:</span>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    'Ultra high detail cyberpunk metropolis at night, rain-slicked neon reflective streets, towering holographic billboards, cinematic atmospheric mist, volumetric cyan and magenta lighting'
                  )
                }
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition"
              >
                Cyberpunk Neo-Kyoto
              </button>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    'Futuristic biomechanical android bust sculpture crafted from black obsidian, polished gold accents, intricate exposed neural fiber optic wires, studio lighting, hyper-realistic macro photography'
                  )
                }
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition"
              >
                Obsidian Android
              </button>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    'Cinematic vertical composition of an ethereal bioluminescent cyber dragon winding around high-tech skyscraper spire in Tokyo, dense neon clouds, falling rain droplets, electric blue and amber glow, hyper-detailed digital art'
                  )
                }
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition"
              >
                Tokyo Celestial Dragon
              </button>
            </div>

            {/* Negative Prompt */}
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Negative Prompt (Reverse Denoising Filter)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Unwanted artifacts</span>
              </div>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g. blurry, low quality, oversaturated noise, watermark"
                className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Strict Aspect Ratio Payload Mapping (Slide 7) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-cyan-500/20">
                  3
                </span>
                <label className="text-sm font-semibold text-white tracking-wide">
                  Aspect Ratio to Exact Pixel Payloads
                </label>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Slide 7 Strict Dimensions
              </span>
            </div>

            {/* Critical Architecture Rule Callout */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 font-mono uppercase text-[10px] tracking-wide block">
                  Critical Architecture Rule:
                </strong>
                Passing unsupported dimensions causes immediate API handshake failure. Always map user intent to exact strict resolution variables before transmitting the payload.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {ASPECT_RATIOS.slice(0, 3).map((ratio) => {
                const isSelected = ratio.id === aspectRatio;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400 ring-1 ring-cyan-400/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {ratio.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {ratio.ratio}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-mono font-semibold text-cyan-400">
                      {ratio.width} × {ratio.height} px
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Volume:</span>
                      <span className="text-slate-400">{ratio.totalPixels.toLocaleString()} px</span>
                    </div>

                    <p className="mt-2 text-[10px] text-slate-400 line-clamp-1 border-t border-slate-800/60 pt-1.5">
                      {ratio.targetUse}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Presets */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Visual Style Preset
              </label>
              <span className="text-[11px] text-slate-500">Appends semantic modifier vectors</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleApplyPreset(style.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedStyle === style.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Advanced Knobs (Split-Timeout & Diffusion Parameters) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Advanced Network & Diffusion Hyperparameters</span>
              </span>
              <span className="text-cyan-400 font-mono text-[11px]">
                {showAdvanced ? 'Hide [-]' : 'Expand [+]'}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
                {/* Split Timeout Settings (Slide 9 & 10) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0b0f17] p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Connect Timeout
                      </span>
                      <span className="font-mono text-cyan-400">{connectTimeout}s</span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={10.0}
                      step={0.05}
                      value={connectTimeout}
                      onChange={(e) => setConnectTimeout(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 mt-2"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Includes 0.05s buffer for TCP packet retransmission delays (Slide 9).
                    </p>
                  </div>

                  <div className="bg-[#0b0f17] p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Read Timeout
                      </span>
                      <span className="font-mono text-amber-400">{readTimeout}s</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={5}
                      value={readTimeout}
                      onChange={(e) => setReadTimeout(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-400 mt-2"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Accommodates slow iterative reverse-Markov denoising loops across GPU clusters.
                    </p>
                  </div>
                </div>

                {/* Exponential Backoff Jitter checkbox */}
                <div className="flex items-center justify-between bg-[#0b0f17] p-3 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-300">
                      Exponential Backoff with Jitter
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Randomized delays to prevent synchronized bot-swarms from locking gateway (Slide 11).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableJitter}
                    onChange={(e) => setEnableJitter(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded"
                  />
                </div>

                {/* Diffusion Hyperparameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      CFG Scale: <span className="font-mono text-cyan-300">{cfgScale}</span>
                    </label>
                    <input
                      type="range"
                      min={1.0}
                      max={15.0}
                      step={0.5}
                      value={cfgScale}
                      onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Steps: <span className="font-mono text-cyan-300">{steps}</span>
                    </label>
                    <input
                      type="range"
                      min={15}
                      max={50}
                      step={1}
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Seed</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded px-2 py-1 text-xs font-mono text-cyan-300"
                      />
                      <button
                        type="button"
                        onClick={handleRandomSeed}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                        title="Randomize seed"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Industrial Testing Simulation Knobs (For Learning & Verification) */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Industrial Testing & Fault Injection Bench
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">DecodeLabs Training Lab</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSimulationMode('normal')}
                className={`p-2.5 rounded-xl text-left border text-xs transition ${
                  simulationMode === 'normal'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-semibold">Standard Run</div>
                <div className="text-[9px] text-slate-500 mt-0.5">All 6 stages pass</div>
              </button>

              <button
                type="button"
                onClick={() => setSimulationMode('gate1_sentinel')}
                className={`p-2.5 rounded-xl text-left border text-xs transition ${
                  simulationMode === 'gate1_sentinel'
                    ? 'bg-rose-950/50 border-rose-500 text-rose-300 font-bold'
                    : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-semibold text-rose-400">Gate 1 Sentinel Block</div>
                <div className="text-[9px] text-slate-500 mt-0.5">$0 compute cost drop</div>
              </button>

              <button
                type="button"
                onClick={() => setSimulationMode('gate2_moderation')}
                className={`p-2.5 rounded-xl text-left border text-xs transition ${
                  simulationMode === 'gate2_moderation'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300 font-bold'
                    : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-semibold text-amber-400">Gate 2 Moderation</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Compute cost incurred</div>
              </button>

              <button
                type="button"
                onClick={() => setSimulationMode('corrupt_stream')}
                className={`p-2.5 rounded-xl text-left border text-xs transition ${
                  simulationMode === 'corrupt_stream'
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-semibold text-cyan-400">Truncated Stream</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Test pixel decode catch</div>
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isGenerating || isOverCharLimit}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl font-['Space_Grotesk'] ${
                isGenerating || isOverCharLimit
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 text-slate-950 hover:opacity-95 shadow-cyan-500/25 cursor-pointer transform hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Orchestrating Reverse-Markov Denoising Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Synthesize Artwork & Trigger Pipeline</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowPayload(!showPayload)}
              className="px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-mono"
              title="Inspect JSON Payload"
            >
              <Code className="w-4 h-4" />
              <span>{showPayload ? 'Hide JSON' : 'Payload'}</span>
            </button>
          </div>
        </form>

        {/* Live Payload Inspector (Drawer/Collapse) */}
        {showPayload && (
          <div className="bg-[#080c14] border border-cyan-900/50 rounded-2xl p-4 font-mono text-xs shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Serialized Multimodal Request Payload</span>
              </span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition text-[11px]"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-slate-300 text-[11px] overflow-x-auto max-h-64 p-2 bg-black/40 rounded-lg">
              {JSON.stringify(serializedPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Right Column: Active Canvas Preview & Visual Summary (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 sticky top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Active Canvas Output
              </h3>
            </div>
            {activeAsset && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                {activeAsset.width} × {activeAsset.height} px
              </span>
            )}
          </div>

          {/* Active Image Box */}
          <div className="relative rounded-xl overflow-hidden bg-black/60 border border-slate-800 aspect-video flex items-center justify-center group">
            {activeAsset ? (
              <>
                <img
                  src={activeAsset.imageUrl}
                  alt={activeAsset.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    activeAsset.securityGates.gate2Status === 'moderation_blocked'
                      ? 'filter blur-2xl'
                      : ''
                  }`}
                />

                {/* Gate 2 Blur Overlay Warning if blocked */}
                {activeAsset.securityGates.gate2Status === 'moderation_blocked' && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <Shield className="w-8 h-8 text-amber-400 mb-2" />
                    <h4 className="text-xs font-bold text-amber-300 uppercase font-mono">
                      Gate 2: Output Moderation Filter
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 max-w-xs">
                      Safety filter flagged finish_reason=FILTER. Blurred placeholder rendered to protect UX. Full compute cost was incurred.
                    </p>
                  </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {activeAsset.aspectRatio}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    QA: {activeAsset.qa.aestheticScore}/10
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    {activeAsset.streamMetrics.chunksCount} Chunks (65.5KB)
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">No active asset selected.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Synthesize an artwork or select one from the vault.
                </p>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          {activeAsset && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white truncate">{activeAsset.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                  {activeAsset.prompt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-[#0b0f17] border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Aesthetic Scorer (Lens 1):</span>
                  <span
                    className={`font-bold ${
                      activeAsset.qa.aestheticPassed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {activeAsset.qa.aestheticScore} / 10.0{' '}
                    <span className="text-[9px] text-slate-500">(Threshold: 7.0)</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0f17] border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">PickScore Semantic (Lens 2):</span>
                  <span
                    className={`font-bold ${
                      activeAsset.qa.semanticPassed ? 'text-cyan-400' : 'text-amber-400'
                    }`}
                  >
                    {activeAsset.qa.semanticScore}% match
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0f17] border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Pixel Decode:</span>
                  <span
                    className={`font-bold ${
                      activeAsset.integrity.rigorousPixelDecode.passed
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {activeAsset.integrity.rigorousPixelDecode.passed
                      ? '100% Buffer Valid'
                      : 'Corrupt Cutoff Caught!'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0f17] border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Memory Streaming Peak:</span>
                  <span className="font-bold text-indigo-400">
                    {activeAsset.streamMetrics.peakMemoryMB} MB{' '}
                    <span className="text-[9px] text-slate-500">(-99.3% vs 10MB)</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
