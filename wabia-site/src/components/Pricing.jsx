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
  return (
    <section id="pricing" className="pricing section overlap" tabIndex={-1} aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Pricing</p>
          <h2 id="pricing-title" className="display h2">
            Fixed prices. No surprises.
          </h2>
          <p className="section-lede">
            Pick a starting point and we’ll confirm the exact price in writing before any work begins.
          </p>
        </div>
        <div className="plans">
          {PLANS.map(({ name, price, featured, pitch, includes, features, time }, i) => (
            <article
              key={name}
              className={featured ? 'plan plan--featured' : 'plan'}
              data-reveal
              style={{ '--delay': `${[0, 80, 140][i]}ms` }}
              aria-labelledby={`plan-${name}`}
            >
              <div className="plan__top">
                <h3 id={`plan-${name}`} className="plan__name">
                  {name}
                </h3>
                {featured && <p className="plan__badge">Our pick for most trades</p>}
              </div>
              <p className="plan__price">
                <span className="plan__currency">€</span>
                {price}
              </p>
              <p className="plan__terms">Fixed price</p>
              <p className="plan__pitch">{pitch}</p>
              <p className="plan__includes">{includes}:</p>
              <ul className="plan__features">
                {features.map(f => (
                  <li key={f}>
                    <Check className="plan__check" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="plan__time">{time}</p>
              <a className="btn btn--block btn--dark" href="#quote">
                Request a quote <Arrow className="btn__arrow" />
              </a>
            </article>
          ))}
        </div>
        <p className="pricing__note">
          Prices cover designing and building your site. Your written quote lists any running costs, like your domain
          name, before you pay anything.
        </p>
      </div>
    </section>
  );
}
