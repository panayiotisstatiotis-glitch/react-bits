import { useRef } from 'react';
import { gsap, reduceMotion, useGSAP } from '../motion.js';
import { DrosiaBar, DrosiaPage, KymaBar, KymaPage, PetrinoBar, PetrinoPage, Phone } from './Concepts.jsx';

const CONCEPTS = [
  {
    name: 'Drosia Air-Con',
    trade: 'Air-con installation & repair',
    town: 'Larnaca',
    build: 'Starter · 1 page',
    note: 'Dark, high-contrast design built around one big call button, with the next free slot on show.',
    features: ['Call button on every screen', 'Next free slot', 'Areas covered'],
    tone: 'dark',
    Page: DrosiaPage,
    Bar: DrosiaBar
  },
  {
    name: 'Petrino Builders',
    trade: 'Renovations',
    town: 'Limassol',
    build: 'Business · 5 pages',
    note: 'Editorial layout that lets finished projects sell the work, with a clear route to a site visit.',
    features: ['Project drawings', 'Before & after', 'Site visit booking'],
    tone: 'light',
    Page: PetrinoPage,
    Bar: PetrinoBar
  },
  {
    name: 'Kyma Pool Care',
    trade: 'Pool cleaning',
    town: 'Paphos',
    build: 'Pro · Greek & English',
    note: 'Friendly one-pager with simple plans, live water readings and booking over WhatsApp.',
    features: ['Greek & English', 'Plan picker', 'WhatsApp booking'],
    tone: 'light',
    Page: KymaPage,
    Bar: KymaBar
  }
];

export default function Work() {
  const rootRef = useRef(null);

  // Pinned showcase: each phone scrolls through its site, then zooms past you as the next one rises from behind.
  useGSAP(
    () => {
      if (reduceMotion) return;
      // Built per breakpoint: below 1000px the call-outs are display: none, and GSAP forces a page layout for every
      // hidden element it touches.
      gsap
        .matchMedia(rootRef.current)
        .add({ wide: '(min-width: 1000px)', narrow: '(max-width: 999px)' }, ({ conditions }) => {
          const infos = gsap.utils.toArray('.concept__info');
          const phones = gsap.utils.toArray('.concept__device');
          const bars = gsap.utils.toArray('.work__bar i');
          gsap.set(phones.slice(1), { autoAlpha: 0, scale: 0.7, yPercent: 10 });
          gsap.set(infos.slice(1), { autoAlpha: 0, y: 48 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.work__track',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          });
          phones.forEach((device, i) => {
            const screen = device.querySelector('.phone__screen');
            const page = device.querySelector('.phone__page');
            tl.to(page, { y: () => -(page.offsetHeight - screen.clientHeight), duration: 0.78 }, i).to(
              bars[i],
              { scaleX: 1, duration: 1 },
              i
            );
            if (conditions.wide)
              tl.to(
                device.querySelectorAll('.callout'),
                { autoAlpha: 1, scale: 1, duration: 0.12, stagger: 0.08 },
                i + 0.08
              );
            if (i === phones.length - 1) return;
            tl.to(device, { scale: 1.35, autoAlpha: 0, yPercent: -8, duration: 0.24, ease: 'power2.in' }, i + 0.8)
              .to(phones[i + 1], { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.3, ease: 'power2.out' }, i + 0.86)
              .to(infos[i], { autoAlpha: 0, y: -48, duration: 0.18 }, i + 0.8)
              .to(infos[i + 1], { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' }, i + 0.9);
          });
          tl.to({}, { duration: 0.15 });
        });
    },
    { scope: rootRef }
  );

  return (
    <section id="work" ref={rootRef} className="work" tabIndex={-1} aria-labelledby="work-title">
      <div className="work__track">
        <div className="work__stage wrap">
          <header className="work__head">
            <p className="eyebrow">Work</p>
            <h2 id="work-title" className="work__title">
              Concept designs
            </h2>
            <p className="work__lede" data-reveal>
              Sample sites for made-up Cyprus businesses, to show the kind of site we build. Concepts, not client
              projects.
            </p>
            <div className="work__bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </header>
          {CONCEPTS.map(({ name, trade, town, build, note, features, tone, Page, Bar }, i) => (
            <div key={name} className="concept">
              <div className="concept__info">
                <p className="concept__count mono">Concept 0{i + 1} / 03</p>
                <h3 className="concept__name">{name}</h3>
                <dl className="concept__spec">
                  <div>
                    <dt>Trade</dt>
                    <dd>{trade}</dd>
                  </div>
                  <div>
                    <dt>Town</dt>
                    <dd>{town}</dd>
                  </div>
                  <div>
                    <dt>Build</dt>
                    <dd>{build}</dd>
                  </div>
                </dl>
                <p className="concept__note">{note}</p>
                <p className="stamp">Concept · fictional business</p>
              </div>
              <div className="concept__device">
                <Phone tone={tone} bar={<Bar />}>
                  <Page />
                </Phone>
                {features.map((f, k) => (
                  <span key={f} className={`callout callout--${k}`} aria-hidden="true">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
