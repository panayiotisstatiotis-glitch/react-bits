import { useEffect, useRef, useState } from 'react';
import { Check, Phone as PhoneIcon, Snow } from './icons.jsx';

export const AREAS = ['Larnaca', 'Livadia', 'Aradippou', 'Oroklini', 'Dromolaxia', 'Pyla'];
const SERVICES = ['Installation', 'Repair', 'Servicing', 'Shops & offices'];
const SLOTS = ['Today 15:30', 'Tomorrow 09:00', 'Tomorrow 13:00'];
const START = { service: '', area: '', name: '', phone: '', slot: SLOTS[0] };

// A question with pill answers. A plain function (not a component), called inline below.
const choices = ({ legend, options, value, onChange, name, wide }) => {
  return (
    <fieldset className={wide ? 'demo__choices demo__choices--wide' : 'demo__choices'}>
      <legend>{legend}</legend>
      {options.map(o => (
        <label key={o} className="demo__chip">
          <input type="radio" name={name} checked={value === o} onChange={() => onChange(o)} />
          <span>{o}</span>
        </label>
      ))}
    </fieldset>
  );
};

// The air-con concept's customer journeys, tappable: call, or ask for a quote in two short steps. Used inside the
// phone in Work and full size on sample.html. Everything happens on screen and nothing is sent.
// Returns the bar's buttons and, while a journey is open, the screen that covers the page.
// linkTo: instead of opening here, the buttons go to that page with the journey to start (?open=calling|what).
// start: the journey to open straight away (from that ?open= parameter).
export const JOURNEYS = ['calling', 'what'];

export function useDrosiaDemo({ linkTo, start } = {}) {
  const [step, setStep] = useState(JOURNEYS.includes(start) ? start : null); // null | 'calling' | 'what' | 'who' | 'sent'
  const [form, setForm] = useState(START);
  const [error, setError] = useState('');
  const screenRef = useRef(null);
  const openerRef = useRef(null);

  // Each new screen takes focus, and the button that opened the journey gets it back at the end.
  useEffect(() => {
    if (step) screenRef.current?.focus({ preventScroll: true });
    else openerRef.current?.focus({ preventScroll: true });
  }, [step]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const go = next => {
    setError('');
    setStep(next);
  };
  const open = (next, e) => {
    openerRef.current = e.currentTarget;
    setForm(START);
    go(next);
  };
  const close = () => go(null);
  const next = () => (form.service && form.area ? go('who') : setError('Choose what you need and where.'));
  const send = e => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please add your name.');
    const digits = form.phone.replace(/\D/g, '').length;
    if (digits < 8 || digits > 15) return setError('Please add a phone number, like 99 123456.');
    go('sent');
  };
  const title = {
    calling: 'Calling Drosia Air-Con',
    what: 'Get a quote',
    who: 'Get a quote',
    sent: 'Quote request sent'
  }[step];

  const screen = step && (
    <div
      ref={screenRef}
      className={`demo demo--${step}`}
      role="dialog"
      aria-label={`${title} (demo)`}
      tabIndex={-1}
      data-lenis-prevent
      onKeyDown={e => e.key === 'Escape' && close()}
    >
      {step === 'calling' && (
        <>
          <span className="demo__avatar">
            <Snow />
          </span>
          <p className="demo__title">Drosia Air-Con</p>
          <p className="demo__sub">Calling…</p>
          <button type="button" className="m-btn demo__end" onClick={close} data-cursor-label="End">
            End call
          </button>
        </>
      )}
      {step === 'what' && (
        <>
          <p className="demo__step">Step 1 of 2</p>
          <p className="demo__title">Get a quote</p>
          {choices({
            legend: 'What do you need?',
            name: 'drosia-service',
            options: SERVICES,
            value: form.service,
            onChange: v => set('service', v)
          })}
          {choices({
            legend: 'Where?',
            name: 'drosia-area',
            options: AREAS,
            value: form.area,
            onChange: v => set('area', v)
          })}
          {error && <p className="demo__error">{error}</p>}
          <button type="button" className="m-btn m-lime" onClick={next} data-cursor-label="Next">
            Next
          </button>
          <button type="button" className="demo__back" onClick={close}>
            Cancel
          </button>
        </>
      )}
      {step === 'who' && (
        <form className="demo__form" onSubmit={send} noValidate>
          <p className="demo__step">Step 2 of 2</p>
          <p className="demo__title">How can we reach you?</p>
          <label className="demo__field">
            <span>Your name</span>
            <input
              type="text"
              autoComplete="off"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              aria-invalid={error.includes('name') || undefined}
            />
          </label>
          <label className="demo__field">
            <span>Phone</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="off"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              aria-invalid={error.includes('phone') || undefined}
            />
          </label>
          {choices({
            legend: 'Best time for a visit',
            name: 'drosia-slot',
            options: SLOTS,
            value: form.slot,
            onChange: v => set('slot', v),
            wide: true
          })}
          {error && (
            <p className="demo__error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="m-btn m-lime" data-cursor-label="Send">
            Send request
          </button>
          <button type="button" className="demo__back" onClick={() => go('what')}>
            Back
          </button>
        </form>
      )}
      {step === 'sent' && (
        <>
          <span className="demo__avatar demo__avatar--done">
            <Check />
          </span>
          <p className="demo__title">Quote request sent</p>
          <p className="demo__sub">
            {form.service} in {form.area}. We’ll call {form.name.trim().split(/\s+/)[0]} on {form.phone.trim()} to
            confirm a visit {form.slot.toLowerCase()}.
          </p>
          <button type="button" className="m-btn m-lime" onClick={close}>
            Done
          </button>
        </>
      )}
      <p className="demo__note">Demo · nothing is sent</p>
    </div>
  );

  // A button, or a link to the full-size page when this phone is too small to tap through.
  const action = (journey, className, label, children) =>
    linkTo ? (
      <a className={className} href={`${linkTo}?open=${journey}`} aria-label={`${label} (opens the sample website)`}>
        {children}
      </a>
    ) : (
      <button
        type="button"
        className={className}
        onClick={e => open(journey, e)}
        aria-label={`${label} (demo)`}
        data-cursor-label="Try"
      >
        {children}
      </button>
    );
  const bar = (
    <>
      {action(
        'calling',
        'm-btn m-lime',
        'Call now',
        <>
          <PhoneIcon /> Call now
        </>
      )}
      {action('what', 'm-btn m-line', 'Get a quote', 'Get a quote')}
    </>
  );

  return { bar, screen };
}
