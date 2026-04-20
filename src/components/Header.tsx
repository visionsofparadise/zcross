import s from './Header.module.css';

const Header = () => (
  <header className={s.root}>
    <div className={`${s.l} mono`}>
      <span><span className={s.dot}></span>SIGNAL ACTIVE</span>
      <span>SR · 48.000 kHz</span>
      <span>BIT · 24</span>
    </div>
    <div className={`${s.c} mono`} style={{ textAlign: 'center' }}>Ƶ</div>
    <div className={`${s.r} mono`}>
      <span>EST · MMXX</span>
      <span>LOC · UK</span>
    </div>
  </header>
);

export default Header;
