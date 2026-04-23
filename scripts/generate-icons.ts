import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SVG_PATH = join(ROOT, "public/icons/icon.svg");
const OUT_DIR = join(ROOT, "public/icons");
const SPLASH_DIR = join(ROOT, "public/splash");

// Brand dark background (matches manifest.json background_color + dark app bg).
const BG_DARK = { r: 37, g: 37, b: 37 }; // matches oklch(0.145 0 0), dark-mode body
const BG_LIGHT = { r: 255, g: 255, b: 255 }; // matches oklch(1 0 0), light-mode body
const BG_ICON = { r: 15, g: 23, b: 42 }; // #0f172a, used for maskable icon padding

const ICON_SIZES: Array<{ size: number; name: string; maskable?: boolean }> = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 512, name: "icon-512-maskable.png", maskable: true },
  { size: 180, name: "apple-touch-icon.png" },
];

// iPhone splash sizes (portrait). Each will be generated in light and dark.
const SPLASH_SIZES: Array<{ w: number; h: number; base: string }> = [
  { w: 1290, h: 2796, base: "iphone-14-pro-max" },
  { w: 1179, h: 2556, base: "iphone-14-pro" },
  { w: 1284, h: 2778, base: "iphone-14-plus" },
  { w: 1170, h: 2532, base: "iphone-14" },
  { w: 1125, h: 2436, base: "iphone-xs-11pro" },
  { w: 828, h: 1792, base: "iphone-xr-11" },
  { w: 750, h: 1334, base: "iphone-se-8" },
];

/**
 * Minimal inline logo rendered as an SVG string for splash screens.
 * Keeps the "IP · ISEN · green dot" identity but WITHOUT the rounded
 * background box so it blends into the splash canvas color.
 */
function buildBareLogoSvg(scheme: "light" | "dark"): string {
  const main = scheme === "light" ? "#0f172a" : "#f8fafc";
  const sub = scheme === "light" ? "#64748b" : "#94a3b8";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g font-family="system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif" font-weight="800" text-anchor="middle">
    <text x="256" y="232" font-size="200" fill="${main}" letter-spacing="-8">IP</text>
    <text x="256" y="340" font-size="50" fill="${sub}" letter-spacing="8">ISEN</text>
  </g>
  <circle cx="256" cy="400" r="10" fill="#22c55e"/>
</svg>`;
}

async function buildIcon(svg: Buffer, opts: { size: number; name: string; maskable?: boolean }) {
  let pipeline = sharp(svg, { density: 512 }).resize(opts.size, opts.size);
  if (opts.maskable) {
    pipeline = pipeline.extend({
      top: Math.round(opts.size * 0.1),
      bottom: Math.round(opts.size * 0.1),
      left: Math.round(opts.size * 0.1),
      right: Math.round(opts.size * 0.1),
      background: { ...BG_ICON, alpha: 1 },
    });
  }
  const buf = await pipeline.png().toBuffer();
  await writeFile(join(OUT_DIR, opts.name), buf);
  console.log(`✓ icons/${opts.name} (${opts.size}×${opts.size}${opts.maskable ? ", maskable" : ""})`);
}

async function buildSplash(
  logoSvg: Buffer,
  opts: { w: number; h: number; name: string; bg: { r: number; g: number; b: number } },
) {
  const logoSize = Math.round(Math.min(opts.w, opts.h) * 0.32);
  const logo = await sharp(logoSvg, { density: 1024 })
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  const canvas = sharp({
    create: {
      width: opts.w,
      height: opts.h,
      channels: 4,
      background: { ...opts.bg, alpha: 1 },
    },
  });

  const output = await canvas
    .composite([
      {
        input: logo,
        top: Math.round((opts.h - logoSize) / 2),
        left: Math.round((opts.w - logoSize) / 2),
      },
    ])
    .png()
    .toBuffer();

  await writeFile(join(SPLASH_DIR, opts.name), output);
  console.log(`✓ splash/${opts.name} (${opts.w}×${opts.h})`);
}

async function main() {
  const svg = await readFile(SVG_PATH);
  const lightLogo = Buffer.from(buildBareLogoSvg("light"));
  const darkLogo = Buffer.from(buildBareLogoSvg("dark"));

  const { mkdir } = await import("node:fs/promises");
  await mkdir(SPLASH_DIR, { recursive: true });

  for (const opts of ICON_SIZES) {
    await buildIcon(svg, opts);
  }

  for (const s of SPLASH_SIZES) {
    await buildSplash(lightLogo, {
      w: s.w,
      h: s.h,
      name: `${s.base}-light.png`,
      bg: BG_LIGHT,
    });
    await buildSplash(darkLogo, {
      w: s.w,
      h: s.h,
      name: `${s.base}-dark.png`,
      bg: BG_DARK,
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
