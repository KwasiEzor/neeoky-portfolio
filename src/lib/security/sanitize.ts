/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize HTML content (more aggressive)
 */
export function sanitizeHtml(html: string): string {
  // Remove all HTML tags except safe ones
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Validate email format (strict)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validate French phone number
 */
export function isValidFrenchPhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Detect spam patterns in text
 */
export function detectSpam(text: string): {
  isSpam: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Check for excessive links
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches && urlMatches.length > 3) {
    reasons.push('Trop de liens');
  }

  // Check for excessive capital letters
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const lowerCount = (text.match(/[a-z]/g) || []).length;
  if (upperCount > lowerCount && text.length > 20) {
    reasons.push('Trop de majuscules');
  }

  // Check for spam keywords (common spam patterns)
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'lottery', 'winner',
    'click here', 'buy now', 'limited time', 'act now',
    'make money fast', 'work from home', 'free money',
    'bitcoin', 'cryptocurrency investment'
  ];

  const lowerText = text.toLowerCase();
  spamKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      reasons.push(`Mot-clé suspect: ${keyword}`);
    }
  });

  // Check for excessive repetition
  const words = text.toLowerCase().split(/\s+/);
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const maxRepetition = Math.max(...Object.values(wordCount));
  if (maxRepetition > 5) {
    reasons.push('Répétition excessive');
  }

  return {
    isSpam: reasons.length > 0,
    reasons,
  };
}

/**
 * Check if text contains only ASCII characters
 */
export function isAsciiOnly(text: string): boolean {
  return /^[\x00-\x7F]*$/.test(text);
}

/**
 * Detect honeypot field (should be empty)
 */
export function checkHoneypot(value: string | undefined): boolean {
  // Honeypot should be empty
  return !value || value.trim() === '';
}

/**
 * Generate a simple CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, expected: string): boolean {
  if (!token || !expected) return false;
  if (token.length !== expected.length) return false;

  // Constant-time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Check if IP is from a known VPN/proxy (basic check)
 */
export function isPotentialProxy(ip: string): boolean {
  // Common proxy/VPN IP ranges (this is a very basic check)
  const suspiciousRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
  ];

  return suspiciousRanges.some(pattern => pattern.test(ip));
}

/**
 * Extract real IP from request headers (considering proxies)
 */
export function getRealIp(headers: Headers): string {
  // Check various headers in order of preference
  const ip =
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-client-ip') ||
    'unknown';

  return ip;
}
