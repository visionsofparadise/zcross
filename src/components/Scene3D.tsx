import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  vertexShader,
  fragmentShader,
} from '../three/backgroundShader.glsl';
import { buildGlyphShapes, GLYPH_SVG } from '../three/glyphPath';
import s from './Scene3D.module.css';

// cheap feature-detect: try a disposable context, fall back to SVG if any
// step throws or returns null
const hasWebGL = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const c = document.createElement('canvas');
    const ctx =
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      c.getContext('experimental-webgl');
    return !!ctx;
  } catch {
    return false;
  }
};

const SvgFallback = () => (
  <svg
    className={s.fallback}
    viewBox="42 -708 508 708"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <g transform="scale(1 -1)">
      <path d={GLYPH_SVG} fill="#141416" />
    </g>
  </svg>
);

// ---- Background shader uniforms (bone variant from TWEAK_DEFAULTS) ----
const BG = new THREE.Vector3(0.937, 0.925, 0.898);
const PALETTE_BONE = 2;

// ---- Glyph TWEAK_DEFAULTS ----
const TILT_ANGLE = (21 * Math.PI) / 180;
const SIZE = 0.56;
const SPIN = 0.07;
const AXIS = new THREE.Vector3(0.33, 0.87, 0).normalize();
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const DEPTH_IN = 0.08;
const DEPTH = Math.max(0.05, 0.05 + DEPTH_IN * 1.3);
const TRAIL_COUNT = 3;
const TRAIL_SPREAD = 0.28;
const TRAIL_INTERVAL = 0.15 + TRAIL_SPREAD * 2.35;
const TRAIL_LIFETIME =
  TRAIL_INTERVAL * Math.max(1, TRAIL_COUNT) + 0.2;
const MAIN_COLOR = 0x141416;
const TRAIL_COLORS = [0x3a6ea5, 0x8fa6c4, 0xeef1ec, 0xd19a9a, 0xe04a4a];

// Glyph horizontal offset in world units so it sits in the left half of the
// viewport. Depends on the Canvas aspect — resolved in useFrame.
interface Stamp {
  bornAt: number;
  q: THREE.Quaternion;
}

