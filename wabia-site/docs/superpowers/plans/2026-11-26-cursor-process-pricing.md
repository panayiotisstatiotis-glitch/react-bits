# Cursor, Process and Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap the crosshair for the React Bits target reticle and turn Process and Pricing into scroll-driven scenes.

**Architecture:** Same pattern as the hero and work scenes: a tall `__track` holds a CSS `position: sticky` stage,
and one scrubbed GSAP timeline (ScrollTrigger driven by Lenis) moves things inside it. Start states live in CSS under
`.motion` and timelines only tween *to* them. Breakpoint branches use `gsap.matchMedia(scope)` with the same queries as
the CSS. Elements that are `display: none` at a size are never tweened.

**Tech Stack:** React 19, Vite 8, GSAP 3.15 (ScrollTrigger, SplitText, `@gsap/react`), Lenis 1.3. No new dependencies.

**Spec:** `wabia-site/docs/superpowers/specs/2026-11-26-cursor-process-pricing-design.md`

## Global Constraints

- No scroll locking or wheel hijacking: holds are sticky stages inside taller tracks.
- `prefers-reduced-motion: reduce`: no Lenis, no cursor, no scenes; all content static and visible.
- Animate only transform, opacity and clip-path (layout shift stays 0). Mobile Lighthouse performance ≥ 80.
- Screen readers keep plain text: prices `€249`, `€459`, `€889`; step titles and text unchanged.
- Palette tokens only: `--ink #0a0b0f`, `--paper #fff`, `--hivis #b8f23d`.
- Breakpoints: Process pin `(min-width: 1000px)`; Pricing pin `(min-width: 1000px) and (min-height: 720px)`.
- Checks: `node $S/check.cjs <size>` against `vite preview` on 127.0.0.1:4173 ($S = session scratchpad). Every
  existing check keeps passing.

## Review Focus

1. Tabbing to a ticket's "Request a quote" before the print scene finishes: the button must be visible (the scene
   jumps to its end on `focusin`). Test in Task 3.
2. Menu jumps to `#process` and `#pricing` with sticky stages: the h2 stays 16px or more below the header. The existing
   menu check covers this. Keep the heading at the top of each stage.
3. Resizing across 1000px wide or 720px tall rebuilds the scenes, so nothing stays hidden. Test in Tasks 2 and 3.
4. A 1280×720 laptop: the Process stage fits with no clipped cards, and Pricing falls back to no hold. Test in Tasks 2
   and 3.
5. Typing in the quote form: the reticle must not hide the text cursor over inputs and textarea. Test in Task 1.

---

### Task 1: Target reticle cursor replaces the crosshair

**Files:**
- Create: `wabia-site/src/bits/TargetCursor.jsx`, `wabia-site/src/bits/TargetCursor.css` (copy from
  `src/content/Animations/TargetCursor/`, with a source comment line)
- Modify: `wabia-site/src/App.jsx` (swap `Crosshair` for `TargetCursor`), `Header.jsx`, `Hero.jsx`, `Pricing.jsx`,
  `Quote.jsx`, `Footer.jsx` (add `data-cursor-label`)
- Delete: `wabia-site/src/bits/Crosshair.jsx`
- Test: `$S/check.cjs` (desktop run: new cursor checks)

**Interfaces:**
- Produces: `<TargetCursor targetSelector cursorColor="#b8f23d" … />`, mounted only when `finePointer && !reduceMotion`.
  Labels: header and footer CTAs and the hero CTA "Quote", ticket buttons "Pick", form submit "Send", nav links "Go".

- [ ] **Step 1: Write the failing checks** in `run()` for non-touch, non-reduced runs:
  `document.querySelector('.target-cursor')` exists and no `[class*=crosshair]` exists. After `mouse.move` to the
  header CTA centre and 600 ms, the corner bounding box covers the CTA box within 14 px on each side, and the label
  text is `Quote`. After moving over `#details` (textarea), the computed `cursor` there is `text` and the reticle's
  opacity is below 0.1. In touch runs, `.target-cursor` does not exist.
