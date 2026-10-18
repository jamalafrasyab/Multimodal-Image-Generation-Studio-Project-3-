import React, { useState } from 'react';
import {
  Download,
  Share2,
  Maximize2,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  Code,
  FileCode,
  Box,
  Eye,
  Filter,
} from 'lucide-react';
import { ArtworkAsset } from '../types/pipeline';

interface AssetVaultProps {
  assets: ArtworkAsset[];
  activeAsset: ArtworkAsset | null;
  onSelectAsset: (asset: ArtworkAsset) => void;
  onOpenExportModal: (asset: ArtworkAsset) => void;
}

export const AssetVault: React.FC<AssetVaultProps> = ({
  assets,
  activeAsset,
  onSelectAsset,
  onOpenExportModal,
}) => {
  const [filterRatio, setFilterRatio] = useState<string>('all');
  const [filterEngine, setFilterEngine] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [inspectModalAsset, setInspectModalAsset] = useState<ArtworkAsset | null>(null);

  const filteredAssets = assets.filter((asset) => {
    if (filterRatio !== 'all' && asset.aspectRatio !== filterRatio) return false;
    if (filterEngine !== 'all' && asset.engine !== filterEngine) return false;
    return true;
  });

  const handleDownloadAsset = (asset: ArtworkAsset) => {
    setDownloadingId(asset.id);

    // Create automated download pipeline saving high-res image + metadata (Slide 19)
    const link = document.createElement('a');
    link.href = asset.imageUrl;
    link.download = `DecodeLabs_${asset.aspectRatio.replace(':', 'x')}_${asset.width}x${asset.height}_seed${asset.seed}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also download companion metadata JSON
    const metadataBlob = new Blob(
      [
        JSON.stringify(
          {
            studio: 'DecodeLabs Industrial Training Kit - Project 3',
            batch: '2026',
            asset_id: asset.id,
            title: asset.title,
            prompt: asset.prompt,
            negative_prompt: asset.negativePrompt,
            resolution: `${asset.width}x${asset.height}`,
            aspect_ratio: asset.aspectRatio,
            engine: asset.engine,
            seed: asset.seed,
            qa_score: asset.qa.aestheticScore,
            semantic_pickscore: asset.qa.semanticScore,
            serialized_payload: asset.serializedPayload,
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const metaLink = document.createElement('a');
    metaLink.href = URL.createObjectURL(metadataBlob);
    metaLink.download = `DecodeLabs_${asset.id}_metadata.json`;
    document.body.appendChild(metaLink);
    metaLink.click();
    document.body.removeChild(metaLink);

    setTimeout(() => setDownloadingId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide font-['Space_Grotesk']">
            Asset Vault & Local Download Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Slide 19 Milestone: High-resolution media orchestration and enterprise asset vault.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0b0f17] p-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={filterRatio}
              onChange={(e) => setFilterRatio(e.target.value)}
              className="bg-transparent text-slate-300 text-xs py-1 px-2 focus:outline-none"
            >
              <option value="all">All Ratios</option>
              <option value="16:9">16:9 Landscape</option>
              <option value="1:1">1:1 Square</option>
              <option value="9:16">9:16 Vertical</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#0b0f17] p-1 rounded-xl border border-slate-800 text-xs">
            <select
              value={filterEngine}
              onChange={(e) => setFilterEngine(e.target.value)}
              className="bg-transparent text-slate-300 text-xs py-1 px-2 focus:outline-none"
            >
              <option value="all">All Engines</option>
              <option value="gpt-image">gpt-image series</option>
              <option value="stable-image-core">Stable Image Core</option>
              <option value="wan-t2i-v2">Wan T2I v2</option>
              <option value="gemini-imagen">Gemini Imagen 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const isActive = activeAsset?.id === asset.id;

          return (
            <div
              key={asset.id}
              className={`bg-slate-900/80 border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between group ${
                isActive
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Media Display */}
              <div className="relative aspect-video bg-black/60 overflow-hidden">
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlays */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {asset.aspectRatio}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {asset.width} × {asset.height}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <button
                    type="button"
                    onClick={() => setInspectModalAsset(asset)}
                    className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 hover:text-white hover:bg-black/80 transition"
                    title="Fullscreen Inspect"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
                    QA: {asset.qa.aestheticScore}/10
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/20">
                    PickScore: {asset.qa.semanticScore}%
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                    <span>{asset.engine}</span>
                    <span>Seed: {asset.seed}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{asset.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans">
                    {asset.prompt}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectAsset(asset)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {isActive ? 'Active Asset' : 'Select'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadAsset(asset)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    title="Automated High-Res Download (Image + Metadata)"
                  >
                    {downloadingId === asset.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenExportModal(asset)}
                    className="p-2 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition"
                    title="Export to Unreal Engine 5 Nanite / Blender bpy"
                  >
                    <Box className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal */}
      {inspectModalAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{inspectModalAsset.title}</h3>
                <span className="text-xs font-mono text-cyan-400">
                  {inspectModalAsset.width} × {inspectModalAsset.height} px • {inspectModalAsset.aspectRatio}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalAsset(null)}
                className="text-slate-400 hover:text-white text-sm font-mono"
              >
                Close [✕]
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black/80 aspect-video flex items-center justify-center">
              <img
                src={inspectModalAsset.imageUrl}
                alt={inspectModalAsset.title}
                className="max-h-[60vh] object-contain"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase">Prompt:</span>
                <p className="text-slate-200 font-sans">{inspectModalAsset.prompt}</p>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase">QA & Stream Verification:</span>
                <div className="text-slate-300">
                  • Aesthetic ViT-L/14: <strong className="text-emerald-400">{inspectModalAsset.qa.aestheticScore}/10</strong>
                </div>
                <div className="text-slate-300">
                  • Semantic PickScore: <strong className="text-cyan-400">{inspectModalAsset.qa.semanticScore}%</strong>
                </div>
                <div className="text-slate-300">
                  • Streaming Chunks: {inspectModalAsset.streamMetrics.chunksCount} chunks of 65.5KB
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadAsset(inspectModalAsset)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res + Metadata</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
