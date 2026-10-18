/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { VisualOrchestrator } from './components/VisualOrchestrator';
import { PipelineStageVisualizer } from './components/PipelineStageVisualizer';
import { IntegritySecurityLab } from './components/IntegritySecurityLab';
import { AssetVault } from './components/AssetVault';
import { SlideDeckGuide } from './components/SlideDeckGuide';
import { EnterpriseExportModal } from './components/EnterpriseExportModal';
import { STARTER_ASSETS } from './data/starterGallery';
import {
  ArtworkAsset,
  EngineId,
  GenerationRequestParams,
} from './types/pipeline';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [assets, setAssets] = useState<ArtworkAsset[]>(STARTER_ASSETS);
  const [activeAsset, setActiveAsset] = useState<ArtworkAsset | null>(STARTER_ASSETS[0]);
  const [activeEngine, setActiveEngine] = useState<EngineId>('gpt-image');
  const [activeTab, setActiveTab] = useState<
    'orchestrator' | 'pipeline' | 'lab' | 'vault' | 'slides'
  >('orchestrator');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportModalAsset, setExportModalAsset] = useState<ArtworkAsset | null>(null);

  // Status Notification Toast
  const [notification, setNotification] = useState<{
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'warning' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), 6000);
  };

  const handleGenerate = async (
    params: GenerationRequestParams
  ): Promise<ArtworkAsset | null> => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/pipeline/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok) {
        // Gate 1 Rejection or Server error
        if (result.securityGates && !result.securityGates.gate1Passed) {
          showToast(
            'error',
            'Gate 1 Sentinel Block ($0 Compute Cost)',
            result.securityGates.gate1Reason ||
              'Input triggered pre-generation safety filter. 0 compute cost incurred.'
          );
          setActiveTab('lab');
        } else {
          showToast('error', 'API Gateway Exception', result.error || 'Network request failed.');
        }
        setIsGenerating(false);
        return null;
      }

      if (result.success && result.data) {
        // Find matching image based on ratio for visualization
        let visualImage = STARTER_ASSETS[0].imageUrl;
        if (params.aspectRatio === '1:1') visualImage = STARTER_ASSETS[1].imageUrl;
        if (params.aspectRatio === '9:16') visualImage = STARTER_ASSETS[2].imageUrl;

        const newAsset: ArtworkAsset = {
          ...result.data,
          imageUrl: visualImage,
        };

        setAssets((prev) => [newAsset, ...prev]);
        setActiveAsset(newAsset);

        if (newAsset.securityGates.gate2Status === 'moderation_blocked') {
          showToast(
            'warning',
            'Gate 2 Moderation Filtered',
            'Output filter caught finish_reason=FILTER. Full GPU compute cost incurred ($0.042). Displaying blurred placeholder.'
          );
        } else if (newAsset.integrity.detectedPrematureCutoff) {
          showToast(
            'warning',
            'Truncated Data Stream Caught!',
            'Superficial header check passed, but rigorous pixel decode (.load()) caught OSError broken data stream and initiated auto-recovery!'
          );
        } else {
          showToast(
            'success',
            'Pipeline Completed Successfully',
            `Artwork synthesized via ${newAsset.engine} with QA score ${newAsset.qa.aestheticScore}/10 and ${newAsset.qa.semanticScore}% PickScore alignment.`
          );
        }

        setIsGenerating(false);
        return newAsset;
      }

      setIsGenerating(false);
      return null;
    } catch (err) {
      console.error(err);
      showToast('error', 'Network Timeout', 'API Gateway timed out or failed to connect.');
      setIsGenerating(false);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeEngine={activeEngine}
        totalAssetsCount={assets.length}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom duration-300">
          <div
            className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 ${
              notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-600 text-rose-200'
                : notification.type === 'warning'
                ? 'bg-amber-950/90 border-amber-600 text-amber-200'
                : 'bg-emerald-950/90 border-emerald-600 text-emerald-200'
            }`}
          >
            {notification.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : notification.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <strong className="font-bold font-mono uppercase tracking-wider block text-white">
                {notification.title}
              </strong>
              <p className="mt-0.5 leading-relaxed text-slate-300">{notification.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="ml-auto text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {activeTab === 'orchestrator' && (
          <VisualOrchestrator
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            activeEngine={activeEngine}
            setActiveEngine={setActiveEngine}
            activeAsset={activeAsset}
            onSelectAsset={setActiveAsset}
          />
        )}

        {activeTab === 'pipeline' && <PipelineStageVisualizer asset={activeAsset} />}

        {activeTab === 'lab' && <IntegritySecurityLab />}

        {activeTab === 'vault' && (
          <AssetVault
            assets={assets}
            activeAsset={activeAsset}
            onSelectAsset={setActiveAsset}
            onOpenExportModal={(asset) => setExportModalAsset(asset)}
          />
        )}

        {activeTab === 'slides' && <SlideDeckGuide />}
      </main>

      {/* Enterprise Export Modal (Blender / UE5 / Polycam) */}
      {exportModalAsset && (
        <EnterpriseExportModal
          asset={exportModalAsset}
          onClose={() => setExportModalAsset(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06090f] py-6 px-4 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-cyan-400 font-bold">DecodeLabs</span>
            <span>// Industrial Training Kit</span>
            <span>•</span>
            <span>Project 3: Multimodal Image Generation Studio (Batch 2026)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Connect: 3.05s buffer</span>
            <span>Read: 60s GPU</span>
            <span>Stream: 65.5 KB Chunks</span>
            <span>Rigorous Pixel Decode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
