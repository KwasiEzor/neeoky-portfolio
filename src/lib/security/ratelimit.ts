import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Upstash is configured
const isUpstashConfigured =
  import.meta.env.UPSTASH_REDIS_REST_URL &&
  import.meta.env.UPSTASH_REDIS_REST_TOKEN;

// Create Redis instance only if configured
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

if (isUpstashConfigured) {
  redis = new Redis({
    url: import.meta.env.UPSTASH_REDIS_REST_URL,
    token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Rate limit: 5 requests per hour per IP
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'neeoky:ratelimit',
  });
}

/**
 * Check if an IP is rate limited
 * @param identifier - IP address or user identifier
 * @returns Object with success status and reset timestamp
 */
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending?: Promise<unknown>;
}> {
  // If Upstash is not configured, allow all requests (development mode)
  if (!ratelimit || !isUpstashConfigured) {
    console.warn('⚠️ Rate limiting is disabled. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable it.');

    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 3600000, // 1 hour from now
    };
  }

  try {
    const result = await ratelimit.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      pending: result.pending,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);

    // On error, allow the request but log it
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 3600000,
    };
  }
}

/**
 * Format remaining time until rate limit reset
 */
export function formatResetTime(resetTimestamp: number): string {
  const now = Date.now();
  const diff = resetTimestamp - now;

  if (diff <= 0) return 'maintenant';

  const minutes = Math.ceil(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h${minutes % 60 > 0 ? ` ${minutes % 60}min` : ''}`;
  }

  return `${minutes}min`;
}
