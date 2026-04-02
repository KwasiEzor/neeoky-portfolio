import type { APIRoute } from 'astro';
import { getAllServices } from '../../lib/sanity/queries';

/**
 * GET /api/services
 * Returns all available services from Sanity
 */
export const GET: APIRoute = async () => {
  try {
    const services = await getAllServices();

    return new Response(
      JSON.stringify({
        success: true,
        data: services,
        count: services.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/services:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Impossible de récupérer les services',
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
