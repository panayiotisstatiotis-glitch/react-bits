import { useEffect, useRef, useState } from 'react';
import Magnet from '../bits/Magnet.jsx';
import { finePointer, gsap, reduceMotion, riseTitle, useGSAP } from '../motion.js';
import { BUSINESS_TYPES, FIELDS, validateQuote } from '../quote.js';
import { Alert, Arrow, Check } from './icons.jsx';

const EMPTY = { name: '', email: '', businessType: '', details: '' };

function Field({ id, n, label, hint, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        <span className="field__n mono" aria-hidden="true">
          0{n}
        </span>
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
      {error && (
        <p id={`${id}-error`} className="field__error">
          <Alert /> {error}
        </p>
      )}
    </div>
  );
}

export default function Quote() {
  const [values, setValues] = useState(EMPTY);
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

  const fieldProps = name => ({
    id: `q-${name}`,
    name,
    value: values[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby':
      [name === 'details' && 'q-details-hint', errors[name] && `q-${name}-error`].filter(Boolean).join(' ') ||
      undefined,
    onChange: e => {
      const next = { ...values, [name]: e.target.value };
      setValues(next);
      // Once a field shows an error, re-check it as the visitor types so the message clears as soon as it's fixed.
      if (errors[name]) setErrors(errs => ({ ...errs, [name]: validateQuote(next)[name] }));
    },
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
      formRef.current.elements[firstInvalid].focus();
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

  return (
    <section id="quote" ref={rootRef} className="quote section" tabIndex={-1} aria-labelledby="quote-title">
      <div className="wrap quote__layout">
        <div className="quote__intro">
          <p className="eyebrow">Request a quote</p>
          <h2 id="quote-title" className="quote__title">
            Tell us about the job
          </h2>
          <p className="section-lede" data-reveal>
            A few details about your business is all we need. We’ll reply with questions and a fixed price, with no
            obligation.
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
              <h3>Request sent</h3>
              <p>
                Thanks, {values.name.trim().split(/\s+/)[0]}. We’ve received your request and will reply to{' '}
                <strong>{values.email.trim()}</strong> within one working day.
              </p>
            </div>
          ) : (
            <form ref={formRef} className="order__form" noValidate onSubmit={onSubmit} aria-labelledby="quote-title">
              <div className="form-grid">
                <Field id="q-name" n={1} label="Your name" error={errors.name}>
                  <input {...fieldProps('name')} type="text" autoComplete="name" enterKeyHint="next" required />
                </Field>
                <Field id="q-email" n={2} label="Email" error={errors.email}>
                  <input
                    {...fieldProps('email')}
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    required
                  />
                </Field>
              </div>
              <Field id="q-businessType" n={3} label="Type of business" error={errors.businessType}>
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
              <Field
                id="q-details"
                n={4}
                label="Project details"
                hint="What you do, where you work, and what the site should help with."
                error={errors.details}
              >
                <textarea
                  {...fieldProps('details')}
                  rows={5}
                  placeholder="E.g. Electrician in Limassol. I want more emergency callouts and a page for solar installs."
                  data-lenis-prevent
                  required
                />
              </Field>

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
