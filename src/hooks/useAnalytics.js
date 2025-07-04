import { useCallback } from 'react'
import { posthog } from '../config/posthog'

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, properties = {}) => {
    if (posthog) {
      posthog.capture(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        user_agent: navigator.userAgent,
      })
    }
  }, [])

  const trackPageView = useCallback((pageName, properties = {}) => {
    if (posthog) {
      posthog.capture('$pageview', {
        page: pageName,
        ...properties
      })
    }
  }, [])

  const trackProjectView = useCallback((projectId, projectTitle, source = 'unknown') => {
    trackEvent('project_viewed', {
      project_id: projectId,
      project_title: projectTitle,
      source, // 'grid', 'featured', 'search', etc.
    })
  }, [trackEvent])

  const trackProjectInteraction = useCallback((projectId, action, projectTitle) => {
    trackEvent('project_interaction', {
      project_id: projectId,
      project_title: projectTitle,
      action, // 'demo_click', 'github_click', 'image_view', 'modal_open'
    })
  }, [trackEvent])

  const trackContactFormSubmission = useCallback((success = true, errorMessage = null) => {
    trackEvent('contact_form_submitted', {
      success,
      error_message: errorMessage,
    })
  }, [trackEvent])

  const trackDownload = useCallback((downloadType, fileName = null) => {
    trackEvent('download', {
      download_type: downloadType, // 'cv', 'resume', 'portfolio'
      file_name: fileName,
    })
  }, [trackEvent])

  const trackNavigation = useCallback((section, method = 'click') => {
    trackEvent('navigation', {
      section, // 'hero', 'about', 'skills', 'projects', 'contact'
      method, // 'click', 'scroll', 'mobile_menu'
    })
  }, [trackEvent])

  const trackThemeChange = useCallback((newTheme) => {
    trackEvent('theme_changed', {
      new_theme: newTheme, // 'light', 'dark'
    })
  }, [trackEvent])

  const trackError = useCallback((errorType, errorMessage, component = null) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      component,
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackProjectView,
    trackProjectInteraction,
    trackContactFormSubmission,
    trackDownload,
    trackNavigation,
    trackThemeChange,
    trackError,
  }
}