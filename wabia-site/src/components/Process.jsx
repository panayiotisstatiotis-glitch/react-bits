import { useRef } from 'react';
import { gsap, reduceMotion, SplitText, useGSAP } from '../motion.js';

const STEPS = [
  {
    title: 'Enquiry',
    time: 'Day 1',
    text: 'Send the form below. We reply within one working day with a few questions about your business.'
  },
  {
    title: 'Fixed quote',
    time: 'Days 2–3',
    text: 'A short call to agree the pages, wording and photos. Then a fixed price in writing. Nothing starts until you approve it.'
  },
  {
    title: 'Design & build',
    time: 'Weeks 1–2',
    text: 'You check the design on your own phone and tell us what to change. Then we build it, fast and mobile-first.'
  },
  {
    title: 'Launch',
    time: 'Launch day',
    text: 'We connect your domain, test every call and quote button, and go live. Your site is ready to share.'
  }
];

export default function Process() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (reduceMotion) return;
      // The blueprint sheet zooms up to full size as it arrives.
      gsap.fromTo(
        '.process__sheet',
        { scale: 0.84, borderRadius: 72 },
        {
          scale: 1,
          borderRadius: 0,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'top 15%', scrub: true }
        }
      );
      const title = SplitText.create('.process__title', { type: 'words,chars', mask: 'chars' });
      gsap.from(title.chars, {
        yPercent: 118,
        stagger: 0.018,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.process__title', start: 'top 80%', once: true }
      });

      // The hi-vis tape pulls out along the steps; each step gets ticked off as the tape reaches it.
      const mm = gsap.matchMedia();
      mm.add({ wide: '(min-width: 1000px)', narrow: '(max-width: 999px)' }, ({ conditions }) => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 75%', scrub: 0.5 }
        });
        tl.to('.tl__fill', conditions.wide ? { scaleX: 1 } : { scaleY: 1 }, 0);
        gsap.utils.toArray('.tl__step').forEach((step, i, all) => {
          const at = i / (all.length - 1) - 0.02;
          tl.to(step.querySelector('.tick path'), { strokeDashoffset: 0, duration: 0.06 }, at)
            .to(step.querySelector('.tl__card'), { y: -10, duration: 0.06 }, at)
            .to(step.querySelector('.tl__pin'), { scale: 1.35, duration: 0.04, yoyo: true, repeat: 1 }, at);
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="process" ref={rootRef} className="process section" tabIndex={-1} aria-labelledby="process-title">
      <div className="process__sheet" aria-hidden="true" />
      <div className="wrap process__inner">
        <div className="process__head">
          <p className="eyebrow">Process</p>
          <h2 id="process-title" className="process__title">
            From enquiry to launch
          </h2>
          <p className="section-lede" data-reveal>
            Four steps, one fixed price, and you always know what happens next.
          </p>
        </div>
        <div className="tl">
          <div className="tl__tape" aria-hidden="true">
            <span className="tl__fill" />
          </div>
          <ol className="tl__steps">
            {STEPS.map(({ title, time, text }, i) => (
              <li key={title} className="tl__step">
                <span className="tl__pin" aria-hidden="true" />
                <div className="tl__card">
                  <span className="tick" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m5 12.5 4.2 4.2L19 7" pathLength="1" />
                    </svg>
                  </span>
                  <p className="tl__time mono">
                    Step 0{i + 1} · {time}
                  </p>
                  <h3 className="tl__title">{title}</h3>
                  <p className="tl__text">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
