// Sound effects for the quiz game, generated on-the-fly via WebAudio —
// no asset files needed. Playback is gated by a user preference persisted
// in localStorage.

const SOUND_KEY = "isen-prep:quiz-sounds";

let _ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    _ctx = new Ctor();
  }
  return _ctx;
}

export function loadSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(SOUND_KEY);
    return raw === null ? true : raw === "on";
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
  } catch {}
}

type NoteSpec = {
  freq: number;
  start: number; // seconds offset from ctx.currentTime
  duration: number;
  gain?: number;
};

function playNotes(notes: NoteSpec[]): void {
  const ctx = getCtx();
  if (!ctx) return;

  // Resume if suspended (needed on iOS after first user gesture).
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.08;
  masterGain.connect(ctx.destination);

  for (const n of notes) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = n.freq;
    const gain = ctx.createGain();
    const peak = n.gain ?? 1;
    gain.gain.setValueAtTime(0.0001, now + n.start);
    gain.gain.exponentialRampToValueAtTime(peak, now + n.start + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + n.start + n.duration,
    );
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now + n.start);
    osc.stop(now + n.start + n.duration + 0.02);
  }
}

export function playCorrect(enabled: boolean): void {
  if (!enabled) return;
  playNotes([
    { freq: 523.25, start: 0, duration: 0.1 }, // C5
    { freq: 659.25, start: 0.08, duration: 0.15 }, // E5
  ]);
  vibrate(30);
}

export function playWrong(enabled: boolean): void {
  if (!enabled) return;
  playNotes([{ freq: 150, start: 0, duration: 0.2 }]);
  vibrate([60, 30, 60]);
}

export function playAchievement(enabled: boolean): void {
  if (!enabled) return;
  playNotes([
    { freq: 523.25, start: 0, duration: 0.1 },
    { freq: 659.25, start: 0.08, duration: 0.1 },
    { freq: 783.99, start: 0.16, duration: 0.2 }, // G5
  ]);
  vibrate([30, 20, 30, 20, 30]);
}

export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {}
}
