import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Terminal,
  Cpu,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';

interface SlideData {
  number: number;
  title: string;
  category: string;
  keyRule?: string;
  content: string[];
  codeSnippet?: string;
  diagramDetails?: {
    label: string;
    description: string;
  }[];
}

const SLIDES: SlideData[] = [
  {
    number: 1,
    title: 'Generative AI // Project 3: Industrial Training Kit',
    category: 'Welcome & Overview',
    content: [
      'Batch: 2026 | Powered by DecodeLabs',
      'Track: Multimodal Image Generation Studio',
      'Foundational milestone for Generative AI Engineers mastering Visual Orchestration and production pipelines.',
    ],
  },
  {
    number: 2,
    title: 'Welcome to the Team! 🚀',
    category: 'Mission Briefing',
    keyRule:
      'This track isn\'t about "just looking at cool pictures"—it\'s about Visual Orchestration through pure programmatic control.',
    content: [
      'Step into the role of a Generative AI Engineer at DecodeLabs.',
      'Before deploying full-scale multimodal applications or creative AI tools, you must master integrating frontier text-to-image APIs (DALL-E 3, gpt-image, Stable Diffusion, Wan v2, Imagen).',
      'Configure exact parameter payloads for strict resolution and aspect ratios.',
      'Handle binary image streams or URLs to display them seamlessly to users.',
    ],
  },
  {
    number: 3,
    title: 'Project 3: Multimodal Image Generation Studio',
    category: 'Requirements & Goals',
    content: [
      'Goal: Build a visual application that translates natural language text descriptions into high-quality digital artwork.',
      'Key Requirement 1: Integrate an image generation API (like DALL-E 3, gpt-image, Stable Diffusion, Imagen).',
      'Key Requirement 2: Set up parameter payloads for image resolution, aspect ratio, and generation count.',
      'Key Requirement 3: Download resulting binary image data or URL and display it cleanly to the user.',
      'Key Skills: Text-to-image APIs, handling image URLs/binary streams, design parameters.',
    ],
  },
  {
    number: 4,
    title: 'A Technical Blueprint for Production-Grade AI Pipelines',
    category: 'Architecture',
    content: [
      'Moving beyond toy scripts to industrial, fault-tolerant, resilient pipelines.',
      'Handling latency spikes, network severance, moderation rejections, and binary chunking.',
    ],
  },
  {
    number: 5,
    title: 'The Architecture of the Automated Design Studio',
    category: '3-Phase Pipeline',
    keyRule:
      'Key Architecture Insight: Diffusion models treat text prompts not as literal instructions, but as high-dimensional semantic vectors guiding a reverse-Markov denoising process. Our pipeline must orchestrate this stateful transformation predictably.',
    content: [
      '[INPUT PHASE]: Capturing structural parameters (prompts, negative prompts, resolution variables) and serializing the multimodal payload.',
      '[PROCESS PHASE]: Coordinating the network request, managing split-timeouts, navigating security gates, and executing the reverse-Markov denoising loop.',
      '[OUTPUT PHASE]: Retrieving generated assets via memory-safe streaming, verifying binary integrity, and writing safely to storage.',
    ],
  },
  {
    number: 6,
    title: 'Navigating the Multimodal Engine Matrix',
    category: 'Engine Specifications',
    content: [
      'gpt-image- series (Azure / OpenAI Foundry): Constraint: DALL-E 3 retired March 2026; enterprise systems must migrate to gpt-image. Limit: 4,000 chars. Output: Base64 JSON (b64_json).',
      'Stable Image Core (Stability AI): Constraint: Optimized for fast, high-quality REST v2beta iteration. Limit: 10,000 chars. Output: RAW Image Bytes or Base64 JSON.',
      'Wan Text-to-Image v2 (Alibaba Cloud): Constraint: Supports artistic and photorealistic standard resolution. Limit: 1,000 chars. Output: Public Image URL or PNG Binary.',
    ],
  },
  {
    number: 7,
    title: 'Translating Aspect Ratios into Exact Pixel Payloads',
    category: 'Payload Formulation',
    keyRule:
      'CRITICAL ARCHITECTURE RULE: Passing unsupported dimensions causes immediate API handshake failure. Always map user intent to exact strict resolution variables before transmitting the payload.',
    content: [
      '[16:9 Landscape]: 1344 x 768 px | Total Pixel Volume: 1,032,192 px | Target: Web banners, presentations.',
      '[1:1 Square]: 1024 x 1024 px | Total Pixel Volume: 1,048,576 px | Target: Avatars, product grids.',
      '[9:16 Vertical]: 768 x 1344 px | Total Pixel Volume: 1,032,192 px | Target: Mobile reels, wallpapers.',
    ],
  },
  {
    number: 8,
    title: 'The Danger of the Default Network Gateway',
    category: 'Network Resilience',
    keyRule:
      'SYSTEM DEFAULT: The Python requests library applies NO timeouts by default. A basic requests.get() waits forever if remote servers drop connection.',
    content: [
      '[ERROR: HANGING_REQUEST]: The program waits forever if a remote server drops the connection.',
      '[ERROR: RESOURCE_DRAIN]: Open TCP connections progressively consume system memory and CPU threads.',
      '[ERROR: POOR_UX]: Real-time application locks up without surfacing exceptions to the user.',
    ],
  },
  {
    number: 9,
    title: 'Implementing the Split-Timeout Timeline',
    category: 'Network Resilience',
    codeSnippet: 'requests.post(url, payload, timeout=(3.05, 60))',
    content: [
      'Connection Timeout (3.05s buffer): Establishes TCP connection. The 0.05s buffer accommodates standard TCP packet retransmission delays.',
      'Read Timeout (60s - 120s): Accommodates the slow, iterative diffusion matrix generation process across remote GPU clusters.',
    ],
  },
  {
    number: 10,
    title: 'The Exception Handling Matrix',
    category: 'Error Diagnostics',
    content: [
      '[NETWORK FAILURE]: Exception: requests.exceptions.ConnectTimeout | Diagnosis: Client cannot establish TCP connection. Indicates network routing issues, strict firewalls, or downed server. | Architecture Rule: FAIL FAST. Do not wait.',
      '[INFERENCE FAILURE]: Exception: requests.exceptions.ReadTimeout | Diagnosis: Connection succeeded, but server took too long to send data. Indicates overloaded GPU clusters or massive response payloads. | Architecture Rule: Keep connection alive longer; prepare for secondary retries.',
    ],
  },
  {
    number: 11,
    title: 'Resilience via Exponential Backoff and Jitter',
    category: 'Network Resilience',
    keyRule:
      'Rationale: Do not hammer a dying server with instant, aggressive retries.',
    content: [
      'Rule 1: Use exponential backoff to give the remote infrastructure breathing room (t = base * 2^attempt).',
      'Rule 2: Introduce "jitter" (randomized delays) to prevent synchronized bot-swarms from locking up the API gateway.',
      'Rule 3: Apply retries selectively based on the HTTP response (e.g., retry on 429 Too Many Requests or 503 Service Unavailable).',
    ],
  },
  {
    number: 12,
    title: 'Navigating the Dual Security Gates',
    category: 'Safety & Moderation',
    keyRule:
      'Architecture Rule: Catch safety-related exceptions gracefully to prevent application crashes and surface polite warnings to the end-user.',
    content: [
      'GATE 1: Pre-Generation (Input Filtering) -> Rejection Trace: sentinel_block or content_policy_violation -> Compute Impact: 0 compute cost incurred. Instant rejection.',
      'GATE 2: Post-Generation (Output Filtering) -> Rejection Trace: moderation_blocked or finish_reason=FILTER -> Compute Impact: Compute cost fully incurred. Generates a blurred placeholder or truncated response.',
    ],
  },
  {
    number: 13,
    title: 'Memory-Safe Streaming for Binary Payloads',
    category: 'Transport Protocol',
    content: [
      'The Anti-Pattern: Loading 10MiB raw image bytes entirely into RAM at once using a basic requests.get().',
      'The Solution: Pipe 65.5KB binary chunks sequentially directly to local storage / blob destination.',
      'Rule 1: Never load high-res images entirely into RAM at once.',
      'Rule 2: Enable chunking by setting stream=True in request parameters.',
      'Rule 3: Write sequentially using iter_content(chunk_size=65536) to pipe data safely directly to the local binary file system.',
    ],
  },
  {
    number: 14,
    title: 'The Threat of the Truncated Data Stream',
    category: 'Data Integrity',
    keyRule:
      'THE TRAP: Standard metadata checks and verify() only read the block structure and CRC headers at the very beginning of the file. They report a success even if the connection dropped mid-download, resulting in a silent, truncated disaster.',
    content: [
      'Readout 1: imghdr.what() -> Returns "Valid PNG"',
      'Readout 2: Pillow: Image.verify() -> Returns "Valid Checksum"',
      'Result: Application displays grey / broken glitched visual artifact without throwing any caught exception!',
    ],
  },
  {
    number: 15,
    title: 'Forcing a Rigorous Pixel-Level Decode',
    category: 'Data Integrity',
    codeSnippet: 'try:\n    Image.open(file_path).load()\nexcept OSError:\n    # Auto-discard and trigger automated retry\n    retry_pipeline()',
    content: [
      'Implementation: To guarantee file integrity, the pipeline must execute Image.open().load() wrapped inside a try...except block.',
      'Mechanism: Calling .load() forces Pillow to fully decode the entire image stream, pixel by pixel, rather than just reading headers.',
      'Outcome: If the file cut off prematurely, this accurately triggers an "OSError: broken data stream", allowing the pipeline to discard the corrupted asset and automatically request a retry.',
    ],
  },
  {
    number: 16,
    title: 'Automated QA: Aesthetic and Semantic Alignment',
    category: 'Quality Assurance',
    content: [
      'Lens 1: Aesthetic Classification -> Process: Image converted to vector embedding via OpenAI CLIP ViT-L/14. Evaluated by linear classifier. -> Threshold: Score must be > 7.0 / 10.0. -> Action: Assets scoring below threshold are automatically discarded.',
      'Lens 2: Semantic Alignment Verification -> Process: Image and original text prompt fed into PickScore or CLIP-IQA. -> Function: Measures how accurately visual output aligns with requested prompt. -> Action: Flags hallucinated or divergent assets for regeneration.',
    ],
  },
  {
    number: 17,
    title: 'The Complete Project 3 Blueprint',
    category: 'Pipeline Architecture',
    content: [
      '1. Prompt Payload Formulation (Aspect Ratio Maps & Constraints Applied)',
      '2. Network API Gateway (Dual-timeout policy: 3.05s Connect / 60s Read)',
      '3. Security & Moderation Gates (Input & Output Safety Filters)',
      '4. Transport Protocol (Memory-safe 65.5KB chunked binary streaming)',
      '5. Integrity Verification (Forced .load() pixel decode, local storage write)',
      '6. Automated Quality Assurance (CLIP ViT-L/14 Aesthetic Scorer & Semantic Alignment)',
    ],
  },
  {
    number: 18,
    title: 'Enterprise Scaling and Workflow Integration',
    category: 'Production Integration',
    keyRule:
      'Mission Statement: "By mastering multimodal orchestration, high-throughput parsing, and binary stream verification, you are not just writing scripts—you are architecting the foundation of a modern automated design studio."',
    content: [
      'Unreal Engine 5: Exporting generated assets for native Nanite integration. Auto-optimizes high-poly AI assets with no manual LODs required. LiveLink / Blueprint.',
      'Blender: Integrating directly via Python APIs (bpy) for in-app generation and material application to local meshes.',
      'Polycam: Combining AI-generated asset variations with real-world 3D scanned reference objects.',
    ],
  },
  {
    number: 19,
    title: 'Conclusion',
    category: 'Summary',
    content: [
      'The absolute best way to master Multimodal AI Engineering is through hands-on API manipulation, not just theory.',
      'Experiment with unique solutions—like setting up an automated download pipeline that saves high-resolution assets locally, or adding style preset parameters (cyberpunk, minimalism) to your payload.',
      'Treat every corrupted image binary or timed-out API request as a valuable learning opportunity.',
      'Your journey to becoming a professional AI Engineer reaches a definitive peak right here, right now, with the very first image payload you deploy today.',
    ],
  },
  {
    number: 20,
    title: 'DecodeLabs // Training Support & Contact',
    category: 'DecodeLabs Info',
    content: [
      '📞 Phone: +91 9236011887',
      '✉ Email: decodelabs.tech@gmail.com',
      '🌎 Web: www.decodelabs.tech',
      '📍 Location: Greater Lucknow, India',
    ],
  },
];

