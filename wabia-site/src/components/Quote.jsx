import { useEffect, useRef, useState } from 'react';
import Magnet from '../bits/Magnet.jsx';
import { finePointer, gsap, reduceMotion, riseTitle, useGSAP } from '../motion.js';
import {
  BUSINESS_TYPES,
  CONTACT_WAYS,
  FIELDS,
  MUST_HAVES,
  OPTIONAL,
  PLANS,
  TIMELINES,
  validateQuote
} from '../quote.js';
import { Alert, Arrow, Check } from './icons.jsx';

// A plan chosen on a price ticket (quote.html?plan=business) arrives pre-selected.
const planFromUrl = () => {
  const plan = new URLSearchParams(location.search).get('plan');
  return PLANS.some(([id]) => id === plan) ? plan : '';
};

const EMPTY = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  contact: '',
  businessType: '',
  area: '',
  website: '',
  plan: '',
  features: [],
  timeline: '',
  details: '',
  fax: ''
};

function FieldError({ id, children }) {
  return (
    children && (
      <p id={`${id}-error`} className="field__error">
        <Alert /> {children}
      </p>
    )
  );
}

function Field({ id, n, label, hint, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {n && (
          <span className="field__n mono" aria-hidden="true">
            {String(n).padStart(2, '0')}
          </span>
        )}
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      <div className="field__control">
        {children}
        <span className="field__line" aria-hidden="true" />
      </div>
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

// Radio or checkbox chips in a fieldset, so the group has one accessible name.
function Choices({ name, legend, hint, type = 'radio', options, value, onChange, error, wide }) {
  const id = `q-${name}`;
  const checked = key => (type === 'checkbox' ? value.includes(key) : value === key);
  return (
    <fieldset
      className="field field--choices"
      aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
    >
      <legend>{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      <div className={wide ? 'chips chips--plans' : 'chips'}>
        {options.map(([key, label, sub], i) => (
          <label key={key} className="chip">
            <input
              type={type}
              name={name}
              value={key}
              checked={checked(key)}
              onChange={() => onChange(key)}
              aria-invalid={error ? true : undefined}
              id={i === 0 ? id : undefined}
            />
            <span className="chip__label">
              {label}
              {sub && <span className="chip__sub">{sub}</span>}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={id}>{error}</FieldError>
    </fieldset>
  );
}

const PLAN_OPTIONS = PLANS.map(([id, label]) => {
  const [name, price] = label.split(' · ');
  return [id, name, price || 'We’ll help you pick'];
});
const pairs = list => list.map(item => [item, item]);

export default function Quote() {
  const [values, setValues] = useState(() => ({ ...EMPTY, plan: planFromUrl() }));
  // The optional extras start closed, unless a plan was picked on a price card.
  const [moreOpen, setMoreOpen] = useState(() => !!planFromUrl());
  const moreRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const doneRef = useRef(null);

  useEffect(() => {
    if (status !== 'sent') return;
    doneRef.current?.focus();
    if (!reduceMotion)
      gsap.from('.form-done__stamp', { autoAlpha: 0, scale: 2.4, rotate: -30, duration: 0.6, ease: 'back.out(2)' });
  }, [status]);

  useGSAP(
    (context, contextSafe) => {
      if (reduceMotion) return;
      riseTitle('.quote__title', 'top 82%', 0.016, contextSafe);
      // The work order slides up and settles at a slight angle, like a sheet dropped on a desk.
      gsap.from('.order', {
        y: 120,
        rotate: 3,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.order', start: 'top 85%', once: true }
      });
    },
    { scope: rootRef }
  );

  // Once a field shows an error, re-check it as the visitor changes it, so the message clears as soon as it's fixed.
  // The phone rule depends on the contact choice, so changing either re-checks both.
  const update = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    const linked = ['contact', 'email', 'phone'].includes(name) ? ['contact', 'email', 'phone'] : [name];
    if (linked.some(f => errors[f])) {
      const found = validateQuote(next);
      setErrors(errs => ({ ...errs, ...Object.fromEntries(linked.map(f => [f, found[f]])) }));
    }
  };

  const fieldProps = (name, hintId) => ({
    id: `q-${name}`,
    name,
    value: values[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': [hintId, errors[name] && `q-${name}-error`].filter(Boolean).join(' ') || undefined,
    onChange: e => update(name, e.target.value),
    onBlur: e => {
      if (e.target.value.trim()) setErrors(errs => ({ ...errs, [name]: validateQuote(values)[name] }));
    }
  });

  const onSubmit = async e => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validateQuote(values);
    setErrors(found);
    const firstInvalid = FIELDS.find(f => found[f]);
    if (firstInvalid) {
      // An optional answer with a problem sits in the closed group: open it so the field can take focus.
      if (OPTIONAL.includes(firstInvalid)) moreRef.current.open = true;
      const el = formRef.current.elements[firstInvalid];
      (el.focus ? el : el[0]).focus(); // a radio group is a list; focus its first option
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(15000) // a stalled connection ends in the error message instead of "Sending…" forever
      });
      const body = await res.json().catch(() => null);
      if (res.status === 400 && body?.errors) setErrors(body.errors);
      // Success only when our endpoint confirms the email went out — not just any 200 (a static host can answer with HTML).
      setStatus(res.ok && body?.ok === true ? 'sent' : 'failed');
    } catch {
      setStatus('failed');
    }
  };

  // Reply by email when they gave one, unless they asked for a call or WhatsApp.
  const byEmail = values.email.trim() && values.contact !== 'Phone call' && values.contact !== 'WhatsApp';

  return (
    <section id="quote" ref={rootRef} className="quote section" tabIndex={-1} aria-labelledby="quote-title">
      <div className="wrap quote__layout">
        <div className="quote__intro">
          <p className="eyebrow">Request a quote</p>
          <h1 id="quote-title" className="quote__title">
            Tell us about the job
          </h1>
          <p className="section-lede" data-reveal>
            Five quick answers are all we need. Add more detail if you like; it helps us quote more exactly. We’ll reply
            with a fixed price, with no obligation.
          </p>
          <ul className="quote__points" data-reveal>
            <li>
              <Check /> Reply within one working day
            </li>
            <li>
              <Check /> Fixed price in writing
            </li>
            <li>
              <Check /> No obligation to go ahead
            </li>
          </ul>
        </div>

        <div className="order">
          <div className="order__head mono" aria-hidden="true">
            <span>Job request</span>
            <span>Wabia · Cyprus</span>
          </div>
          {status === 'sent' ? (
            <div ref={doneRef} className="form-done" role="status" tabIndex={-1}>
              <span className="form-done__stamp" aria-hidden="true">
                Received
              </span>
              <h2>Request sent</h2>
              <p>
                Thanks, {values.name.trim().split(/\s+/)[0]}. We’ve received your request and will reply
                {byEmail ? (
                  <>
                    {' '}
                    to <strong>{values.email.trim()}</strong>
                  </>
                ) : (
                  <>
                    {' '}
                    by {values.contact === 'WhatsApp' ? 'WhatsApp' : 'phone'} on <strong>{values.phone.trim()}</strong>
                  </>
                )}{' '}
                within one working day.
              </p>
              <a className="btn btn--ink" href="./">
                Back to the home page <Arrow className="btn__arrow" />
              </a>
            </div>
          ) : (
            <form ref={formRef} className="order__form" noValidate onSubmit={onSubmit} aria-labelledby="quote-title">
              <Field id="q-name" n={1} label="Your name" error={errors.name}>
                <input {...fieldProps('name')} type="text" autoComplete="name" enterKeyHint="next" required />
              </Field>

              <fieldset className="field field--choices" aria-describedby="q-reach-hint">
                <legend>
                  <span className="field__n mono" aria-hidden="true">
                    02
                  </span>
                  How can we reach you?
                </legend>
                <p id="q-reach-hint" className="field__hint">
                  An email or a phone number. One is enough.
                </p>
                <div className="form-grid">
                  <Field id="q-email" label="Email" error={errors.email}>
                    <input
                      {...fieldProps('email', 'q-reach-hint')}
                      type="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      enterKeyHint="next"
                    />
                  </Field>
                  <Field id="q-phone" label="Phone or WhatsApp" error={errors.phone}>
                    <input
                      {...fieldProps('phone', 'q-reach-hint')}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                    />
                  </Field>
                </div>
              </fieldset>

              <div className="form-grid">
                <Field id="q-businessType" n={3} label="Your trade" error={errors.businessType}>
                  <select {...fieldProps('businessType')} required>
                    <option value="" disabled>
                      Choose one…
                    </option>
                    {BUSINESS_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="q-area" n={4} label="Town or area" error={errors.area}>
                  <input
                    {...fieldProps('area')}
                    type="text"
                    autoComplete="address-level2"
                    placeholder="E.g. Limassol"
                    enterKeyHint="next"
                    required
                  />
                </Field>
              </div>

              <Field
                id="q-details"
                n={5}
                label="What do you need?"
                hint="A line or two is plenty: what you do and what the site should help with."
                error={errors.details}
              >
                <textarea
                  {...fieldProps('details', 'q-details-hint')}
                  rows={4}
                  placeholder="E.g. Electrician in Limassol. I want more emergency callouts and a page for solar installs."
                  data-lenis-prevent
                  required
                />
              </Field>

              {/* Everything else helps us quote more exactly, but none of it is needed to send. */}
              <details ref={moreRef} className="more" open={moreOpen} onToggle={e => setMoreOpen(e.currentTarget.open)}>
                <summary className="form-group mono">
                  Add more detail
                  <span className="field__opt">Optional</span>
                  <span className="more__sign" aria-hidden="true" />
                </summary>
                <div className="more__body">
                  <div className="form-grid">
                    <Field id="q-businessName" label="Business name" error={errors.businessName}>
                      <input
                        {...fieldProps('businessName')}
                        type="text"
                        autoComplete="organization"
                        enterKeyHint="next"
                      />
                    </Field>
                    <Field
                      id="q-website"
                      label="Current website"
                      hint="Leave blank if you don’t have one yet."
                      error={errors.website}
                    >
                      <input
                        {...fieldProps('website', 'q-website-hint')}
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="yourbusiness.com"
                        enterKeyHint="next"
                      />
                    </Field>
                  </div>
                  <Choices
                    name="contact"
                    legend="Best way to reach you"
                    options={pairs(CONTACT_WAYS)}
                    value={values.contact}
                    onChange={v => update('contact', v)}
                    error={errors.contact}
                  />
                  <Choices
                    name="plan"
                    legend="Which plan suits you?"
                    options={PLAN_OPTIONS}
                    value={values.plan}
                    onChange={v => update('plan', v)}
                    error={errors.plan}
                    wide
                  />
                  <Choices
                    name="features"
                    legend="Must-haves"
                    hint="Tick any you already know you want."
                    type="checkbox"
                    options={pairs(MUST_HAVES)}
                    value={values.features}
                    onChange={v =>
                      update(
                        'features',
                        values.features.includes(v) ? values.features.filter(f => f !== v) : [...values.features, v]
                      )
                    }
                    error={errors.features}
                  />
                  <Choices
                    name="timeline"
                    legend="When do you need it live?"
                    options={pairs(TIMELINES)}
                    value={values.timeline}
                    onChange={v => update('timeline', v)}
                    error={errors.timeline}
                  />
                </div>
              </details>

              {/* Spam trap: hidden from people and screen readers; bots fill in every field they find. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="q-fax">Leave this empty</label>
                <input
                  id="q-fax"
                  name="fax"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.fax}
                  onChange={e => update('fax', e.target.value)}
                />
              </div>

              {status === 'failed' && (
                <p className="form-alert" role="alert">
                  <Alert /> Your request didn’t send. Please check your connection and try again in a minute.
                </p>
              )}

              <div className="form-actions">
                <Magnet disabled={!finePointer || reduceMotion} padding={50} magnetStrength={3}>
                  <button
                    type="submit"
                    className="btn btn--lime btn--lg"
                    aria-disabled={status === 'sending'}
                    data-cursor-label="Send"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send request'}
                    {status !== 'sending' && <Arrow className="btn__arrow" />}
                  </button>
                </Magnet>
                <p className="form-note">We only use your details to reply to this request.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
