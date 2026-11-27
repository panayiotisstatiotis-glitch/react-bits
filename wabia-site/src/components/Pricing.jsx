import { useEffect, useRef } from 'react';
import SpotlightCard from '../bits/SpotlightCard.jsx';
import { QUOTE_PAGE } from './Header.jsx';
import { finePointer, gsap, reduceMotion, riseTitle, useGSAP } from '../motion.js';
import { Arrow, Check } from './icons.jsx';
import Odometer from './Odometer.jsx';

const PLANS = [
  {
    name: 'Starter',
    price: 249,
    pitch: 'A one-page site that gets you found and called.',
    includes: 'What you get',
    features: [
      'One-page website',
      'Designed for phones first',
      'Tap-to-call and WhatsApp buttons',
      'Enquiry form to your inbox',
      'Google Maps and opening hours',
      'Lifetime support after launch'
    ],
    time: 'Live in about a week'
  },
  {
    name: 'Business',
    price: 459,
    featured: true,
    pitch: 'Room for your services, your best jobs and the areas you cover.',
    includes: 'Everything in Starter, plus',
    features: [
      'Up to 5 pages',
      'A page for each main service',
      'Photo gallery of your work',
      'Local search basics',
      'Google Business Profile set-up'
    ],
    time: 'Live in about two weeks'
  },
  {
    name: 'Pro',
    price: 889,
    pitch: 'A bilingual site built to win more local searches.',
    includes: 'Everything in Business, plus',
    features: [
      'Up to 10 pages',
      'Greek and English versions',
      'A page for each town you cover',
      'Quote form with photo upload',
      'Speed and search tuning'
    ],
    time: 'Live in about three weeks'
  }
];

// What every price includes, said next to the prices.
const FACTS = [
  ['VAT', 'Included in every price'],
  ['Support', 'For life, after launch'],
  ['Hosting', 'Not included']
];

export default function Pricing() {
  const rootRef = useRef(null);

  // The ticket's side notches sit on its perforation line, wherever the text above it puts that line.
  useEffect(() => {
    const tickets = [...rootRef.current.querySelectorAll('.ticket')];
    const place = () =>
      tickets.forEach(t => {
        const perf = t.querySelector('.ticket__perf');
        t.style.setProperty('--perf', `${perf.offsetTop + perf.offsetHeight / 2}px`);
      });
    place();
    const ro = new ResizeObserver(place);
    tickets.forEach(t => ro.observe(t));
    return () => ro.disconnect();
  }, []);

  useGSAP(
    (context, contextSafe) => {
      if (reduceMotion) return;
      riseTitle('.pricing__title', 'top 82%', 0.016, contextSafe);

      // The cards stay still so they can be compared at any point. Each one comes alive once as it scrolls into view:
      // the price rolls like a mechanical counter, the stamp lands, and its features tick off as they come into view.
      gsap.utils.toArray('.ticket').forEach(ticket => {
        const lime = ticket.classList.contains('ticket--lime');
        const once = el => ({ trigger: el, start: 'top 85%', once: true });
        const tl = gsap
          .timeline({ scrollTrigger: once(ticket.querySelector('.ticket__price')) })
          .to(ticket.querySelectorAll('.odo__reel'), {
            yPercent: (n, el) => -el.dataset.d * 10,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power2.out'
          })
          .to(
            ticket.querySelector('.ticket__stamp'),
            { autoAlpha: lime ? 1 : 0.85, scale: 1, rotation: -12, duration: 0.3, ease: 'back.out(2)' },
            0.55
          );
        if (lime)
          tl.fromTo(ticket.querySelector('.ticket__tape'), { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, 0.2).fromTo(
            ticket.querySelector('.ticket__sweep'),
            { xPercent: 0 },
            { xPercent: 200, duration: 0.9 },
            0.4
          );
        gsap
          .timeline({ scrollTrigger: once(ticket.querySelector('.ticket__features')) })
          .to(ticket.querySelectorAll('.ticket__features li'), { opacity: 1, duration: 0.3, stagger: 0.06 }, 0)
          .to(
            ticket.querySelectorAll('.ticket__features svg'),
            { scale: 1, duration: 0.25, stagger: 0.06, ease: 'back.out(3)' },
            0
          );
      });

      // With a mouse, each ticket tilts toward the cursor like a card held in the hand.
      if (!finePointer) return;
      gsap.utils.toArray('.ticket').forEach(ticket => {
        const rx = gsap.quickTo(ticket, 'rotationX', { duration: 0.6, ease: 'power3' });
        const ry = gsap.quickTo(ticket, 'rotationY', { duration: 0.6, ease: 'power3' });
        ticket.addEventListener('pointermove', e => {
          const r = ticket.getBoundingClientRect();
          rx(((e.clientY - r.top) / r.height - 0.5) * -10);
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        });
        ticket.addEventListener('pointerleave', () => {
          rx(0);
          ry(0);
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="pricing" ref={rootRef} className="pricing section" tabIndex={-1} aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Pricing</p>
          <h2 id="pricing-title" className="pricing__title">
            Fixed prices. No surprises.
          </h2>
          <p className="section-lede" data-reveal>
            Pick a starting point and we’ll confirm the exact price in writing before any work begins.
          </p>
        </div>
        <dl className="pricing__facts" data-reveal>
          {FACTS.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="tickets">
          {PLANS.map(({ name, price, featured, pitch, includes, features, time }) => (
            <div key={name} className="ticket-slot">
              <SpotlightCard
                theme="light"
                className={featured ? 'ticket ticket--lime' : 'ticket'}
                spotlightColor={featured ? '#0a0b0f' : '#b8f23d'}
                intensity={0.22}
                spotlightSize={320}
                style={featured ? { '--spotlight-card-surface': '#b8f23d' } : undefined}
                aria-labelledby={`plan-${name}`}
              >
                {featured && (
                  <span className="ticket__tape" aria-hidden="true">
                    Most picked · Most picked · Most picked
                  </span>
                )}
                <div className="ticket__head mono">
                  <span>Job ticket</span>
                  <span>Nº {String(price).padStart(4, '0')}</span>
                </div>
                <h3 id={`plan-${name}`} className="ticket__name">
                  {name}
                </h3>
                <p className="ticket__price">
                  <span className="sr-only">€{price}</span>
                  <span aria-hidden="true">
                    <span className="ticket__cur">€</span>
                    <Odometer value={price} />
                  </span>
                </p>
                <p className="ticket__terms mono">
                  {featured ? 'VAT included · our pick for most trades' : 'Fixed price · VAT included'}
                </p>
                <p className="ticket__pitch">{pitch}</p>
                <hr className="ticket__perf" />
                <p className="ticket__includes">{includes}:</p>
                <ul className="ticket__features">
                  {features.map(f => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="ticket__time mono">{time}</p>
                <a
                  className="btn btn--ink btn--block"
                  href={`${QUOTE_PAGE}?plan=${name.toLowerCase()}`}
                  data-cursor-label="Pick"
                >
                  Request a quote <Arrow className="btn__arrow" />
                </a>
                <span className="ticket__barcode" aria-hidden="true" />
                <span className="ticket__stamp" aria-hidden="true">
                  Fixed price
                </span>
                {featured && <span className="ticket__sweep" aria-hidden="true" />}
              </SpotlightCard>
            </div>
          ))}
        </div>
        <p className="pricing__note" data-reveal>
          Prices cover designing and building your site, VAT included. Hosting and your domain name are separate running
          costs: your written quote lists them before you pay anything.
        </p>
      </div>
    </section>
  );
}
