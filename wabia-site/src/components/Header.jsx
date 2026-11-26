import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import Magnet from '../bits/Magnet.jsx';
import { finePointer, reduceMotion, ScrollTrigger, useGSAP } from '../motion.js';
import { LogoMark } from './icons.jsx';

const LINKS = [
  ['work', 'Work'],
  ['process', 'Process'],
  ['pricing', 'Pricing']
];
const SECTIONS = [['top', 'Intro'], ...LINKS, ['quote', 'Quote']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('top');
  const toggleRef = useRef(null);
  const barRef = useRef(null);

  useLenis(({ progress }) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
  });

  // Scrollspy: the section crossing the middle of the screen is the current one.
  useGSAP(() => {
    SECTIONS.forEach(([id]) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => self.isActive && setCurrent(id)
      })
    );
  });

  // The phone menu closes on Escape (focus back to its button) or a tap outside the header.
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = e => {
      if (!e.target.closest('.header')) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('focusin', onPointer); // focus leaving the header closes it too, so nothing hides under it
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('focusin', onPointer);
    };
  }, [open]);

  const index = SECTIONS.findIndex(([id]) => id === current);

  return (
    <header className="header">
      <div className="header__bar wrap">
        <a className="logo" href="#top" aria-label="Wabia, back to top">
          <LogoMark className="logo__mark" />
          <span className="logo__word">wabia</span>
        </a>
        <p className="header__where" aria-hidden="true">
          <span>0{index}</span> {SECTIONS[index][1]}
        </p>
        <nav className="nav" aria-label="Main">
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen(o => !o)}
          >
            Menu
            <span className="nav__toggle-icon" aria-hidden="true" />
          </button>
          <ul id="nav-links" className="nav__links" data-open={open || undefined} onClick={() => setOpen(false)}>
            {LINKS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={current === id ? 'location' : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Magnet disabled={!finePointer || reduceMotion} padding={40} magnetStrength={3}>
            <a className="btn btn--lime nav__cta" href="#quote">
              Request a quote
            </a>
          </Magnet>
        </nav>
      </div>
      <div ref={barRef} className="header__progress" aria-hidden="true" />
    </header>
  );
}