- [ ] **Step 2: Run** `node $S/check.cjs desktop`. Expected: FAIL on the new cursor checks.
- [ ] **Step 3: Implement.** Copy the component. Adapt only the hide rule: over `input, textarea, select` the reticle
  fades out and the native cursor stays. `targetSelector`: `'a, button, .ticket, [data-cursor-label]'`. Remove
  Crosshair.
- [ ] **Step 4: Run** `node $S/check.cjs desktop` and `node $S/check.cjs phone`. Expected: all pass.
- [ ] **Step 5: Commit** `feat(wabia): target reticle cursor replaces crosshair`

### Task 2: Process scene: the steps travel along the tape

**Files:**
- Modify: `wabia-site/src/components/Process.jsx`, `wabia-site/src/styles.css` (Process block, `.motion` start
  states), `wabia-site/src/components/icons.jsx` (add `Van`)
- Test: `$S/check.cjs` (new process checks), `$S/resize.cjs` (extend)

**Interfaces:**
- Produces markup: `section#process > .process__track > .process__stage > (.process__sheet, .process__head,
  .pboard > (.pboard__van > (svg.van, .pboard__day > .pboard__days > span×4), .pboard__strip > (.tl__tape >
  .tl__fill, ol.tl__steps > li.tl__step×4 > (.tl__num, .tl__pin, .tl__card > (.tick, .tl__time, .tl__title, .tl__text,
  .tl__stamp)))))`. The Launch card also gets `.tl__live` (mini phone, LIVE pill, 8 `.tl__spark` lines).
- `Van`: an inline SVG icon component exported from `icons.jsx`, with wheels as `.van__wheel` groups.

- [ ] **Step 1: Write the failing checks.**
  - **Desktop (1440×900):** scroll to the `.process__track` top plus 10 px; `.process__stage` top equals 0 ± 2 px
    after another 600 px of wheel scrolling (it holds).
  - **Desktop, start of the hold:** card 1 centre is within 40 px of the `.pboard__van` centre, and `.pboard__day`
    shows `Day 1`.
  - **Desktop, end of the track:** card 4 centre is within 40 px of the van; all 4 `.tick path` have
    `stroke-dashoffset` 0; `.tl__live` opacity is 1; `.pboard__day` shows `Launch day`.
  - **Phone (390×844):** `.process__stage` is not sticky, the van's y increases as you scroll through `.tl`, and all 4
    cards become fully visible.
  - **1280×720:** every `.tl__card` bottom stays inside the stage while it holds.
  - **Resize 820→1350 (resize.cjs):** after scrolling Process, card 4 is visible and its tick is drawn.
  - **Reduced motion:** the existing visibility check covers `.tl__card`. Add that `.tl__stamp` and `.pboard__van`
    have computed `display: none`.
- [ ] **Step 2: Run** `node $S/check.cjs desktop` and `node $S/check.cjs phone`. Expected: FAIL on the new process
  checks.
- [ ] **Step 3: Implement.** Values:
  - Desktop track `400svh`; the stage is sticky at top 0 with height `100svh`.
  - Cards `min(400px, 30vw)` wide with a 64px gap; the strip's left padding centres card 1 under the van.
  - Timeline in units, for each step i of 0–3:
    - card flips up at `i-0.5 → i` (rotationX 70 → 0, origin bottom)
    - tick and day label at `i` (day reel `yPercent: -100*i`)
    - DONE stamp at `i+0.3` (Launch shows LIVE plus sparks instead)
    - the strip moves at `i+0.45 → i+1` to `x: () => -step*(i+1)` (wheels rotate, the van bobs)
    - the fill grows with the strip
    - big numbers parallax `xPercent 30 → -30` across the whole timeline
    - a 0.4 hold at the end
  - Phones keep the vertical layout: the van rides the vertical tape (y follows the fill), each card flips in as it
    enters (scrubbed per card), and the stamp lands at 45% of the viewport.
  - Title split and sheet zoom stay as they are.
- [ ] **Step 4: Run** the full check suite (`desktop phone small tablet reduced`), then `resize.cjs`. Expected: all
  pass.
