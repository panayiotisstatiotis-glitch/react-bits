# Wabia site

One-page site for Wabia, built with React, Vite, [Lenis](https://lenis.dev) smooth scrolling and GSAP
(ScrollTrigger, SplitText), driven from one frame clock. `src/bits/` holds React Bits components from this repo
(Crosshair, Magnet, ClickSpark, TextPressure, SpotlightCard). With "reduce motion" switched on, Lenis and every
scroll effect are off and the page is a plain document.

```bash
npm install
npm run dev      # local preview at the address it prints
npm run build    # production build in dist/
npm test         # form validation and /api/quote tests
```

## Quote form

The form posts to `/api/quote` ([api/quote.js](api/quote.js)), a Vercel Function that checks the request again
and emails it through [Resend](https://resend.com). The API key only ever lives in the server environment.
The page shows "Request sent" only when that endpoint confirms the email went out.

Before it can receive real requests:

1. Deploy to Vercel with the project's **Root Directory** set to `wabia-site`.
2. In Resend, verify the domain you'll send from and create an API key.
3. In Vercel → Settings → Environment Variables, set `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL`
   (see [.env.example](.env.example)), then redeploy.

`npm run dev` has no `/api`, so sending from a local preview shows an error rather than a fake success.
To test real sending locally, run `vercel dev` with the same variables in `.env.local`.
