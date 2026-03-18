import { defineConfig } from 'astro/config';
import sanity from "astro-sanity";

// https://astro.build/config
export default defineConfig({
  site: 'https://neeoky.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sanity({
      projectId: "cbdkq097", // Your actual Project ID
      dataset: "production",
      apiVersion: "2024-03-18",
      useCdn: true,
    }),
  ],
});
