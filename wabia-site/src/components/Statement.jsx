import { useRef } from 'react';
import { gsap, reduceMotion, SplitText, useGSAP } from '../motion.js';
import { Search } from './icons.jsx';

const QUERY = 'emergency plumber limassol';
const STATEMENT =
  'Your next customer is already searching. “AC repair Larnaca.” “Emergency plumber Limassol.” They call the first business that looks trustworthy on their phone. We make sure that’s you.';

export default function Statement() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (reduceMotion) return;
      const text = rootRef.current.querySelector('.statement__visual');
      const split = SplitText.create(text, { type: 'words', aria: 'none' });
      const read = { trigger: text, start: 'top 85%', end: 'bottom 55%', scrub: true };

      // Words light up as you read down; the two searches get a lime highlighter stroke.
      gsap.fromTo(
        split.words,
        { opacity: 0.12, yPercent: 35 },
        { opacity: 1, yPercent: 0, ease: 'none', stagger: 0.08, scrollTrigger: read }
      );
      gsap.fromTo(
        '.statement .mark',
        { backgroundSize: '0% 100%', color: '#ffffff' },
        {
          backgroundSize: '100% 100%',
          color: '#0a0b0f',
          ease: 'none',
          stagger: 0.6,
          scrollTrigger: { ...read, end: 'center 50%' }
        }
      );

      // The search box types the query as you scroll, then "your business" climbs to the top result.
      const card = rootRef.current.querySelector('.search');
      const query = SplitText.create(card.querySelector('.search__query'), { type: 'chars', aria: 'none' });
      gsap
        .timeline({ scrollTrigger: { trigger: card, start: 'top 80%', end: 'bottom 40%', scrub: 0.4 } })
        .from(query.chars, { autoAlpha: 0, stagger: 0.02, duration: 0.02, ease: 'none' })
        .from('.search__row', { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.2, ease: 'power2.out' })
        .to('.search__row--you', { yPercent: -200, duration: 0.4, ease: 'power3.inOut' }, '+=0.1')
        .to('.search__row--other', { yPercent: 100, duration: 0.4, ease: 'power3.inOut' }, '<')
        .from('.search__badge', { autoAlpha: 0, scale: 0.6, duration: 0.15, ease: 'back.out(2.4)' });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="statement section" aria-labelledby="statement-title">
      <div className="wrap statement__layout">
        <div>
          <h2 id="statement-title" className="eyebrow">
            Why it matters
          </h2>
          <p className="statement__text">
            <span className="sr-only">{STATEMENT}</span>
            <span className="statement__visual" aria-hidden="true">
              Your next customer is already searching. <span className="mark">“AC repair Larnaca.”</span>{' '}
              <span className="mark">“Emergency plumber Limassol.”</span> They call the first business that looks
              trustworthy on their phone. We make sure that’s you.
            </span>
          </p>
        </div>
        <div className="search" aria-hidden="true">
          <div className="search__bar">
            <Search />
            <span className="search__query">{QUERY}</span>
            <span className="search__caret" />
          </div>
          <ol className="search__results">
            <li className="search__row search__row--other">
              <i />
              <span>
                <b />
                <em />
              </span>
            </li>
            <li className="search__row search__row--other">
              <i />
              <span>
                <b />
                <em />
              </span>
            </li>
            <li className="search__row search__row--you">
              <i />
              <span>
                <strong>Your business · Limassol</strong>
                <small>Fixed-price plumbing · Call now · Open today</small>
              </span>
              <span className="search__badge">You</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
