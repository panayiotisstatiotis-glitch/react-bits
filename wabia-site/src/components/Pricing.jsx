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

// Wide and tall enough for the printer scene to hold on screen with compact tickets.
const HOLD = '(min-width: 1000px) and (min-height: 760px)';

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

      // The giant outlined FIXED PRICE band drifts behind the tickets, faster the faster you scroll.
      gsap.to('.pricing__band span', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
      });

      // Hold: tickets feed out of the printer one by one, stacked in the middle, then fan out into their columns.
      // Free (phones, short screens): each ticket prints as it scrolls in. Either way the price rolls, the features
      // tick off and the stamp lands once a ticket is out.
      gsap.matchMedia(rootRef.current).add({ hold: HOLD, free: `not all and ${HOLD}` }, ({ conditions }) => {
        const slots = gsap.utils.toArray('.ticket-slot');
        const tickets = gsap.utils.toArray('.ticket');
        const tape = gsap.utils.toArray('.ticket__tape');
        const sweep = gsap.utils.toArray('.ticket__sweep');
        // Once a ticket is out its price rolls, the printer count moves on and the stamp lands with a bump...
        const roll = (t, i, at, k) =>
          t
            .to(
              tickets[i].querySelectorAll('.odo__reel'),
              {
                yPercent: (n, el) => -el.dataset.d * 10,
                duration: 0.35 * k,
                stagger: 0.05 * k,
                ease: 'power2.out'
              },
              at
            )
            .to('.printer__reel', { yPercent: (-100 / 3) * i, duration: 0.1 * k }, at)
            .to(
              tickets[i].querySelector('.ticket__stamp'),
              {
                autoAlpha: (n, el) => (el.closest('.ticket--lime') ? 1 : 0.85),
                scale: 1,
                rotation: -12,
                duration: 0.12 * k,
                ease: 'back.out(2)'
              },
              at + 0.15 * k
            )
            .to(tickets[i], { y: 3, duration: 0.03 * k, yoyo: true, repeat: 3 }, at + 0.2 * k);
        // ...and its features tick off one by one.
        const tick = (t, i, at, k) =>
          t
            .to(
              tickets[i].querySelectorAll('.ticket__features li'),
              { opacity: 1, duration: 0.2 * k, stagger: 0.04 * k },
              at
            )
            .to(
              tickets[i].querySelectorAll('.ticket__features svg'),
              { scale: 1, duration: 0.15 * k, stagger: 0.04 * k, ease: 'back.out(3)' },
              at
            );
        let doneAt; // scroll position where the focused ticket is printed and the focused control shows, for keyboard

        if (conditions.hold) {
          const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
          const col = () => tickets[1].offsetLeft - tickets[0].offsetLeft;
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.pricing__track',
              start: () => `top ${headerH()}px`,
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          });
          tl.fromTo(
            tickets,
            { yPercent: -100, clipPath: 'inset(100% 0% 0% 0%)' },
            { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, stagger: 0.6, ease: 'power1.out' },
            0
          ).fromTo(
            tickets,
            { x: i => (1 - i) * col(), rotation: i => [-4, 2, -1][i] },
            { x: 0, rotation: 0, duration: 0.6, ease: 'power2.inOut' },
            1.8
          );
          tickets.forEach((t, i) => tick(roll(tl, i, 0.6 * i + 0.4, 0.6), i, 0.6 * i + 0.45, 0.6));
          tl.fromTo(tape, { scaleX: 0 }, { scaleX: 1, duration: 0.25 }, 2.1)
            .fromTo(sweep, { xPercent: 0 }, { xPercent: 200, duration: 0.5 }, 2.15)
            .to({}, { duration: 0.3 });
          doneAt = () => tl.scrollTrigger.end;
        } else {
          tickets.forEach((t, i) => {
            gsap.fromTo(
              t,
              { yPercent: -30, clipPath: 'inset(30% 0% 0% 0%)' },
              {
                yPercent: 0,
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: 'none',
                scrollTrigger: { trigger: slots[i], start: 'top 95%', end: 'top 60%', scrub: 0.4 }
              }
            );
            // A phone ticket is taller than the screen, so each part plays as it comes into view.
            const when = el => ({ trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' });
            const out = roll(gsap.timeline({ scrollTrigger: when(t.querySelector('.ticket__price')) }), i, 0, 2);
            tick(gsap.timeline({ scrollTrigger: when(t.querySelector('.ticket__features')) }), i, 0, 2);
            if (t.classList.contains('ticket--lime'))
              out
                .fromTo(tape, { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, 0.3)
                .fromTo(sweep, { xPercent: 0 }, { xPercent: 200, duration: 0.9 }, 0.5);
          });
          // The ticket may still be sliding in, so place the control by its offset inside the ticket, from the
          // ticket's resting slot: far enough down that the print is done, and the control fully on screen.
          doneAt = (slot, el) => {
            const top = slot.getBoundingClientRect().top + scrollY;
            const bottom = top + el.getBoundingClientRect().bottom - slot.firstElementChild.getBoundingClientRect().top;
            return Math.max(top - innerHeight * 0.55, bottom - innerHeight + 24);
          };
        }

        // Tabbing into a ticket finishes its print first, so the focused button is never clipped away.
        const row = gsap.utils.toArray('.tickets')[0];
        const onFocus = e => {
          const y = doneAt(e.target.closest('.ticket-slot'), e.target);
          if (scrollY >= y - 1) return;
          if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
        };
        row.addEventListener('focusin', onFocus);
        return () => row.removeEventListener('focusin', onFocus);
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
        <div className="pricing__track">
          <div className="pricing__stage">
            <p className="pricing__band" aria-hidden="true">
              <span>Fixed price · No surprises · Fixed price · No surprises · </span>
            </p>
            <div className="printer" aria-hidden="true">
              <span className="printer__led" />
              <span className="printer__slot" />
              <span className="printer__count">
                Printing job tickets{' '}
                <span className="printer__n">
                  <span className="printer__reel">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </span>
                </span>
                /3
              </span>
            </div>
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
          </div>
        </div>
        <p className="pricing__note" data-reveal>
          Prices cover designing and building your site. Your written quote lists any running costs, like your domain
          name, before you pay anything.
        </p>
      </div>
    </section>
  );
}
