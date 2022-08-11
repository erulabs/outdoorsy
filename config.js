// @flow

const overrideLocalhost = str => {
  if (process.env.OVERRIDE_LOCALHOST) {
    return str.replace(/localhost/g, process.env.OVERRIDE_LOCALHOST)
  }
  return str
}

const trimTrailingSlash = str => str.replace(/\/$/, '')

export const NODE_ENV = process.env.NODE_ENV || 'development'
export const COMMIT_HASH = process.env.NEXT_PUBLIC_COMMIT_HASH || 'dev'
if (typeof window !== 'undefined') window.COMMIT_HASH = COMMIT_HASH

// Must match service configuration
export const COOKIE_DOMAIN = overrideLocalhost(process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost')

export const ROLLBAR_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN || 'ba0f0ecde6d64a47874d2006a049d3b2'

export const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_7AkRzftaxjOZWEiGFNy7sPYP'
export const STRIPE_OAUTH_CLIENT_ID =
  process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID || 'ca_IzBT1oLJMtWrTweD5ckO60o5imtrp8VF'
export const STRIPE_TEST_OAUTH_CLIENT_ID =
  process.env.NEXT_PUBLIC_STRIPE_TEST_OAUTH_CLIENT_ID || 'ca_IzBTx9Y6NMt1TSB4apkZekg3IECHzfNS'

export const LOG_LEVEL =
  process.env.NEXT_PUBLIC_LOG_LEVEL || COMMIT_HASH === 'dev' ? 'debug' : 'info'

export const SITE_TITLE_PREFIX = NODE_ENV === 'development' ? 'outDEVsy |' : 'outdoor.sy |'
