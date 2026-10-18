import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Pipeline Generation Endpoint
app.post('/api/pipeline/generate', async (req, res) => {
  try {
    const {
      prompt = '',
      negativePrompt = '',
      engine = 'gemini-imagen',
      aspectRatio = '16:9',
      stylePreset = 'cyberpunk',
      seed = Math.floor(Math.random() * 9000000) + 1000000,
      cfgScale = 7.5,
      steps = 30,
      connectTimeout = 3.05,
      readTimeout = 60,
      enableJitter = true,
      simulateCorruptStream = false,
      simulateSafetyViolation = 'none',
    } = req.body;

    // --- STAGE 1: PROMPT PAYLOAD FORMULATION ---
    const ratioMap: Record<string, { w: number; h: number; pixels: number; label: string }> = {
      '16:9': { w: 1344, h: 768, pixels: 1032192, label: '16:9 Landscape' },
      '1:1': { w: 1024, h: 1024, pixels: 1048576, label: '1:1 Square' },
      '9:16': { w: 768, h: 1344, pixels: 1032192, label: '9:16 Vertical' },
      '4:3': { w: 1152, h: 864, pixels: 995328, label: '4:3 Standard' },
      '3:4': { w: 864, h: 1152, pixels: 995328, label: '3:4 Portrait' },
    };
    const dimensions = ratioMap[aspectRatio] || ratioMap['16:9'];

    // --- STAGE 2: NETWORK API GATEWAY (SPLIT-TIMEOUT & JITTER) ---
    // Calculate exponential backoff with jitter simulation
    const backoffTable = [1, 2, 3, 4, 5].map((attempt) => {
      const baseDelay = 1.5 * Math.pow(2, attempt - 1);
      const jitter = enableJitter ? Math.round(Math.random() * 750) / 1000 : 0;
      const totalWaitSeconds = Math.round((baseDelay + jitter) * 100) / 100;
      return {
        attempt,
        baseDelay: Math.round(baseDelay * 100) / 100,
        jitter,
        totalWaitSeconds,
      };
    });

    // --- STAGE 3: SECURITY & MODERATION GATES ---
    // Gate 1: Pre-Generation (Input Filtering)
    const dangerousKeywords = ['bomb', 'terror', 'weaponized', 'nsfw_bypass', 'exploit_vulnerability'];
    const hasForbiddenInput =
      simulateSafetyViolation === 'gate1_sentinel' ||
      dangerousKeywords.some((kw) => prompt.toLowerCase().includes(kw));

    if (hasForbiddenInput) {
      return res.status(400).json({
        success: false,
        phase: 'Stage 3: Security & Moderation Gate 1',
        securityGates: {
          gate1Passed: false,
          gate1Status: 'sentinel_block',
          gate1ComputeCost: 0.0,
          gate1Reason:
            'Gate 1 Pre-Generation Rejection: Input payload triggered sentinel_block / content_policy_violation. Compute impact: $0.00 compute cost incurred. Instant rejection.',
          gate2Passed: false,
          gate2Status: 'passed',
          gate2ComputeCost: 0.0,
        },
      });
    }

    // Gate 2: Post-Generation (Output Filtering)
    const isGate2Blocked = simulateSafetyViolation === 'gate2_moderation';

    // --- STAGE 4: MEMORY-SAFE 65.5KB CHUNK STREAMING METRICS ---
    const simulatedRawBytes = Math.round(dimensions.pixels * 1.05); // ~1.05MB PNG/JPEG
    const chunkSize = 65536; // 65.5 KB
    const chunksCount = Math.ceil(simulatedRawBytes / chunkSize);
    const streamDurationMs = Math.floor(Math.random() * 120) + 280;

    // --- STAGE 5: INTEGRITY VERIFICATION (RIGOROUS PIXEL DECODE) ---
    const integrityResult = {
      superficialHeaderCheck: {
        passed: true,
        method: 'imghdr.what() & Image.verify()' as const,
        message: 'PASS: CRC and file header valid (Warning: only checks leading headers).',
      },
      rigorousPixelDecode: {
        passed: !simulateCorruptStream,
        method: 'Image.open().load() full pixel buffer' as const,
        message: simulateCorruptStream
          ? 'FAIL: OSError: broken data stream detected at raster line 512. Partial byte cutoff caught before rendering.'
          : `PASS: Decoded all ${dimensions.pixels.toLocaleString()} pixels RGBA with zero scanline tears.`,
        pixelsDecodedCount: simulateCorruptStream
          ? Math.floor(dimensions.pixels * 0.45)
          : dimensions.pixels,
        corruptedAtByte: simulateCorruptStream ? Math.floor(simulatedRawBytes * 0.45) : undefined,
      },
      detectedPrematureCutoff: simulateCorruptStream,
      autoRecoveryTriggered: simulateCorruptStream,
    };

    // --- STAGE 6: AUTOMATED QA (AESTHETIC & SEMANTIC ALIGNMENT) ---
    // Lens 1: Aesthetic (ViT-L/14 threshold >= 7.0/10)
    const aestheticScore = simulateCorruptStream
      ? 3.2
      : Math.round((8.8 + Math.random() * 0.9) * 10) / 10;
    const aestheticPassed = aestheticScore >= 7.0;

    // Lens 2: Semantic Alignment Verification (PickScore / CLIP-IQA)
    const semanticScore = simulateCorruptStream
      ? 41
      : Math.floor(92 + Math.random() * 7);
    const semanticPassed = semanticScore >= 80;

    // Serialized Engine Payload
    const serializedPayload = {
      engine,
      dimensions: `${dimensions.w}x${dimensions.h}`,
      aspectRatio,
      pixelVolume: dimensions.pixels,
      prompt,
      negativePrompt,
      stylePreset,
      seed,
      cfgScale,
      steps,
      gatewayConfig: {
        connectTimeoutBufferSec: connectTimeout,
        readTimeoutSec: readTimeout,
        exponentialBackoffJitter: enableJitter,
      },
    };

    return res.json({
      success: true,
      data: {
        id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: prompt.slice(0, 36) || 'Synthesized Artwork',
        prompt,
        negativePrompt,
        stylePreset,
        engine,
        aspectRatio,
        width: dimensions.w,
        height: dimensions.h,
        seed,
        cfgScale,
        steps,
        timestamp: new Date().toISOString(),
        securityGates: {
          gate1Passed: true,
          gate1Status: 'passed',
          gate1ComputeCost: 0.0,
          gate2Passed: !isGate2Blocked,
          gate2Status: isGate2Blocked ? 'moderation_blocked' : 'passed',
          gate2ComputeCost: isGate2Blocked ? 0.042 : 0.038,
          gate2Reason: isGate2Blocked
            ? 'Gate 2 Post-Generation Filter: Output safety scanner flagged finish_reason=FILTER. Full GPU compute cost incurred ($0.042). Displaying blurred placeholder.'
            : undefined,
        },
        streamMetrics: {
          chunkSize,
          totalBytes: simulatedRawBytes,
          chunksCount,
          streamDurationMs,
          peakMemoryMB: 0.065, // ~65.5 KB buffer
          traditionalRamMB: 10.4, // ~10.4 MB if loaded at once
          transferRateKBps: Math.round((simulatedRawBytes / 1024 / streamDurationMs) * 1000),
          memorySavingsPercent: 99.3,
        },
        integrity: integrityResult,
        qa: {
          aestheticScore,
          aestheticPassed,
          aestheticBreakdown: {
            composition: Math.round((8.9 + Math.random() * 0.9) * 10) / 10,
            lighting: Math.round((9.0 + Math.random() * 0.9) * 10) / 10,
            sharpness: Math.round((8.8 + Math.random() * 0.9) * 10) / 10,
            colorHarmonics: Math.round((8.9 + Math.random() * 0.9) * 10) / 10,
          },
          semanticScore,
          semanticPassed,
          promptKeyElements: [
            { element: 'Primary subject focal point', matched: !simulateCorruptStream },
            { element: 'Lighting & atmosphere parameters', matched: !simulateCorruptStream },
            { element: 'Style preset adherence', matched: !simulateCorruptStream },
          ],
          divergenceFlagged: simulateCorruptStream,
          recommendation:
            aestheticPassed && semanticPassed && !isGate2Blocked
              ? 'approved'
              : 'regenerate',
        },
        serializedPayload,
        backoffTable,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Pipeline error:', error);
    res.status(500).json({ error: error.message || 'Pipeline execution failed' });
  }
});

// Endpoint: Code Generation for Blender 3.18+ / 4.x Python bpy script
app.post('/api/export/blender', (req, res) => {
  const { title = 'Cyberpunk_Asset', width = 1344, height = 768, prompt = '' } = req.body;
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9_]/g, '_');

  const pythonScript = `"""
DecodeLabs Multimodal AI Studio - Blender Pipeline Export
Project 3: Visual Orchestration & Nanite In-App Automation
Target: Blender 3.18+ / Blender 4.x
Resolution: ${width}x${height}
Prompt: ${prompt.replace(/"/g, '\\"')}
"""
import bpy
import os

def setup_multimodal_asset_material():
    asset_name = "${sanitizedTitle}"
    
    # 1. Create or retrieve active mesh
    obj = bpy.context.active_object
    if not obj or obj.type != 'MESH':
        print("[DecodeLabs Pipeline] No active mesh selected. Creating target quad...")
        bpy.ops.mesh.primitive_plane_add(size=2.0)
        obj = bpy.context.active_object
        obj.name = f"{asset_name}_Quad"
    
    # Set physical dimensions matching aspect ratio (${width}:${height})
    obj.scale.x = ${width} / 1000.0
    obj.scale.y = ${height} / 1000.0
    
    # 2. Setup Material with Principled BSDF node setup
    mat = bpy.data.materials.new(name=f"M_{asset_name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    # Node Graph
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
    
    # Link Nodes
    links.new(node_coord.outputs['UV'], node_mapping.inputs['Vector'])
    links.new(node_mapping.outputs['Vector'], node_tex.inputs['Vector'])
    links.new(node_tex.outputs['Color'], node_bsdf.inputs['Base Color'])
    links.new(node_bsdf.outputs['BSDF'], node_out.inputs['Surface'])
    
    # Assign material to object
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
        
    print(f"[DecodeLabs Pipeline] Material M_{asset_name} successfully linked to {obj.name}!")

if __name__ == "__main__":
    setup_multimodal_asset_material()
`;

  res.json({ script: pythonScript, filename: `${sanitizedTitle}_blender.py` });
});

// Endpoint: Unreal Engine 5 Nanite Auto-LOD configuration
app.post('/api/export/ue5', (req, res) => {
  const { title = 'Cyberpunk_Asset', width = 1344, height = 768 } = req.body;
  const config = {
    pipeline: 'DecodeLabs Project 3 Enterprise Exporter',
    targetEngine: 'Unreal Engine 5.4+ / 5.5',
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
      assetName: `SM_${title.replace(/[^a-zA-Z0-9_]/g, '_')}`,
      resolution: `${width}x${height}`,
      importPath: `/Game/AI_Generated/Project3/${title}/`,
    },
  };
  res.json({ config, filename: `${title}_UE5_Nanite_Config.json` });
});

// Start Vite in middleware mode
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DecodeLabs Studio] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
