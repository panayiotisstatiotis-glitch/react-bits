# Cursor, Process and Pricing: design

Date: 2026-11-26. Size: small change (short design). Approved in chat: the user picked "Target reticle" and
"Full version".

## Intent

- The crosshair lines that follow the mouse "don't look very nice". Replace them with a cursor that fits the
  site-work look.
- Process and Pricing feel flat next to the hero and work scenes. Give them more scroll-driven effects.

## Goals

- **Cursor:** React Bits `TargetCursor` on fine pointers only. Lime corner brackets spin slowly around a dot and
  snap around buttons, links and cards, with short labels (`data-cursor-label`). Replaces `Crosshair`.
- **Process (desktop):** the section holds (sticky stage) while the four steps travel along the tape. A small van
  drives along the tape with a day counter (Day 1 → Launch). Big outlined step numbers sit behind the cards. Each
  card flips up, ticks and gets a "DONE" stamp. Launch ends with lime sparks and the phone saying LIVE.
- **Pricing (desktop):** a short hold where the three tickets feed out of a printer slot, then fan into a row.
  Prices roll like a mechanical counter. "Most picked" hazard tape and a light sweep on €459. Features tick off one
  by one. A giant outlined "FIXED PRICE" band slides behind and speeds up with scroll.
- **Phones:** the same ideas in a vertical layout, with no holds.

## Non-goals and anti-goals

- No scroll locking or wheel hijacking. Holds are CSS sticky stages inside taller tracks, like the hero and work.
- No new dependencies.
- Prices and steps stay readable for screen readers (plain text copies). With reduced motion, the page is static.
- Animate transform, opacity and clip-path only: keep layout shift at 0 and mobile Lighthouse at 80 or better.

## Approaches

- **Cursor:** target reticle (picked), glowing grid, springy ribbons or liquid swarm. The reticle fits the
  measuring theme, is plain DOM (cheap) and helps people see what is clickable. The grid is subtle but only on
  grid sections. Ribbons and swarm are WebGL, heavier, and compete with the text.
- **Sections:** full version with holds (picked) or a lighter version with no holds. Full adds about three
  screens of scrolling before the quote form, which the user accepted.

## Left to the builder (my calls)

- Track lengths: Process about 3.5 screens, Pricing about 2 screens (desktop).
- Labels: "Quote" on quote buttons, "Send" on submit, "Pick" on ticket buttons, "Go" on menu links.
- Van and sparks drawn in SVG and CSS. No images.
- Keep every existing browser check passing; extend the checks for the new scenes.
