import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SVG_PATH = join(ROOT, "public/icons/icon.svg");
const OUT_DIR = join(ROOT, "public/icons");
const SPLASH_DIR = join(ROOT, "public/splash");

// Brand dark background (matches manifest.json background_color).
const BG = { r: 15, g: 23, b: 42 };

const ICON_SIZES: Array<{ size: number; name: string; maskable?: boolean }> = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 512, name: "icon-512-maskable.png", maskable: true },
  { size: 180, name: "apple-touch-icon.png" },
];

// iPhone splash sizes (portrait, 2x-3x pixel ratios).
// Source: WebKit-supported apple-touch-startup-image media queries.
// Keeping the most common 7 — covers ~95 % of iPhones in use.
const SPLASH_SIZES: Array<{ w: number; h: number; name: string; media: string }> = [
  { w: 1290, h: 2796, name: "iphone-14-pro-max.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
  { w: 1179, h: 2556, name: "iphone-14-pro.png",     media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
  { w: 1284, h: 2778, name: "iphone-14-plus.png",    media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" },
  { w: 1170, h: 2532, name: "iphone-14.png",         media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
  { w: 1125, h: 2436, name: "iphone-xs-11pro.png",   media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
  { w: 828,  h: 1792, name: "iphone-xr-11.png",      media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" },
  { w: 750,  h: 1334, name: "iphone-se-8.png",       media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
];

async function buildIcon(svg: Buffer, opts: { size: number; name: string; maskable?: boolean }) {
  let pipeline = sharp(svg, { density: 512 }).resize(opts.size, opts.size);
  if (opts.maskable) {
    pipeline = pipeline.extend({
      top: Math.round(opts.size * 0.1),
      bottom: Math.round(opts.size * 0.1),
      left: Math.round(opts.size * 0.1),
      right: Math.round(opts.size * 0.1),
      background: { ...BG, alpha: 1 },
    });
  }
  const buf = await pipeline.png().toBuffer();
  await writeFile(join(OUT_DIR, opts.name), buf);
  console.log(`✓ icons/${opts.name} (${opts.size}×${opts.size}${opts.maskable ? ", maskable" : ""})`);
}

async function buildSplash(svg: Buffer, opts: { w: number; h: number; name: string }) {
  // Render the SVG at ~35 % of the smallest side — a centered logo with
  // generous padding looks best across device aspect ratios.
  const logoSize = Math.round(Math.min(opts.w, opts.h) * 0.32);
  const logo = await sharp(svg, { density: 1024 })
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  const canvas = sharp({
    create: {
      width: opts.w,
      height: opts.h,
      channels: 4,
      background: { ...BG, alpha: 1 },
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

  // Ensure splash directory exists.
  const { mkdir } = await import("node:fs/promises");
  await mkdir(SPLASH_DIR, { recursive: true });

  for (const opts of ICON_SIZES) {
    await buildIcon(svg, opts);
  }

  for (const opts of SPLASH_SIZES) {
    await buildSplash(svg, opts);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export { SPLASH_SIZES };
