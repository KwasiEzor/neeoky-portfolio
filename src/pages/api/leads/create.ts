import type { APIRoute } from 'astro';
import { z } from 'zod';
import { completeFormSchema } from '../../../lib/validations/schemas';
import { createLead, parseUTMParams } from '../../../lib/sanity/mutations';
import { nanoid } from 'nanoid';
import { checkRateLimit, formatResetTime } from '../../../lib/security/ratelimit';
import { getRealIp, detectSpam, checkHoneypot, sanitizeString } from '../../../lib/security/sanitize';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. Get real IP address
    const ip = getRealIp(request.headers) || clientAddress || 'unknown';

    // 2. Check rate limiting
    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Trop de requêtes',
          message: `Veuillez réessayer dans ${formatResetTime(rateLimitResult.reset)}`,
          retryAfter: rateLimitResult.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      );
    }

    // 3. Parse request body
    const body = await request.json();

    // 4. Check honeypot field (anti-bot)
    if (!checkHoneypot(body.website)) {
      console.warn(`Honeypot triggered from IP: ${ip}`);
      // Return success to not alert the bot
      return new Response(
        JSON.stringify({
          success: true,
          leadId: 'honeypot-' + nanoid(8),
          message: 'Votre demande a été envoyée avec succès!',
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Validate data with Zod
    const validatedData = completeFormSchema.parse(body);

    // 6. Spam detection on description
    const spamCheck = detectSpam(validatedData.projectDescription);
    if (spamCheck.isSpam) {
      console.warn(`Spam detected from IP ${ip}:`, spamCheck.reasons);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Contenu suspect détecté',
          message: 'Veuillez vérifier votre message et réessayer',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 7. Sanitize text inputs (extra security layer)
    const sanitizedData = {
      ...validatedData,
      firstName: sanitizeString(validatedData.firstName),
      lastName: sanitizeString(validatedData.lastName),
      company: validatedData.company ? sanitizeString(validatedData.company) : undefined,
      projectDescription: sanitizeString(validatedData.projectDescription),
    };

    // 8. Extract tracking data
    const referer = request.headers.get('referer') || 'direct';
    const utmParams = parseUTMParams(referer);
    const sessionId = body.sessionId || nanoid(16);

    // 9. Create lead in Sanity
    const result = await createLead({
      ...sanitizedData,
      source: referer,
      sessionId,
      utmParams: utmParams || undefined,
    });

    // 10. TODO: Send emails (will be implemented in next phase)
    // Promise.all([
    //   sendConfirmationEmail(sanitizedData.email, result.data),
    //   sendAdminNotification(result.data),
    // ]).catch(console.error);

    // 11. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        leadId: result.leadId,
        message: 'Votre demande a été envoyée avec succès!',
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/leads/create:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Données invalides',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Une erreur est survenue lors de l\'envoi de votre demande',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Prerender config for Astro
export const prerender = false;
