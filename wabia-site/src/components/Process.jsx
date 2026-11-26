import { useRef } from 'react';
import { gsap, reduceMotion, riseTitle, ScrollTrigger, useGSAP } from '../motion.js';
import { Van } from './icons.jsx';

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
    (context, contextSafe) => {
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
      riseTitle('.process__title', 'top 80%', 0.018, contextSafe);

      // Wide: the stage holds while the van drives the job along the tape, step by step. Narrow: the tape runs down
      // the page and the van rides it. Start states (cards lying flat, stamps and LIVE hidden) live in CSS.
      gsap
        .matchMedia(rootRef.current)
        .add({ wide: '(min-width: 1000px)', narrow: '(max-width: 999px)' }, ({ conditions }) => {
          const steps = gsap.utils.toArray('.tl__step');
          const cards = steps.map(s => s.querySelector('.tl__card'));
          const ticks = steps.map(s => s.querySelector('.tick path'));
          const pins = steps.map(s => s.querySelector('.tl__pin'));
          const stamps = gsap.utils.toArray('.tl__stamp');
          const last = steps.length - 1;
          // Launch: the phone goes LIVE with a burst of sparks. k scales it into the scroll timeline's units.
          const addLaunch = (t, at, k = 1) =>
            t
              .to('.tl__live', { autoAlpha: 1, y: 0, duration: 0.4 * k }, at)
              .to('.tl__live-pill', { scale: 1, duration: 0.35 * k, ease: 'back.out(3)' }, at + 0.25 * k)
              .to('.tl__spark i', { scaleX: 1, duration: 0.25 * k, stagger: 0.02 * k }, at + 0.4 * k)
              .to('.tl__spark i', { opacity: 0, duration: 0.3 * k }, at + 0.75 * k);

          if (conditions.wide) {
            const strip = gsap.utils.toArray('.pboard__strip')[0];
            const step = () => steps[1].offsetLeft - steps[0].offsetLeft;
            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: '.process__track',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.6,
                invalidateOnRefresh: true
              }
            });
            tl.fromTo('.tl__num', { xPercent: 30 }, { xPercent: -30, duration: last + 0.4 }, 0);
            steps.forEach((s, i) => {
              if (i > 0) tl.to(cards[i], { rotationX: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, i - 0.5);
              tl.to(ticks[i], { strokeDashoffset: 0, duration: 0.15 }, i)
                .to(pins[i], { scale: 1.35, duration: 0.06, yoyo: true, repeat: 1 }, i)
                .to('.pboard__days', { yPercent: -25 * i, duration: 0.12, ease: 'power2.out' }, i);
              if (i === last) return;
              tl.to(stamps[i], { autoAlpha: 1, scale: 1, rotation: -12, duration: 0.12, ease: 'back.out(2)' }, i + 0.3)
                .to(cards[i], { x: 3, duration: 0.025, yoyo: true, repeat: 3 }, i + 0.36)
                .to(strip, { x: () => -step() * (i + 1), duration: 0.55, ease: 'power1.inOut' }, i + 0.45)
                .to(
                  '.van__wheel',
                  // SVG groups turn about their top-left by default; spin each wheel about its own hub.
                  { rotation: 540 * (i + 1), transformOrigin: '50% 50%', duration: 0.55, ease: 'power1.inOut' },
                  i + 0.45
                )
                .to('.van', { y: -3, duration: 0.07, yoyo: true, repeat: 7 }, i + 0.45);
            });
            addLaunch(tl, last + 0.05, 0.3).to({}, { duration: 0.4 });
            return;
          }

          const tape = gsap.utils.toArray('.tl__tape')[0];
          const van = gsap.utils.toArray('.pboard__van')[0];
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.tl',
              start: 'top 70%',
              end: 'bottom 75%',
              scrub: 0.5,
              invalidateOnRefresh: true
            }
          });
          // Duration 1 spans the whole scroll, like the step ticks placed from 0 to 1 below.
          tl.to('.tl__fill', { scaleY: 1, duration: 1 }, 0).to(
            van,
            { y: () => tape.offsetHeight - van.offsetHeight, duration: 1 },
            0
          );
          steps.forEach((s, i) => {
            const at = Math.max(0, i / last - 0.02);
            tl.to(ticks[i], { strokeDashoffset: 0, duration: 0.06 }, at).to(
              pins[i],
              { scale: 1.35, duration: 0.04, yoyo: true, repeat: 1 },
              at
            );
            gsap.to(cards[i], {
              rotationX: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: s, start: 'top 95%', end: 'top 62%', scrub: 0.4 }
            });
          });
          stamps.forEach((stamp, i) =>
            gsap.to(stamp, {
              autoAlpha: 1,
              scale: 1,
              rotation: -12,
              duration: 0.45,
              ease: 'back.out(2)',
              scrollTrigger: { trigger: cards[i], start: 'top 45%', toggleActions: 'play none none reverse' }
            })
          );
          const launch = addLaunch(gsap.timeline({ paused: true }), 0);
          ScrollTrigger.create({
            trigger: cards[last],
            start: 'top 45%',
            onEnter: () => launch.play(),
            onLeaveBack: () => launch.reverse()
          });
          gsap.fromTo(
            '.tl__num',
            { yPercent: 25 },
            {
              yPercent: -25,
              ease: 'none',
              scrollTrigger: { trigger: '.tl', start: 'top bottom', end: 'bottom top', scrub: true }
            }
          );
        });
    },
    { scope: rootRef }
  );

  return (
    <section id="process" ref={rootRef} className="process section" tabIndex={-1} aria-labelledby="process-title">
      <div className="process__track">
        <div className="process__stage">
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
            <div className="tl pboard">
              <div className="pboard__van" aria-hidden="true">
                <p className="pboard__day">
                  <span className="pboard__days">
                    {STEPS.map(({ time }) => (
                      <span key={time}>{time}</span>
                    ))}
                  </span>
                </p>
                <Van className="van" />
              </div>
              <span className="pboard__fill" aria-hidden="true" />
              <div className="pboard__strip">
                <div className="tl__tape" aria-hidden="true">
                  <span className="tl__fill" />
                </div>
                <ol className="tl__steps">
                  {STEPS.map(({ title, time, text }, i) => (
                    <li key={title} className="tl__step">
                      <span className="tl__num" aria-hidden="true">
                        0{i + 1}
                      </span>
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
                        {i < STEPS.length - 1 ? (
                          <span className="tl__stamp" aria-hidden="true">
                            Done
                          </span>
                        ) : (
                          <span className="tl__live" aria-hidden="true">
                            <span className="tl__live-phone">
                              <span className="tl__live-pill">Live</span>
                            </span>
                            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                              <span key={a} className="tl__spark" style={{ '--a': `${a}deg` }}>
                                <i />
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
