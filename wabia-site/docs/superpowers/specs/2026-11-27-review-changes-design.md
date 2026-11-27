# Review changes — design

**Why:** an outside review liked the look but said visitors have to work too hard to request a quote. Keep the look;
cut the effort.

**Goals**

1. Quote form: five things up front — name, a way to reach them (email _or_ phone), trade, town, what they need.
   Everything else optional, the plan included.
2. One concept phone (Drosia Air-Con) is tappable, so an owner can take the steps their customer would.
3. Pricing is easy to compare: the three cards stay still and fully in view, with VAT, hosting and support stated.
4. Phone first screen: headline and buttons higher; no "Fig. 01 — Desktop, 1:1" label.

**Facts from the owner (copy)**

- Prices include VAT.
- Hosting is not included.
- Support after launch: forever. Written as "Lifetime support after launch" — _our reading: included in the price._

**Non-goals:** new sections, new visual style, real booking or calling from the demo.
**Anti-goals:** a demo that looks like a real business's booking tool; a form that claims to be shorter but still
shows a wall of questions; pricing that only lines up at the end of a scroll animation.

## Approaches (decided)

- **Form.** (a) Delete the optional questions — loses the detail that makes a precise quote. (b) Keep them behind one
  closed "Add more detail (optional)" group, opened automatically when a plan arrives from a price card or an optional
  answer has an error. **Chosen: (b).** Only the five required items are numbered (01–05).
- **Contact.** One field "email or phone" is hard to validate and reply to. **Chosen:** two inputs inside one numbered
  item "How can we reach you?", at least one needed; "best way to reach you" moves to the optional group with no
  default. If they choose Email, email is needed; Phone call or WhatsApp, phone is needed.
- **Demo.** Drosia's bar becomes real buttons: **Call now** → a calling screen with an End button; **Book a visit** →
  pick one of three slots → Confirm → "Visit booked" with Done. It runs inside the phone, says "Demo — nothing is
  sent", and the other two phones stay pictures.
- **Pricing.** (a) Keep the printer scene but end it earlier — the cards still move while people read. (b) Three still
  cards in a row (stacked on phones); each card's price rolls, features tick and stamp lands once when the card comes
  into view. **Chosen: (b).** The pinned track, printer, band and keyboard-scroll workaround go. A facts row above the
  cards and a line on each card carry VAT / hosting / support.
- **Phone hero.** Below 760px the hero content starts at the top instead of being centred in the screen, and the
  "Fig. 01" label is hidden.

## Constraints

Existing site rules hold: Lenis with no scroll locking or wheel hijacking, reduced motion respected, 60/30/10
black/white/lime, email credentials server-side only, browser and server share `src/quote.js` validation.
