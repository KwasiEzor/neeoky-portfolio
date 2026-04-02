import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  sanitizeHtml,
  isValidEmail,
  isValidFrenchPhone,
  detectSpam,
  checkHoneypot,
  sanitizeFilename,
} from '../lib/security/sanitize';

describe('Sanitization', () => {
  it('should sanitize XSS attempts', () => {
    const input = '<script>alert("XSS")</script>';
    const result = sanitizeString(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('should sanitize HTML special characters', () => {
    const input = '<div>Test & "quotes" & \'apostrophes\'</div>';
    const result = sanitizeString(input);
    expect(result).not.toContain('<div>');
    expect(result).toContain('&lt;div&gt;');
    expect(result).toContain('&quot;');
    expect(result).toContain('&#x27;');
  });

  it('should remove dangerous HTML tags', () => {
    const input = '<script>alert("XSS")</script><div>Safe</div>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove iframe tags', () => {
    const input = '<iframe src="evil.com"></iframe>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<iframe');
  });

  it('should remove event handlers', () => {
    const input = '<div onclick="alert()">Click me</div>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onclick');
  });
});

describe('Email Validation', () => {
  it('should validate correct email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@example.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('invalid@.com')).toBe(false);
  });
});

describe('Phone Validation', () => {
  it('should validate French phone numbers', () => {
    expect(isValidFrenchPhone('0612345678')).toBe(true);
    expect(isValidFrenchPhone('06 12 34 56 78')).toBe(true);
    expect(isValidFrenchPhone('+33612345678')).toBe(true);
    expect(isValidFrenchPhone('0033612345678')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidFrenchPhone('123')).toBe(false);
    expect(isValidFrenchPhone('0012345678')).toBe(false); // Starts with 00
    expect(isValidFrenchPhone('1234567890')).toBe(false); // Wrong format
  });
});

describe('Spam Detection', () => {
  it('should detect excessive links', () => {
    const text = 'Check http://link1.com and http://link2.com and http://link3.com and http://link4.com';
    const result = detectSpam(text);
    expect(result.isSpam).toBe(true);
    expect(result.reasons).toContain('Trop de liens');
  });

  it('should detect excessive capitals', () => {
    const text = 'BUY NOW THIS IS AMAZING DEAL!!!';
    const result = detectSpam(text);
    expect(result.isSpam).toBe(true);
    expect(result.reasons.some(r => r.includes('majuscules'))).toBe(true);
  });

  it('should detect spam keywords', () => {
    const text = 'Click here to win viagra casino lottery';
    const result = detectSpam(text);
    expect(result.isSpam).toBe(true);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('should detect excessive repetition', () => {
    const text = 'buy buy buy buy buy buy buy now now now now now now';
    const result = detectSpam(text);
    expect(result.isSpam).toBe(true);
    expect(result.reasons).toContain('Répétition excessive');
  });

  it('should not flag normal text as spam', () => {
    const text = 'Je souhaite créer un site web pour mon entreprise de consulting';
    const result = detectSpam(text);
    expect(result.isSpam).toBe(false);
  });
});

describe('Honeypot Check', () => {
  it('should pass for empty honeypot', () => {
    expect(checkHoneypot('')).toBe(true);
    expect(checkHoneypot(undefined)).toBe(true);
    expect(checkHoneypot('   ')).toBe(true);
  });

  it('should fail for filled honeypot', () => {
    expect(checkHoneypot('bot filled this')).toBe(false);
    expect(checkHoneypot('spam')).toBe(false);
  });
});

describe('Filename Sanitization', () => {
  it('should sanitize dangerous characters', () => {
    const filename = '../../../etc/passwd';
    const result = sanitizeFilename(filename);
    expect(result).not.toContain('../');
    expect(result).not.toContain('/');
  });

  it('should preserve safe characters', () => {
    const filename = 'my-document_v2.1.pdf';
    const result = sanitizeFilename(filename);
    expect(result).toBe('my-document_v2.1.pdf');
  });

  it('should replace spaces with underscores', () => {
    const filename = 'my document with spaces.pdf';
    const result = sanitizeFilename(filename);
    expect(result).toBe('my_document_with_spaces.pdf');
  });

  it('should limit filename length', () => {
    const filename = 'a'.repeat(300) + '.pdf';
    const result = sanitizeFilename(filename);
    expect(result.length).toBeLessThanOrEqual(255);
  });
});
