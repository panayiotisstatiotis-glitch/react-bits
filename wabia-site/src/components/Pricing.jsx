import { useLenis } from 'lenis/react';
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

// Wide and tall enough to hold the stage on screen and show each plan on its own before all three together.
const HOLD = '(min-width: 1000px) and (min-height: 760px)';
const COUNT = ['Plan 1 of 3', 'Plan 2 of 3', 'Plan 3 of 3', 'Compare all three'];

// What every price includes, said next to the prices.
const FACTS = [
  ['VAT', 'Included in every price'],
  ['Support', 'For life, after launch'],
  ['Hosting', 'Not included']
];

export default function Pricing() {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);
  lenisRef.current = useLenis();

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

      // Two outlined bands drift behind the cards in opposite directions, at the speed you scroll.
      const across = { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.to('.pricing__band--a span', { xPercent: -50, ease: 'none', scrollTrigger: across });
      gsap.fromTo('.pricing__band--b span', { xPercent: -50 }, { xPercent: 0, ease: 'none', scrollTrigger: across });

      // VAT, support and hosting rise in one after another.
      gsap.from('.pricing__facts > div', {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.pricing__facts', start: 'top 92%', end: 'top 62%', scrub: 0.5 }
      });

      // A card comes alive: its price rolls like a mechanical counter, the stamp lands, the tape unrolls, its features
      // tick off and a sheen runs across it. k stretches the timings.
      const alive = (tl, ticket, at, k = 1) => {
        tl.to(
          ticket.querySelectorAll('.odo__reel'),
          { yPercent: (n, el) => -el.dataset.d * 10, duration: 0.9 * k, stagger: 0.08 * k, ease: 'power2.out' },
          at
        )
          .to(
            ticket.querySelector('.ticket__stamp'),
            {
              autoAlpha: ticket.classList.contains('ticket--lime') ? 1 : 0.85,
              scale: 1,
              rotation: -12,
              duration: 0.3 * k,
              ease: 'back.out(2)'
            },
            at + 0.55 * k
          )
          .to(ticket.querySelectorAll('.ticket__features li'), { opacity: 1, duration: 0.3 * k, stagger: 0.06 * k }, at)
          .to(
            ticket.querySelectorAll('.ticket__features svg'),
            { scale: 1, duration: 0.25 * k, stagger: 0.06 * k, ease: 'back.out(3)' },
            at
          )
          .fromTo(
            ticket.querySelector('.ticket__sweep'),
            { xPercent: 0 },
            { xPercent: 200, duration: 0.8 * k },
            at + 0.3 * k
          );
        const tape = ticket.querySelector('.ticket__tape');
        if (tape) tl.fromTo(tape, { scaleX: 0 }, { scaleX: 1, duration: 0.5 * k }, at + 0.2 * k);
        return tl;
      };

      gsap
        .matchMedia(rootRef.current)
        .add(
          { hold: HOLD, wide: `(min-width: 1000px) and (max-height: 759px)`, narrow: '(max-width: 999px)' },
          ({ conditions }) => {
            const tickets = gsap.utils.toArray('.ticket');

            if (conditions.hold) {
              // Hold: the stage stays under the header while each plan takes the centre on its own, its name huge behind
              // it, then all three come back and spread into their columns to compare.
              const names = gsap.utils.toArray('.pricing__solo span');
              const headerH = () =>
                parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
              const centre = i => (1 - i) * (tickets[1].offsetLeft - tickets[0].offsetLeft);
              const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: '.pricing__track',
                  start: () => `top ${headerH()}px`,
                  end: 'bottom bottom',
                  scrub: 0.6,
                  invalidateOnRefresh: true
                },
                // Only the cards on show take clicks: the hidden ones sit in the same spot.
                onUpdate: () =>
                  tickets.forEach(t => (t.style.pointerEvents = gsap.getProperty(t, 'opacity') > 0.5 ? '' : 'none'))
              });
              const tilt = [-5, 4, -4];
              // The drifting bands step back while each plan has the stage, and return for the comparison.
              tl.fromTo('.pricing__band', { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0).to(
                '.pricing__band',
                { opacity: 1, duration: 0.5 },
                4.4
              );
              tickets.forEach((t, i) => {
                const at = i * 1.5;
                tl.fromTo(
                  t,
                  { x: () => centre(i), y: 160, rotation: tilt[i], scale: 0.92, opacity: 0 },
                  { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
                  at
                ).fromTo(
                  names[i],
                  { opacity: 0, scale: 0.9 },
                  { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
                  at
                );
                alive(tl, t, at + 0.3, 0.6);
                tl.to('.pricing__reel', { yPercent: -25 * i, duration: 0.2 }, at);
                tl.to(names[i], { opacity: 0, scale: 1.08, duration: 0.4 }, at + 1.2);
                // Each plan steps aside for the next; after the last, all three come back together.
                if (i < 2)
                  tl.to(
                    t,
                    { y: -120, rotation: -tilt[i], scale: 0.92, opacity: 0, duration: 0.4, ease: 'power2.in' },
                    at + 1.2
                  );
              });
              tl.to(
                tickets.slice(0, 2),
                { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
                4.4
              )
                .to(tickets, { x: 0, duration: 0.8, ease: 'power2.inOut' }, 4.4)
                .to('.pricing__reel', { yPercent: -75, duration: 0.2 }, 4.4)
                .to({}, { duration: 0.6 });

              // Tabbing into a card skips to the end of the scene, so the focused button is never on a hidden card.
              const row = rootRef.current.querySelector('.tickets');
              const onFocus = () => {
                const end = tl.scrollTrigger.end;
                if (scrollY >= end - 1) return;
                if (lenisRef.current) lenisRef.current.scrollTo(end, { immediate: true, force: true });
                else window.scrollTo(0, end);
              };
              row.addEventListener('focusin', onFocus);
              return () => {
                row.removeEventListener('focusin', onFocus);
                tickets.forEach(t => (t.style.pointerEvents = ''));
              };
            }

            // Free (shorter or narrower screens): the cards deal in, rising with a tilt and settling one after another, and
            // finish before the row is fully on screen, so from then on they hold still. Opacity (not visibility) keeps
            // their buttons reachable by keyboard throughout.
            const tilt = [-6, 3, 6];
            const dealt = i => ({ y: 160, rotation: tilt[i], scale: 0.9, opacity: 0 });
            const settled = { y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out' };
            if (conditions.wide)
              gsap.fromTo(
                tickets,
                { ...dealt(0), rotation: i => tilt[i] },
                {
                  ...settled,
                  stagger: 0.15,
                  scrollTrigger: { trigger: '.tickets', start: 'top 98%', end: 'top 45%', scrub: 0.6 }
                }
              );
            // Stacked: each card deals in as it reaches the screen.
            else
              tickets.forEach((t, i) =>
                gsap.fromTo(t, dealt(i), {
                  ...settled,
                  scrollTrigger: { trigger: t, start: 'top 98%', end: 'top 70%', scrub: 0.6 }
                })
              );
            // Each card comes alive once as it scrolls into view.
            tickets.forEach(t =>
              alive(
                gsap.timeline({
                  scrollTrigger: { trigger: t.querySelector('.ticket__price'), start: 'top 85%', once: true }
                }),
                t,
                0
              )
            );
          }
        );

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
        <dl className="pricing__facts">
          {FACTS.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="pricing__track">
          <div className="pricing__stage">
            <div className="pricing__deck">
              <p className="pricing__solo" aria-hidden="true">
                {PLANS.map(({ name }) => (
                  <span key={name}>{name}</span>
                ))}
              </p>
              <p className="pricing__count mono" aria-hidden="true">
                <span className="pricing__reel">
                  {COUNT.map(c => (
                    <span key={c}>{c}</span>
                  ))}
                </span>
              </p>
              <p className="pricing__band pricing__band--a" aria-hidden="true">
                <span>Fixed price · No surprises · Fixed price · No surprises · </span>
              </p>
              <p className="pricing__band pricing__band--b" aria-hidden="true">
                <span>VAT included · Support for life · VAT included · Support for life · </span>
              </p>
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
                      <span className="ticket__sweep" aria-hidden="true" />
                    </SpotlightCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="pricing__note" data-reveal>
          Prices cover designing and building your site, VAT included. Hosting and your domain name are separate running
          costs: your written quote lists them before you pay anything.
        </p>
      </div>
    </section>
  );
}
