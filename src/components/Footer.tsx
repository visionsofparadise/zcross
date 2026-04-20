import { useEffect, useRef } from 'react';
import s from './Footer.module.css';

const Footer = () => {
  const coordRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const a = Math.floor((Math.sin(t * 0.3) * 0.5 + 0.5) * 0xffff)
        .toString(16)
        .padStart(4, '0')
        .toUpperCase();
      const b = Math.floor((Math.cos(t * 0.2) * 0.5 + 0.5) * 0xffff)
        .toString(16)
        .padStart(4, '0')
        .toUpperCase();
      const p = Math.sin(t * 0.25);
      if (coordRef.current) {
        coordRef.current.textContent = `SYS · ${a} ${b}`;
      }
      if (phaseRef.current) {
        phaseRef.current.textContent = `φ ${p >= 0 ? '+' : ''}${p.toFixed(3)}π`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <footer className={s.root}>
      <div className={`${s.l} mono`}>
        <span ref={coordRef} id="coord">
          SYS · 0000 0000
        </span>
      </div>
      <div className={`${s.c} mono`}>ƵCROSS · AUDIO ENGINEERING</div>
      <div className={`${s.r} mono`}>
        <span ref={phaseRef} id="phase">
          φ +0.000π
        </span>
      </div>
    </footer>
  );
};

export default Footer;
