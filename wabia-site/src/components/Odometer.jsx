import { reduceMotion } from '../motion.js';

const REEL = [...'0123456789'];

// A price that rolls like a mechanical counter: each digit is a 0–9 reel that rolls up to its digit (data-d). The
// Pricing timeline does the rolling. With reduced motion it's just the number.
export default function Odometer({ value }) {
  if (reduceMotion) return <span className="ticket__num">{value}</span>;
  return (
    <span className="ticket__num">
      {[...String(value)].map((d, i) => (
        <span key={i} className="odo">
          <span className="odo__reel" data-d={d}>
            {REEL.map((n, k) => (
              <span key={k}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
