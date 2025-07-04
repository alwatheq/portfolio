import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

export const initPostHog = () => {
  console.log('Initializing PostHog with key:', POSTHOG_KEY)
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Capture pageviews automatically
      capture_pageview: true,
      // Capture clicks automatically
      autocapture: true,
      // Enable session recording (optional)
      session_recording: {
        enabled: true,
        // Only record sessions with events
        record_on_start: false,
      },
      // Privacy settings
      respect_dnt: true,
      // Debug mode (set to false in production)

      // Persistence
      persistence: 'localStorage+cookie',
      // Cross-domain tracking
      cross_subdomain_cookie: false,
      // Feature flags
      bootstrap: {
        featureFlags: {},
      },
      // Capture console logs (optional)
      capture_console: false,
    })
posthog.capture('$pageview', {
        page: window.location.pathname,
        user_agent: navigator.userAgent,
        })
    
  }
}

export { posthog }