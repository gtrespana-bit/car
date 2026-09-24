// ============================================================================
//  Genera los iconos PNG de la PWA (512, 192 y 180 px para iOS) sin
//  dependencias externas: escribe el PNG a mano con zlib.
//  Uso:  node scripts/make-icons.mjs
// ============================================================================
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const AMBER = [245, 158, 11];
const DARK = [15, 23, 42];

const inRoundedRect = (x, y, x0, y0, x1, y1, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.max(x0 + r, Math.min(x, x1 - r));
  const cy = Math.max(y0 + r, Math.min(y, y1 - r));
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};

const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;

const inTrapezoid = (x, y, x0, y0, x1, y1, x2, y2, x3, y3) => {
  // método de los semiplanos con los cuatro vértices
  const d1 = (x - x1) * (y0 - y1) - (x0 - x1) * (y - y1);
  const d2 = (x - x2) * (y1 - y2) - (x1 - x2) * (y - y2);
  const d3 = (x - x3) * (y2 - y3) - (x2 - x3) * (y - y3);
  const d4 = (x - x0) * (y3 - y0) - (x3 - x0) * (y - y0);
  const neg = d1 < 0 || d2 < 0 || d3 < 0 || d4 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0 || d4 > 0;
  return !(neg && pos);
};

/** Dibuja el coche sobre un fondo redondeado, en un lienzo de `size` px. */
function pixel(x, y, size) {
  const s = size / 512;
  const X = x / s;
  const Y = y / s;

  // Fondo: cuadrado redondeado, transparente fuera
  if (!inRoundedRect(X, Y, 0, 0, 512, 512, 104)) return null;

  // Carrocería
  if (inRoundedRect(X, Y, 84, 248, 428, 344, 30)) return AMBER;
  // Techo / habitáculo
  if (inTrapezoid(X, Y, 158, 252, 206, 176, 330, 176, 384, 252)) return AMBER;
  // Lunetas (delantera y trasera) en el color del fondo
  if (inTrapezoid(X, Y, 178, 244, 214, 194, 262, 194, 262, 244)) return DARK;
  if (inTrapezoid(X, Y, 272, 244, 272, 194, 322, 194, 358, 244)) return DARK;
  // Pasos de rueda
  if (inCircle(X, Y, 172, 344, 52) || inCircle(X, Y, 348, 344, 52)) return DARK;
  // Llantas
  if (inCircle(X, Y, 172, 344, 30) || inCircle(X, Y, 348, 344, 30)) return AMBER;
  // Buje
  if (inCircle(X, Y, 172, 344, 11) || inCircle(X, Y, 348, 344, 11)) return DARK;
  // Faro delantero
  if (inRoundedRect(X, Y, 404, 262, 424, 282, 8)) return DARK;

  return DARK;
}

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n += 1) {
    c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function toPng(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  let o = 0;
  for (let y = 0; y < size; y += 1) {
    raw[o] = 0; // filtro none
    o += 1;
    for (let x = 0; x < size; x += 1) {
      const c = pixel(x, y, size);
      if (!c) {
        raw[o] = 0; raw[o + 1] = 0; raw[o + 2] = 0; raw[o + 3] = 0;
      } else {
        raw[o] = c[0]; raw[o + 1] = c[1]; raw[o + 2] = c[2]; raw[o + 3] = 255;
      }
      o += 4;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // profundidad
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
for (const size of [512, 192, 180, 32]) {
  const name = size === 180 ? 'apple-touch-icon.png' : size === 32 ? 'favicon-32.png' : `icon-${size}.png`;
  writeFileSync(`public/icons/${name}`, toPng(size));
  console.log(`  ✓ public/icons/${name}`);
}
