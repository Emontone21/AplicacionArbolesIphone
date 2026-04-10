/**
 * Genera icon-192.png, icon-512.png y apple-touch-icon.png
 * desde favicon.svg usando la API Canvas de Node (requires: npm i canvas sharp)
 *
 * Uso:  node generate-icons.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { createCanvas, loadImage } from 'canvas';

const sizes = [
  { file: 'public/icon-192.png',          size: 192 },
  { file: 'public/icon-512.png',          size: 512 },
  { file: 'public/apple-touch-icon.png',  size: 180 },
];

const svgPath = new URL('./public/favicon.svg', import.meta.url).pathname;
const svgData = readFileSync(svgPath);
const svgBlob = `data:image/svg+xml;base64,${Buffer.from(svgData).toString('base64')}`;

for (const { file, size } of sizes) {
  const canvas = createCanvas(size, size);
  const ctx    = canvas.getContext('2d');

  // Dark background (matches app dark mode)
  ctx.fillStyle = '#191919';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fill();

  const img = await loadImage(svgBlob);
  const pad = size * 0.1;
  ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);

  writeFileSync(file, canvas.toBuffer('image/png'));
  console.log(`✓ ${file}`);
}
