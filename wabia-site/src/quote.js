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

export const PLANS = [
  ['starter', 'Starter · €249'],
  ['business', 'Business · €459'],
  ['pro', 'Pro · €889'],
  ['unsure', 'Not sure yet']
];
export const CONTACT_WAYS = ['Email', 'Phone call', 'WhatsApp'];
export const MUST_HAVES = [
  'Tap-to-call & WhatsApp buttons',
  'Greek & English',
  'Photo gallery of my work',
  'Online quote form',
  'Google Maps & opening hours',
  'Booking requests'
];
export const TIMELINES = ['As soon as possible', 'Within a month', 'No rush'];

// Form order, so the first invalid field gets focus: the five required answers, then the optional extras.
// REQUIRED are the ones an empty form gets told about; the email key carries the "email or phone" message.
export const FIELDS = [
  'name',
  'email',
  'phone',
  'businessType',
  'area',
  'details',
  'businessName',
  'contact',
  'website',
  'plan',
  'features',
  'timeline'
];
export const OPTIONAL = FIELDS.slice(6);
export const REQUIRED = ['name', 'email', 'businessType', 'area', 'details'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]+$/;
const WEBSITE = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)*\.[a-z]{2,}(\/\S*)?$/i;
const text = value => (typeof value === 'string' ? value.trim() : '');
const optional = (value, list) => !text(value) || list.includes(value);

export function validateQuote(data) {
  const { name, businessName, email, phone, contact, businessType, area, website, plan, features, timeline, details } =
    data ?? {};
  const errors = {};

  if (!text(name)) errors.name = 'Please enter your name.';
  else if (text(name).length > 100) errors.name = 'Please keep your name under 100 characters.';

  if (text(businessName).length > 120) errors.businessName = 'Please keep this under 120 characters.';

  // An email or a phone number is enough. Whichever is filled in must work, and the way they'd like to be reached
  // needs its matching detail.
  const digits = text(phone).replace(/\D/g, '').length;
  const wantsPhone = contact === 'Phone call' || contact === 'WhatsApp';
  if (text(email)) {
    if (!EMAIL.test(text(email)) || text(email).length > 254)
      errors.email = 'Please enter a valid email address, like name@example.com.';
  } else if (contact === 'Email') errors.email = 'Please enter your email, or choose another way to reach you.';
  else if (!text(phone)) errors.email = 'Please enter an email or a phone number.';
  if ((wantsPhone || text(phone)) && (!PHONE.test(text(phone)) || digits < 8 || digits > 15))
    errors.phone = 'Please enter a phone number we can reach you on, like 99 123456.';

  if (!optional(contact, CONTACT_WAYS)) errors.contact = 'Please choose how we should reach you.';

  if (!BUSINESS_TYPES.includes(businessType)) errors.businessType = 'Please choose the closest type of business.';

  if (!text(area)) errors.area = 'Please tell us your town or area.';
  else if (text(area).length > 80) errors.area = 'Please keep this under 80 characters.';

  if (text(website) && (!WEBSITE.test(text(website)) || text(website).length > 200))
    errors.website = 'Please enter a web address, like yourbusiness.com, or leave it blank.';

  if (text(plan) && !PLANS.some(([id]) => id === plan)) errors.plan = 'Please choose one of our plans.';

  if (features !== undefined && (!Array.isArray(features) || !features.every(f => MUST_HAVES.includes(f))))
    errors.features = 'Please choose from the list.';

  if (!optional(timeline, TIMELINES)) errors.timeline = 'Please choose from the list.';

  if (text(details).length < 20) errors.details = 'Please tell us a bit more — at least 20 characters.';
  else if (text(details).length > 4000) errors.details = 'Please keep this under 4,000 characters.';

  // Spam trap: a field people never see. Anything typed in it came from a bot.
  if (text(data?.fax)) errors.fax = 'Please leave this field empty.';

  return errors;
}

export const planLabel = id => PLANS.find(([key]) => key === id)?.[1] ?? id;
