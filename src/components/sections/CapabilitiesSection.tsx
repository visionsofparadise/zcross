import Section from './Section';
import s from './CapabilitiesSection.module.css';

interface Props {
  active?: boolean;
  leaving?: boolean;
}

const CAPABILITIES = [
  'Audio Engineering',
  'Editing',
  'Motion Graphics',
  'Long-form Editorial',
  'Brand Design',
  'Music Production',
  'Social Media Content',
];

const CapabilitiesSection = ({ active, leaving }: Props) => (
  <Section
    idx="03"
    dataIdx="2"
    label="Capabilities"
    accent="var(--pal-4)"
    className={s.capsSection}
    active={active}
    leaving={leaving}
  >
    <div className={s.capsHead}>
      <span className={s.left}>CAPS · INDEX</span>
      <span>07 DISCIPLINES</span>
    </div>
    <ol className={s.capsList}>
      {CAPABILITIES.map((name, i) => (
        <li key={name} className={s.capItem}>
          <span className={s.capNum}>{String(i + 1).padStart(2, '0')}</span>
          <span className={s.capName}>{name}</span>
          <span className={s.capBar}></span>
          <span className={s.capDot}></span>
        </li>
      ))}
    </ol>
  </Section>
);

export default CapabilitiesSection;
