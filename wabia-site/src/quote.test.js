/* eslint-env node */
import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESS_TYPES, MUST_HAVES, REQUIRED, validateQuote } from './quote.js';
import { POST } from '../api/quote.js';

const valid = {
  name: 'Andreas',
  email: 'andreas@example.com',
  businessType: BUSINESS_TYPES[0],
  area: 'Limassol',
  details: 'Plumber in Limassol. I need a simple site with a call button.'
};

const ENV = {
  RESEND_API_KEY: 'test-key',
  QUOTE_TO_EMAIL: 'inbox@example.com',
  QUOTE_FROM_EMAIL: 'Wabia <quotes@example.com>'
};
const realFetch = globalThis.fetch;

const post = body =>
  POST(
    new Request('http://localhost/api/quote', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    })
  );

test.afterEach(() => {
  globalThis.fetch = realFetch;
  for (const key of Object.keys(ENV)) delete process.env[key];
});

test('accepts a complete request', () => {
  assert.deepEqual(validateQuote(valid), {});
});

test('flags every missing or malformed required field', () => {
  assert.deepEqual(Object.keys(validateQuote(null)).sort(), [...REQUIRED].sort());
  const bad = validateQuote({
    name: '  ',
    email: 'andreas@',
    businessType: 'Spaceships',
    area: '   ',
    details: 'too short'
  });
  assert.deepEqual(Object.keys(bad).sort(), [...REQUIRED].sort());
  assert.match(bad.email, /valid email/);
  assert.match(bad.area, /town or area/);
});

test('an email or a phone number is enough to reach them', () => {
  const phoneOnly = { ...valid, email: '', phone: '99 123456' };
  assert.deepEqual(validateQuote(phoneOnly), {});
  assert.match(validateQuote({ ...valid, email: '' }).email, /email or a phone number/);
  // Choosing email as the way to reach them needs an email address.
  assert.match(validateQuote({ ...phoneOnly, contact: 'Email' }).email, /email/);
});

test('the plan is optional but must be one of ours', () => {
  assert.deepEqual(validateQuote({ ...valid, plan: '' }), {});
  assert.deepEqual(validateQuote({ ...valid, plan: 'pro' }), {});
  assert.ok(validateQuote({ ...valid, plan: 'gold' }).plan);
});

test('phone is needed only when they ask for a call or WhatsApp', () => {
  assert.deepEqual(validateQuote({ ...valid, contact: 'Email' }), {});
  assert.match(validateQuote({ ...valid, contact: 'WhatsApp' }).phone, /number/);
  assert.match(validateQuote({ ...valid, contact: 'Phone call', phone: '12' }).phone, /number/);
  assert.deepEqual(validateQuote({ ...valid, contact: 'WhatsApp', phone: '+357 99 123456' }), {});
});

test('optional fields can stay blank but are checked when filled', () => {
  const full = {
    ...valid,
    businessName: 'Andreas Plumbing',
    phone: '99 123456',
    contact: 'Phone call',
    area: 'Limassol and Paphos',
    website: 'andreasplumbing.com.cy',
    plan: 'business',
    features: [MUST_HAVES[0], MUST_HAVES[1]],
    timeline: 'Within a month'
  };
  assert.deepEqual(validateQuote(full), {});
  const bad = validateQuote({
    ...full,
    website: 'not a site',
    features: ['Rocket launcher'],
    timeline: 'Yesterday',
    contact: 'Fax'
  });
  assert.deepEqual(Object.keys(bad).sort(), ['contact', 'features', 'timeline', 'website']);
});

test('a filled spam trap is rejected and never sent', async () => {
  assert.ok(validateQuote({ ...valid, fax: 'buy now' }).fax);
  Object.assign(process.env, ENV);
  globalThis.fetch = () => assert.fail('must not send');
  assert.equal((await post({ ...valid, fax: 'buy now' })).status, 400);
});

test('server rejects bad input and never calls the email provider', async () => {
  Object.assign(process.env, ENV);
  globalThis.fetch = () => assert.fail('must not send');
  assert.equal((await post('not json')).status, 400);
  const res = await post({ ...valid, email: 'nope' });
  assert.equal(res.status, 400);
  assert.ok((await res.json()).errors.email);
});

test('server does not report success when email is not configured', async () => {
  globalThis.fetch = () => assert.fail('must not send');
  const res = await post(valid);
  assert.equal(res.status, 503);
  assert.notEqual((await res.json()).ok, true);
});

test('server reports ok only after the provider accepts the email', async () => {
  Object.assign(process.env, ENV);
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response('{"id":"1"}', { status: 200 });
  };
  const res = await post({ ...valid, plan: 'business' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer test-key');
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.reply_to, valid.email);
  assert.equal(sent.to, ENV.QUOTE_TO_EMAIL);
  assert.match(sent.subject, /Business · €459/);
  assert.match(sent.text, /Plan: Business · €459/);

  // Phone only, no plan: nothing undefined in the email, and no empty reply-to.
  await post({ ...valid, email: '', phone: '99 123456' });
  const phoneOnly = JSON.parse(calls[1].init.body);
  assert.equal('reply_to' in phoneOnly, false);
  assert.doesNotMatch(phoneOnly.subject + phoneOnly.text, /undefined/);
  assert.match(phoneOnly.subject, /Limassol/);
  assert.match(phoneOnly.text, /Plan: —/);
});

test('provider failure or network error is reported as a failure', async () => {
  Object.assign(process.env, ENV);
  globalThis.fetch = async () => new Response('nope', { status: 500 });
  assert.equal((await post(valid)).status, 502);
  globalThis.fetch = async () => {
    throw new Error('offline');
  };
  assert.equal((await post(valid)).status, 502);
});
