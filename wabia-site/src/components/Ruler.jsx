import { useLenis } from 'lenis/react';
import { useRef } from 'react';

const STEP = 80; // px of tape between numbers; each number is 10 cm
const LABELS = Array.from({ length: 90 }, (_, i) => i * 10);

// A tape measure on the right edge: the tape pulls out as you scroll and the lime line reads off the distance.
export default function Ruler() {
  const tapeRef = useRef(null);
  const readRef = useRef(null);

  useLenis(({ scroll }) => {
    if (!tapeRef.current) return;
    const pulled = scroll * 0.25;
    tapeRef.current.style.transform = `translate3d(0, ${(-pulled).toFixed(1)}px, 0)`;
    readRef.current.textContent = `${Math.round((pulled / STEP) * 10)} cm`;
  });

  return (
    <div className="ruler" aria-hidden="true">
      <div className="ruler__clip">
        <div ref={tapeRef} className="ruler__tape">
          {LABELS.map(n => (
            <span key={n} style={{ top: `${(n / 10) * STEP}px` }}>
              {n}
            </span>
          ))}
        </div>
      </div>
      <p className="ruler__read">
        <span ref={readRef}>0 cm</span>
      </p>
    </div>
  );
}
