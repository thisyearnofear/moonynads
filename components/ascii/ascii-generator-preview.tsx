"use client";

import { useState } from "react";
import {
  useAsciiGenerator,
  getAvailableBaseDesigns,
} from "@/hooks/ascii/use-ascii-generator";
import { ASCIIAnimator } from "./ascii-animator";
import { useAnimationState } from "@/hooks/ui/use-animation-state";
// Basic HTML elements instead of shadcn/ui components to prevent bloat

export function AsciiGeneratorPreview() {
  // Nested component for AI Assist to keep file self-contained
  function AIAssist({ availableDesignIds, onApply, onApplyAndGenerate }: { availableDesignIds: string[]; onApply: (s: { baseDesign: string; variation: 'subtle'|'moderate'|'dramatic'; complexity: number; seed?: string; rationale?: string }) => void; onApplyAndGenerate?: (s: { baseDesign: string; variation: 'subtle'|'moderate'|'dramatic'; complexity: number; seed?: string; rationale?: string }) => void }) {
    const [idea, setIdea] = useState('Lunar eclipse with dramatic contrast and geometric feel')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [suggestion, setSuggestion] = useState<{ baseDesign: string; variation: 'subtle'|'moderate'|'dramatic'; complexity: number; seed?: string; rationale?: string } | null>(null)
    const [streamText, setStreamText] = useState('')
    const [model, setModel] = useState<string>(() => typeof window !== 'undefined' ? (localStorage.getItem('rw_model') || 'kimi-k2-0905:free') : 'kimi-k2-0905:free')

    function extractJson(text: string): any | null {
      if (!text) return null
      // strip code fences if present
      const fenced = text.match(/```(?:json)?\n([\s\S]*?)```/i)
      const body = fenced ? fenced[1] : text
      try { return JSON.parse(body) } catch {}
      // try to find a JSON object in text
      const braceStart = body.indexOf('{')
      const braceEnd = body.lastIndexOf('}')
      if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
        const maybe = body.slice(braceStart, braceEnd + 1)
        try { return JSON.parse(maybe) } catch {}
      }
      return null
    }

    async function ask() {
      setStreamText('')
      try {
        // Attempt streaming first
        setLoading(true)
        setError('')
        setSuggestion(null)
        const system = `You are an assistant that maps user ideas to ASCII generator parameters.\nReturn ONLY JSON with keys: baseDesign, variation, complexity, seed(optional), rationale(optional).\n- baseDesign must be one of: ${availableDesignIds.join(', ')}\n- variation must be one of: subtle | moderate | dramatic\n- complexity must be an integer between 1 and 10.\n- Make reasonable choices based on the idea.\nOutput final JSON at the end.`

        const res = await fetch('/api/routeway/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: idea }
            ]
          })
        })
        if (res.ok && res.body) {
          const reader = res.body.getReader()
          const decoder = new TextDecoder()
          let accumulated = ''
          while (true) {
            const { value, done } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            // Extract content deltas if present. We assume OpenAI-like SSE with data: {choices:[{delta:{content}}]}
            const lines = chunk.split(/\r?\n/).filter(Boolean)
            for (const line of lines) {
              if (!line.startsWith('data:')) continue
              const payload = line.replace(/^data:\s*/, '')
              if (payload === '[DONE]') continue
              try {
                const obj = JSON.parse(payload)
                const piece = obj?.choices?.[0]?.delta?.content ?? ''
                if (piece) {
                  accumulated += piece
                  setStreamText(prev => prev + piece)
                  const parsed = extractJson(accumulated)
                  if (parsed) {
                    // validate and set suggestion immediately
                    const bd = typeof parsed.baseDesign === 'string' && availableDesignIds.includes(parsed.baseDesign) ? parsed.baseDesign : availableDesignIds[0]
                    const vv = parsed.variation
                    const v: 'subtle'|'moderate'|'dramatic' = vv === 'dramatic' ? 'dramatic' : vv === 'moderate' ? 'moderate' : 'subtle'
                    const cx = Math.max(1, Math.min(10, parseInt(String(parsed.complexity || 5))))
                    const s = typeof parsed.seed === 'string' ? parsed.seed : `ai-${Date.now()}`
                    setSuggestion({ baseDesign: bd, variation: v, complexity: cx, seed: s, rationale: parsed.rationale })
                  }
                }
              } catch {}
            }
          }
          setLoading(false)
          if (!suggestion) {
            // If we didn't parse during stream, try once at the end
            const parsed = extractJson(accumulated)
            if (parsed) {
              const bd = typeof parsed.baseDesign === 'string' && availableDesignIds.includes(parsed.baseDesign) ? parsed.baseDesign : availableDesignIds[0]
              const vv = parsed.variation
              const v: 'subtle'|'moderate'|'dramatic' = vv === 'dramatic' ? 'dramatic' : vv === 'moderate' ? 'moderate' : 'subtle'
              const cx = Math.max(1, Math.min(10, parseInt(String(parsed.complexity || 5))))
              const s = typeof parsed.seed === 'string' ? parsed.seed : `ai-${Date.now()}`
              setSuggestion({ baseDesign: bd, variation: v, complexity: cx, seed: s, rationale: parsed.rationale })
            } else {
              setError('Stream ended without valid JSON')
            }
          }
          return
        }
        // Fallback to non-streaming
        const res2 = await fetch('/api/routeway/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: idea }
            ]
          })
        })
        const json = await res2.json()
        if (!res2.ok) throw new Error(json?.error || 'AI request failed')
        const content = json?.choices?.[0]?.message?.content || ''
        const parsed = extractJson(content)
        if (!parsed) throw new Error('Could not parse AI JSON response')
        const bd = typeof parsed.baseDesign === 'string' && availableDesignIds.includes(parsed.baseDesign) ? parsed.baseDesign : availableDesignIds[0]
        const vv = parsed.variation
        const v: 'subtle'|'moderate'|'dramatic' = vv === 'dramatic' ? 'dramatic' : vv === 'moderate' ? 'moderate' : 'subtle'
        const cx = Math.max(1, Math.min(10, parseInt(String(parsed.complexity || 5))))
        const s = typeof parsed.seed === 'string' ? parsed.seed : `ai-${Date.now()}`
        const sug = { baseDesign: bd, variation: v, complexity: cx, seed: s, rationale: parsed.rationale }
        setSuggestion(sug)
      } catch (e: any) {
        setError(e?.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
      setLoading(true)
      setError('')
      setSuggestion(null)
      try {
        const system = `You are an assistant that maps user ideas to ASCII generator parameters.
Return ONLY JSON with keys: baseDesign, variation, complexity, seed(optional), rationale(optional).
- baseDesign must be one of: ${availableDesignIds.join(', ')}
- variation must be one of: subtle | moderate | dramatic
- complexity must be an integer between 1 and 10.
- Make reasonable choices based on the idea.
Example:
{"baseDesign":"moon","variation":"dramatic","complexity":8,"seed":"ai-idea-123","rationale":"High contrast lunar vibe"}`
        const res = await fetch('/api/routeway/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'kimi-k2-0905:free',
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: idea }
            ]
          })
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'AI request failed')
        const content = json?.choices?.[0]?.message?.content || ''
        const parsed = extractJson(content)
        if (!parsed) throw new Error('Could not parse AI JSON response')
        // validate
        const bd = typeof parsed.baseDesign === 'string' && availableDesignIds.includes(parsed.baseDesign) ? parsed.baseDesign : availableDesignIds[0]
        const vv = parsed.variation
        const v: 'subtle'|'moderate'|'dramatic' = vv === 'dramatic' ? 'dramatic' : vv === 'moderate' ? 'moderate' : 'subtle'
        const cx = Math.max(1, Math.min(10, parseInt(String(parsed.complexity || 5))))
        const s = typeof parsed.seed === 'string' ? parsed.seed : `ai-${Date.now()}`
        const sug = { baseDesign: bd, variation: v, complexity: cx, seed: s, rationale: parsed.rationale }
        setSuggestion(sug)
      } catch (e: any) {
        setError(e?.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="p-6 space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Describe your idea</label>
        <textarea className="w-full border rounded p-2 font-mono" rows={3} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="e.g., organic heart motif, moderate variation, medium detail" />
        <div className="flex flex-wrap gap-2 items-center">
          <select value={model} onChange={(e)=>{ setModel(e.target.value); try { localStorage.setItem('rw_model', e.target.value) } catch {} }} className="px-2 py-1 border rounded bg-white dark:bg-gray-700">
            <option value="kimi-k2-0905:free">Kimi K2 (free)</option>
            <option value="deepseek-chat">DeepSeek (if available)</option>
            <option value="glm-4">GLM-4 (if available)</option>
          </select>
          <button onClick={ask} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50">{loading ? 'Thinking…' : 'Suggest Settings'}</button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs opacity-80 mt-2">
          <span>Presets:</span>
          <button type="button" className="px-2 py-1 border rounded" onClick={()=>setIdea('Lunar eclipse, dramatic contrast, geometric')}>Lunar Eclipse</button>
          <button type="button" className="px-2 py-1 border rounded" onClick={()=>setIdea('Minimalist moon lattice, subtle, clean')}>Minimal Lattice</button>
          <button type="button" className="px-2 py-1 border rounded" onClick={()=>setIdea('Organic heart bloom, moderate detail, soft edges')}>Heart Bloom</button>
          <button type="button" className="px-2 py-1 border rounded" onClick={()=>setIdea('Chudnovsky numeric texture, high complexity, dramatic')}>Chudnovsky Texture</button>
        </div>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        {streamText && (
          <pre className="text-xs bg-gray-50 dark:bg-gray-900 border rounded p-2 whitespace-pre-wrap max-h-32 overflow-auto">{streamText}</pre>
        )}
        {suggestion && (
          <div className="text-sm bg-gray-50 dark:bg-gray-900 border rounded p-3">
            <div>baseDesign: <strong>{suggestion.baseDesign}</strong></div>
            <div>variation: <strong>{suggestion.variation}</strong></div>
            <div>complexity: <strong>{suggestion.complexity}</strong></div>
            {suggestion.seed && <div>seed: <span className="font-mono">{suggestion.seed}</span></div>}
            {suggestion.rationale && <div className="mt-2 opacity-80">{suggestion.rationale}</div>}
            <div className="mt-3 flex gap-2">
              <button onClick={() => onApply(suggestion)} className="px-3 py-1.5 bg-blue-600 text-white rounded">Apply</button>
              {onApplyAndGenerate && (
                <button onClick={() => onApplyAndGenerate(suggestion)} className="px-3 py-1.5 bg-green-600 text-white rounded">Apply & Generate</button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
  const { ascii, isGenerating, error, generate, lastParams } =
    useAsciiGenerator();
  const animationState = useAnimationState();

  const [baseDesign, setBaseDesign] = useState("moon");
  const [variation, setVariation] = useState<
    "subtle" | "moderate" | "dramatic"
  >("subtle");
  const [complexity, setComplexity] = useState(3);
  const [seed, setSeed] = useState(`preview-${Date.now()}`);

  const availableDesigns = getAvailableBaseDesigns();

  const handleGenerate = async () => {
    await generate({
      seed,
      baseDesign,
      variation,
      complexity,
      preserveTheme: true,
    });
  };

  const handleRandomize = () => {
    const randomDesign =
      availableDesigns[Math.floor(Math.random() * availableDesigns.length)].id;
    const randomVariation = ["subtle", "moderate", "dramatic"][
      Math.floor(Math.random() * 3)
    ] as any;
    const randomComplexity = Math.floor(Math.random() * 8) + 3;
    const randomSeed = `random-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    setBaseDesign(randomDesign);
    setVariation(randomVariation);
    setComplexity(randomComplexity);
    setSeed(randomSeed);
  };

  const handleDownload = () => {
    if (ascii) {
      const blob = new Blob([ascii.art], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascii-${baseDesign}-${seed}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Convert ASCII art to data URI for ASCIIAnimator
  const getAsciiDataUri = (art: string) => {
    return `data:text/plain;charset=utf-8,${encodeURIComponent(art)}`;
  };

  return (
    <div className="space-y-6">
      {/* AI Assist Panel integrated with Routeway (Kimi K2) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Assist</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Describe what you want and AI will suggest generator settings.</p>
        </div>
        <AIAssist
          availableDesignIds={availableDesigns.map(d => d.id)}
          onApply={(s) => {
            setBaseDesign(s.baseDesign)
            setVariation(s.variation)
            setComplexity(s.complexity)
            if (s.seed) setSeed(s.seed)
          }}
          onApplyAndGenerate={(s) => {
            setBaseDesign(s.baseDesign)
            setVariation(s.variation)
            setComplexity(s.complexity)
            if (s.seed) setSeed(s.seed)
            setTimeout(() => handleGenerate(), 0)
          }}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ASCII Art Generator
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate unique ASCII art variations based on existing pant designs
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="base-design"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Base Design
              </label>
              <select
                id="base-design"
                value={baseDesign}
                onChange={(e) => setBaseDesign(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDesigns.map((design) => (
                  <option key={design.id} value={design.id}>
                    {design.name} ({design.rarity})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="variation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Variation Level
              </label>
              <select
                id="variation"
                value={variation}
                onChange={(e) =>
                  setVariation(
                    e.target.value as "subtle" | "moderate" | "dramatic"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="subtle">Subtle (1-2 changes)</option>
                <option value="moderate">Moderate (3-5 changes)</option>
                <option value="dramatic">Dramatic (6+ changes)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="complexity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Complexity: {complexity}
            </label>
            <input
              id="complexity"
              type="range"
              min={1}
              max={10}
              step={1}
              value={complexity}
              onChange={(e) => setComplexity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Higher complexity adds more variations and details
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="seed"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Generation Seed
            </label>
            <div className="flex gap-2">
              <input
                id="seed"
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seed for deterministic generation"
              />
              <button
                type="button"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSeed(`seed-${Date.now()}`)}
              >
                ↻
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isGenerating ? "Generating..." : "Generate ASCII"}
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🔀 Randomize
            </button>
            {ascii && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ⬇ Download
              </button>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          )}
        </div>
      </div>

      {ascii && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generated ASCII Art
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Variation of{" "}
              {availableDesigns.find((d) => d.id === baseDesign)?.name} with{" "}
              {variation} changes
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm whitespace-pre overflow-x-auto">
                {ascii.art}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Base Design:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ascii.metadata.baseDesign}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Variation:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ascii.metadata.variation}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Changes:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ascii.metadata.changes}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Theme Preservation:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {Math.round(ascii.metadata.themePreservation * 100)}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Animation Preview
                </h4>
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
                  <ASCIIAnimator
                    src={getAsciiDataUri(ascii.art)}
                    pantId={baseDesign}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {lastParams && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generation Parameters
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Settings used for the last generation
            </p>
          </div>
          <div className="p-6">
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-900 dark:text-white">
              {JSON.stringify(lastParams, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
