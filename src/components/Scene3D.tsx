import { useEffect, useLayoutEffect, useState } from 'react';
import BackgroundShader from './BackgroundShader';
import GlyphCanvas2D from './GlyphCanvas2D';
import s from './Scene3D.module.css';

// WebGL feature-detect for the background shader only. The Canvas 2D glyph
// renders in software without WebGL.
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

  return (
    <div className={s.root}>
      {webgl && <BackgroundShader />}
      {showGlyph && <GlyphCanvas2D />}
    </div>
  );
};

export default Scene3D;
