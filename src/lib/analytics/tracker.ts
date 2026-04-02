import Plausible from 'plausible-tracker';

// Configuration
const domain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN || 'neeoky.com';
const apiHost = import.meta.env.PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io';

// Initialize Plausible (only on client-side)
let plausible: ReturnType<typeof Plausible> | null = null;

if (typeof window !== 'undefined') {
  plausible = Plausible({
    domain,
    apiHost,
    trackLocalhost: import.meta.env.DEV,
  });

  // Enable automatic pageview tracking
  plausible.enableAutoPageviews();
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, props?: Record<string, any>) {
  if (!plausible) return;

  try {
    plausible.trackEvent(eventName, { props });
    console.log('📊 Event tracked:', eventName, props);
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

/**
 * Track pageview manually
 */
export function trackPageview(path?: string) {
  if (!plausible) return;

  try {
    plausible.trackPageview({
      url: path || window.location.pathname,
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// ========================================
// FORM-SPECIFIC TRACKING
// ========================================

/**
 * Track form started
 */
export function trackFormStarted() {
  trackEvent('Form Started', {
    page: 'demande-devis',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track step completed
 */
export function trackStepCompleted(step: number, stepName: string, data?: any) {
  trackEvent('Step Completed', {
    step,
    stepName,
    ...data,
  });
}

/**
 * Track step validation error
 */
export function trackStepError(step: number, stepName: string, errors: string[]) {
  trackEvent('Step Validation Error', {
    step,
    stepName,
    errorCount: errors.length,
    errors: errors.join(', '),
  });
}

/**
 * Track form submitted
 */
export function trackFormSubmitted(data: {
  services: number;
  pack: string;
  projectType: string;
  budget: string;
  timeline: string;
  leadId: string;
}) {
  trackEvent('Form Submitted', {
    servicesCount: data.services,
    pack: data.pack,
    projectType: data.projectType,
    budget: data.budget,
    timeline: data.timeline,
    leadId: data.leadId,
  });
}

/**
 * Track form abandoned
 */
export function trackFormAbandoned(step: number, stepName: string, completedSteps: number) {
  trackEvent('Form Abandoned', {
    abandonedAtStep: step,
    stepName,
    completedSteps,
    completionRate: Math.round((completedSteps / 5) * 100),
  });
}

/**
 * Track form auto-saved
 */
export function trackFormAutoSaved(step: number) {
  trackEvent('Form Auto Saved', {
    step,
  });
}

/**
 * Track form resumed (from saved data)
 */
export function trackFormResumed(step: number, savedAt: string) {
  const now = new Date();
  const saved = new Date(savedAt);
  const hoursSinceSave = Math.round((now.getTime() - saved.getTime()) / 3600000);

  trackEvent('Form Resumed', {
    resumedAtStep: step,
    hoursSinceSave,
  });
}

/**
 * Track service selected
 */
export function trackServiceSelected(serviceName: string, serviceId: string) {
  trackEvent('Service Selected', {
    serviceName,
    serviceId,
  });
}

/**
 * Track pack selected
 */
export function trackPackSelected(pack: string) {
  trackEvent('Pack Selected', {
    pack,
  });
}

/**
 * Track error occurred
 */
export function trackError(errorType: string, errorMessage: string, context?: any) {
  trackEvent('Error Occurred', {
    errorType,
    errorMessage,
    ...context,
  });
}

/**
 * Track rate limit hit
 */
export function trackRateLimitHit(ip: string) {
  trackEvent('Rate Limit Hit', {
    ip: ip.substring(0, 7) + '***', // Anonymize IP
  });
}

// ========================================
// CONVERSION TRACKING
// ========================================

/**
 * Track conversion goal
 */
export function trackGoal(goalName: string, revenue?: number) {
  if (!plausible) return;

  try {
    plausible.trackEvent(goalName, {
      props: {
        revenue,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

/**
 * Track lead generated
 */
export function trackLeadGenerated(leadId: string, estimatedValue?: number) {
  trackGoal('Lead Generated', estimatedValue);
  trackEvent('Lead Generated', {
    leadId,
    estimatedValue,
  });
}

// ========================================
// FUNNEL TRACKING
// ========================================

/**
 * Get funnel data for analytics
 */
export interface FunnelStep {
  step: number;
  name: string;
  entered: boolean;
  completed: boolean;
  timestamp?: string;
}

/**
 * Track complete funnel journey
 */
export function trackFunnelJourney(steps: FunnelStep[], outcome: 'completed' | 'abandoned') {
  const completedSteps = steps.filter((s) => s.completed).length;
  const funnelData = {
    outcome,
    totalSteps: steps.length,
    completedSteps,
    completionRate: Math.round((completedSteps / steps.length) * 100),
    stepBreakdown: steps.map((s) => ({
      step: s.step,
      name: s.name,
      completed: s.completed,
    })),
  };

  trackEvent('Funnel Journey', funnelData);
}

// ========================================
// SESSION TRACKING
// ========================================

let sessionStartTime: number | null = null;

/**
 * Start session timer
 */
export function startSessionTimer() {
  sessionStartTime = Date.now();
}

/**
 * Get session duration in seconds
 */
export function getSessionDuration(): number {
  if (!sessionStartTime) return 0;
  return Math.round((Date.now() - sessionStartTime) / 1000);
}

/**
 * Track session ended
 */
export function trackSessionEnded(outcome: 'submitted' | 'abandoned' | 'closed') {
  const duration = getSessionDuration();

  trackEvent('Session Ended', {
    outcome,
    durationSeconds: duration,
    durationMinutes: Math.round(duration / 60),
  });
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize form analytics tracking
 */
export function initFormAnalytics() {
  startSessionTimer();
  trackFormStarted();

  // Track beforeunload (form abandoned)
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      // Get current form state to determine if abandoned
      const formDataStr = localStorage.getItem('neeoky-form-data:');
      const currentStep = localStorage.getItem('neeoky-current-step:');

      if (formDataStr && currentStep) {
        try {
          const data = JSON.parse(formDataStr);
          const step = parseInt(currentStep);

          // Only track abandonment if form has data but wasn't submitted
          if (Object.keys(data).length > 0 && step < 5) {
            trackFormAbandoned(step, `Step ${step}`, step - 1);
            trackSessionEnded('abandoned');
          }
        } catch (error) {
          // Ignore errors
        }
      }
    });
  }
}
