import s from './Fiducials.module.css';

const Fiducials = () => (
  <div className={s.root}>
    <svg viewBox="0 0 1000 700" preserveAspectRatio="none">
      {/* center crosshair ticks */}
      <line x1="500" y1="0" x2="500" y2="14" className={s.tick} opacity="0.5" />
      <line x1="500" y1="686" x2="500" y2="700" className={s.tick} opacity="0.5" />
      <line x1="0" y1="350" x2="14" y2="350" className={s.tick} opacity="0.5" />
      <line x1="986" y1="350" x2="1000" y2="350" className={s.tick} opacity="0.5" />
    </svg>
  </div>
);

export default Fiducials;
