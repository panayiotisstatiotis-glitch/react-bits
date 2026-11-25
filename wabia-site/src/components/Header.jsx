import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import { LogoMark } from './icons.jsx';

const LINKS = [
  ['#work', 'Work'],
  ['#process', 'Process'],
  ['#pricing', 'Pricing']
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const barRef = useRef(null);

  useLenis(({ progress }) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
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
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <header className="header">
      <div className="header__bar wrap">
        <a className="logo" href="#top" aria-label="Wabia, back to top">
          <LogoMark className="logo__mark" />
          <span className="logo__word">wabia</span>
        </a>
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
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <a className="btn btn--lime nav__cta" href="#quote">
            Request a quote
          </a>
        </nav>
      </div>
      <div ref={barRef} className="header__progress" aria-hidden="true" />
    </header>
  );
}
