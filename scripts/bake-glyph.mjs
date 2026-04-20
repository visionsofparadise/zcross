// One-time offline bake: turns the Ƶ glyph into a deduplicated wireframe edge
// list and writes it to public/glyph.bin.
//
// Runtime (GlyphCanvas2D) fetches the blob and renders it with Canvas 2D,
// avoiding the three.js ExtrudeGeometry / WireframeGeometry runtime cost for
// the glyph (the background shader still uses three).
//
// Format:
//   uint32 LE  edgeCount
//   Float32[]  edgeCount * 6   (2 verts × 3 coords, little-endian)
//
// The path parser + buildGlyphShapes logic is inlined from
// src/three/glyphPath.ts to keep this runnable as plain Node ESM without a
// TS loader. Duplicating ~100 lines is fine for a throwaway tool.

import * as THREE from 'three';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// ---- Copied verbatim from src/three/glyphPath.ts ------------------------

const GLYPH_SVG =
  'M550 708Q495 706 429.5 705.5Q364 705 307 705H227Q183 705 139 706Q95 707 58 708Q62 670 63.5 634.5Q65 599 65 580Q65 556 64.5 535Q64 514 62 498H85Q90 550 99 586Q108 622 125.5 643.5Q143 665 172.5 675Q202 685 249 685H444L249.95 364H77V344H237.86L42 20V0Q99 2 164.5 2.5Q230 3 289 3H369.5Q413 3 457 2.5Q501 2 538 0Q534 38 532.5 73.5Q531 109 531 128Q531 179 534 210H511Q506 158 497 122Q488 86 470.5 64.5Q453 43 423.5 33Q394 23 347 23H151L343.6 344H515V364L355.6 364L550 688Z';

const TARGET_SIZE = 2.4;

function parseSvgPath(d) {
  const subs = [];
  let cur = null;
  let startX = 0,
    startY = 0,
    cx = 0,
    cy = 0;
  const tokens = d.match(/[MLHVQCZ]|-?\d*\.?\d+/g) || [];
  let i = 0;
  let cmd = null;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MLHVQCZ]/i.test(t)) {
      cmd = t.toUpperCase();
      i++;
      continue;
    }
    const num = () => parseFloat(tokens[i++]);
    if (cmd === 'M') {
      const x = num(),
        y = num();
      if (cur) subs.push(cur);
      cur = { start: [x, y], segs: [] };
      startX = x;
      startY = y;
      cx = x;
      cy = y;
      cmd = 'L';
    } else if (cmd === 'L') {
      const x = num(),
        y = num();
      cur.segs.push({ type: 'L', pts: [x, y] });
      cx = x;
      cy = y;
    } else if (cmd === 'H') {
      const x = num();
      cur.segs.push({ type: 'L', pts: [x, cy] });
      cx = x;
    } else if (cmd === 'V') {
      const y = num();
      cur.segs.push({ type: 'L', pts: [cx, y] });
      cy = y;
    } else if (cmd === 'Q') {
      const x1 = num(),
        y1 = num(),
        x = num(),
        y = num();
      cur.segs.push({ type: 'Q', pts: [x1, y1, x, y] });
      cx = x;
      cy = y;
    } else if (cmd === 'C') {
      const x1 = num(),
        y1 = num(),
        x2 = num(),
        y2 = num(),
        x = num(),
        y = num();
      cur.segs.push({ type: 'C', pts: [x1, y1, x2, y2, x, y] });
      cx = x;
      cy = y;
    } else if (cmd === 'Z') {
      if (cur && (cx !== startX || cy !== startY)) {
        cur.segs.push({ type: 'L', pts: [startX, startY] });
      }
      if (cur) subs.push(cur);
      cur = null;
    }
  }
  if (cur) subs.push(cur);
  return subs;
}

function sampleSub(sp) {
  const pts = [[sp.start[0], sp.start[1]]];
  let px = sp.start[0],
    py = sp.start[1];
  sp.segs.forEach((s) => {
    if (s.type === 'L') {
      pts.push([s.pts[0], s.pts[1]]);
      px = s.pts[0];
      py = s.pts[1];
    } else if (s.type === 'Q') {
      const [x1, y1, x2, y2] = s.pts;
      for (let t = 0.1; t <= 1.0001; t += 0.1) {
        const mt = 1 - t;
        const xx = mt * mt * px + 2 * mt * t * x1 + t * t * x2;
        const yy = mt * mt * py + 2 * mt * t * y1 + t * t * y2;
        pts.push([xx, yy]);
      }
      px = x2;
      py = y2;
    } else if (s.type === 'C') {
      const [x1, y1, x2, y2, x3, y3] = s.pts;
      for (let t = 0.1; t <= 1.0001; t += 0.1) {
        const mt = 1 - t;
        const xx =
          mt * mt * mt * px +
          3 * mt * mt * t * x1 +
          3 * mt * t * t * x2 +
          t * t * t * x3;
        const yy =
          mt * mt * mt * py +
          3 * mt * mt * t * y1 +
          3 * mt * t * t * y2 +
          t * t * t * y3;
        pts.push([xx, yy]);
      }
      px = x3;
      py = y3;
    }
  });
  return pts;
}

