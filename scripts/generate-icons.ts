import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SVG_PATH = join(ROOT, "public/icons/icon.svg");
const OUT_DIR = join(ROOT, "public/icons");

const SIZES: Array<{ size: number; name: string; maskable?: boolean }> = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 512, name: "icon-512-maskable.png", maskable: true },
  { size: 180, name: "apple-touch-icon.png" },
];

async function main() {
  const svg = await readFile(SVG_PATH);

  for (const { size, name, maskable } of SIZES) {
    let pipeline = sharp(svg, { density: 512 }).resize(size, size);

    if (maskable) {
      pipeline = pipeline.extend({
        top: Math.round(size * 0.1),
        bottom: Math.round(size * 0.1),
        left: Math.round(size * 0.1),
        right: Math.round(size * 0.1),
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      });
    }

    const buf = await pipeline.png().toBuffer();
    await writeFile(join(OUT_DIR, name), buf);
    console.log(`✓ ${name} (${size}×${size}${maskable ? ", maskable" : ""})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
