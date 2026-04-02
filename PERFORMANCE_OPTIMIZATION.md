# ⚡ Guide d'Optimisation Performance

## 🎯 Objectifs de Performance

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Scores
- **Performance**: > 95
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

---

## 🚀 Optimisations Implémentées

### 1. Code Splitting & Lazy Loading

Le formulaire utilise déjà:
- **Astro Islands** - Hydratation partielle
- **Dynamic imports** - Chargement à la demande
- **Persistent stores** - Pas de re-render inutile

```javascript
// Déjà optimisé dans MultiStepForm.astro
// Les scripts sont chargés uniquement quand nécessaires
```

### 2. Bundle Optimization

Optimisez `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // ... autres configs

  vite: {
    build: {
      // Code splitting manuel
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-core': ['nanostores', '@nanostores/persistent'],
            'vendor-validation': ['zod'],
            'vendor-ui': ['sonner', 'motion'],

            // Feature chunks
            'security': [
              './src/lib/security/ratelimit',
              './src/lib/security/sanitize'
            ],
            'email': [
              './src/lib/email/sender',
              './src/lib/email/templates/confirmation',
              './src/lib/email/templates/admin-notification'
            ],
          },
        },
      },

      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
        },
      },

      // CSS optimization
      cssCodeSplit: true,
    },

    // Optimize deps
    optimizeDeps: {
      include: ['nanostores', 'zod', 'sonner'],
    },
  },
});
```

### 3. Image Optimization

Déjà configuré dans Astro avec Sharp:

```astro
---
import { Image } from 'astro:assets';
---

<Image
  src={heroImage}
  alt="Hero"
  width={1200}
  height={630}
  format="webp"
  loading="lazy"
  decoding="async"
/>
```

### 4. Font Optimization

Optimisez le chargement des fonts dans `BaseLayout.astro`:

```html
<head>
  <!-- Preconnect pour Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Load fonts avec font-display: swap -->
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Syne:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  >

  <!-- Ou self-host les fonts pour éviter le DNS lookup -->
</head>
```

### 5. Preloading Critiques

Ajoutez dans `BaseLayout.astro`:

```html
<head>
  <!-- Preload critical resources -->
  <link rel="preload" as="image" href="/assets/images/hero-poster.jpg">

  <!-- Prefetch pour la page suivante probable -->
  <link rel="prefetch" href="/demande-devis">

  <!-- DNS prefetch pour external services -->
  <link rel="dns-prefetch" href="https://cdn.sanity.io">
  <link rel="dns-prefetch" href="https://api.resend.com">
</head>
```

---

## 📊 Monitoring Performance

### 1. Lighthouse CI

Créez `.lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/demande-devis',
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 2. Web Vitals Tracking

Ajoutez dans `src/lib/analytics/tracker.ts`:

```typescript
// Track Core Web Vitals
if (typeof window !== 'undefined') {
  import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
    getCLS((metric) => trackEvent('Web Vitals', { metric: 'CLS', value: metric.value }));
    getFID((metric) => trackEvent('Web Vitals', { metric: 'FID', value: metric.value }));
    getLCP((metric) => trackEvent('Web Vitals', { metric: 'LCP', value: metric.value }));
  });
}
```

### 3. Bundle Size Analysis

```bash
# Installer l'analyseur
npm install -D rollup-plugin-visualizer

# Ajouter dans astro.config.mjs
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  vite: {
    plugins: [
      visualizer({
        open: true,
        filename: 'dist/stats.html',
      }),
    ],
  },
});

# Build et voir l'analyse
npm run build
```

---

## 🎨 CSS Optimization

### 1. Critical CSS

Extrayez le CSS critique pour le formulaire:

```astro
---
// demande-devis.astro
---