function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i],
      [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a * 0.5;
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i],
      [xj, yj] = poly[j];
    const hit =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-9) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function buildGlyphShapes() {
  const subs = parseSvgPath(GLYPH_SVG);

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  const framed = subs.map((sp) => {
    const pts = sampleSub(sp);
    pts.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
    return { sp, pts, area: signedArea(pts) };
  });

  const scale = TARGET_SIZE / (maxY - minY);
  const mx = (minX + maxX) * 0.5;
  const my = (minY + maxY) * 0.5;
  const tx = (x) => (x - mx) * scale;
  const ty = (y) => (y - my) * scale;

  const biggest = framed.reduce((a, b) =>
    Math.abs(a.area) > Math.abs(b.area) ? a : b,
  );
  if (biggest.area < 0) {
    framed.forEach((f) => {
      const rev = f.pts.slice().reverse();
      f.sp = {
        start: [rev[0][0], rev[0][1]],
        segs: rev
          .slice(1)
          .map((p) => ({ type: 'L', pts: [p[0], p[1]] })),
      };
      f.pts = rev;
      f.area = -f.area;
    });
  }

  const outers = framed.filter((f) => f.area > 0);
  const holes = framed.filter((f) => f.area < 0);

  const runPath = (target, sp) => {
    target.moveTo(tx(sp.start[0]), ty(sp.start[1]));
    sp.segs.forEach((s) => {
      if (s.type === 'L') {
        target.lineTo(tx(s.pts[0]), ty(s.pts[1]));
      } else if (s.type === 'Q') {
        target.quadraticCurveTo(
          tx(s.pts[0]),
          ty(s.pts[1]),
          tx(s.pts[2]),
          ty(s.pts[3]),
        );
      } else if (s.type === 'C') {
        target.bezierCurveTo(
          tx(s.pts[0]),
          ty(s.pts[1]),
          tx(s.pts[2]),
          ty(s.pts[3]),
          tx(s.pts[4]),
          ty(s.pts[5]),
        );
      }
    });
  };

  const shapes = [];
  outers.forEach((outer) => {
    const shape = new THREE.Shape();
    runPath(shape, outer.sp);
    holes.forEach((hole) => {
      const [hx, hy] = hole.pts[0];
      if (pointInPoly(hx, hy, outer.pts)) {
        const hp = new THREE.Path();
        runPath(hp, hole.sp);
        shape.holes.push(hp);
      }
    });
    shapes.push(shape);
  });
  return shapes;
}

// ---- Bake ---------------------------------------------------------------

// Mirror Scene3D.tsx lines 51–57
const DEPTH_IN = 0.08;
const DEPTH = Math.max(0.05, 0.05 + DEPTH_IN * 1.3);

const shapes = buildGlyphShapes();
const geo = new THREE.ExtrudeGeometry(shapes, {
  depth: DEPTH,
  bevelEnabled: false,
  curveSegments: 3,
  steps: Math.max(2, Math.round(DEPTH * 6)),
});
geo.center();
geo.computeBoundingBox();
console.log('bounding box (after .center()):', geo.boundingBox);

const wire = new THREE.WireframeGeometry(geo);
const posAttr = wire.attributes.position;
const count = posAttr.count; // total vertices, comes in pairs
if (count % 2 !== 0) {
  throw new Error(`Wireframe vertex count is odd: ${count}`);
}
const edgeCount = count / 2;

// Pack: uint32 LE header + float32 LE payload
const payloadFloats = count * 3;
const headerBytes = 4;
const payloadBytes = payloadFloats * 4;
const buf = new ArrayBuffer(headerBytes + payloadBytes);
const dv = new DataView(buf);
dv.setUint32(0, edgeCount, true);
const floats = new Float32Array(buf, headerBytes, payloadFloats);
const src = posAttr.array;
for (let i = 0; i < payloadFloats; i++) {
  floats[i] = src[i];
}

const outPath = resolve(PROJECT_ROOT, 'public', 'glyph.bin');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, new Uint8Array(buf));

console.log(`edges: ${edgeCount}`);
console.log(`bytes: ${buf.byteLength}`);
console.log(`wrote ${outPath}`);
