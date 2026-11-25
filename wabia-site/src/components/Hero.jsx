import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import { Arrow } from './icons.jsx';

const LINES = ['Websites that', 'keep your phone', 'ringing.'];

export default function Hero() {
  const innerRef = useRef(null);

  // Gentle depth: the hero drifts at a slower rate than the page and fades as it leaves.
  useLenis(({ scroll }) => {
    const el = innerRef.current;
    if (!el) return;
    const y = Math.min(scroll, innerHeight);
    el.style.transform = `translate3d(0, ${(y * 0.3).toFixed(1)}px, 0)`;
    el.style.opacity = String(1 - (y / innerHeight) * 0.9);
  });

  return (
    <section id="top" className="hero" tabIndex={-1} aria-labelledby="hero-title">
      <div ref={innerRef} className="hero__inner wrap">
        <p className="eyebrow hero__eyebrow">Web design for trades · Cyprus</p>
        <h1 id="hero-title" className="display hero__title">
          {LINES.map((line, i) => (
            <span key={line} className="hero__line">
              <span className={i === LINES.length - 1 ? 'hl' : undefined} style={{ '--i': i }}>
                {line}
              </span>{' '}
            </span>
          ))}
        </h1>
        <div className="hero__foot">
          <p className="hero__lede">
            Fixed-price websites for plumbers, electricians, air-con engineers, cleaners and builders across Cyprus.
            Designed for the phone in your customer’s hand.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--lime btn--lg" href="#quote">
              Request a quote <Arrow className="btn__arrow" />
            </a>
            <a className="btn btn--ghost btn--lg" href="#work">
              See concept designs
            </a>
          </div>
        </div>
        <ul className="hero__facts">
          <li>
            <strong>From €249</strong>
            <span>One fixed price, agreed up front</span>
          </li>
          <li>
            <strong>Mobile-first</strong>
            <span>Built for the phone, then the laptop</span>
          </li>
          <li>
            <strong>Made for trades</strong>
            <span>Call, WhatsApp and quote buttons</span>
          </li>
          <li className="hero__scroll" aria-hidden="true">
            Scroll to explore
          </li>
        </ul>
      </div>
    </section>
  );
}
