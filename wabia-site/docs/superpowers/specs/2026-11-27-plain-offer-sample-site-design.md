# Plain offer and a sample site — design

**Why:** a second review says the specific promise (customers can ask for a quote without calling) should be plain,
the demo should be an invitation a tradesperson can open on their own phone, and phone screens should give the space
to the offer and the demo instead of decoration.

**Goals**

1. Under the headline, the owner's copy, word for word: "Fixed-price websites for trades and home service businesses
   in Cyprus. Show what you do, where you work, and let customers request a quote online." The rotating trade word
   goes (the copy has no slot for it).
2. The hero's second button reads "Try a sample website" and opens `sample.html`: the Drosia Air-Con concept as a
   full-size phone website, with a working (fake) quote flow — the one a customer would use.
3. Below 760px the hero drops the coordinates ("Cyprus · 35.1° N 33.4° E") and "Scroll to zoom out".

**Non-goals:** sample pages for the other two concepts; anything actually being sent from the sample.
**Anti-goals:** a sample that could be mistaken for a real business (it says "sample by Wabia · made-up business ·
nothing is sent" at the top and on every demo screen).

## Approaches (decided)

- **Where "Try a sample website" goes.** (a) Scroll to the phone mock-up in Work — on a phone that is a small picture
  of a phone inside a phone. (b) A new page, `sample.html`, that _is_ the sample site at full size. **Chosen: (b).**
- **Which flow.** The customer's quote flow replaces "Book a visit": **Get a quote** → step 1 what's needed (service)
  and where (area) → step 2 name, phone and a preferred visit time → "Quote request sent". **Call now** stays. One
  `DrosiaFlows` component serves both the Work mock-up and the sample page.
- **Sample page chrome.** None of Wabia's (no header, ruler, cursor or Lenis): a slim top banner with "Back to Wabia",
  then the Drosia page in a phone-width column (full width on phones, centred on desktop) with a sticky bottom bar.

## Plan

1. Hero copy + button + phone trims; remove the rotator (Hero.jsx, styles.css). Check: phone hides coords and cue;
   sub text matches; second button opens `sample.html`.
2. `DrosiaFlows` with the quote flow; Work mock-up bar becomes Call now / Get a quote; info card links to the sample.
   Check: in every device mode, Get a quote → pick service and area → name + phone → sent; empty step 2 shows errors.
3. `sample.html` page (Vite input, `data-page="sample"`, `SampleSite`). Check on a phone: banner, flow end to end,
   Back to Wabia link.
4. Full checks, Lighthouse on the sample page, preview (with `sample.html`), push.
