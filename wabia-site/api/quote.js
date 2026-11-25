/* eslint-env node */
import { validateQuote } from '../src/quote.js';

// POST /api/quote — a Vercel Function (Node.js runtime).
// The email API key is read from server environment variables here and never reaches browser code.
export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Never trust the browser's validation: check again on the server.
  const errors = validateQuote(data);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    console.error('Quote form: set RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL to send email.');
    return Response.json({ error: 'Email is not set up yet.' }, { status: 503 });
  }

  const name = data.name.trim();
  const email = data.email.trim();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: QUOTE_FROM_EMAIL,
      to: QUOTE_TO_EMAIL,
      reply_to: email,
      subject: `Quote request: ${name} (${data.businessType})`.replace(/[\r\n]+/g, ' '),
      text: `Name: ${name}\nEmail: ${email}\nBusiness: ${data.businessType}\n\n${data.details.trim()}`
    }),
    signal: AbortSignal.timeout(10000)
  }).catch(() => null);

  if (!response?.ok) {
    console.error('Quote form: email provider error', response?.status, await response?.text().catch(() => ''));
    return Response.json({ error: 'Could not send right now.' }, { status: 502 });
  }

  // Only now has the request actually been sent.
  return Response.json({ ok: true });
}
