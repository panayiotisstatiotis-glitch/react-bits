import { useEffect, useRef, useState } from 'react';
import { BUSINESS_TYPES, FIELDS, validateQuote } from '../quote.js';
import { Alert, Arrow, Check } from './icons.jsx';

const EMPTY = { name: '', email: '', businessType: '', details: '' };

function Field({ id, label, hint, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {children}
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
  const formRef = useRef(null);
  const doneRef = useRef(null);

  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

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
        body: JSON.stringify(values)
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
    <section id="quote" className="quote section" tabIndex={-1} aria-labelledby="quote-title">
      <div className="wrap quote__layout">
        <div className="quote__intro" data-reveal>
          <p className="eyebrow">Request a quote</p>
          <h2 id="quote-title" className="display h2">
            Tell us about the job
          </h2>
          <p className="section-lede">
            A few details about your business is all we need. We’ll reply with questions and a fixed price, with no
            obligation.
          </p>
          <ul className="quote__points">
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

        {status === 'sent' ? (
          <div ref={doneRef} className="form-card form-done" role="status" tabIndex={-1}>
            <span className="form-done__icon">
              <Check />
            </span>
            <h3>Request sent</h3>
            <p>
              Thanks, {values.name.trim().split(/\s+/)[0]}. We’ve received your request and will reply to{' '}
              <strong>{values.email.trim()}</strong> within one working day.
            </p>
          </div>
        ) : (
          <form ref={formRef} className="form-card" noValidate onSubmit={onSubmit} aria-labelledby="quote-title">
            <div className="form-grid">
              <Field id="q-name" label="Your name" error={errors.name}>
                <input {...fieldProps('name')} type="text" autoComplete="name" enterKeyHint="next" required />
              </Field>
              <Field id="q-email" label="Email" error={errors.email}>
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
            <Field id="q-businessType" label="Type of business" error={errors.businessType}>
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
              <button type="submit" className="btn btn--lime btn--lg" aria-disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send request'}
                {status !== 'sending' && <Arrow className="btn__arrow" />}
              </button>
              <p className="form-note">We only use your details to reply to this request.</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
