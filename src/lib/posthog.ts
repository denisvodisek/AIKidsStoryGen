import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

// Initialize PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded')
        }
      },
      capture_pageview: false, // We'll capture pageviews manually
      capture_pageleave: true,
      session_recording: {
        recordCrossOriginIframes: true,
      },
    })
  }
}

// Analytics events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

// User identification
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties)
  }
}

// Page view tracking
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', {
      page: pageName,
      ...properties
    })
  }
}

// Story generation events
export const trackStoryGeneration = (storyData: {
  character: string
  setting: string
  lesson: string
  language: string
  success: boolean
}) => {
  trackEvent('story_generated', storyData)
}

export const trackSubscription = (plan: string, action: 'started' | 'completed' | 'cancelled') => {
  trackEvent('subscription_action', { plan, action })
}

export default posthog 