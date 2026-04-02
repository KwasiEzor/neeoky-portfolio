import { nanoid } from 'nanoid';

/**
 * Get or create a session ID for tracking
 */
export function getSessionId(): string {
  const STORAGE_KEY = 'neeoky-session-id';

  // Check if we're in browser
  if (typeof window === 'undefined') {
    return nanoid(16);
  }

  // Try to get existing session ID
  let sessionId = localStorage.getItem(STORAGE_KEY);

  // Create new one if doesn't exist
  if (!sessionId) {
    sessionId = nanoid(16);
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Clear session ID (e.g., after form submission)
 */
export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('neeoky-session-id');
  }
}
