import { useEffect, useRef } from 'react';
import { fragmentShader } from '../three/backgroundShader.glsl';
import s from './Scene3D.module.css';

// Raw WebGL port of the R3F ShaderQuad from Scene3D.tsx. Owns its own
// <canvas>, one fullscreen NDC quad, and the rAF loop. Uniform names and
// values mirror the R3F version verbatim (bone variant from TWEAK_DEFAULTS).

// Vertex shader authored against GLSL ES 1.00 with a single vec2 attribute
// `a`. Kept inline rather than in backgroundShader.glsl.ts because that file
// still exports the three.js-style vertex shader (which references
// `position.xy` — an attribute three.js supplies automatically).
const VERTEX_SHADER = /* glsl */ `
  attribute vec2 a;
  varying vec2 v;
  void main(){
    v = a * 0.5 + 0.5;
    gl_Position = vec4(a, 0.0, 1.0);
  }
`;

const BG: [number, number, number] = [0.937, 0.925, 0.898];
const PALETTE_BONE = 2;
const DENSITY = 120;
const INTENSITY = 1.0;
const SPEED = 1.0;

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null => {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(
      '[BackgroundShader] shader compile:',
      gl.getShaderInfoLog(sh),
    );
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

const linkProgram = (
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
): WebGLProgram | null => {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(
      '[BackgroundShader] program link:',
      gl.getProgramInfoLog(prog),
    );
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
};

const BackgroundShader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const glOpts: WebGLContextAttributes = {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    };
    const gl = (canvas.getContext('webgl2', glOpts) ||
      canvas.getContext('webgl', glOpts)) as WebGLRenderingContext | null;
    if (!gl) {
      console.error('[BackgroundShader] no WebGL context');
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;
    const prog = linkProgram(gl, vs, fs);
    if (!prog) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    // Static fullscreen NDC quad as TRIANGLE_STRIP.
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const u_res = gl.getUniformLocation(prog, 'u_res');
    const u_t = gl.getUniformLocation(prog, 'u_t');
    const u_intensity = gl.getUniformLocation(prog, 'u_intensity');
    const u_speed = gl.getUniformLocation(prog, 'u_speed');
    const u_palette = gl.getUniformLocation(prog, 'u_palette');
    const u_bg = gl.getUniformLocation(prog, 'u_bg');
    const u_density = gl.getUniformLocation(prog, 'u_density');
    const u_mouse = gl.getUniformLocation(prog, 'u_mouse');
    const u_mouseActive = gl.getUniformLocation(prog, 'u_mouseActive');

    // Mouse tracking — pixel-space (backing store), Y-up.
    const mouseTarget: [number, number] = [0, 0];
    const mouse: [number, number] = [0, 0];
    let active = 0;

    const onMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouseTarget[0] = e.clientX * dpr;
      mouseTarget[1] = (window.innerHeight - e.clientY) * dpr;
      active = 1;
    };
    const onLeave = () => {
      active = 0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      const w = Math.max(1, Math.round(cssW * dpr));
      const h = Math.max(1, Math.round(cssH * dpr));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // Upload static uniforms once.
    gl.useProgram(prog);
    gl.uniform1f(u_intensity, INTENSITY);
    gl.uniform1f(u_speed, SPEED);
    gl.uniform1i(u_palette, PALETTE_BONE);
    gl.uniform3f(u_bg, BG[0], BG[1], BG[2]);
    gl.uniform1f(u_density, DENSITY);
    gl.uniform2f(u_mouse, 0.5, 0.5);
    gl.uniform1f(u_mouseActive, 0);

    gl.clearColor(0, 0, 0, 0);

    let rafId = 0;
    let last = performance.now();
    let elapsed = 0;

    const frame = () => {
      rafId = requestAnimationFrame(frame);
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      elapsed += dt;

      // Lerp smoothing toward the tracked pixel-space target.
      mouse[0] += (mouseTarget[0] - mouse[0]) * 0.12;
      mouse[1] += (mouseTarget[1] - mouse[1]) * 0.12;

      gl.useProgram(prog);
      gl.uniform2f(u_res, canvas.width, canvas.height);
      gl.uniform1f(u_t, elapsed);
      gl.uniform2f(u_mouse, mouse[0], mouse[1]);
      gl.uniform1f(u_mouseActive, active);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (vbo) gl.deleteBuffer(vbo);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={s.bgShader}
      aria-hidden="true"
    />
  );
};

export default BackgroundShader;
