import { useSyncExternalStore } from 'react';
import { AREAS, useDrosiaDemo } from './drosia-demo.jsx';
import { SAMPLE_PAGE } from './Header.jsx';
import { Arrow, Building, Check, Gauge, HouseDrawing, Snow, Wave, Wrench } from './icons.jsx';
import './concepts.css';

// Mock sites for three fictional businesses. They're pictures of a website (aria-hidden by the phone frame);
// the card text next to each phone describes them. A live phone keeps its bar and screen usable (see DrosiaDemo).

export function Phone({ children, bar, screen, tone = 'light', live = false }) {
  return (
    <div className={`phone phone--${tone}`} aria-hidden={live ? undefined : 'true'}>
      <div className="phone__screen">
        <div className="phone__status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone__icons">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="phone__page" aria-hidden={live ? 'true' : undefined}>
          {children}
        </div>
        {bar && <div className="phone__bar">{bar}</div>}
        {screen}
      </div>
    </div>
  );
}

export const DrosiaPage = () => (
  <div className="mock mock--drosia">
    <div className="m-nav">
      <span className="m-logo">
        <Snow /> drosia
      </span>
      <span className="m-burger" />
    </div>
    <div className="d-dial">
      <svg viewBox="0 0 200 200" className="d-ring">
        <circle cx="100" cy="100" r="84" className="d-track" />
        <circle cx="100" cy="100" r="84" className="d-arc" pathLength="100" />
      </svg>
      <svg viewBox="0 0 200 200" className="d-ticks">
        {Array.from({ length: 36 }, (_, i) => (
          <line key={i} x1="100" y1="6" x2="100" y2={i % 3 ? 12 : 16} transform={`rotate(${i * 10} 100 100)`} />
        ))}
      </svg>
      <div className="d-temp">
        <b>18°</b>
        <span>Cooling · living room</span>
      </div>
    </div>
    <div className="m-kicker">Larnaca · 7 days a week</div>
    <div className="m-h1">Cool again by tonight.</div>
    <div className="m-p">Air-con installation, servicing and repairs across Larnaca district.</div>
    <div className="d-slot">
      <i /> Next free slot · Today 15:30
    </div>
    <div className="m-label">Services</div>
    <div className="d-grid">
      <span>
        <Snow />
        Installation<small>Split &amp; multi-split</small>
      </span>
      <span>
        <Wrench />
        Repairs<small>All major brands</small>
      </span>
      <span>
        <Gauge />
        Servicing<small>Clean &amp; gas check</small>
      </span>
      <span>
        <Building />
        Shops &amp; offices<small>Ducted systems</small>
      </span>
    </div>
    <div className="m-label">Areas we cover</div>
    <div className="m-chips">
      {AREAS.map(a => (
        <span key={a}>{a}</span>
      ))}
    </div>
    <div className="d-why">
      <span>
        <Check /> F-gas certified technicians
      </span>
      <span>
        <Check /> Fixed callout price
      </span>
      <span>
        <Check /> Old units taken away
      </span>
    </div>
  </div>
);

const NARROW = '(max-width: 759px)';
const narrowNow = () => window.matchMedia(NARROW).matches;
const onNarrow = change => {
  const query = window.matchMedia(NARROW);
  query.addEventListener('change', change);
  return () => query.removeEventListener('change', change);
};

// In Work: the air-con concept's phone, tappable. On phones it's too small to tap through, so its buttons open the
// full-size sample website instead, with the same journey started.
export function DrosiaDemo() {
  const narrow = useSyncExternalStore(onNarrow, narrowNow);
  const { bar, screen } = useDrosiaDemo({ linkTo: narrow ? SAMPLE_PAGE : undefined });
  return (
    <Phone tone="dark" live screen={screen} bar={bar}>
      <DrosiaPage />
    </Phone>
  );
}

export const PetrinoPage = () => (
  <div className="mock mock--petrino">
    <div className="m-nav">
      <span className="p-word">Petrino</span>
      <span className="m-burger" />
    </div>
    <div className="m-kicker">Renovations · Limassol</div>
    <div className="p-h1">
      Built
      <br />
      to last.
    </div>
    <div className="p-drawing">
      <HouseDrawing />
      <div className="p-block">
        <span>Stone house, Platres</span>
        <span>DWG A-201 · 1:50</span>
      </div>
    </div>
    <div className="m-p">
      Kitchens, bathrooms and full renovations. One team from the first visit to the final clean.
    </div>
    <div className="p-ba">
      <span className="p-before">Before</span>
      <span className="p-after">After</span>
      <i className="p-handle" />
    </div>
    <div className="m-label">Recent projects</div>
    <div className="p-projects">
      {[
        ['2026', 'Stone house, Platres'],
        ['2025', 'Kitchen, Germasogeia'],
        ['2025', 'Bathroom, Agios Athanasios'],
        ['2024', 'Villa refit, Pissouri']
      ].map(([y, p]) => (
        <span key={p}>
          <b>{y}</b>
          {p}
          <Arrow />
        </span>
      ))}
    </div>
    <div className="m-label">How we work</div>
    <div className="p-steps">
      <span>
        <b>01</b> Site visit
      </span>
      <span>
        <b>02</b> Fixed quote
      </span>
      <span>
        <b>03</b> Build &amp; handover
      </span>
    </div>
  </div>
);

export const PetrinoBar = () => (
  <span className="m-btn m-dark m-wide">
    Book a site visit <Arrow />
  </span>
);

export const KymaPage = () => (
  <div className="mock mock--kyma">
    <div className="k-banner">Now booking summer plans</div>
    <div className="m-nav">
      <span className="m-logo">
        <Wave /> kyma
      </span>
      <span className="k-lang">EN · ΕΛ</span>
    </div>
    <div className="m-h1">Clear water, every week.</div>
    <div className="m-p">Pool cleaning and care in Paphos, Peyia and Coral Bay.</div>
    <div className="k-pool">
      <svg viewBox="0 0 240 90" preserveAspectRatio="none" className="k-waves">
        <path d="M0 22q15-10 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0" />
        <path d="M0 46q15-10 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0" />
        <path d="M0 70q15-10 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0" />
      </svg>
      <div className="k-check">
        <span>
          pH <b>7.4</b>
        </span>
        <span>
          Chlorine <b>1.5 ppm</b>
        </span>
        <span>
          Water <b>27 °C</b>
        </span>
      </div>
    </div>
    <div className="k-seg">
      <span className="is-on">Weekly</span>
      <span>Fortnightly</span>
      <span>One-off</span>
    </div>
    <div className="k-plan">
      <b>Weekly visit</b>
      <span>Clean, test &amp; balance, with a photo report after every visit.</span>
    </div>
    <div className="m-checks">
      {['Skim, brush & vacuum', 'Filter & pump check', 'Chemicals balanced on site'].map(c => (
        <span key={c}>
          <Check /> {c}
        </span>
      ))}
    </div>
  </div>
);

export const KymaBar = () => <span className="m-btn m-dark m-wide">Message us on WhatsApp</span>;
