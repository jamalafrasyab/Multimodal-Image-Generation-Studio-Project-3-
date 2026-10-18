import React, { useState } from 'react';
import {
  Box,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Sparkles,
  ExternalLink,
  Layers,
  FileCode,
} from 'lucide-react';
import { ArtworkAsset } from '../types/pipeline';

interface EnterpriseExportModalProps {
  asset: ArtworkAsset | null;
  onClose: () => void;
}

export const EnterpriseExportModal: React.FC<EnterpriseExportModalProps> = ({
  asset,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'blender' | 'ue5' | 'polycam'>('blender');
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const sanitizedTitle = asset.title.replace(/[^a-zA-Z0-9_]/g, '_');

  // Blender Python script (Slide 18)
  const blenderScript = `"""
DecodeLabs Industrial Training Kit - Project 3
Target: Blender 3.18+ / Blender 4.x Python bpy API
Asset: ${sanitizedTitle} (${asset.width}x${asset.height} px, ${asset.aspectRatio})
Prompt: ${asset.prompt.replace(/"/g, '\\"')}
"""
import bpy
import os

def integrate_decode_labs_asset():
    asset_name = "${sanitizedTitle}"
    width = ${asset.width}
    height = ${asset.height}
    
    print(f"[DecodeLabs] Initializing material pipeline for: {asset_name}")
    
    # 1. Target Mesh or create calibrated plane
    obj = bpy.context.active_object
    if not obj or obj.type != 'MESH':
        bpy.ops.mesh.primitive_plane_add(size=2.0)
        obj = bpy.context.active_object
        obj.name = f"{asset_name}_DisplayQuad"
    
    # Scale plane according to exact aspect ratio
    obj.scale.x = width / 1000.0
    obj.scale.y = height / 1000.0
    
    # 2. Configure Principled BSDF Node Graph
    mat = bpy.data.materials.new(name=f"M_{asset_name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    node_out = nodes.new(type='ShaderNodeOutputMaterial')
    node_bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    node_tex = nodes.new(type='ShaderNodeTexImage')
    node_coord = nodes.new(type='ShaderNodeTexCoord')
    node_mapping = nodes.new(type='ShaderNodeMapping')
    
    node_out.location = (400, 0)
    node_bsdf.location = (100, 0)
    node_tex.location = (-200, 0)
    node_mapping.location = (-400, 0)
    node_coord.location = (-600, 0)
    
    links.new(node_coord.outputs['UV'], node_mapping.inputs['Vector'])
    links.new(node_mapping.outputs['Vector'], node_tex.inputs['Vector'])
    links.new(node_tex.outputs['Color'], node_bsdf.inputs['Base Color'])
    links.new(node_bsdf.outputs['BSDF'], node_out.inputs['Surface'])
    
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
        
    print(f"[DecodeLabs] Material M_{asset_name} bound to {obj.name} successfully!")

if __name__ == "__main__":
    integrate_decode_labs_asset()
`;

  // Unreal Engine 5 Nanite Config (Slide 18)
  const ue5Config = {
    pipeline: 'DecodeLabs Project 3 Enterprise Exporter',
    targetEngine: 'Unreal Engine 5.4 / 5.5',
    naniteSettings: {
      enableNanite: true,
      autoOptimizeHighPolyAIAssets: true,
      targetTrianglePercentage: 100,
      keepPercentTriangles: 1.0,
      preserveArea: true,
      fallbackRelativeError: 1.0,
    },
    texturePacking: {
      format: 'Packed ORM (Occlusion / Roughness / Metallic)',
      channelR: 'Ambient Occlusion (AO)',
      channelG: 'Roughness',
      channelB: 'Metallic',
      compressionSettings: 'TC_Masks',
      sRGB: false,
    },
    assetMetadata: {
      assetName: `SM_${sanitizedTitle}`,
      resolution: `${asset.width}x${asset.height}`,
      aspectRatio: asset.aspectRatio,
      importPath: `/Game/AI_Generated/Project3/${sanitizedTitle}/`,
      streamChunks: asset.streamMetrics.chunksCount,
    },
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Enterprise Scaling & Workflow Integration
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Slide 18 Architecture: Nanite LODs, Blender Python API orchestration, and Polycam 3D scan fusion.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            Close [✕]
          </button>
        </div>

        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('blender')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
              activeTab === 'blender'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Blender 3.18+ / 4.x (bpy)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ue5')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
              activeTab === 'ue5'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Unreal Engine 5 (Nanite)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('polycam')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
              activeTab === 'polycam'
                ? 'bg-indigo-500 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Polycam (3D Scan Fusion)
          </button>
        </div>

        {/* Tab 1: Blender */}
        {activeTab === 'blender' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  In-App Generation & Material Application Script
                </span>
                <p className="text-xs text-slate-400">
                  Run directly in Blender's Text Editor to create a calibrated mesh and Principled BSDF node graph.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(blenderScript)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy bpy Script'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(blenderScript, `${sanitizedTitle}_blender.py`)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .py</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-black/60 border border-slate-800 rounded-xl font-mono text-[11px] text-amber-200/90 overflow-x-auto max-h-72">
              {blenderScript}
            </pre>
          </div>
        )}

        {/* Tab 2: Unreal Engine 5 */}
        {activeTab === 'ue5' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  Nanite Native Integration & ORM Texture Packing
                </span>
                <p className="text-xs text-slate-400">
                  Auto-optimizes high-poly AI assets with no manual LODs required. Packed ORM format (AO/Roughness/Metallic).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(ue5Config, null, 2))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadFile(
                      JSON.stringify(ue5Config, null, 2),
                      `${sanitizedTitle}_UE5_Nanite.json`,
                      'application/json'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Config</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-black/60 border border-slate-800 rounded-xl font-mono text-[11px] text-cyan-200/90 overflow-x-auto max-h-72">
              {JSON.stringify(ue5Config, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Polycam */}
        {activeTab === 'polycam' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-white font-mono">
                Polycam AI + Scan Fusion Workflow
              </span>
              <p className="text-xs text-slate-400">
                Combines AI-generated asset variations with real-world 3D scanned reference objects via Polycam Cloud Asset Merge.
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 text-xs space-y-3 font-mono">
              <div className="text-slate-300">
                1. Export LiDAR or photogrammetry point cloud from Polycam.
              </div>
              <div className="text-slate-300">
                2. Apply synthesized concept raster <strong className="text-indigo-400">{asset.title}</strong> as projective depth guidance.
              </div>
              <div className="text-slate-300">
                3. Texture projection preserves scanned geometric scale while adopting synthetic aesthetic stylization ({asset.stylePreset}).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
