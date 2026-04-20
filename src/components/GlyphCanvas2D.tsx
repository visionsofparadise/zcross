import { useEffect, useRef } from 'react';
import s from './Scene3D.module.css';

// Canvas 2D replacement for the three.js GlyphMesh. Fetches a pre-baked
// wireframe edge list (public/glyph.bin) and draws it per frame with
// projected lines. Keeps the animation math from Scene3D.tsx verbatim.

// ---- Glyph constants — keep in sync with Scene3D.tsx TWEAK_DEFAULTS ----
const TILT_ANGLE = (21 * Math.PI) / 180;
const SIZE = 0.56;
const SPIN = 0.07;
// AXIS = normalize(0.33, 0.87, 0)
const AXIS: [number, number, number] = (() => {
  const x = 0.33,
    y = 0.87,
    z = 0;
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
})();
const Z_AXIS: [number, number, number] = [0, 0, 1];
const TRAIL_COUNT = 3;
const TRAIL_SPREAD = 0.28;
const TRAIL_INTERVAL = 0.15 + TRAIL_SPREAD * 2.35;
const TRAIL_LIFETIME =
  TRAIL_INTERVAL * Math.max(1, TRAIL_COUNT) + 0.2;
const MAIN_COLOR = '#141416';
const TRAIL_COLORS = ['#ffffff', '#ffffff', '#ffffff'];

const CAMERA_Z = 3.9;
const FOV = (42 * Math.PI) / 180;
const NEAR = 0.1;
const FAR = 100;

// ---- Math helpers ------------------------------------------------------

type Vec3 = [number, number, number];
type Quat = [number, number, number, number]; // x, y, z, w
type Mat4 = Float32Array;

const quatFromAxisAngle = (a: Vec3, angle: number): Quat => {
  const h = angle * 0.5;
  const sh = Math.sin(h);
  return [a[0] * sh, a[1] * sh, a[2] * sh, Math.cos(h)];
};

// a * b (Hamilton product)
const quatMul = (a: Quat, b: Quat): Quat => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];

const mat4FromQuatScale = (q: Quat, sc: number): Mat4 => {
  const [x, y, z, w] = q;
  const xx = x * x,
    yy = y * y,
    zz = z * z;
  const xy = x * y,
    xz = x * z,
    yz = y * z;
  const wx = w * x,
    wy = w * y,
    wz = w * z;
  const m = new Float32Array(16);
  m[0] = (1 - 2 * (yy + zz)) * sc;
  m[1] = 2 * (xy + wz) * sc;
  m[2] = 2 * (xz - wy) * sc;
  m[3] = 0;
  m[4] = 2 * (xy - wz) * sc;
  m[5] = (1 - 2 * (xx + zz)) * sc;
  m[6] = 2 * (yz + wx) * sc;
  m[7] = 0;
  m[8] = 2 * (xz + wy) * sc;
  m[9] = 2 * (yz - wx) * sc;
  m[10] = (1 - 2 * (xx + yy)) * sc;
  m[11] = 0;
  m[12] = 0;
  m[13] = 0;
  m[14] = 0;
  m[15] = 1;
  return m;
};

// out = a * b (column-major, matches OpenGL/three convention)
const mat4Mul = (a: Mat4, b: Mat4): Mat4 => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      o[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return o;
};

const mat4Perspective = (
  fov: number,
  aspect: number,
  near: number,
  far: number,
): Mat4 => {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) * nf;
  m[11] = -1;
  m[14] = 2 * far * near * nf;
  return m;
};

// Apply a -tz translation along Z to the identity view matrix so the camera
// sits at (0, 0, tz). View = inverse of camera transform.
const mat4ViewTranslateZ = (tz: number): Mat4 => {
  const m = new Float32Array(16);
  m[0] = 1;
  m[5] = 1;
  m[10] = 1;
  m[15] = 1;
  m[14] = -tz;
  return m;
};

// Project a world-space point via mvp into clip space, then NDC.
// Returns [ndcX, ndcY, ndcZ, clipW].
const projectPoint = (
  mvp: Mat4,
  x: number,
  y: number,
  z: number,
): [number, number, number, number] => {
  const cx = mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12];
  const cy = mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13];
  const cz = mvp[2] * x + mvp[6] * y + mvp[10] * z + mvp[14];
  const cw = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15];
  return [cx / cw, cy / cw, cz / cw, cw];
};

// ---- Component ---------------------------------------------------------

interface Stamp {
  bornAt: number;
  q: Quat;
}

