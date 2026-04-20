import { useEffect, useRef, useState } from 'react';
import s from './Stories.module.css';
import HeroSection from './sections/HeroSection';
import DomainSection from './sections/DomainSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import CtaSection from './sections/CtaSection';
import { useScrollProgress } from '../hooks/useScrollProgress';

const TOTAL = 4;

const Stories = () => {
  const { activeIdx } = useScrollProgress(TOTAL);
  const prevRef = useRef(0);
  const [leavingIdx, setLeavingIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activeIdx === prevRef.current) return;
    const leaving = prevRef.current;
    prevRef.current = activeIdx;
    setLeavingIdx(leaving);
    const id = window.setTimeout(() => {
      setLeavingIdx((curr) => (curr === leaving ? null : curr));
    }, 900);
    return () => window.clearTimeout(id);
  }, [activeIdx]);

  return (
    <aside className={s.root} id="story" aria-label="ƵCROSS masthead">
      <div className={s.frame}>
        <HeroSection
          active={activeIdx === 0}
          leaving={leavingIdx === 0}
        />
        <DomainSection
          active={activeIdx === 1}
          leaving={leavingIdx === 1}
        />
        <CapabilitiesSection
          active={activeIdx === 2}
          leaving={leavingIdx === 2}
        />
        <CtaSection
          active={activeIdx === 3}
          leaving={leavingIdx === 3}
        />
      </div>
    </aside>
  );
};

export default Stories;
