import { useEffect, useRef } from 'react';
import SpotlightCard from '../bits/SpotlightCard.jsx';
import { finePointer, gsap, reduceMotion, SplitText, useGSAP } from '../motion.js';
import { Arrow, Check } from './icons.jsx';

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
      'Google Maps and opening hours'
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
    () => {
      if (reduceMotion) return;
      const title = SplitText.create('.pricing__title', { type: 'words,chars', mask: 'chars' });
      gsap.from(title.chars, {
        yPercent: 118,
        stagger: 0.016,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pricing__title', start: 'top 82%', once: true }
      });

      // Tickets print out of a slot, the prices count up, then the FIXED PRICE stamp lands on each one.
      const tickets = gsap.utils.toArray('.ticket');
      gsap
        .timeline({ scrollTrigger: { trigger: '.tickets', start: 'top 78%', once: true } })
        .from(tickets, { clipPath: 'inset(0% 0% 100% 0%)', y: -36, duration: 1.1, ease: 'expo.out', stagger: 0.16 })
        .from(
          '.ticket__num',
          { textContent: 0, snap: { textContent: 1 }, duration: 1.3, ease: 'power2.out', stagger: 0.16 },
          0.2
        )
        .from(
          '.ticket__stamp',
          { autoAlpha: 0, scale: 2.6, rotate: -32, duration: 0.55, ease: 'back.out(2)', stagger: 0.16 },
          0.95
        );

      // With a mouse, each ticket tilts toward the cursor like a card held in the hand.
      if (!finePointer) return;
      tickets.forEach(ticket => {
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
        <div className="tickets">
          {PLANS.map(({ name, price, featured, pitch, includes, features, time }) => (
            <SpotlightCard
              key={name}
              theme="light"
              className={featured ? 'ticket ticket--lime' : 'ticket'}
              spotlightColor={featured ? '#0a0b0f' : '#b8f23d'}
              intensity={0.22}
              spotlightSize={320}
              style={featured ? { '--spotlight-card-surface': '#b8f23d' } : undefined}
              aria-labelledby={`plan-${name}`}
            >
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
                  <span className="ticket__num">{price}</span>
                </span>
              </p>
              <p className="ticket__terms mono">
                {featured ? 'Fixed price · our pick for most trades' : 'Fixed price'}
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
              <a className="btn btn--ink btn--block" href="#quote" data-cursor-label="Pick">
                Request a quote <Arrow className="btn__arrow" />
              </a>
              <span className="ticket__barcode" aria-hidden="true" />
              <span className="ticket__stamp" aria-hidden="true">
                Fixed price
              </span>
            </SpotlightCard>
          ))}
        </div>
        <p className="pricing__note" data-reveal>
          Prices cover designing and building your site. Your written quote lists any running costs, like your domain
          name, before you pay anything.
        </p>
      </div>
    </section>
  );
}
