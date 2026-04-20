import Section from './Section';
import s from './HeroSection.module.css';

interface Props {
  active?: boolean;
  leaving?: boolean;
}

const HeroSection = ({ active, leaving }: Props) => (
  <Section
    idx="01"
    dataIdx="0"
    label="Masthead"
    accent="var(--pal-1)"
    active={active}
    leaving={leaving}
  >
    <h1 className={s.displayBlock}>
      <span className={s.content}>
        Cont<span className={s.kernTE}>ent</span>
      </span>
      <span className={s.productionLine}>
        <span className={s.tick} aria-hidden="true" />
        <span className={s.production}>
          Product<span className={s.kernTI}>ion</span>
        </span>
      </span>
    </h1>
    <div className={s.heroByline}>
      <div className={s.heroBylineBar} aria-hidden="true"></div>
      <div className={s.heroBylineBody}>
        <div className={s.heroBylineLabel}>BY</div>
        <div className={s.heroBylineName}>Matt Cavender</div>
      </div>
    </div>
    <div className={s.heroMeta}>
      <span>EST · <b className={s.b}>MMXX</b></span>
      <span>LOC · <b className={s.b}>UK</b></span>
      <span>SR · <b className={s.b}>48.000 kHz</b></span>
    </div>
  </Section>
);

export default HeroSection;