- [ ] **Step 5: Commit** `feat(wabia): process scene with van, day counter and stamps`

### Task 3: Pricing scene: printer feed, rolling prices

**Files:**
- Create: `wabia-site/src/components/Odometer.jsx`
- Modify: `wabia-site/src/components/Pricing.jsx`, `wabia-site/src/styles.css` (Pricing block, compact tickets on
  desktop)
- Test: `$S/check.cjs` (price reading, pricing checks), `$S/resize.cjs`

**Interfaces:**
- Produces `Odometer({ value: number })`, which renders `<span className="ticket__num">`. With motion it holds one
  `.odo > .odo__reel > span×20` per digit (0–9 twice, so the reel can spin past). Under reduced motion it holds the
  plain number. The reel shows digit d at `yPercent: -(10 + d) * 5`.
- Markup: `section#pricing > .wrap > (.section-head, .pricing__track > .pricing__stage > (.pricing__band, .printer >
  (.printer__led, .printer__count), .tickets), .pricing__note)`. The featured ticket gets `.ticket__tape` ("Most
  picked") and `.ticket__sweep`.

- [ ] **Step 1: Write the failing checks.**
  - Price reading: for each `.ticket__num`, take the `.odo__reel > span` whose top equals the `.odo` top (± 2 px),
    join them, and expect `249,459,889`. If there are no reels (reduced motion), use the `textContent`.
  - **Desktop (1440×900):** the stage holds (top equal to the header height ± 2 px over 500 px of scrolling); at the
    track end all three tickets have `clip-path` `inset(0%)` or none, and the three ticket centres are in ascending
    x order more than 300 px apart.
  - **1280×720:** `.pricing__stage` is not sticky.
  - **Focus:** `Tab` until a ticket button is focused, then its rect is inside the viewport and not clipped (the
    ticket's computed clip-path is none or `inset(0%)`).
  - **Phone:** prices settle and no overflow.
  - **Resize:** prices settle after crossing the breakpoint.
- [ ] **Step 2: Run** `node $S/check.cjs desktop`. Expected: FAIL on the new pricing checks.
- [ ] **Step 3: Implement.** Values:
  - Desktop track `220svh`; the stage is sticky at `top: var(--header-h)`.
  - Tickets start inside the printer: `yPercent: -104` plus `clipPath: inset(0 0 100% 0)`, stacked in the centre
    column (`x` toward the middle, rotation −4°, 2°, −1°).
  - Each feeds out at `0.6*i → 0.6*i+0.5`, then its odometer rolls, its features tick in (check pops, then the text
    goes from opacity 0.35 to 1), and its stamp slams with a ±3 px shake. The printer count shows `i+1/3`.
  - Fan out at `1.8 → 2.4`. The featured ticket gets its tape band (scaleX 0 → 1) and a light sweep.
  - `.pricing__band` ("FIXED PRICE · NO SURPRISES ·" twice, outlined) scrubs `xPercent 0 → -50` across the section.
  - Without the hold (phones, short screens): each ticket prints on its own scrubbed trigger, with the same feature
    ticks, roll and stamp.
  - `focusin` on `.tickets` while the hold is not finished calls `lenis.scrollTo(trigger.end, { immediate: true })`.
  - Hover keeps the tilt; add a CSS-only barcode scan line under `(hover: hover) and (pointer: fine)`.
- [ ] **Step 4: Run** the full suite plus `resize.cjs`. Expected: all pass.
- [ ] **Step 5: Commit** `feat(wabia): pricing printer scene with rolling prices`

### Task 4: Verify and ship

- [ ] Run `npm run build`, `npm test`, ESLint and Prettier (the repo configs), and `check.cjs` for all sizes plus
  `form`. Expected: all pass.
- [ ] Run Lighthouse mobile and desktop. Expected: mobile performance ≥ 80, CLS 0, accessibility 100.
- [ ] Rebuild the single-file preview (`make_preview.py`) and republish to the same artifact path. Push
  `claude/blissful-cerf-ysrwq4`.
