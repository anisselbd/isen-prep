// Generate a shareable PNG image of a quiz result, entirely client-side via
// Canvas (no server roundtrip, no CDN dependency).

export type ShareData = {
  score: number;
  mode_name: string;
  max_combo: number;
  correct_count: number;
  total_answers: number;
  is_new_best: boolean;
};

const BG = "#0f172a";
const ACCENT = "#fbbf24";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

export async function renderShareImage(
  data: ShareData,
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const SIZE = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, BG);
  grad.addColorStop(1, "#1e293b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = 60; x < SIZE; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SIZE);
    ctx.stroke();
  }

  // "IP" badge top-left
  ctx.fillStyle = TEXT;
  ctx.font = "800 64px system-ui, -apple-system, Segoe UI, Helvetica, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("IP", 80, 80);
  ctx.fillStyle = MUTED;
  ctx.font = "600 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("ISEN PREP · Quiz arcade", 80, 160);

  // Center: big score
  ctx.fillStyle = ACCENT;
  ctx.font = "900 360px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(data.score), SIZE / 2, SIZE / 2 - 40);

  ctx.fillStyle = TEXT;
  ctx.font = "600 44px system-ui, -apple-system, sans-serif";
  ctx.fillText("points", SIZE / 2, SIZE / 2 + 150);

  // Record badge
  if (data.is_new_best) {
    ctx.fillStyle = ACCENT;
    ctx.font = "700 30px system-ui, -apple-system, sans-serif";
    ctx.fillText("🏆  NOUVEAU RECORD", SIZE / 2, SIZE / 2 - 230);
  }

  // Bottom stats row
  const bottomY = SIZE - 170;
  ctx.fillStyle = TEXT;
  ctx.font = "700 38px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  const col = SIZE / 3;
  ctx.fillText(String(data.max_combo), col / 2 + 80, bottomY);
  ctx.fillText(
    `${data.correct_count}/${data.total_answers}`,
    SIZE / 2,
    bottomY,
  );
  ctx.fillText(data.mode_name, SIZE - col / 2 - 80, bottomY);

  ctx.fillStyle = MUTED;
  ctx.font = "500 24px system-ui, -apple-system, sans-serif";
  ctx.fillText("combo max", col / 2 + 80, bottomY + 48);
  ctx.fillText("bonnes", SIZE / 2, bottomY + 48);
  ctx.fillText("mode", SIZE - col / 2 - 80, bottomY + 48);

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
}

/**
 * Try to share via Web Share API (native iOS/Android sheet) with the image
 * as an attachment. Fall back to a download if unsupported.
 */
export async function shareResult(data: ShareData): Promise<void> {
  const blob = await renderShareImage(data);
  if (!blob) return;

  const file = new File([blob], `isen-prep-quiz-${data.score}.png`, {
    type: "image/png",
  });

  type ShareDataShape = { files?: File[]; title?: string; text?: string };
  const nav = navigator as Navigator & {
    canShare?: (d: ShareDataShape) => boolean;
    share?: (d: ShareDataShape) => Promise<void>;
  };

  if (
    typeof nav.canShare === "function" &&
    nav.canShare({ files: [file] }) &&
    typeof nav.share === "function"
  ) {
    try {
      await nav.share({
        files: [file],
        title: `ISEN PREP Quiz — ${data.score} pts`,
        text: `J'ai marqué ${data.score} pts en ${data.mode_name}.`,
      });
      return;
    } catch {
      // User cancelled or failed → fall through to download.
    }
  }

  // Fallback: trigger download.
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
