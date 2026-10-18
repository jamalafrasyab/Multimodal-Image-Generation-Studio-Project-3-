import React, { useState } from 'react';
import {
  Layers,
  Clock,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  Eye,
  FileCheck,
  ChevronRight,
  Sparkles,
  BarChart3,
  Server,
  Zap,
} from 'lucide-react';
import { ArtworkAsset } from '../types/pipeline';

interface PipelineStageVisualizerProps {
  asset: ArtworkAsset | null;
}

export const PipelineStageVisualizer: React.FC<PipelineStageVisualizerProps> = ({ asset }) => {
  const [selectedStage, setSelectedStage] = useState<number>(1);

  if (!asset) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto">
        <Cpu className="w-12 h-12 mx-auto text-cyan-400 mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
          No Pipeline Data Available
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          Trigger an orchestration run or select an artwork from the vault to inspect the 6-stage AI pipeline execution trace.
        </p>
      </div>
    );
  }

  const stages = [
    {
      num: 1,
      name: 'Prompt Payload Formulation',
      subtitle: 'Aspect Ratio Maps & Strict Dimension Payloads',
      slideRef: 'Slide 5, 6, 7',
      status: 'passed',
      statusLabel: 'Serialized',
      icon: Layers,
    },
    {
      num: 2,
      name: 'Network API Gateway',
      subtitle: 'Split-Timeout (3.05s/60s) & Exponential Backoff Jitter',
      slideRef: 'Slide 8, 9, 10, 11',
      status: 'passed',
      statusLabel: 'Gateway Synced',
      icon: Clock,
    },
    {
      num: 3,
      name: 'Security & Moderation Gates',
      subtitle: 'Dual-Gate Protocol (Gate 1 Pre-Gen & Gate 2 Post-Gen)',
      slideRef: 'Slide 12',
      status:
        !asset.securityGates.gate1Passed
          ? 'failed'
          : !asset.securityGates.gate2Passed
          ? 'warning'
          : 'passed',
      statusLabel:
        !asset.securityGates.gate1Passed
          ? 'Gate 1 Blocked ($0 Cost)'
          : !asset.securityGates.gate2Passed
          ? 'Gate 2 Moderation Filter'
          : 'Both Gates Passed',
      icon: ShieldCheck,
    },
    {
      num: 4,
      name: 'Transport Protocol',
      subtitle: 'Memory-Safe 65.5KB Chunked Binary Streaming',
      slideRef: 'Slide 13',
      status: 'passed',
      statusLabel: `${asset.streamMetrics.chunksCount} Chunks (65.5KB)`,
      icon: Database,
    },
    {
      num: 5,
      name: 'Integrity Verification',
      subtitle: 'Rigorous Pixel Decode (Image.open().load()) vs Header Trap',
      slideRef: 'Slide 14, 15',
      status: asset.integrity.rigorousPixelDecode.passed ? 'passed' : 'failed',
      statusLabel: asset.integrity.rigorousPixelDecode.passed
        ? 'Full Raster Decoded'
        : 'Cutoff Caught (Auto-Retry)',
      icon: FileCheck,
    },
    {
      num: 6,
      name: 'Automated Quality Assurance',
      subtitle: 'Lens 1 Aesthetic ViT-L/14 & Lens 2 PickScore Semantic',
      slideRef: 'Slide 16',
      status: asset.qa.aestheticPassed && asset.qa.semanticPassed ? 'passed' : 'warning',
      statusLabel: `Score ${asset.qa.aestheticScore}/10 • ${asset.qa.semanticScore}% Match`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Project 3 Architecture Blueprint
              </span>
              <span className="text-xs text-slate-500 font-mono">Slide 17 Master Diagram</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 font-['Space_Grotesk']">
              Production-Grade Multimodal AI Pipeline Execution Trace
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspecting execution of <strong className="text-slate-200">{asset.title}</strong>{' '}
              ({asset.engine} • {asset.aspectRatio} • {asset.width}x{asset.height}px)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Pipeline State:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                asset.qa.recommendation === 'approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-950 text-amber-400 border border-amber-500/40'
              }`}
            >
              {asset.qa.recommendation === 'approved' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PRODUCTION READY // APPROVED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>REQUIRES ATTENTION // {asset.qa.recommendation.toUpperCase()}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* 6-Stage Flow Stepper (Slide 17 layout) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-6 pt-6 border-t border-slate-800">
          {stages.map((st) => {
            const isSelected = selectedStage === st.num;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setSelectedStage(st.num)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-800/95 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg'
                    : 'bg-[#0b0f17]/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {st.num}
                  </span>
                  {st.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : st.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>

                <div className="mt-2.5">
                  <h4
                    className={`text-xs font-bold truncate ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {st.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {st.statusLabel}
                  </p>
                </div>

                <div className="mt-2 text-[9px] font-mono text-cyan-400/80">
                  {st.slideRef}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Stage Detail Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {selectedStage === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  Stage 1 Deep Dive // Slide 5, 6, 7
                </span>
                <h3 className="text-base font-bold text-white">
                  Prompt Payload Formulation & Dimension Serialization
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Pixel Volume: {asset.width * asset.height} px
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0b0f17] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Structural Parameters
                </h4>
                <div className="text-xs space-y-1.5 font-mono">
                  <div className="text-slate-400">
                    Target Engine:{' '}
                    <strong className="text-white">{asset.engine}</strong>
                  </div>
                  <div className="text-slate-400">
                    Aspect Ratio:{' '}
                    <strong className="text-cyan-400">{asset.aspectRatio}</strong>
                  </div>
                  <div className="text-slate-400">
                    Strict Dimensions:{' '}
                    <strong className="text-cyan-400">
                      {asset.width} × {asset.height} px
                    </strong>
                  </div>
                  <div className="text-slate-400">
                    Total Pixel Volume:{' '}
                    <strong className="text-white">
                      {(asset.width * asset.height).toLocaleString()} px
                    </strong>
                  </div>
                  <div className="text-slate-400">
                    CFG Guidance:{' '}
                    <strong className="text-white">{asset.cfgScale}</strong> | Steps:{' '}
                    <strong className="text-white">{asset.steps}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#0b0f17] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Reverse-Markov Insight (Slide 5)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Diffusion models treat text prompts not as literal instructions, but as high-dimensional semantic vectors guiding a reverse-Markov denoising process. Our pipeline serializes user intent into mathematically strict pixel targets.
                </p>
                <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 p-2 rounded border border-cyan-900/40">
                  Serialized Format: {JSON.stringify(asset.serializedPayload?.dimensions || `${asset.width}x${asset.height}`)}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedStage === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  Stage 2 Deep Dive // Slide 8, 9, 10, 11
                </span>
                <h3 className="text-base font-bold text-white">
                  Network API Gateway & Split-Timeout Timeline
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Split-Timeout: 3.05s / 60s
              </span>
            </div>

            {/* Split Timeout Visual Timeline (Slide 9) */}
            <div className="bg-[#0b0f17] p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Split-Timeout Timeline (Slide 9 Architecture)
              </h4>
              <div className="relative pt-2 pb-6">
                <div className="h-4 bg-slate-800 rounded-full flex overflow-hidden">
                  <div
                    style={{ width: '8%' }}
                    className="bg-cyan-400 flex items-center justify-center text-[9px] font-bold text-black font-mono"
                    title="Connect Timeout (3.05s)"
                  >
                    TCP 3.05s
                  </div>
                  <div
                    style={{ width: '92%' }}
                    className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white font-mono"
                    title="Read Timeout (60s - 120s)"
                  >
                    Read Timeout (60s Remote GPU Diffusion)
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                  <span>0s (Start)</span>
                  <span className="text-cyan-400">3.05s (TCP Buffer)</span>
                  <span>60s (GPU Matrix Complete)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/40 text-slate-300">
                  <strong className="text-cyan-400 block font-mono text-[11px]">
                    Connect Timeout (3.05s Buffer):
                  </strong>
                  Establishes TCP connection. The 0.05s buffer accommodates standard TCP packet retransmission delays. Fails fast if cluster is down.
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-slate-300">
                  <strong className="text-indigo-400 block font-mono text-[11px]">
                    Read Timeout (60s - 120s):
                  </strong>
                  Accommodates slow, iterative diffusion matrix generation process across remote GPU clusters. Keeps connection alive without premature drops.
                </div>
              </div>
            </div>

            {/* Exponential Backoff Table (Slide 11) */}
            <div className="bg-[#0b0f17] p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Resilience via Exponential Backoff and Jitter (Slide 11)
              </h4>
              <p className="text-xs text-slate-400">
                Formula: <code className="text-cyan-400 font-mono">wait_time = base * 2^(attempt) + jitter</code> (Applied selectively on HTTP 429 Too Many Requests or 503 Service Unavailable).
              </p>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="text-[10px] uppercase text-slate-500 bg-slate-900/60 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Attempt</th>
                      <th className="py-2 px-3">Base Delay</th>
                      <th className="py-2 px-3">Jitter Window</th>
                      <th className="py-2 px-3">Total Wait Time</th>
                      <th className="py-2 px-3">Protection Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2 px-3 text-cyan-400">Attempt #1</td>
                      <td className="py-2 px-3">1.50s</td>
                      <td className="py-2 px-3">+0.32s</td>
                      <td className="py-2 px-3 font-bold text-white">1.82s</td>
                      <td className="py-2 px-3 text-slate-400">Immediate transient drop</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-cyan-400">Attempt #2</td>
                      <td className="py-2 px-3">3.00s</td>
                      <td className="py-2 px-3">+0.68s</td>
                      <td className="py-2 px-3 font-bold text-white">3.68s</td>
                      <td className="py-2 px-3 text-slate-400">Burst recovery</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-cyan-400">Attempt #3</td>
                      <td className="py-2 px-3">6.00s</td>
                      <td className="py-2 px-3">+0.45s</td>
                      <td className="py-2 px-3 font-bold text-white">6.45s</td>
                      <td className="py-2 px-3 text-slate-400">Rate limit cooldown</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-cyan-400">Attempt #4</td>
                      <td className="py-2 px-3">12.00s</td>
                      <td className="py-2 px-3">+0.91s</td>
                      <td className="py-2 px-3 font-bold text-white">12.91s</td>
                      <td className="py-2 px-3 text-slate-400">Cluster scale-out window</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedStage === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  Stage 3 Deep Dive // Slide 12
                </span>
                <h3 className="text-base font-bold text-white">
                  Navigating the Dual Security Gates
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Gate 1 & Gate 2 Protection
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gate 1 Card */}
              <div
                className={`p-4 rounded-xl border ${
                  asset.securityGates.gate1Passed
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-rose-950/30 border-rose-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    GATE 1: Pre-Generation (Input Filtering)
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      asset.securityGates.gate1Passed
                        ? 'bg-emerald-900/60 text-emerald-300'
                        : 'bg-rose-900/60 text-rose-300'
                    }`}
                  >
                    {asset.securityGates.gate1Status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300 font-mono">
                  <div>
                    Error Trace:{' '}
                    <code className="text-cyan-300">sentinel_block / content_policy</code>
                  </div>
                  <div>
                    Compute Impact:{' '}
                    <strong className="text-emerald-400">$0.00 compute cost incurred</strong>
                  </div>
                  <div className="text-slate-400 text-[11px] font-sans pt-1">
                    Filters prohibited keywords, harmful intent, and safety violations before reaching GPU nodes. Instant rejection protects billing.
                  </div>
                </div>
              </div>

              {/* Gate 2 Card */}
              <div
                className={`p-4 rounded-xl border ${
                  asset.securityGates.gate2Passed
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-amber-950/30 border-amber-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    GATE 2: Post-Generation (Output Filtering)
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      asset.securityGates.gate2Passed
                        ? 'bg-emerald-900/60 text-emerald-300'
                        : 'bg-amber-900/60 text-amber-300'
                    }`}
                  >
                    {asset.securityGates.gate2Status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300 font-mono">
                  <div>
                    Error Trace:{' '}
                    <code className="text-amber-300">moderation_blocked / finish_reason=FILTER</code>
                  </div>
                  <div>
                    Compute Impact:{' '}
                    <strong className="text-amber-400">
                      Compute cost fully incurred (${asset.securityGates.gate2ComputeCost.toFixed(3)})
                    </strong>
                  </div>
                  <div className="text-slate-400 text-[11px] font-sans pt-1">
                    Catches synthetic visual anomalies generated by diffusion models. Triggers blurred placeholder to safeguard end-user interface without crash.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedStage === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  Stage 4 Deep Dive // Slide 13
                </span>
                <h3 className="text-base font-bold text-white">
                  Memory-Safe Streaming for Binary Payloads
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Chunk Size: 65,536 Bytes (65.5KB)
              </span>
            </div>

            {/* Anti-Pattern vs Solution (Slide 13) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
                  <XCircle className="w-4 h-4" />
                  <span>The Anti-Pattern (requests.get())</span>
                </div>
                <p className="text-slate-300">
                  Loading a 10MiB raw image entirely into RAM at once using a basic monolithic request. Under concurrent user traffic, this creates memory spikes and container Out-Of-Memory (OOM) kills.
                </p>
                <div className="text-rose-400 font-mono text-[11px] bg-black/40 p-2 rounded">
                  Peak RAM Usage: ~{asset.streamMetrics.traditionalRamMB} MB
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The Solution (iter_content chunk_size=65536)</span>
                </div>
                <p className="text-slate-300">
                  Setting <code className="text-cyan-300 font-mono">stream=True</code> and writing sequentially in 65.5KB chunks directly to disk/blob storage keeps process RAM virtually flat.
                </p>
                <div className="text-emerald-400 font-mono text-[11px] bg-black/40 p-2 rounded">
                  Peak RAM Usage: ~{asset.streamMetrics.peakMemoryMB} MB (-{asset.streamMetrics.memorySavingsPercent}% savings!)
                </div>
              </div>
            </div>

            {/* Stream Telemetry Bar */}
            <div className="bg-[#0b0f17] p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Total Stream Payload:</span>
                <span className="text-white font-bold">
                  {(asset.streamMetrics.totalBytes / 1024).toFixed(1)} KB (
                  {asset.streamMetrics.chunksCount} chunks of 65.5KB)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Transfer Rate:</span>
                <span className="text-cyan-400 font-bold">
                  {asset.streamMetrics.transferRateKBps} KB/s
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Stream Duration:</span>
                <span className="text-indigo-400 font-bold">
                  {asset.streamMetrics.streamDurationMs} ms
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedStage === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  Stage 5 Deep Dive // Slide 14, 15
                </span>
                <h3 className="text-base font-bold text-white">
                  Integrity Verification: Rigorous Pixel-Level Decode
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Pixel-Level Defense
              </span>
            </div>

            {/* The Trap vs Rigorous Decode (Slide 14 & 15) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Trap: imghdr.what() & Image.verify()</span>
                </div>
                <p className="text-slate-300">
                  Standard metadata checks and verify() only read the block structure and CRC headers at the very start of the file. They report success even if the connection dropped mid-download, resulting in a silent truncated disaster.
                </p>
                <div className="text-amber-300 font-mono text-[11px] bg-black/40 p-2 rounded">
                  Status: {asset.integrity.superficialHeaderCheck.message}
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  asset.integrity.rigorousPixelDecode.passed
                    ? 'bg-emerald-950/20 border-emerald-900/40'
                    : 'bg-rose-950/30 border-rose-900/60'
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-mono text-white">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      asset.integrity.rigorousPixelDecode.passed
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  />
                  <span>The Fix: Forcing Image.open().load()</span>
                </div>
                <p className="text-slate-300">
                  Calling <code className="text-cyan-300 font-mono">.load()</code> forces the library to fully decode the entire image stream, pixel by pixel, catching premature network disconnects before displaying corrupted images.
                </p>
                <div
                  className={`font-mono text-[11px] bg-black/40 p-2 rounded ${
                    asset.integrity.rigorousPixelDecode.passed
                      ? 'text-emerald-300'
                      : 'text-rose-400'
                  }`}
                >
                  Status: {asset.integrity.rigorousPixelDecode.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedStage === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  Stage 6 Deep Dive // Slide 16
                </span>
                <h3 className="text-base font-bold text-white">
                  Automated QA: Aesthetic and Semantic Alignment
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                CLIP ViT-L/14 & PickScore
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lens 1 */}
              <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase font-mono">
                    Lens 1: Aesthetic Classification (ViT-L/14)
                  </h4>
                  <span
                    className={`text-xs font-mono font-bold ${
                      asset.qa.aestheticPassed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    Score: {asset.qa.aestheticScore} / 10.0
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Evaluated by linear classifier on OpenAI CLIP ViT-L/14 vector embeddings. Assets scoring below 7.0 / 10.0 threshold are flagged or discarded.
                </p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Composition:</span>
                    <span className="text-cyan-400">{asset.qa.aestheticBreakdown.composition}/10</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Lighting:</span>
                    <span className="text-cyan-400">{asset.qa.aestheticBreakdown.lighting}/10</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Sharpness:</span>
                    <span className="text-cyan-400">{asset.qa.aestheticBreakdown.sharpness}/10</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Color Harmonics:</span>
                    <span className="text-cyan-400">{asset.qa.aestheticBreakdown.colorHarmonics}/10</span>
                  </div>
                </div>
              </div>

              {/* Lens 2 */}
              <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase font-mono">
                    Lens 2: Semantic Alignment Verification
                  </h4>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    PickScore: {asset.qa.semanticScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Measures how accurately the visual output aligns with the requested prompt using PickScore / CLIP-IQA prompt similarity.
                </p>
                <div className="space-y-1.5 text-xs font-mono">
                  {asset.qa.promptKeyElements.map((elem, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <span>• {elem.element}</span>
                      <span className={elem.matched ? 'text-emerald-400' : 'text-rose-400'}>
                        {elem.matched ? 'MATCHED' : 'DIVERGENT'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
