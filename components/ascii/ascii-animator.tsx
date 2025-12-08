"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAnimationState } from "@/hooks/ui/use-animation-state";
import { useAnimationRecorder } from "@/hooks/ui/use-animation-recorder";
import { useAnimationUpload } from "@/hooks/ui/use-animation-upload";
import { useEmojiSubstitution } from "@/hooks/ascii/use-emoji-substitution";

interface ASCIIAnimatorProps {
  src: string;
  pantId?: string;
}

export function ASCIIAnimator({ src, pantId }: ASCIIAnimatorProps) {
  const [text, setText] = useState("");
  const animState = useAnimationState(pantId);
  const recorder = useAnimationRecorder();
  const upload = useAnimationUpload();
  const emojiSubstitution = useEmojiSubstitution(text);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const [interactive, setInteractive] = useState(true);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameRate, setFrameRate] = useState(4);
  const timeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerXRef = useRef(0.5);
  const pointerYRef = useRef(0.5);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 640, h: 240 });

  useEffect(() => {
    let active = true;
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        if (!active) return;
        setText(t.replace(/\r\n/g, "\n"));
      });
    return () => {
      active = false;
    };
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    const dir = src.substring(0, src.lastIndexOf("/"));
    const base = src.substring(src.lastIndexOf("/") + 1, src.lastIndexOf("."));
    const prefix = `${dir}/${base}-frame-`;
    const attempts = Array.from(
      { length: 24 },
      (_, i) => `${prefix}${i + 1}.txt`
    );
    Promise.all(
      attempts.map(async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return "";
          const body = await res.text();
          return body.replace(/\r\n/g, "\n");
        } catch {
          return "";
        }
      })
    ).then((list) => {
      if (cancelled) return;
      const valid = list.filter((f) => f && f.trim().length > 0);
      setFrames(valid);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const loop = (t: number) => {
      if (!paused) timeRef.current = t;
      if (!paused) setTick((v) => (v + 1) % 1000000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused]);

  // Animation always uses original ASCII, unaffected by emoji substitution
  const activeText = useMemo(() => {
    let baseText = text;
    if (animState.mode === "frameCycle" && frames.length > 0) {
      const sec = timeRef.current / 1000;
      const idx = Math.floor(sec * Math.max(0.5, frameRate)) % frames.length;
      baseText = frames[idx];
    }
    return baseText;
  }, [animState.mode, frames, frameRate, text, tick]);


  const lines = useMemo(() => activeText.split("\n"), [activeText]);

  const baseColorClass = useMemo(() => {
    if (animState.palette === "yellow")
      return "text-yellow-700 dark:text-yellow-500";
    if (animState.palette === "green")
      return "text-green-700 dark:text-green-500";
    if (animState.palette === "blue") return "text-blue-700 dark:text-blue-400";
    return "text-foreground";
  }, [animState.palette]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    pointerXRef.current = nx;
    const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    pointerYRef.current = ny;
  };

  const renderLineHTML = (line: string, i: number) => {
    const t = timeRef.current * 0.002 * animState.speed;
    const phaseScale = interactive ? 0.5 + pointerXRef.current : 1;
    const amplScale = interactive ? 0.5 + pointerYRef.current : 1;
    let x = 0;
    let y = 0;
    if (animState.mode === "lineWave")
      x = Math.sin(t + i * 0.6 * phaseScale) * animState.amplitude * amplScale;
    if (animState.mode === "blockSway")
      x = Math.sin(t) * animState.amplitude * amplScale;
    if (animState.mode === "glitch")
      x =
        Math.sin(t * 2 + i * 1.3) * (animState.amplitude * 0.4) +
        (Math.random() - 0.5) * 2;
    const style: React.CSSProperties = {
      transform: `translate(${x}px, ${y}px)`,
    };
    if (
      (animState.mode === "colorCycle" || animState.palette === "rainbow") &&
      !animState.gradient
    ) {
      const hue = (t * 60 + i * 20) % 360;
      style.color = `hsl(${hue}, 80%, 60%)`;
    }
    if (animState.targetChar || animState.targetSet) {
      return (
        <div key={i} style={style} className="leading-[1.15]">
          {line.split("").map((ch, j) => {
            const isTarget =
              (animState.targetChar && ch === animState.targetChar) ||
              (animState.targetSet &&
                new Set(animState.targetSet.split("")).has(ch));
            const cs: React.CSSProperties = {};
            if (isTarget && !animState.gradient) {
              if (animState.palette === "rainbow") {
                const hue = (t * 60 + i * 20) % 360;
                cs.color = `hsl(${hue}, 90%, 60%)`;
              } else if (animState.palette === "yellow") {
                cs.color = `#f59e0b`;
              } else if (animState.palette === "green") {
                cs.color = `#22c55e`;
              } else if (animState.palette === "blue") {
                cs.color = `#3b82f6`;
              }
            }
            return (
              <span key={j} style={cs} className={ch.length > 1 || ch.codePointAt(0)! > 0xFFFF ? "text-[16px]" : "text-[20px]"}>
                {ch}
              </span>
            );
          })}
        </div>
      );
    }
    return (
      <div key={i} style={style} className="leading-[1.15]">
        {line.split('').map((ch, j) => (
          <span key={j} className={ch.length > 1 || ch.codePointAt(0)! > 0xFFFF ? "text-[16px]" : "text-[20px]"}>
            {ch}
          </span>
        ))}
      </div>
    );
  };

  const renderSVG = () => {
    const charHeight = 16;
    const padding = 20;
    const width = 480;
    const height = lines.length * charHeight + padding * 2;
    return (
      <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <style>{`
          .ascii { font-family: 'Courier New', monospace; font-size: 14px; fill: currentColor; }
          @keyframes sway { 0% { transform: translateX(-4px) } 100% { transform: translateX(4px) } }
          .line { animation: sway ${Math.max(
            1,
            4 / animState.speed
          )}s ease-in-out infinite alternate; }
        `}</style>
        <g>
          <text x={padding} y={padding + charHeight} className="ascii">
            {lines.map((line, i) => (
              <tspan
                key={i}
                x={padding}
                dy={i === 0 ? 0 : charHeight}
                className="line"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      </svg>
    );
  };

  useEffect(() => {
    const linesCount = lines.length;
    const maxLen = Math.max(1, ...lines.map((l) => l.length));
    // Use a slightly wider character width to account for emoji characters
    const charW = 14;
    const charH = 20;
    const pad = 20;
    const w = Math.max(400, maxLen * charW + pad * 2);
    const h = linesCount * charH + pad * 2;
    setCanvasSize({ w, h });
  }, [
    lines,
    animState.mode,
    animState.palette,
    animState.speed,
    animState.amplitude,
    animState.gradient,
    animState.targetChar,
    animState.targetSet,
  ]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = canvasSize.w;
    c.height = canvasSize.h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#0a0a0b";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, c.width - 2, c.height - 2);
    const pad = 20;
    const charH = 20;
    ctx.font = "20px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji Mozilla', 'Segoe UI Symbol', 'Symbola', 'Noto Sans', 'Courier New', monospace";
    const t = timeRef.current * 0.002 * animState.speed;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const phaseScale = interactive ? 0.5 + pointerXRef.current : 1;
      const amplScale = interactive ? 0.5 + pointerYRef.current : 1;
      let xOffset = 0;
      if (animState.mode === "lineWave")
        xOffset =
          Math.sin(t + i * 0.6 * phaseScale) * animState.amplitude * amplScale;
      if (animState.mode === "blockSway")
        xOffset = Math.sin(t) * animState.amplitude * amplScale;
      if (animState.mode === "glitch")
        xOffset =
          Math.sin(t * 2 + i * 1.3) * (animState.amplitude * 0.4) +
          (Math.random() - 0.5) * 2;
      const y = pad + charH * (i + 1);
      if (animState.gradient) {
        const grad = ctx.createLinearGradient(0, 0, c.width, 0);
        grad.addColorStop(0, "#f59e0b");
        grad.addColorStop(0.5, "#84cc16");
        grad.addColorStop(1, "#3b82f6");
        ctx.fillStyle = grad;
        ctx.fillText(line, pad + xOffset, y);
        continue;
      }
      if (animState.targetChar || animState.targetSet) {
        const setChars = new Set(animState.targetSet.split(""));
        for (let j = 0; j < line.length; j++) {
          const ch = line[j];
          let color = "#f4f4f5";
          const isTarget =
            (animState.targetChar && ch === animState.targetChar) ||
            (animState.targetSet && setChars.has(ch));
          if (isTarget) {
            if (animState.palette === "rainbow") {
              const hue = (t * 60 + i * 20) % 360;
              color = `hsl(${hue}, 90%, 60%)`;
            } else if (animState.palette === "yellow") color = "#f59e0b";
            else if (animState.palette === "green") color = "#22c55e";
            else if (animState.palette === "blue") color = "#3b82f6";
          } else {
            if (animState.palette === "yellow") color = "#a16207";
            else if (animState.palette === "green") color = "#15803d";
            else if (animState.palette === "blue") color = "#1e3a8a";
          }
          ctx.fillStyle = color as any;
          // Use a different width calculation for emojis vs regular characters
          const charWidth = ch.length > 1 || ch.codePointAt(0)! > 0xFFFF ? 16 : 12; // Emojis may need more space
          ctx.fillText(ch, pad + xOffset + j * charWidth, y);
        }
      } else {
        if (
          animState.mode === "colorCycle" ||
          animState.palette === "rainbow"
        ) {
          const hue = (t * 60 + i * 20) % 360;
          ctx.fillStyle = `hsl(${hue}, 80%, 60%)` as any;
        } else if (animState.palette === "yellow") ctx.fillStyle = "#a16207";
        else if (animState.palette === "green") ctx.fillStyle = "#15803d";
        else if (animState.palette === "blue") ctx.fillStyle = "#1e3a8a";
        else ctx.fillStyle = "#f4f4f5";
        ctx.fillText(line, pad + xOffset, y);
      }
    }
  }, [
    lines,
    animState.palette,
    animState.gradient,
    animState.targetChar,
    animState.targetSet,
    animState.mode,
    animState.amplitude,
    animState.speed,
    interactive,
    pointerXRef.current,
    pointerYRef.current,
    tick,
    canvasSize,
  ]);

  const handleStartRecording = () => {
    recorder.startRecording(canvasRef.current);
  };

  const downloadSnapshot = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hips-snapshot.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleUploadSnapshot = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const blob = await new Promise<Blob | null>((resolve) =>
      c.toBlob(resolve, "image/png")
    );
    if (!blob) {
      upload.clearError();
      return;
    }
    const file = new File([blob], "snapshot.png", { type: "image/png" });
    await upload.uploadFile(file, {
      ...animState.getSettings(),
      emojiEnabled: emojiSubstitution.isSubstituted,
      emojiTheme: emojiSubstitution.theme,
      emojiComplexity: emojiSubstitution.complexity,
    });
  };

  const handleUploadWebM = async () => {
    if (!recorder.recordUrl) {
      upload.clearError();
      return;
    }
    const res = await fetch(recorder.recordUrl);
    const blob = await res.blob();
    const file = new File([blob], "animation.webm", { type: "video/webm" });
    await upload.uploadFile(file, {
      ...animState.getSettings(),
      emojiEnabled: emojiSubstitution.isSubstituted,
      emojiTheme: emojiSubstitution.theme,
      emojiComplexity: emojiSubstitution.complexity,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
        <select
          value={animState.mode}
          onChange={(e) => animState.setMode(e.target.value as any)}
          className="font-mono text-xs px-2 py-1 border rounded"
        >
          <option value="still">still</option>
          <option value="lineWave">lineWave</option>
          <option value="blockSway">blockSway</option>
          <option value="colorCycle">colorCycle</option>
          <option value="glitch">glitch</option>
          <option value="frameCycle">frameCycle</option>
          <option value="svgWave">svgWave</option>
        </select>
        <select
          value={animState.palette}
          onChange={(e) => animState.setPalette(e.target.value as any)}
          className="font-mono text-xs px-2 py-1 border rounded"
        >
          <option value="yellow">yellow</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="rainbow">rainbow</option>
        </select>
        <label className="font-mono text-xs">speed</label>
        <input
          type="range"
          min={0}
          max={3}
          step={0.1}
          value={animState.speed}
          onChange={(e) => animState.setSpeed(parseFloat(e.target.value))}
        />
        <label className="font-mono text-xs">ampl</label>
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={animState.amplitude}
          onChange={(e) => animState.setAmplitude(parseFloat(e.target.value))}
        />
        {animState.mode === "frameCycle" && (
          <>
            <label className="font-mono text-xs">fps</label>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={frameRate}
              onChange={(e) => setFrameRate(parseFloat(e.target.value))}
            />
          </>
        )}
        <input
          placeholder="target char"
          value={animState.targetChar}
          onChange={(e) => animState.setTargetChar(e.target.value.slice(0, 1))}
          className="font-mono text-xs px-2 py-1 border rounded w-24"
        />
        <input
          placeholder="target set"
          value={animState.targetSet}
          onChange={(e) => animState.setTargetSet(e.target.value)}
          className="font-mono text-xs px-2 py-1 border rounded w-24"
        />
        <button
          onClick={() => setInteractive((v) => !v)}
          className="font-mono text-xs px-2 py-1 border rounded"
        >
          {interactive ? "interactive" : "static"}
        </button>
        <button
          onClick={() => animState.setGradient(!animState.gradient)}
          className="font-mono text-xs px-2 py-1 border rounded"
        >
          {animState.gradient ? "gradient on" : "gradient off"}
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          className="font-mono text-xs px-2 py-1 bg-yellow-600 text-white rounded"
        >
          {paused ? "resume" : "pause"}
        </button>
        <button
          onClick={handleStartRecording}
          disabled={recorder.isRecording}
          className="font-mono text-xs px-2 py-1 bg-blue-600 text-white rounded disabled:bg-blue-400"
        >
          {recorder.isRecording ? "recording..." : "record webm"}
        </button>
        <label className="font-mono text-xs">rec fps</label>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={recorder.recordFps}
          onChange={(e) => recorder.setRecordFps(parseFloat(e.target.value))}
        />
        <label className="font-mono text-xs">sec</label>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={recorder.recordDuration}
          onChange={(e) =>
            recorder.setRecordDuration(parseFloat(e.target.value))
          }
        />
        <button
          onClick={downloadSnapshot}
          className="font-mono text-xs px-2 py-1 border rounded"
        >
          snapshot png
        </button>
        {recorder.recordUrl && (
          <>
            <a
              href={recorder.recordUrl}
              download="animation.webm"
              className="font-mono text-xs px-2 py-1 border rounded text-blue-600"
            >
              download webm
            </a>
            <button
              onClick={handleUploadWebM}
              disabled={upload.isUploading}
              className="font-mono text-xs px-2 py-1 border rounded bg-purple-600 text-white disabled:bg-purple-400"
            >
              {upload.isUploading ? "uploading..." : "upload webm"}
            </button>
          </>
        )}
        <button
          onClick={handleUploadSnapshot}
          disabled={upload.isUploading}
          className="font-mono text-xs px-2 py-1 border rounded disabled:opacity-50"
        >
          {upload.isUploading ? "uploading..." : "upload png"}
        </button>
        {upload.error && (
          <span className="font-mono text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded">
            {upload.error.message}
          </span>
        )}
        {upload.uploadUrl && (
          <a
            href={upload.uploadUrl}
            target="_blank"
            className="font-mono text-xs px-2 py-1 border rounded text-green-600"
          >
            view upload
          </a>
        )}
      </div>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`pixel-border p-4 rounded bg-background/70 ${baseColorClass}`}
        style={
          animState.gradient
            ? {
                background: "linear-gradient(90deg, #f59e0b, #84cc16, #3b82f6)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }
            : undefined
        }
      >
        {animState.mode === "svgWave" ? (
          renderSVG()
        ) : (
          <div className="font-mono whitespace-pre text-[20px] font-[monospace]">
            {lines.map(renderLineHTML)}
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          className="w-full max-w-xl rounded border border-yellow-600/30"
        />
      </div>

      {/* Lunar Emoji Generator - Static Preview Only */}
      <div className="mt-6 pixel-border rounded-lg bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-500">
            🌙 LUNAR EMOJI PREVIEW
          </h3>
          <p className="font-mono text-xs text-foreground/70 mt-1">
            Static preview of moon-themed emoji variations (non-animated)
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={emojiSubstitution.theme}
              onChange={(e) => emojiSubstitution.setTheme(e.target.value as any)}
              className="font-mono text-xs px-2 py-1 border rounded"
              title={emojiSubstitution.getThemeDescription(emojiSubstitution.theme)}
            >
              {emojiSubstitution.getAvailableThemes().map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="font-mono text-xs">complexity</label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={emojiSubstitution.complexity}
              onChange={(e) => emojiSubstitution.setComplexity(parseInt(e.target.value))}
              title={`Substitution rate: ${emojiSubstitution.metadata?.substitutionRate}%`}
            />
            <span className="font-mono text-xs">{emojiSubstitution.complexity}</span>
            <button
              onClick={() => {
                const blob = new Blob([emojiSubstitution.substitutedText], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${pantId || "ascii"}-emoji.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="font-mono text-xs px-2 py-1 border rounded"
            >
              download
            </button>
          </div>

          <div className="pixel-border p-3 rounded bg-background/70 font-mono text-xs overflow-x-auto whitespace-pre">
            {emojiSubstitution.substitutedText}
          </div>

          {emojiSubstitution.metadata && (
            <div className="text-xs text-foreground/60 grid grid-cols-2 gap-2 md:grid-cols-4">
              <div>
                <span className="text-foreground/50">Substituted:</span>
                <div className="font-mono">
                  {emojiSubstitution.metadata.charactersSubstituted}/
                  {emojiSubstitution.metadata.totalCharactersEligible}
                </div>
              </div>
              <div>
                <span className="text-foreground/50">Rate:</span>
                <div className="font-mono">
                  {Math.round(emojiSubstitution.metadata.substitutionRate * 100)}%
                </div>
              </div>
              <div>
                <span className="text-foreground/50">Theme:</span>
                <div className="font-mono">{emojiSubstitution.metadata.theme}</div>
              </div>
              <div>
                <span className="text-foreground/50">Integrity:</span>
                <div className="font-mono">
                  {emojiSubstitution.metadata.themeIntegrity}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
