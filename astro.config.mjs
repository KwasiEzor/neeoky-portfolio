import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from "astro-sanity";

const env = loadEnv(import.meta.env?.MODE ?? 'production', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: 'https://neeoky.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sanity({
      projectId: env.SANITY_PROJECT_ID || "cbdkq097",
      dataset: env.SANITY_DATASET || "production",
      apiVersion: env.SANITY_API_VERSION || "2024-03-18",
      useCdn: true,
    }),
  ],
});