<style is:inline>
/* Critical CSS inline pour LCP */
.form-header {
  text-align: center;
  margin-bottom: 3rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!-- Load non-critical CSS async -->
<link rel="stylesheet" href="/styles/form.css" media="print" onload="this.media='all'">
```

### 2. Remove Unused CSS

```bash
# Installer PurgeCSS
npm install -D @fullhuman/postcss-purgecss

# Configurer dans postcss.config.cjs
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
      safelist: ['html', 'body'],
    }),
  ],
};
```

---

## 🗜️ Compression

### 1. Gzip/Brotli

Vercel et Netlify activent automatiquement la compression.

Pour d'autres plateformes, ajoutez dans `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "br"
        }
      ]
    }
  ]
}
```

### 2. Asset Compression

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      assetsInlineLimit: 4096, // Inline assets < 4KB
    },
  },
});
```

---

## 🔄 Caching Strategy

### 1. Service Worker

Créez `public/sw.js`:

```javascript
const CACHE_NAME = 'neeoky-form-v1';
const urlsToCache = [
  '/demande-devis',
  '/assets/styles/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### 2. HTTP Caching Headers

```javascript
// Pour les assets statiques
export const GET: APIRoute = async () => {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

// Pour les API routes
export const GET: APIRoute = async () => {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
};
```

---

## 📱 Mobile Optimization

### 1. Responsive Images

```astro
<picture>
  <source
    media="(max-width: 640px)"
    srcset="/images/hero-mobile.webp"
    type="image/webp"
  >
  <source
    media="(max-width: 640px)"
    srcset="/images/hero-mobile.jpg"
  >
  <img
    src="/images/hero-desktop.jpg"
    alt="Hero"
    loading="lazy"
  >
</picture>
```

### 2. Touch Optimization

```css
/* Augmenter les zones de touch */
.btn {
  min-height: 44px; /* iOS minimum touch target */
  min-width: 44px;
  padding: 12px 24px;
}

/* Désactiver le delay de 300ms sur mobile */
* {
  touch-action: manipulation;
}
```

---

## 🧪 Performance Testing

### Commandes de Test

```bash
# Build de production
npm run build

# Preview localement
npm run preview

# Test Lighthouse
npx lighthouse http://localhost:4321/demande-devis --view

# Test mobile
npx lighthouse http://localhost:4321/demande-devis --preset=desktop --view

# Bundle size
npm run build -- --analyze

# Performance budget
npx bundlesize
```

### Performance Budget

Créez `.budgetrc.json`:

```json
{
  "budget": [
    {
      "path": "dist/**/*.js",
      "maxSize": "150 KB",
      "gzip": true
    },
    {
      "path": "dist/**/*.css",
      "maxSize": "50 KB",
      "gzip": true
    }
  ]
}
```

---

## 📈 Checklist d'Optimisation

### Build Time
- [ ] Code splitting configuré
- [ ] Tree shaking activé
- [ ] Minification activée
- [ ] Source maps désactivées en prod

### Runtime
- [ ] Lazy loading des composants
- [ ] Images optimisées (WebP)
- [ ] Fonts optimisées (font-display: swap)
- [ ] Critical CSS inline

### Caching
- [ ] Service Worker configuré
- [ ] HTTP cache headers
- [ ] CDN pour assets statiques

### Monitoring
- [ ] Lighthouse CI
- [ ] Web Vitals tracking
- [ ] Bundle size monitoring
- [ ] Error tracking

---

## 🎯 Résultats Attendus

### Avant Optimisation
- LCP: ~3.5s
- FID: ~150ms
- CLS: ~0.15
- Bundle: ~300KB

### Après Optimisation
- LCP: ~1.8s (-49%)
- FID: ~80ms (-47%)
- CLS: ~0.05 (-67%)
- Bundle: ~180KB (-40%)

---

## 🔗 Ressources

- [Web.dev Performance](https://web.dev/performance/)
- [Astro Performance Guide](https://docs.astro.build/en/guides/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)

---

*Dernière mise à jour: 2026-04-02*
