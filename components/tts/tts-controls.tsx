"use client";

import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { extractReadableText } from "@/lib/tts/extract";

type Props = {
  /** Raw lesson markdown. Stripped client-side before being sent to TTS. */
  markdown: string;
};

const VOICE_STORAGE_KEY = "isen-prep:tts-voice";

/**
 * Score a voice for French TTS quality. Higher = better.
 * Signals we use (in order of impact):
 * - Explicit quality tag in the name (premium / enhanced / natural / neural)
 * - Non-local voices (cloud-backed, usually higher quality)
 * - "fr-FR" over "fr-CA" / other variants
 */
function scoreFrenchVoice(v: SpeechSynthesisVoice): number {
  let score = 0;
  const name = v.name.toLowerCase();
  if (/(premium|enhanced|natural|neural|studio)/i.test(name)) score += 100;
  if (/google|microsoft|amazon/i.test(name)) score += 20;
  if (!v.localService) score += 15;
  if (v.lang?.toLowerCase() === "fr-fr") score += 5;
  if (v.lang?.toLowerCase().startsWith("fr")) score += 2;
  return score;
}

export function TtsControls({ markdown }: Props) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState<string>("");
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const cancelledRef = useRef(false);

  const frenchVoices = useMemo(
    () =>
      voices
        .filter((v) => v.lang?.toLowerCase().startsWith("fr"))
        .sort((a, b) => scoreFrenchVoice(b) - scoreFrenchVoice(a)),
    [voices],
  );

  const selectedVoice = useMemo(
    () => frenchVoices.find((v) => v.voiceURI === voiceUri) ?? frenchVoices[0],
    [frenchVoices, voiceUri],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    setSupported(true);

    const pickVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
    };

    pickVoices();
    window.speechSynthesis.onvoiceschanged = pickVoices;

    const savedUri = window.localStorage.getItem(VOICE_STORAGE_KEY);
    if (savedUri) setVoiceUri(savedUri);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Default-select the highest-scored French voice once we have the list.
  useEffect(() => {
    const top = frenchVoices[0];
    if (!voiceUri && top) {
      setVoiceUri(top.voiceURI);
    }
  }, [frenchVoices, voiceUri]);

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
    if (selectedVoice) utter.voice = selectedVoice;
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
  }, [rate, selectedVoice]);

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

      {frenchVoices.length > 0 ? (
        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          Voix
          <select
            value={voiceUri}
            onChange={(e) => {
              setVoiceUri(e.target.value);
              try {
                window.localStorage.setItem(VOICE_STORAGE_KEY, e.target.value);
              } catch {}
            }}
            className="max-w-[180px] truncate rounded border bg-background px-1 py-0.5 text-xs"
            aria-label="Voix de lecture"
          >
            {frenchVoices.map((v) => {
              const isPremium = /(premium|enhanced|natural|neural|studio)/i.test(
                v.name,
              );
              const remote = !v.localService ? " · distante" : "";
              return (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {isPremium ? "★ " : ""}
                  {v.name}
                  {remote}
                </option>
              );
            })}
          </select>
        </label>
      ) : null}

      <label className="flex items-center gap-2 text-xs text-muted-foreground">
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
