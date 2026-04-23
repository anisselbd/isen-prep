"use client";

import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { extractReadableText } from "@/lib/tts/extract";

type Props = {
  /** Raw lesson markdown. Stripped client-side before being sent to TTS. */
  markdown: string;
};

/**
 * Lightweight text-to-speech bar for lesson pages.
 *
 * Implementation notes:
 * - Uses the native `speechSynthesis` API (zero API cost).
 * - Lessons are chunked into paragraphs and queued one by one to work around
 *   Chrome's "auto-pause after 15 s" bug on long utterances.
 * - A French voice is picked if available, otherwise we fall back to
 *   whatever the browser gives us with the lang hint.
 */
export function TtsControls({ markdown }: Props) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [rate, setRate] = useState(1);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    setSupported(true);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => v.lang?.toLowerCase().startsWith("fr-fr")) ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("fr")) ??
        null;
    };

    pickVoice();
    // Voices load async on Chrome — re-pick when the list populates.
    window.speechSynthesis.onvoiceschanged = pickVoice;

    return () => {
      // On unmount, cancel any ongoing speech to avoid leaking across pages.
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakNext = useCallback(() => {
    if (cancelledRef.current) return;
    const i = indexRef.current;
    const chunks = chunksRef.current;
    if (i >= chunks.length) {
      setStatus("idle");
      setProgress({ current: chunks.length, total: chunks.length });
      return;
    }

    const utter = new SpeechSynthesisUtterance(chunks[i]);
    utter.lang = "fr-FR";
    utter.rate = rate;
    if (voiceRef.current) utter.voice = voiceRef.current;
    utter.onend = () => {
      if (cancelledRef.current) return;
      indexRef.current += 1;
      setProgress({ current: indexRef.current, total: chunks.length });
      speakNext();
    };
    utter.onerror = () => {
      setStatus("idle");
    };
    window.speechSynthesis.speak(utter);
  }, [rate]);

  const play = useCallback(() => {
    if (!supported) return;
    const plain = extractReadableText(markdown);
    const chunks = plain
      .split(/\n\n+/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter((s) => s.length > 0);

    chunksRef.current = chunks;
    indexRef.current = 0;
    cancelledRef.current = false;
    setProgress({ current: 0, total: chunks.length });
    setStatus("playing");
    window.speechSynthesis.cancel();
    speakNext();
  }, [markdown, supported, speakNext]);

  const pauseOrResume = useCallback(() => {
    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
    }
  }, [status]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    setStatus("idle");
    setProgress({ current: 0, total: 0 });
  }, []);

  if (!supported) {
    return (
      <div className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Lecture vocale non supportée par ce navigateur.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
      <Volume2 className="size-4 text-muted-foreground" aria-hidden="true" />
      {status === "idle" ? (
        <Button size="sm" variant="outline" onClick={play}>
          <Play className="size-3.5" />
          Lire à voix haute
        </Button>
      ) : (
        <>
          <Button size="sm" variant="outline" onClick={pauseOrResume}>
            {status === "playing" ? (
              <>
                <Pause className="size-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-3.5" />
                Reprendre
              </>
            )}
          </Button>
          <Button size="sm" variant="ghost" onClick={stop}>
            <Square className="size-3.5" />
            Stop
          </Button>
        </>
      )}

      <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        Vitesse
        <select
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="rounded border bg-background px-1 py-0.5 text-xs"
          aria-label="Vitesse de lecture"
        >
          <option value={0.8}>0,8×</option>
          <option value={1}>1×</option>
          <option value={1.2}>1,2×</option>
          <option value={1.5}>1,5×</option>
        </select>
      </label>

      {progress.total > 0 ? (
        <span className="text-xs tabular-nums text-muted-foreground">
          {progress.current} / {progress.total}
        </span>
      ) : null}
    </div>
  );
}
