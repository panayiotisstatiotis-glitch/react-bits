import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

const A = ['Fixed price', 'From €249', 'No surprises', 'Built for phones', 'Greek & English', 'You approve first'];
const B = ['Plumbers', 'Electricians', 'Air-con', 'Builders', 'Pool care', 'Cleaners', 'Painters', 'Solar', 'Roofers'];
const LOOP_MS = 42000;

function Tape({ items, className, trackRef }) {
  return (
    <div className={`tape ${className}`}>
      <ul ref={trackRef} className="tape__track">
        {[...items, ...items].map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// Two hazard tapes crossing on the blueprint paper. They run in opposite directions and Lenis' scroll velocity
// speeds them up and flips them when you scroll back up.
export default function Tapes() {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const anims = useRef([]);

  const lenis = useLenis(({ velocity, direction }) => {
    const rate = (direction || 1) * (1 + Math.min(Math.abs(velocity) * 0.14, 6));
    anims.current.forEach((a, i) => a.updatePlaybackRate(i ? -rate : rate));
  });

  useEffect(() => {
    if (!lenis) return; // reduced motion: the tapes stay still
    anims.current = [aRef, bRef].map(ref => {
      const a = ref.current.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-50%,0,0)' }], {
        duration: LOOP_MS,
        iterations: Infinity
      });
      a.currentTime = LOOP_MS * 1000; // deep in the loop so playing backwards never runs out
      return a;
    });
    return () => anims.current.forEach(a => a.cancel());
  }, [lenis]);

  return (
    <div className="tapes" aria-hidden="true">
      <Tape items={A} className="tape--lime" trackRef={aRef} />
      <Tape items={B} className="tape--ink" trackRef={bRef} />
    </div>
  );
}
