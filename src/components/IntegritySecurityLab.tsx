import React, { useState } from 'react';
import {
  ShieldAlert,
  FileX2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Server,
  Layers,
  Database,
  Radio,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';

export const IntegritySecurityLab: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'stream_cutoff' | 'dual_gates' | 'split_timeout' | 'chunk_memory'>('stream_cutoff');

  // Lab 1: Stream Cutoff states
  const [streamProgress, setStreamProgress] = useState<number>(45); // Cut off at 45%
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [testRun, setTestRun] = useState<boolean>(false);

  // Lab 2: Dual Gates states
  const [simPrompt, setSimPrompt] = useState<string>('Futuristic solar kinetic skyscraper');
  const [simGate1Fail, setSimGate1Fail] = useState<boolean>(false);
  const [simGate2Fail, setSimGate2Fail] = useState<boolean>(false);

  // Lab 3: Backoff Jitter states
  const [enableJitter, setEnableJitter] = useState<boolean>(true);
  const [attemptsCount, setAttemptsCount] = useState<number>(5);

  const runTruncatedTest = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setTestRun(true);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Lab Selector Navigation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="text-base font-bold text-white tracking-wide font-['Space_Grotesk']">
                DecodeLabs Engineering Sandbox // Labs & Fault Injection
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hands-on experimental verification of the core architectural lessons in Project 3.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0b0f17] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveLab('stream_cutoff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                activeLab === 'stream_cutoff'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lab 1: Truncated Stream
            </button>
            <button
              onClick={() => setActiveLab('dual_gates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                activeLab === 'dual_gates'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lab 2: Dual Gates
            </button>
            <button
              onClick={() => setActiveLab('split_timeout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                activeLab === 'split_timeout'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lab 3: Split-Timeout & Jitter
            </button>
            <button
              onClick={() => setActiveLab('chunk_memory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                activeLab === 'chunk_memory'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lab 4: 65.5KB Streaming
            </button>
          </div>
        </div>
      </div>

      {/* LAB 1: TRUNCATED STREAM TRAP */}
      {activeLab === 'stream_cutoff' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Slide 14 & 15 Blueprint Validation
              </span>
              <h3 className="text-lg font-bold text-white mt-1 font-['Space_Grotesk']">
                The Threat of the Truncated Data Stream vs Rigorous Pixel Decode
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Demonstrates why superficial header checks report a false positive on severed network streams, and how forcing a pixel-level buffer decode (<code className="text-cyan-300">Image.open().load()</code>) protects production systems from silent corruption.
              </p>
            </div>
          </div>

          {/* Interactive Stream Cutoff Knob */}
          <div className="bg-[#0b0f17] p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Simulate Network Disconnect Stream Point:
              </span>
              <span className="font-mono text-cyan-400 font-bold text-sm">
                {streamProgress}% of image payload received ({streamProgress === 100 ? 'Complete' : 'Severed early'})
              </span>
            </div>

            <div className="relative">
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={streamProgress}
                onChange={(e) => {
                  setStreamProgress(parseInt(e.target.value, 10));
                  setTestRun(false);
                }}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>10% (Early Drop)</span>
                <span>50% (Mid-Transfer Cutoff)</span>
                <span>100% (Full Transmission)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={runTruncatedTest}
                disabled={isVerifying}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Integrity Verification Test</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStreamProgress(100);
                  setTestRun(false);
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                Reset to 100%
              </button>
            </div>
          </div>

          {/* Visual Side-by-Side Simulation Comparison (Slide 14 & 15) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Readout 1: The Trap */}
            <div className="bg-[#0b0f17] border border-amber-900/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Readout 1: imghdr.what() & verify()
                </span>
                <span className="text-[10px] font-mono text-slate-500">The Trap (Slide 14)</span>
              </div>

              {/* Simulated corrupted image preview */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-end">
                <div
                  style={{ height: `${streamProgress}%` }}
                  className="w-full bg-gradient-to-t from-cyan-600/40 to-indigo-600/40 relative border-b-2 border-dashed border-rose-500 flex items-center justify-center"
                >
                  <span className="text-[11px] font-mono text-cyan-200 bg-black/60 px-2 py-0.5 rounded">
                    Decoded Valid Scanlines ({streamProgress}%)
                  </span>
                </div>
                {streamProgress < 100 && (
                  <div
                    style={{ height: `${100 - streamProgress}%` }}
                    className="w-full bg-slate-900 flex items-center justify-center text-slate-600 text-xs font-mono"
                  >
                    [MISSING TRUNCATED BYTES // GREY ARTIFACT]
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5 font-mono">
                <div className="text-amber-300 font-bold">
                  {testRun || true ? 'Readout 1: Returns "Valid PNG/JPEG Header"' : 'Pending run...'}
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  <strong>Why it fails:</strong> Standard metadata checks only read block structure and CRC headers at the very start of the file. It falsely reports success even if the connection dropped at {streamProgress}%, leaving the user with a broken glitched asset!
                </div>
              </div>
            </div>

            {/* Readout 2: Rigorous Pixel Decode */}
            <div className="bg-[#0b0f17] border border-cyan-900/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Readout 2: Image.open().load()
                </span>
                <span className="text-[10px] font-mono text-slate-500">The Solution (Slide 15)</span>
              </div>

              {/* Pixel decode visual buffer scan */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 p-3 font-mono text-[10px] text-slate-400 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-cyan-400">&gt; Pillow pixel decode loop initiated...</div>
                  <div>&gt; Scanning raster scanlines RGBA...</div>
                  <div>&gt; Byte offset 0x0000 to 0x{Math.floor(streamProgress * 1024).toString(16)}...</div>
                  {streamProgress < 100 ? (
                    <div className="text-rose-400 font-bold">
                      &gt; [ERROR 0x7E1]: Stream terminated prematurely at row {Math.floor(streamProgress * 7.68)}.
                    </div>
                  ) : (
                    <div className="text-emerald-400 font-bold">
                      &gt; [SUCCESS]: All 1,032,192 pixels loaded cleanly into buffer.
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span>Raster Buffer:</span>
                  <span className={streamProgress === 100 ? 'text-emerald-400' : 'text-rose-400'}>
                    {streamProgress === 100 ? '100% Intact' : `Corrupted at ${streamProgress}%`}
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border text-xs space-y-1.5 font-mono ${
                  streamProgress === 100
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-rose-950/20 border-rose-800/40'
                }`}
              >
                <div className={streamProgress === 100 ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                  {streamProgress === 100
                    ? 'Outcome: 100% raster passed. Safe for production output.'
                    : 'Outcome: OSError: broken data stream caught! Auto-retry scheduled.'}
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  <strong>Production Rule:</strong> Calling <code className="text-cyan-300">.load()</code> forces Pillow to fully decode every pixel coordinate. Corrupted assets are caught before ever reaching the client interface or storage buckets.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 2: DUAL SECURITY GATES */}
      {activeLab === 'dual_gates' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Slide 12 Architecture Validation
            </span>
            <h3 className="text-lg font-bold text-white mt-1 font-['Space_Grotesk']">
              Dual Security Gates: Pre-Generation vs Post-Generation
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Inspect how Gate 1 (Input Filtering) avoids billing costs, whereas Gate 2 (Post-Generation Filter) absorbs compute costs and requires polite placeholder degradation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gate 1 Simulation */}
            <div className="bg-[#0b0f17] p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  GATE 1: Pre-Generation (Input Filtering)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">$0 Compute Cost</span>
              </div>

              <div className="text-xs space-y-2">
                <label className="text-slate-400 block">Test Prompt Input:</label>
                <input
                  type="text"
                  value={simPrompt}
                  onChange={(e) => setSimPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <span>Trigger Sentinel Input Policy Rejection:</span>
                <input
                  type="checkbox"
                  checked={simGate1Fail}
                  onChange={(e) => setSimGate1Fail(e.target.checked)}
                  className="accent-rose-500 w-4 h-4"
                />
              </div>

              <div
                className={`p-3 rounded-lg border text-xs font-mono ${
                  simGate1Fail
                    ? 'bg-rose-950/30 border-rose-800 text-rose-300'
                    : 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                }`}
              >
                <div>Error Trace: {simGate1Fail ? 'sentinel_block / content_policy_violation' : 'None (Payload clean)'}</div>
                <div>Compute Billed: $0.000</div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">
                  {simGate1Fail
                    ? 'Instant drop at API edge. GPU nodes never allocated.'
                    : 'Input passes security scan. Dispatched to GPU worker.'}
                </div>
              </div>
            </div>

            {/* Gate 2 Simulation */}
            <div className="bg-[#0b0f17] p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  GATE 2: Post-Generation (Output Filtering)
                </span>
                <span className="text-[10px] font-mono text-amber-400">Compute Cost Fully Incurred</span>
              </div>

              <div className="text-xs space-y-2 text-slate-400">
                <p>Diffusion completed 30 steps across 8x H100 GPUs.</p>
                <p>Output raster scrutinized against visual moderation classifiers.</p>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <span>Trigger Output Moderation Block:</span>
                <input
                  type="checkbox"
                  checked={simGate2Fail}
                  onChange={(e) => setSimGate2Fail(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
              </div>

              <div
                className={`p-3 rounded-lg border text-xs font-mono ${
                  simGate2Fail
                    ? 'bg-amber-950/30 border-amber-800 text-amber-300'
                    : 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                }`}
              >
                <div>Error Trace: {simGate2Fail ? 'moderation_blocked / finish_reason=FILTER' : 'None (Output approved)'}</div>
                <div>Compute Billed: $0.040 (Fully Incurred)</div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">
                  {simGate2Fail
                    ? 'Generates polite warning & blurred placeholder to prevent frontend app crash.'
                    : 'Image released to transport streaming layer.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: SPLIT-TIMEOUT & JITTER */}
      {activeLab === 'split_timeout' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Slide 8-11 Network Resilience
            </span>
            <h3 className="text-lg font-bold text-white mt-1 font-['Space_Grotesk']">
              Exponential Backoff & Randomized Jitter Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Preventing synchronized bot-swarms from locking overloaded API gateways during HTTP 429 and 503 surges.
            </p>
          </div>

          <div className="bg-[#0b0f17] p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Randomized Jitter Mode (Prevent Gateway Lockup):
              </span>
              <input
                type="checkbox"
                checked={enableJitter}
                onChange={(e) => setEnableJitter(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
            </div>

            {/* Backoff timeline visualization */}
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((att) => {
                const base = 1.5 * Math.pow(2, att - 1);
                const jitter = enableJitter ? (att * 0.23) % 0.8 : 0;
                const total = base + jitter;

                return (
                  <div key={att} className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Attempt #{att}</span>
                      <span className="text-cyan-400 font-bold">
                        Wait: {total.toFixed(2)}s (Base: {base.toFixed(2)}s + Jitter: {jitter.toFixed(2)}s)
                      </span>
                    </div>
                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.min(100, (total / 26) * 100)}%` }}
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LAB 4: 65.5KB CHUNKED STREAMING */}
      {activeLab === 'chunk_memory' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Slide 13 Streaming Architecture
            </span>
            <h3 className="text-lg font-bold text-white mt-1 font-['Space_Grotesk']">
              Memory-Safe Binary Streaming (iter_content chunk_size=65536)
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Comparing process RAM saturation between the monolithic requests.get() anti-pattern vs 65.5KB binary streaming directly to storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0b0f17] border border-rose-900/50 space-y-3">
              <span className="text-xs font-bold text-rose-400 font-mono">
                The Monolithic Anti-Pattern (requests.get())
              </span>
              <p className="text-xs text-slate-400">
                Loads the entire 10MiB high-res binary array into process heap at once.
              </p>
              <div className="h-8 bg-slate-900 rounded-lg overflow-hidden flex items-center px-3 border border-slate-800">
                <div className="h-4 bg-rose-500 rounded w-full flex items-center justify-center text-[10px] font-mono font-bold text-white">
                  Heap RAM: 10,485,760 Bytes (~10.5 MB)
                </div>
              </div>
              <p className="text-[11px] text-rose-400/80">
                Risk: At 100 concurrent image generations, server consumes ~1.05 GB instant RAM spike!
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0b0f17] border border-emerald-900/50 space-y-3">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                The DecodeLabs Solution (chunk_size=65536)
              </span>
              <p className="text-xs text-slate-400">
                Pipes sequentially in 65.5KB blocks directly to disk/blob storage.
              </p>
              <div className="h-8 bg-slate-900 rounded-lg overflow-hidden flex items-center px-3 border border-slate-800">
                <div className="h-4 bg-emerald-500 rounded w-[4%] flex items-center justify-center text-[9px] font-mono font-bold text-black">
                  65KB
                </div>
              </div>
              <p className="text-[11px] text-emerald-400">
                Result: Process buffer capped at 65.5KB regardless of whether the image is 1MB or 100MB!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
