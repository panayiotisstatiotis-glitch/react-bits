import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import { clamp01 } from '../scroll.js';
import { Arrow, Check, HouseDrawing, Snow, Wave } from './icons.jsx';
import './concepts.css';

// Decorative previews of fictional sites. The visible card text describes each one, so the mock itself is aria-hidden.
function Phone({ children }) {
  const screenRef = useRef(null);
  const pageRef = useRef(null);

  // The mock site scrolls inside the phone while the phone travels up the screen.
  useLenis(() => {
    const screen = screenRef.current;
    const page = pageRef.current;
    if (!screen || !page) return;
    const r = screen.getBoundingClientRect();
    const q = clamp01((innerHeight * 0.9 - r.top) / (r.height + innerHeight * 0.6));
    page.style.transform = `translate3d(0, ${(-q * (page.offsetHeight - screen.clientHeight)).toFixed(1)}px, 0)`;
  });

  return (
    <div className="phone" aria-hidden="true">
      <div ref={screenRef} className="phone__screen">
        <div ref={pageRef} className="phone__page">
          {children}
        </div>
      </div>
    </div>
  );
}

const DrosiaPage = () => (
  <div className="mock mock--drosia">
    <div className="m-nav">
      <span className="m-logo">
        <Snow /> drosia
      </span>
      <span className="m-pill m-lime">Call now</span>
    </div>
    <div className="m-kicker">Larnaca · 7 days a week</div>
    <div className="m-h1">Cool again by tonight.</div>
    <div className="m-p">Air-con installation, servicing and repairs across Larnaca district.</div>
    <div className="m-row">
      <span className="m-btn m-lime">Call now</span>
      <span className="m-btn m-line">WhatsApp</span>
    </div>
    <div className="m-card">
      <strong>Same-day callouts</strong>
      <span>Book before 12:00 and we fix it today.</span>
    </div>
    <div className="m-label">Services</div>
    <div className="m-list">
      {['Installation', 'Servicing & cleaning', 'Repairs & gas top-up', 'Shops & offices'].map(s => (
        <span key={s}>
          {s} <Arrow />
        </span>
      ))}
    </div>
    <div className="m-label">Areas we cover</div>
    <div className="m-chips">
      {['Larnaca', 'Livadia', 'Aradippou', 'Oroklini', 'Dromolaxia', 'Pyla'].map(a => (
        <span key={a}>{a}</span>
      ))}
    </div>
    <div className="m-cta m-lime">
      Book a service <Arrow />
    </div>
  </div>
);

const PetrinoPage = () => (
  <div className="mock mock--petrino">
    <div className="m-nav">
      <span className="m-wordmark">Petrino</span>
      <span className="m-burger" />
    </div>
    <div className="m-kicker">Renovations · Limassol</div>
    <div className="m-h1">Built to last.</div>
    <div className="m-photo">
      <HouseDrawing />
      <span>Stone house restoration, Platres</span>
    </div>
    <div className="m-p">
      Kitchens, bathrooms and full renovations. One team from the first visit to the final clean.
    </div>
    <span className="m-btn m-dark">
      Book a site visit <Arrow />
    </span>
    <div className="m-label">Recent projects</div>
    <div className="m-projects">
      {['Stone house, Platres', 'Kitchen, Germasogeia', 'Bathroom, Agios Athanasios', 'Villa refit, Pissouri'].map(
        (p, i) => (
          <span key={p}>
            <b>0{i + 1}</b>
            {p}
          </span>
        )
      )}
    </div>
    <div className="m-grid">
      <span />
      <span />
      <span />
      <span />
    </div>
    <div className="m-label">How we work</div>
    <div className="m-steps">
      <span>Site visit</span>
      <span>Fixed quote</span>
      <span>Build &amp; handover</span>
    </div>
  </div>
);

const KymaPage = () => (
  <div className="mock mock--kyma">
    <div className="m-banner">Now booking summer plans</div>
    <div className="m-nav">
      <span className="m-logo">
        <Wave /> kyma
      </span>
      <span className="m-lang">EN · ΕΛ</span>
    </div>
    <div className="m-h1">Clear water, every week.</div>
    <div className="m-p">Pool cleaning and care in Paphos, Peyia and Coral Bay.</div>
    <span className="m-btn m-dark">Message us on WhatsApp</span>
    <div className="m-waves">
      <svg viewBox="0 0 120 44" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M0 10q7.5-6 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0M0 22q7.5-6 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0M0 34q7.5-6 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0" />
      </svg>
    </div>
    <div className="m-label">Plans</div>
    <div className="m-plans">
      <span>
        <strong>Weekly</strong>Clean, test &amp; balance
      </span>
      <span>
        <strong>Fortnightly</strong>For lighter-use pools
      </span>
      <span>
        <strong>One-off</strong>Before guests arrive
      </span>
    </div>
    <div className="m-checks">
      {['Chemical balance', 'Filter & pump check', 'Photo report after every visit'].map(c => (
        <span key={c}>
          <Check /> {c}
        </span>
      ))}
    </div>
    <div className="m-cta m-lime">Get a free quote</div>
  </div>
);

const CONCEPTS = [
  {
    name: 'Drosia Air-Con',
    trade: 'Air-con installation & repair · Larnaca',
    note: 'Dark, high-contrast design built around one big call button and same-day callouts.',
    Page: DrosiaPage
  },
  {
    name: 'Petrino Builders',
    trade: 'Renovations · Limassol',
    note: 'Editorial layout that lets finished projects sell the work, with a clear route to a site visit.',
    Page: PetrinoPage
  },
  {
    name: 'Kyma Pool Care',
    trade: 'Pool cleaning · Paphos',
    note: 'Friendly one-pager with simple plans, Greek and English, and booking over WhatsApp.',
    Page: KymaPage
  }
];

export default function Work() {
  return (
    <section id="work" className="work section" tabIndex={-1} aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Work</p>
          <h2 id="work-title" className="display h2">
            Concept designs
          </h2>
          <p className="section-lede">
            Three sample sites for made-up Cyprus businesses, to show the kind of site we build. These are concepts, not
            client projects.
          </p>
        </div>
        <div className="work__grid">
          {CONCEPTS.map(({ name, trade, note, Page }, i) => (
            <article key={name} className="concept" data-reveal style={{ '--delay': `${[0, 90, 160][i]}ms` }}>
              <div className="concept__device">
                <span className="concept__badge">Concept</span>
                <Phone>
                  <Page />
                </Phone>
              </div>
              <div className="concept__meta">
                <p className="concept__label">Concept 0{i + 1} · Fictional business</p>
                <h3 className="concept__name">{name}</h3>
                <p className="concept__trade">{trade}</p>
                <p className="concept__note">{note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
