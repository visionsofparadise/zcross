import type { CSSProperties } from 'react';
import s from './Meter.module.css';
import { useScrollProgress } from '../hooks/useScrollProgress';

const TOTAL = 4;
const SECTIONS = ['Masthead', 'Practice', 'Capabilities', 'Contact'];

const Meter = () => {
  const { progress, activeIdx } = useScrollProgress(TOTAL);
  const pct = (progress / (TOTAL - 1)) * 100;
  const hintVisible = progress < 0.15;

  const jump = (i: number) => {
    window.scrollTo({
      top: (i + 0.5) * window.innerHeight,
      behavior: 'smooth',
    });
  };

  const barStyle = { '--p': pct + '%' } as CSSProperties;

  return (
    <>
      <div className={s.root} id="meter" aria-hidden="true">
        <div className={s.readout}>
          <span>
            <span className={s.idx} id="meter-idx">
              {String(activeIdx + 1).padStart(2, '0')}
            </span>
            <span className={s.tot}> / 04</span>
          </span>
        </div>
        <div className={s.bar} id="meter-bar" style={barStyle}></div>
        <div className={s.ticks} id="meter-ticks">
          {SECTIONS.map((label, i) => {
            const cls = [
              s.tick,
              i === activeIdx && 'active',
              i < activeIdx && 'past',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={i}
                type="button"
                className={cls}
                data-i={i}
                aria-label={label}
                onClick={() => jump(i)}
              />
            );
          })}
        </div>
        <div className={s.label}>
          <b id="meter-label">{SECTIONS[activeIdx].toUpperCase()}</b>
          signal position
        </div>
      </div>

      <div
        className={`${s.hint}${hintVisible ? ' visible' : ''}`}
        id="scroll-hint"
      >
        <span>scroll</span>
        <span className={s.hintLine}></span>
      </div>
    </>
  );
};

export default Meter;
