import { useEffect, useRef } from 'react';
import Magnet from '../bits/Magnet.jsx';
import { QUOTE_PAGE, SAMPLE_PAGE } from './Header.jsx';
import { finePointer, gsap, reduceMotion, SplitText, useGSAP } from '../motion.js';
import { Arrow, LogoMark, Phone, Chat, Doc } from './icons.jsx';

// Each line of the headline has its own width on Anybody's 50–150 axis, then is sized to fill the column.
const LINES = [
  { text: 'Websites', wdth: 150 },
  { text: 'that keep your', wdth: 58 },
  { text: 'phone ringing.', wdth: 108, hl: 'ringing.' }
];
const PINGS = [
  { Icon: Phone, title: 'Incoming call', text: 'Limassol · 99 •• •• 12' },
  { Icon: Chat, title: 'WhatsApp', text: '“Can you come today?”' },
  { Icon: Doc, title: 'New quote request', text: 'Kitchen renovation' }
];

export default function Hero() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const titleRef = useRef(null);

  // Layout (runs with reduced motion too): size the phone to the stage and fit each headline line to the column.
  useEffect(() => {
    const stage = stageRef.current;
    const title = titleRef.current;
    // The probe sits in a zero-size clipped box, so its 100px-tall test lines never widen the page.
    const probeBox = document.createElement('span');
    probeBox.className = 'hero__probe-box';
    const probe = probeBox.appendChild(document.createElement('span'));
    probe.className = 'hero__probe';
    title.appendChild(probeBox);
    const layout = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight || innerHeight;
      const pw = Math.round(Math.min(300, W * 0.7, (H * 0.82 * 9) / 19.5));
      const ph = Math.round((pw * 19.5) / 9);
      stage.style.setProperty('--pw', `${pw}px`);
      stage.style.setProperty('--ph', `${ph}px`);
      // Where the screen's edges end up when it has shrunk into the phone (read by the clip-path in CSS).
      stage.style.setProperty('--cx', `${(W - pw) / 2}px`);
      stage.style.setProperty('--cy', `${(H - ph) / 2}px`);
      const lines = [...title.querySelectorAll('.hero__line')];
      // Measure on a hidden probe at each line's final width, so a running entrance animation can't skew it.
      const sizes = lines.map(line => {
        probe.style.fontStretch = `${line.dataset.wdth}%`;
        probe.textContent = line.dataset.text;
        return (98.5 * title.clientWidth) / probe.offsetWidth; // 1.5% spare for sub-pixel rounding of the split letters
      });
      const k = Math.min(1, (H * 0.5) / sizes.reduce((sum, s) => sum + s * 0.9, 0));
      lines.forEach((line, i) => (line.style.fontSize = `${(sizes[i] * k).toFixed(1)}px`));
    };
    layout();
    document.fonts?.ready.then(layout);
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    return () => {
      ro.disconnect();
      probeBox.remove();
    };
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) return;
      const lines = gsap.utils.toArray('.hero__line', rootRef.current);

      // Entrance: letters rise out of masks while each line stretches out to its full width.
      // The stretch is a scaleX, not a font-stretch tween: transforms skip layout, so the page doesn't shift.
      const split = SplitText.create(lines, { type: 'chars', mask: 'chars', aria: 'none' });
      gsap
        .timeline({ delay: 0.1 })
        .from(split.chars, { yPercent: 118, duration: 1.15, ease: 'expo.out', stagger: 0.02 }, 0)
        .from(lines, { scaleX: 0.55, transformOrigin: '0% 50%', duration: 1.7, ease: 'expo.out', stagger: 0.12 }, 0)
        .from(
          '.hero__meta, .hero__sub, .hero__ctas, .hero__foot',
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.08
          },
          0.5
        );

      // Scroll: the page zooms out, morphs into a phone screen on blueprint paper, then gets measured and rings.
      // Every layer's starting state lives in CSS (.motion …) and is only tweened *to* here, so a ScrollTrigger refresh
      // can never show a later layer early. --z drives the screen's clip-path from full stage to the phone's rectangle.
      // Built per breakpoint: below 1000px the notes and dimension lines are display: none, and GSAP forces a page
      // layout for every hidden element it touches.
      gsap
        .matchMedia(rootRef.current)
        .add({ wide: '(min-width: 1000px)', narrow: '(max-width: 999px)' }, ({ conditions }) => {
          const tl = gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: '.hero__track', start: 'top top', end: 'bottom bottom', scrub: 0.5 }
            })
            .to('.hero__text', { scale: 0.8, opacity: 0, duration: 0.3 }, 0)
            .to('.hero__lower', { autoAlpha: 0, duration: 0.15 }, 0)
            .to('.hero__screen', { '--z': 1, duration: 0.42, ease: 'power2.inOut' }, 0.08)
            .to('.hero__paper', { autoAlpha: 1, duration: 0.22 }, 0.12)
            .to('.hero__phone', { autoAlpha: 1, scale: 1, duration: 0.12 }, 0.46)
            .to('.hero__caption > *', { opacity: 1, y: 0, duration: 0.12, stagger: 0.04 }, 0.52);
          if (conditions.wide)
            tl.to('.hero__dim', { scale: 1, duration: 0.1, stagger: 0.05 }, 0.58).to(
              '.hero__note',
              { opacity: 1, y: 0, duration: 0.1, stagger: 0.04 },
              0.62
            );
          tl.to('.phone__thumb', { opacity: 1, scale: 1, duration: 0.12 }, 0.64)
            .to('.hero__ping', { opacity: 1, y: 0, scale: 1, duration: 0.09, stagger: 0.07, ease: 'back.out(2)' }, 0.7)
            .to({}, { duration: 0.12 });
        });
    },
    { scope: rootRef }
  );

  return (
    <section id="top" ref={rootRef} className="hero" tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero__track">
        <div ref={stageRef} className="hero__stage">
          <div className="hero__paper" aria-hidden="true">
            <div className="hero__caption">
              <p className="mono">Fig. 02 — Mobile, 1:1</p>
              <p className="hero__caption-text">Built for the phone in your customer’s hand.</p>
            </div>
            <span className="hero__dim hero__dim--w">
              <span>72 mm</span>
            </span>
            <span className="hero__dim hero__dim--h">
              <span>150 mm</span>
            </span>
            <p className="hero__note hero__note--a">Call button inside thumb reach</p>
            <p className="hero__note hero__note--b">WhatsApp in one tap</p>
            <p className="hero__note hero__note--c">Quote form, four fields</p>
          </div>

          <div className="hero__phone" aria-hidden="true">
            <div className="hero__phone-screen">
              <div className="mini">
                <div className="mini__nav">
                  <LogoMark className="mini__logo" /> wabia <span className="mini__menu" />
                </div>
                <p className="mini__h">
                  Websites that keep your phone <span>ringing.</span>
                </p>
                <p className="mini__p">Fixed-price websites for trades across Cyprus.</p>
                <span className="mini__btn">
                  Request a quote <Arrow />
                </span>
                <span className="mini__rows">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <span className="phone__thumb" />
            </div>
          </div>

          <div className="hero__pings" aria-hidden="true">
            {PINGS.map(({ Icon, title, text }) => (
              <div key={title} className="hero__ping">
                <span className="hero__ping-icon">
                  <Icon />
                </span>
                <span>
                  <strong>{title}</strong>
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="hero__screen">
            <div className="hero__inner wrap">
              <div className="hero__text">
                <div className="hero__meta mono">
                  <span>Wabia — web design for trades</span>
                  <span className="hero__coords">Cyprus · 35.1° N 33.4° E</span>
                </div>
                <h1 id="hero-title" ref={titleRef} className="hero__title">
                  <span className="sr-only">{LINES.map(l => l.text).join(' ')}</span>
                  {LINES.map(({ text, wdth, hl }) => (
                    <span
                      key={text}
                      aria-hidden="true"
                      className="hero__line"
                      data-text={text}
                      data-wdth={wdth}
                      style={{ fontStretch: `${wdth}%` }}
                    >
                      {hl ? text.replace(hl, '') : text}
                      {hl && <span className="hl">{hl}</span>}{' '}
                    </span>
                  ))}
                </h1>
                <p className="hero__sub">
                  Fixed-price websites for trades and home service businesses in Cyprus. Show what you do, where you
                  work, and let customers request a quote online.
                </p>
              </div>
              <div className="hero__lower">
                <div className="hero__ctas">
                  <Magnet disabled={!finePointer || reduceMotion} padding={60} magnetStrength={3}>
                    <a className="btn btn--lime btn--lg" href={QUOTE_PAGE} data-cursor-label="Quote">
                      Request a quote <Arrow className="btn__arrow" />
                    </a>
                  </Magnet>
                  <a className="btn btn--ghost btn--lg" href={SAMPLE_PAGE} data-cursor-label="Try">
                    Try a sample website
                  </a>
                </div>
                <div className="hero__foot mono" aria-hidden="true">
                  <span className="hero__fig">Fig. 01 — Desktop, 1:1</span>
                  <span className="hero__cue">Scroll to zoom out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
