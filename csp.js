const policies = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
    'https://frozit-api.onrender.com',
    'https://inventory.zoho.in',
    'https://checkout.razorpay.com',
    'https://checkout.razorpay.com/v1/checkout.js',
  ],
  'child-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': [
    "'self'",
    'https://*.stripe.com',
    'https://raw.githubusercontent.com',
    'https://frozit-api.onrender.com',
    'https://inventory.zoho.in',
    'https://checkout.razorpay.com',
  ],
  'font-src': ["'self'"],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://inventory.zoho.in',
    'https://checkout.razorpay.com',
    'https://api.razorpay.com/',
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://api.stripe.com',
    'https://maps.googleapis.com',
    'https://frozit-api.onrender.com',
    'https://inventory.zoho.in',
    `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    'http://13.126.151.180',
    'https://checkout.razorpay.com',
  ],
}

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`
    }
    return ''
  })
  .join('; ')