const GlyphCanvas2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let edges: Float32Array | null = null;
    let aborted = false;
    let rafId = 0;

    let cssW = window.innerWidth;
    let cssH = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      // Scale so drawing ops use CSS pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Trail ring buffer
    const stamps: (Stamp | undefined)[] = new Array(TRAIL_COUNT);
    let cursor = 0;
    let nextStampAt = 0;

    // Per-frame scratch to avoid alloc churn
    let projected: Float32Array | null = null;
    const t0 = performance.now();

    const drawWire = (
      mvp: Mat4,
      offsetPx: number,
      color: string,
      alpha: number,
    ) => {
      if (!edges || !projected) return;
      const vertCount = edges.length / 3;
      // Project all verts
      for (let v = 0; v < vertCount; v++) {
        const ei = v * 3;
        const [nx, ny] = projectPoint(
          mvp,
          edges[ei],
          edges[ei + 1],
          edges[ei + 2],
        );
        const px = (nx + 1) * 0.5 * cssW + offsetPx;
        const py = (1 - (ny + 1) * 0.5) * cssH;
        projected[v * 2] = px;
        projected[v * 2 + 1] = py;
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Edges are consecutive vertex pairs
      const edgeCount = vertCount / 2;
      for (let e = 0; e < edgeCount; e++) {
        const a = e * 4;
        ctx.moveTo(projected[a], projected[a + 1]);
        ctx.lineTo(projected[a + 2], projected[a + 3]);
      }
      ctx.stroke();
    };

    const frame = () => {
      if (aborted) return;
      rafId = requestAnimationFrame(frame);
      if (!edges || !projected) return;

      ctx.clearRect(0, 0, cssW, cssH);

      const t = (performance.now() - t0) / 1000;

      // Main mesh quaternion — mirrors Scene3D.tsx lines 206–224.
      const spin = t * (0.05 + SPIN * 2.2);
      const breathe = Math.sin(t * 0.3) * 0.02;
      const qSpin = quatFromAxisAngle(AXIS, spin);
      const qTilt = quatFromAxisAngle(Z_AXIS, TILT_ANGLE + breathe);
      // three's premultiply(other): this = other * this, so final = tilt * spin
      const qMain = quatMul(qTilt, qSpin);

      // Stamp the ring buffer
      if (t >= nextStampAt) {
        const slot = cursor % TRAIL_COUNT;
        stamps[slot] = { bornAt: t, q: qMain };
        cursor++;
        nextStampAt = t + TRAIL_INTERVAL;
      }

      // Build projection + view
      const aspect = cssW / Math.max(1, cssH);
      const proj = mat4Perspective(FOV, aspect, NEAR, FAR);
      const view = mat4ViewTranslateZ(CAMERA_Z);
      const vp = mat4Mul(proj, view);

      // Horizontal offset: match Scene3D.tsx line 218 (-visibleW * 0.25).
      // In pixel space that's -cssW * 0.25 after NDC->pixel (mapping is
      // linear in x for centred perspective).
      const offsetPx = -cssW * 0.25;

      // Draw ghost trails first (additive), then main mesh (source-over).
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const stamp = stamps[i];
        if (!stamp) continue;
        const age = t - stamp.bornAt;
        if (age > TRAIL_LIFETIME) continue;
        const fadeIn = Math.min(1, age / 0.08);
        const fadeOut = 1 - age / TRAIL_LIFETIME;
        const alpha = 0.55 * fadeIn * fadeOut * fadeOut;
        if (alpha < 0.01) continue;
        const model = mat4FromQuatScale(stamp.q, SIZE);
        const mvp = mat4Mul(vp, model);
        drawWire(
          mvp,
          offsetPx,
          TRAIL_COLORS[i % TRAIL_COLORS.length],
          alpha,
        );
      }

      ctx.globalCompositeOperation = 'source-over';
      const mainModel = mat4FromQuatScale(qMain, SIZE);
      const mainMvp = mat4Mul(vp, mainModel);
      drawWire(mainMvp, offsetPx, MAIN_COLOR, 0.95);
    };

    // Fetch the pre-baked edge buffer
    fetch(`${import.meta.env.BASE_URL}glyph.bin`)
      .then((r) => {
        if (!r.ok) throw new Error(`glyph.bin ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        if (aborted) return;
        const dv = new DataView(buf);
        const edgeCount = dv.getUint32(0, true);
        const floatCount = edgeCount * 2 * 3;
        edges = new Float32Array(buf, 4, floatCount);
        projected = new Float32Array(edgeCount * 2 * 2); // 2 verts × 2 px coords
        rafId = requestAnimationFrame(frame);
      })
      .catch((err) => {
        // Non-fatal: log and leave the canvas blank. The SvgFallback is not
        // reachable once webgl succeeds, so a hard fetch failure here shows
        // nothing in the left half — acceptable for a spike.
        console.error('[GlyphCanvas2D] failed to load glyph.bin:', err);
      });

    return () => {
      aborted = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={s.glyphCanvas}
      aria-hidden="true"
    />
  );
};

export default GlyphCanvas2D;
