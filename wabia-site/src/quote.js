// Shared by the quote form (browser) and api/quote.js (server), so both apply the same rules.

export const BUSINESS_TYPES = [
  'Plumbing',
  'Electrical',
  'Air-con & heating',
  'Pool care',
  'Cleaning',
  'Building & renovation',
  'Painting & decorating',
  'Gardening & landscaping',
  'Solar & energy',
  'Other trade or home service'
];

export const FIELDS = ['name', 'email', 'businessType', 'details'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = value => (typeof value === 'string' ? value.trim() : '');

export function validateQuote(data) {
  const { name, email, businessType, details } = data ?? {};
  const errors = {};

  if (!text(name)) errors.name = 'Please enter your name.';
  else if (text(name).length > 100) errors.name = 'Please keep your name under 100 characters.';

  if (!text(email)) errors.email = 'Please enter your email address.';
  else if (!EMAIL.test(text(email)) || text(email).length > 254)
    errors.email = 'Please enter a valid email address, like name@example.com.';

  if (!BUSINESS_TYPES.includes(businessType)) errors.businessType = 'Please choose the closest type of business.';

  if (text(details).length < 20) errors.details = 'Please tell us a bit more — at least 20 characters.';
  else if (text(details).length > 4000) errors.details = 'Please keep this under 4,000 characters.';

  return errors;
}