export const SlideDeckGuide: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = SLIDES[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-400 text-slate-950 font-bold uppercase">
              DecodeLabs Kit
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Slide {slide.number} of {SLIDES.length}
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1 font-['Space_Grotesk']">
            {slide.title}
          </h2>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-cyan-400 px-2 font-bold">
            {currentSlideIndex + 1} / {SLIDES.length}
          </span>
          <button
            type="button"
            disabled={currentSlideIndex === SLIDES.length - 1}
            onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Display Card */}
      <div className="bg-gradient-to-b from-[#0b0f17] to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            {slide.category}
          </span>
          <span className="text-xs font-mono text-slate-500">
            DECODELABS BATCH 2026 // PROJECT 3
          </span>
        </div>

        {/* Key Rule Callout if exists */}
        {slide.keyRule && (
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs flex items-start gap-3">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-cyan-300 font-mono uppercase text-[10px] block mb-0.5">
                Core Architectural Rule:
              </strong>
              {slide.keyRule}
            </div>
          </div>
        )}

        {/* Content list */}
        <div className="space-y-3">
          {slide.content.map((point, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-md bg-cyan-950 text-cyan-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* Code snippet if applicable */}
        {slide.codeSnippet && (
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Production Implementation Code:
            </span>
            <pre className="p-4 rounded-xl bg-black/70 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              {slide.codeSnippet}
            </pre>
          </div>
        )}

        {/* Slide 20 Contact Details Card */}
        {slide.number === 20 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+91 9236011887</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>decodelabs.tech@gmail.com</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>www.decodelabs.tech</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Greater Lucknow, India</span>
            </div>
          </div>
        )}
      </div>

      {/* Slide Thumbnails Quick Scroller */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {SLIDES.map((s, idx) => (
            <button
              key={s.number}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                currentSlideIndex === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Slide {s.number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
