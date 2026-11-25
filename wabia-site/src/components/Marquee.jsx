import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

const TRADES = [
  'Plumbers',
  'Electricians',
  'Air-con engineers',
  'Pool care',
  'Cleaners',
  'Builders',
  'Painters',
  'Gardeners',
  'Solar installers',
  'Roofers',
  'Locksmiths',
  'Handymen'
];
const LOOP_MS = 48000;

export default function Marquee() {
  const trackRef = useRef(null);
  const animRef = useRef(null);

  // Lenis velocity drives the band: faster while you scroll, and it follows the scroll direction.
  const lenis = useLenis(({ velocity, direction }) => {
    animRef.current?.updatePlaybackRate((direction || 1) * (1 + Math.min(Math.abs(velocity) * 0.12, 5)));
  });

  useEffect(() => {
    if (!lenis) return; // reduced motion: the band stays still
    const anim = trackRef.current.animate(
      [{ transform: 'translate3d(0, 0, 0)' }, { transform: 'translate3d(-50%, 0, 0)' }],
      {
        duration: LOOP_MS,
        iterations: Infinity
      }
    );
    anim.currentTime = LOOP_MS * 1000; // start deep in the loop so playing backwards never runs out
    animRef.current = anim;
    return () => anim.cancel();
  }, [lenis]);

  return (
    <section className="marquee" aria-label="Who we build for">
      <ul ref={trackRef} className="marquee__track">
        {TRADES.map(t => (
          <li key={t}>{t}</li>
        ))}
        {TRADES.map(t => (
          <li key={`${t}-copy`} aria-hidden="true">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
