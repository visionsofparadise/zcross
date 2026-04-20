import { CSSProperties, ReactNode } from 'react';
import s from './Section.module.css';

interface Props {
  /** "01", "02", ... — shown in ghost number and header */
  idx: string;
  /** data-idx on <section> — 0-based string, used by scroll logic */
  dataIdx: string;
  /** e.g. "Masthead" — shown after "01 / 04 — " in header */
  label: string;
  /** CSS value for per-section accent (e.g. 'var(--pal-1)') */
  accent: string;
  /** Optional override for ghost-number opacity (defaults to 0.06) */
  ghostOpacity?: number;
  /** Additional class on the <section> so per-section CSS can target
     `.active` descendants via local hashed classname */
  className?: string;
  active?: boolean;
  leaving?: boolean;
  children: ReactNode;
}

const TOTAL = '04';

const Section = ({
  idx,
  dataIdx,
  label,
  accent,
  ghostOpacity,
  className,
  active,
  leaving,
  children,
}: Props) => {
  const cls = [s.section, className, active && 'active', leaving && 'leaving']
    .filter(Boolean)
    .join(' ');
  const style: CSSProperties & Record<'--sec-accent', string> = {
    '--sec-accent': accent,
  };
  if (ghostOpacity != null) {
    (style as Record<string, string | number>)['--sec-num-opacity'] = ghostOpacity;
  }
  return (
    <section className={cls} style={style} data-idx={dataIdx} data-label={label}>
      <div className={s.secNum} aria-hidden="true">{idx}</div>
      <div className={s.secHead}>
        <span>
          <span className={s.secIdx}>{idx}</span> / {TOTAL} — {label}
        </span>
      </div>
      <div className={s.secBody}>{children}</div>
    </section>
  );
};

export default Section;
