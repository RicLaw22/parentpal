/**
 * generate-icons.js
 * Generates PWA icons as PNG files using pure Node.js (no external deps).
 * Creates a radial gradient: amber/saffron centre → deep indigo edge.
 * Runs automatically via postinstall and before next build.
 */

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// ── CRC32 table ──────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// ── PNG builder ───────────────────────────────────────────────────────────────
function buildPNG(size) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  // Pixel data: 1 filter byte per row + 3 bytes per pixel (RGB)
  const rowLen = 1 + size * 3;
  const raw = Buffer.alloc(size * rowLen, 0);

  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded corners: pixels outside inscribed circle get indigo bg
      const inCircle = dist <= maxR * 0.92;
      let t, r, g, b;

      if (!inCircle) {
        // Background colour: deep indigo #1E1B4B
        r = 30; g = 27; b = 75;
      } else {
        // Radial gradient 0=centre amber #F59E0B → 1=edge indigo #312E81
        t = Math.min(dist / (maxR * 0.75), 1);
        // Ease out
        t = t * t;
        r = Math.round(245 * (1 - t) + 49 * t);
        g = Math.round(158 * (1 - t) + 46 * t);
        b = Math.round(11  * (1 - t) + 129 * t);
      }

      const off = y * rowLen + 1 + x * 3;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
    }
  }

  const idat = chunk('IDAT', zlib.deflateSync(raw, { level: 6 }));
  const iend = chunk('IEND', Buffer.alloc(0));
  return Buffer.concat([SIG, chunk('IHDR', ihdr), idat, iend]);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

[192, 512].forEach((size) => {
  const filePath = path.join(OUT_DIR, `icon-${size}.png`);
  fs.writeFileSync(filePath, buildPNG(size));
  console.log(`✅  Generated ${filePath}`);
});

console.log('🎉  ParentPal icons ready!');
