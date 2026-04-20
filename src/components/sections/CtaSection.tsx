import Section from './Section';
import s from './CtaSection.module.css';

interface Props {
  active?: boolean;
  leaving?: boolean;
}

const CtaSection = ({ active, leaving }: Props) => (
  <Section
    idx="04"
    dataIdx="3"
    label="Signal Out"
    accent="var(--pal-5)"
    ghostOpacity={0.07}
    active={active}
    leaving={leaving}
  >
    <div className={s.ctaOver}>
      {"let's"}<br/>wor<span className={s.kernRK}>k</span><span className={s.period}>.</span>
    </div>
    <a className={s.ctaEmail} href="mailto:contact@zcross.media">
      contact@zcross.media
      <span className={s.arrow}>→</span>
    </a>
    <div className={s.ctaMeta}>
      <span>CH · <b>A1 / A2</b></span>
      <span>BUS · <b>MSTR OUT</b></span>
      <span>STATUS · <b>OPEN FOR BOOKING</b></span>
    </div>
  </Section>
);

export default CtaSection;
