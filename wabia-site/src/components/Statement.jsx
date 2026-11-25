import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import { progressAt } from '../scroll.js';

const SEGMENTS = [
  ['Your next customer is already searching.'],
  ['“AC repair Larnaca.”', true],
  ['“Emergency plumber Limassol.”', true],
  ['They call the first business that looks trustworthy on their phone. We make sure that’s you.']
];
const WORDS = SEGMENTS.flatMap(([text, hl]) => text.split(' ').map(word => [word, hl]));

export default function Statement() {
  const textRef = useRef(null);

  // Words light up as the paragraph passes a reading line ~70% down the screen.
  useLenis(() => {
    if (textRef.current) textRef.current.style.setProperty('--p', progressAt(textRef.current, 0.7).toFixed(3));
  });

  return (
    <section className="statement section" aria-labelledby="statement-title">
      <div className="wrap">
        <h2 id="statement-title" className="eyebrow">
          Why it matters
        </h2>
        <p ref={textRef} className="statement__text" style={{ '--n': WORDS.length }}>
          {WORDS.map(([word, hl], i) => (
            <span key={i} className={hl ? 'w hl' : 'w'} style={{ '--i': i }}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
