import Section from './Section';
import s from './DomainSection.module.css';

interface Props {
  active?: boolean;
  leaving?: boolean;
}

const DomainSection = ({ active, leaving }: Props) => (
  <Section
    idx="02"
    dataIdx="1"
    label="Practice"
    accent="var(--pal-2)"
    active={active}
    leaving={leaving}
  >
    <div className={s.domIntro}>domain of practice <i>—</i></div>
    <div className={s.domBig}>
      <span className={s.italic}>Computing<span className={s.amp}>&amp;</span></span>
      <span className={s.sc}>Technology</span>
    </div>
    <div className={s.domFoot}>
      <b>No. 01</b><span>vol. MMXX–MMXXVI · ISSN pending</span>
    </div>
  </Section>
);

export default DomainSection;
