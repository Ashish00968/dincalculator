import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const svgPath = path.join(ROOT_DIR, 'public/og-image.svg');
const pngPath = path.join(ROOT_DIR, 'public/og-image.png');

async function generateOgImage() {
  const svgBuffer = fs.readFileSync(svgPath);
  await sharp(svgBuffer)
    .resize(1200, 630)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(pngPath);

  const stats = fs.statSync(pngPath);
  console.log(`Generated ${pngPath} (${Math.round(stats.size / 1024)} KB)`);
}

generateOgImage().catch(console.error);
