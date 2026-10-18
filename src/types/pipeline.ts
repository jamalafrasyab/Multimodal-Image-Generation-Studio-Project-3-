export type EngineId = 'gemini-imagen' | 'gpt-image' | 'stable-image-core' | 'wan-t2i-v2';

export interface EngineSpec {
  id: EngineId;
  name: string;
  provider: string;
  constraint: string;
  charLimit: number;
  outputFormat: 'b64_json' | 'raw_bytes' | 'url';
  color: string;
  endpointMock: string;
  supportedRatios: string[];
}

export type AspectRatioId = '16:9' | '1:1' | '9:16' | '4:3' | '3:4';

export interface AspectRatioSpec {
  id: AspectRatioId;
  label: string;
  ratio: string;
  width: number;
  height: number;
  totalPixels: number;
  targetUse: string;
}

export interface SecurityGateResult {
  gate1Passed: boolean;
  gate1Status: 'passed' | 'sentinel_block' | 'content_policy_violation';
  gate1ComputeCost: number; // $0.00
  gate1Reason?: string;
  
  gate2Passed: boolean;
  gate2Status: 'passed' | 'moderation_blocked' | 'finish_reason_filter';
  gate2ComputeCost: number; // Full cost incurred
  gate2Reason?: string;
}

export interface StreamMetrics {
  chunkSize: number; // 65,536 bytes (65.5KB)
  totalBytes: number;
  chunksCount: number;
  streamDurationMs: number;
  peakMemoryMB: number; // Safe ~0.5MB vs single-load 10MB
  traditionalRamMB: number; // ~10MB
  transferRateKBps: number;
  memorySavingsPercent: number;
}

export interface IntegrityVerificationResult {
  superficialHeaderCheck: {
    passed: boolean;
    method: 'imghdr.what()' | 'Pillow: Image.verify()';
    message: string;
  };
  rigorousPixelDecode: {
    passed: boolean;
    method: 'Image.open().load() full pixel buffer';
    message: string;
    pixelsDecodedCount: number;
    corruptedAtByte?: number;
  };
  detectedPrematureCutoff: boolean;
  autoRecoveryTriggered: boolean;
}

export interface QAReport {
  aestheticScore: number; // 0.0 to 10.0 (Threshold: 7.0)
  aestheticPassed: boolean;
  aestheticBreakdown: {
    composition: number;
    lighting: number;
    sharpness: number;
    colorHarmonics: number;
  };
  semanticScore: number; // 0 to 100% (PickScore / CLIP-IQA)
  semanticPassed: boolean;
  promptKeyElements: { element: string; matched: boolean }[];
  divergenceFlagged: boolean;
  recommendation: 'approved' | 'regenerate' | 'aesthetic_warning';
}

export interface ArtworkAsset {
  id: string;
  title: string;
  prompt: string;
  negativePrompt: string;
  stylePreset: string;
  engine: EngineId;
  aspectRatio: AspectRatioId;
  width: number;
  height: number;
  seed: number;
  cfgScale: number;
  steps: number;
  imageUrl: string;
  timestamp: string;
  securityGates: SecurityGateResult;
  streamMetrics: StreamMetrics;
  integrity: IntegrityVerificationResult;
  qa: QAReport;
  serializedPayload: Record<string, unknown>;
  isCorruptedSimulation?: boolean;
}

export interface GenerationRequestParams {
  prompt: string;
  negativePrompt: string;
  engine: EngineId;
  aspectRatio: AspectRatioId;
  stylePreset: string;
  seed?: number;
  cfgScale?: number;
  steps?: number;
  connectTimeout?: number; // 3.05s buffer
  readTimeout?: number; // 60s
  enableJitter?: boolean;
  simulateCorruptStream?: boolean;
  simulateSafetyViolation?: 'none' | 'gate1_sentinel' | 'gate2_moderation';
}
