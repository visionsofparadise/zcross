import { useEffect } from 'react';

export function useKeyboardNav(totalSections: number) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const vh = window.innerHeight;
      const current = Math.round(window.scrollY / vh);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(totalSections - 1, current + 1);
        window.scrollTo({ top: next * vh, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const next = Math.max(0, current - 1);
        window.scrollTo({ top: next * vh, behavior: 'smooth' });
      } else if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        window.scrollTo({
          top: (totalSections - 1) * vh,
          behavior: 'smooth',
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [totalSections]);
}
