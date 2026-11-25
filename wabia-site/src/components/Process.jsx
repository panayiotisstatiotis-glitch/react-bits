import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import { progressAt } from '../scroll.js';

const STEPS = [
  {
    title: 'Enquiry',
    time: 'Day 1',
    text: 'Send the form below. We reply within one working day with a few questions about your business.'
  },
  {
    title: 'Fixed quote',
    time: 'Days 2–3',
    text: 'A short call to agree the pages, wording and photos. Then a fixed price in writing. Nothing starts until you approve it.'
  },
  {
    title: 'Design & build',
    time: 'Weeks 1–2',
    text: 'You check the design on your own phone and tell us what to change. Then we build it, fast and mobile-first.'
  },
  {
    title: 'Launch',
    time: 'Launch day',
    text: 'We connect your domain, test every call and quote button, and go live. Your site is ready to share.'
  }
];

export default function Process() {
  const listRef = useRef(null);
  const lineRef = useRef(null);

  // The line fills and each step lights up as it crosses the middle of the screen.
  useLenis(() => {
    const list = listRef.current;
    if (!list) return;
    lineRef.current.style.transform = `scaleY(${progressAt(list, 0.55).toFixed(3)})`;
    for (const step of list.children)
      step.toggleAttribute('data-active', step.getBoundingClientRect().top < innerHeight * 0.55);
  });

  return (
    <section id="process" className="process section sheet light" tabIndex={-1} aria-labelledby="process-title">
      <div className="wrap process__layout">
        <div className="process__intro" data-reveal>
          <p className="eyebrow">Process</p>
          <h2 id="process-title" className="display h2">
            From enquiry to launch
          </h2>
          <p className="section-lede">Four steps, one fixed price, and you always know what happens next.</p>
        </div>
        <div className="steps">
          <span className="steps__track" aria-hidden="true">
            <span ref={lineRef} className="steps__line" />
          </span>
          <ol ref={listRef} className="steps__list">
            {STEPS.map(({ title, time, text }, i) => (
              <li key={title} className="step">
                <span className="step__num" aria-hidden="true">
                  0{i + 1}
                </span>
                <p className="step__time">{time}</p>
                <h3 className="step__title">{title}</h3>
                <p className="step__text">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
