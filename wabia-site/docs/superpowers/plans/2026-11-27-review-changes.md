# Review changes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorter quote form, a tappable air-con demo, comparable pricing cards with VAT/hosting/support, and a tighter
phone hero.

**Architecture:** Same React 19 + Vite multi-page site in `wabia-site/`. Validation stays shared in `src/quote.js`;
the demo is local React state inside the Drosia phone; pricing drops its pinned GSAP scene for per-card one-shot
timelines.

**Tech Stack:** React 19, Vite 8, GSAP 3 + ScrollTrigger, Lenis, node:test, Playwright check suite (scratchpad
`check.cjs`).

**Spec:** `docs/superpowers/specs/2026-11-27-review-changes-design.md`

## Global Constraints

- Copy: "Prices include VAT", "Hosting not included", "Lifetime support after launch".
- No scroll locking, no wheel hijacking; every effect has a reduced-motion state that shows the final content.
- Quote: `REQUIRED = ['name', 'email', 'businessType', 'area', 'details']` (the `email` key carries the
  email-or-phone error); empty submit shows exactly 5 errors.

## Review Focus

- Phone only, contact preference left blank → valid; success text says "by phone on …".
- `?plan=pro` → optional group opens with Pro checked.
- Bad website typed in the closed optional group → submit opens the group and focuses the website field.
- Keyboard: Tab reaches the demo's Call now / Book a visit and every pricing button with nothing clipped.
- Reduced motion: pricing shows real prices and all features; demo still works.

---

### Task 1: Validation and email for the shorter form

**Files:** Modify `src/quote.js`, `api/quote.js`, `src/quote.test.js`
**Produces:** `validateQuote(data)` rules — email optional when a valid phone is given (both blank → `errors.email =
'Please enter an email or a phone number.'`); contact `''` allowed; `contact === 'Email'` needs email; Phone call /
WhatsApp need phone; `area` required ('Please tell us your town or area.', ≤80); `plan` optional but must be in
`PLANS` when given. `FIELDS` order: name, email, phone, businessType, area, details, businessName, contact, website,
plan, features, timeline.

- [ ] Tests first: phone-only valid; both blank → email error; area required; plan '' valid / 'gold' invalid; email
      subject without a plan has no "undefined" and `reply_to` is omitted when no email.
- [ ] Run `npm test` → new tests fail. Implement. Run → all pass. Commit.

### Task 2: Quote page layout

**Files:** Modify `src/components/Quote.jsx`, `src/styles.css`

- [ ] Required items 01–05: name; "How can we reach you?" (email + phone inputs, hint "One is enough."); type of
      business; town or area; project details. Then `<details className="more">` "Add more detail (optional)" holding
      business name, best way to reach you, current website, plan, must-haves, timeline (unnumbered).
- [ ] `contact` starts `''`; `<details>` opens when a plan came from the URL or an optional field fails on submit.
- [ ] Success line: email if given and contact isn't Phone call/WhatsApp, else phone.
- [ ] Update scratchpad `check.cjs` form checks (5 errors incl. town; open group before WhatsApp; `?plan=pro` opens
      the group). Run `check.cjs form` → all pass. Commit.

### Task 3: Tappable Drosia demo

**Files:** Modify `src/components/Concepts.jsx`, `src/components/concepts.css`, `src/components/Work.jsx`
**Produces:** `Phone({ live })` — when `live`, `aria-hidden` sits on the page only; `DrosiaDemo()` renders the bar
(Call now, Book a visit) and overlays: `calling` (End), `pick` (Today 15:30 / Tomorrow 09:00 / Tomorrow 13:00 →
Confirm), `booked` (Done). Label "Demo — nothing is sent". Overlay has `role="dialog"` + `aria-label`, focus moves
in and back to the opening button.

- [ ] Check: click Book a visit → pick Tomorrow 09:00 → Confirm → "Visit booked · Tomorrow 09:00"; Done returns;
      Call now → "Calling Drosia" → End returns. Add to `check.cjs` desktop mode. Run → pass. Commit.

### Task 4: Comparable pricing

**Files:** Modify `src/components/Pricing.jsx`, `src/styles.css`

- [ ] Remove `.pricing__track/.pricing__stage`, printer, band, `HOLD` scene and the focusin workaround. Cards sit in
      `.tickets` (3 columns ≥1000px). Each card: one `ScrollTrigger` (`top 85%`, once) plays price roll, feature ticks,
      stamp, tape/sweep. Card terms line: "Fixed price · VAT included". Facts row above cards: the three Global copy lines.
      Note updated to say hosting and domain are running costs listed in the written quote.
- [ ] Check: at every scroll position through pricing on desktop, the three cards never overlap and the prices read
      249/459/889 once in view; update price check in `check.cjs`. Run all modes → pass. Commit.

### Task 5: Phone hero

**Files:** Modify `src/styles.css`, `src/components/Hero.jsx`

- [ ] Below 760px: `.hero__inner { justify-content: flex-start }` with a small top padding; hide the "Fig. 01" span.
- [ ] Check (phone mode): headline top ≤ 120px from the viewport top; "Fig. 01" not visible. Run → pass. Commit.

### Task 6: Verify and ship

- [ ] All check modes, unit tests, ESLint, Prettier, Lighthouse home + quote; screenshots; republish preview; push.
