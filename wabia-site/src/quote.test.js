/* eslint-env node */
import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESS_TYPES, FIELDS, validateQuote } from './quote.js';
import { POST } from '../api/quote.js';

const valid = {
  name: 'Andreas',
  email: 'andreas@example.com',
  businessType: BUSINESS_TYPES[0],
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

test('flags every missing or malformed field', () => {
  assert.deepEqual(Object.keys(validateQuote(null)).sort(), [...FIELDS].sort());
  const bad = validateQuote({ name: '  ', email: 'andreas@', businessType: 'Spaceships', details: 'too short' });
  assert.deepEqual(Object.keys(bad).sort(), [...FIELDS].sort());
  assert.match(bad.email, /valid email/);
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
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer test-key');
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.reply_to, valid.email);
  assert.equal(sent.to, ENV.QUOTE_TO_EMAIL);
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
