import { createClient } from '@sanity/client';

// Get environment variables
const projectId = import.meta.env.SANITY_PROJECT_ID || 'cbdkq097';
const dataset = import.meta.env.SANITY_DATASET || 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2024-03-18';
const token = import.meta.env.SANITY_API_TOKEN;

// Create Sanity client for reading (public)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster reads
});

// Create Sanity client for writing (authenticated)
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Don't use CDN for writes
  token, // Authentication token for mutations
});

// Sanity configuration
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};