const ShaderQuad = () => {
  const { gl, size } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouse = useRef(new THREE.Vector2(0, 0));
  const active = useRef(0);

  const uniforms = useMemo(
    () => ({
      u_res: { value: new THREE.Vector2(1, 1) },
      u_t: { value: 0 },
      u_intensity: { value: 1.0 },
      u_speed: { value: 1.0 },
      u_palette: { value: PALETTE_BONE },
      u_bg: { value: BG.clone() },
      u_density: { value: 120 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouseActive: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouseTarget.current.set(
        e.clientX * dpr,
        (window.innerHeight - e.clientY) * dpr,
      );
      active.current = 1;
    };
    const onLeave = () => {
      active.current = 0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useFrame((_state, dt) => {
    const dpr = gl.getPixelRatio();
    uniforms.u_res.value.set(size.width * dpr, size.height * dpr);
    uniforms.u_t.value += dt;
    mouse.current.lerp(mouseTarget.current, 0.12);
    uniforms.u_mouse.value.copy(mouse.current);
    uniforms.u_mouseActive.value = active.current;
  });

  // Fullscreen quad in NDC space. Positioned at z = -50 so anything with normal
  // depth test draws in front. depthTest/depthWrite disabled so it always
  // renders regardless of z-buffer state.
  return (
    <mesh renderOrder={-1} position={[0, 0, -50]} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms as unknown as Record<string, THREE.IUniform>}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const GlyphMesh = () => {
  const { size } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const ghostsRef = useRef<THREE.Mesh[]>([]);
  const stampsRef = useRef<(Stamp | undefined)[]>([]);
  const cursorRef = useRef(0);
  const nextStampAtRef = useRef(0);
  const tiltQuat = useRef(new THREE.Quaternion());

  const shapes = useMemo(() => buildGlyphShapes(), []);
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: DEPTH,
      bevelEnabled: false,
      curveSegments: 3,
      steps: Math.max(2, Math.round(DEPTH * 6)),
    });
    g.center();
    return g;
  }, [shapes]);

  const mainMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: MAIN_COLOR,
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      }),
    [],
  );

  const ghostMaterials = useMemo(
    () =>
      Array.from(
        { length: TRAIL_COUNT },
        (_, i) =>
          new THREE.MeshBasicMaterial({
            color: TRAIL_COLORS[i % TRAIL_COLORS.length],
            wireframe: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
      ),
    [],
  );

  // free GPU resources when the glyph unmounts (e.g. viewport crosses the
  // mobile breakpoint). useMemo deps are stable so this only fires once.
  useEffect(
    () => () => {
      geometry.dispose();
      mainMaterial.dispose();
      ghostMaterials.forEach((m) => m.dispose());
    },
    [geometry, mainMaterial, ghostMaterials],
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const t = state.clock.getElapsedTime();
    const spin = t * (0.05 + SPIN * 2.2);
    const breathe = Math.sin(t * 0.3) * 0.02;

    // Camera is at (0,0,3.9) with fov 42; at z=0 the visible width is
    // 2 * 3.9 * tan(21°) * aspect. Position the glyph group at x = -25% of
    // that width so it sits centred in the viewport's left half. Skip the
    // translation on mobile (< 768px) where Scene3D is hidden anyway, but
    // also behaves sensibly at any aspect.
    const visibleH = 2 * 3.9 * Math.tan((42 * Math.PI) / 180 / 2);
    const aspect = size.width / Math.max(1, size.height);
    const visibleW = visibleH * aspect;
    group.position.x = -visibleW * 0.25;

    mesh.scale.setScalar(SIZE);
    mesh.quaternion.identity();
    mesh.quaternion.setFromAxisAngle(AXIS, spin);
    tiltQuat.current.setFromAxisAngle(Z_AXIS, TILT_ANGLE + breathe);
    mesh.quaternion.premultiply(tiltQuat.current);

    if (t >= nextStampAtRef.current) {
      const slot = cursorRef.current % TRAIL_COUNT;
      stampsRef.current[slot] = {
        bornAt: t,
        q: mesh.quaternion.clone(),
      };
      cursorRef.current++;
      nextStampAtRef.current = t + TRAIL_INTERVAL;
    }

    ghostsRef.current.forEach((g, i) => {
      const stamp = stampsRef.current[i];
      if (!stamp || i >= TRAIL_COUNT) {
        g.visible = false;
        return;
      }
      const age = t - stamp.bornAt;
      if (age > TRAIL_LIFETIME) {
        g.visible = false;
        return;
      }
      const fadeIn = Math.min(1, age / 0.08);
      const fadeOut = 1 - age / TRAIL_LIFETIME;
      const alpha = 0.55 * fadeIn * fadeOut * fadeOut;
      if (alpha < 0.01) {
        g.visible = false;
        return;
      }
      g.visible = true;
      g.quaternion.copy(stamp.q);
      g.scale.copy(mesh.scale);
      (g.material as THREE.MeshBasicMaterial).opacity = alpha;
    });
  });

  return (
    <group ref={groupRef}>
      {ghostMaterials.map((mat, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ghostsRef.current[i] = el;
          }}
          geometry={geometry}
          material={mat}
          visible={false}
          renderOrder={0}
        />
      ))}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={mainMaterial}
        renderOrder={1}
      />
    </group>
  );
};

const Scene3D = () => {
  const [showGlyph, setShowGlyph] = useState(
    () => typeof window === 'undefined' || window.innerWidth > 768,
  );
  const [webgl] = useState(hasWebGL);

  useLayoutEffect(() => {
    const id = window.setTimeout(
      () => window.dispatchEvent(new Event('resize')),
      0,
    );
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setShowGlyph(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (!webgl) {
    return (
      <div className={s.root}>{showGlyph && <SvgFallback />}</div>
    );
  }

  return (
    <div className={s.root}>
      <Canvas
        camera={{ position: [0, 0, 3.9], fov: 42, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          premultipliedAlpha: false,
        }}
        dpr={[1, 2]}
        resize={{ debounce: 0, scroll: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ShaderQuad />
        {showGlyph && <GlyphMesh />}
      </Canvas>
    </div>
  );
};

export default Scene3D;
