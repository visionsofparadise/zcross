import { useEffect, useState } from 'react';

const EASE = 0.08;

export function useScrollProgress(totalSections: number) {
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let eased = 0;
    let raf = 0;
    let last = 0;

    const tick = () => {
      const vh = window.innerHeight;
      const target = Math.max(
        0,
        Math.min(totalSections - 1, window.scrollY / vh),
      );
      eased += (target - eased) * EASE;
      if (Math.abs(target - eased) < 0.001) eased = target;

      const idx = Math.min(
        totalSections - 1,
        Math.max(0, Math.round(eased)),
      );
      setProgress(eased);
      if (idx !== last) {
        last = idx;
        setActiveIdx(idx);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalSections]);

  return { progress, activeIdx };
}
