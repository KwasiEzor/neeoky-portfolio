# 🚀 Guide de Déploiement - Formulaire Multi-Étapes

## 📋 Checklist Pré-Déploiement

### 1. Configuration des Variables d'Environnement

Créez un fichier `.env` avec toutes les variables requises:

```env
# ========================================
# SANITY CMS (REQUIS)
# ========================================
SANITY_PROJECT_ID=cbdkq097
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-18
SANITY_API_TOKEN=sk_prod_xxxxx

# Comment obtenir le token:
# 1. https://www.sanity.io/manage
# 2. Sélectionnez votre projet
# 3. API > Tokens > Add API token
# 4. Permissions: "Editor" minimum

# ========================================
# EMAIL (RECOMMANDÉ)
# ========================================
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=Neeoky <noreply@neeoky.com>
ADMIN_EMAIL=contact@neeoky.com

# Comment obtenir la clé:
# 1. https://resend.com/signup
# 2. API Keys > Create API Key
# 3. Permissions: "Sending access"

# ========================================
# RATE LIMITING (RECOMMANDÉ)
# ========================================
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Comment obtenir:
# 1. https://upstash.com
# 2. Create Database (Redis)
# 3. Copy REST API credentials

# ========================================
# ANALYTICS (OPTIONNEL)
# ========================================
PUBLIC_PLAUSIBLE_DOMAIN=neeoky.com
PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io

# Ou utilisez Plausible self-hosted:
# PUBLIC_PLAUSIBLE_API_HOST=https://analytics.votredomaine.com
```

---

## 🏗️ Déploiement sur Vercel (Recommandé)

### Étape 1: Préparer le Projet

```bash
# 1. Build local pour vérifier
npm run build

# 2. Commit tous les changements
git add .
git commit -m "feat: add multi-step form with CMS integration"
git push
```

### Étape 2: Installer l'Adaptateur Vercel

```bash
npm install @astrojs/vercel
```

### Étape 3: Configurer Astro pour Vercel

Mettez à jour `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from 'astro-sanity';
import vercel from '@astrojs/vercel/serverless'; // Ajoutez ceci

const env = loadEnv(import.meta.env?.MODE ?? 'production', process.cwd(), '');

export default defineConfig({
  site: 'https://neeoky.com',
  output: 'hybrid',
  adapter: vercel(), // Ajoutez ceci
  trailingSlash: 'never',
  integrations: [
    sanity({
      projectId: env.SANITY_PROJECT_ID || 'cbdkq097',
      dataset: env.SANITY_DATASET || 'production',
      apiVersion: env.SANITY_API_VERSION || '2024-03-18',
      useCdn: true,
    }),
  ],
});
```

### Étape 4: Déployer sur Vercel

**Option A: Via CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Via GitHub**
1. Allez sur [vercel.com](https://vercel.com)
2. Import Git Repository
3. Sélectionnez votre repo
4. Configurez les variables d'environnement
5. Deploy!

### Étape 5: Configurer les Variables d'Environnement sur Vercel

1. Allez dans Project Settings
2. Environment Variables
3. Ajoutez toutes les variables de `.env`
4. **Important**: Ne pas ajouter les variables `PUBLIC_*` en tant que secrets

---

## 🌐 Déploiement sur Netlify

### Étape 1: Installer l'Adaptateur

```bash
npm install @astrojs/netlify
```

### Étape 2: Configurer Astro

```javascript
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
  // ...
  adapter: netlify(),
});
```

### Étape 3: Créer netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  directory = "dist/functions"
```

### Étape 4: Déployer

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 📊 Configuration Post-Déploiement

### 1. Vérifier Sanity Studio

```bash
cd studio
npx sanity deploy
```

Votre Studio sera accessible à: `https://votre-projet.sanity.studio`

### 2. Configurer Resend (Email)

1. Vérifiez votre domaine sur Resend
2. Ajoutez les enregistrements DNS (SPF, DKIM, DMARC)
3. Testez l'envoi depuis le dashboard Resend

### 3. Configurer Plausible (Analytics)

**Option A: Plausible Cloud**
1. Créez un compte sur [plausible.io](https://plausible.io)
2. Ajoutez votre domaine
3. Pas besoin de script - déjà intégré!

**Option B: Self-hosted**
```bash
# Utilisez Docker Compose
docker-compose up -d
```

### 4. Tester le Formulaire

1. Allez sur `https://votredomaine.com/demande-devis`
2. Remplissez le formulaire
3. Vérifiez:
   - ✅ Lead créé dans Sanity
   - ✅ Email de confirmation reçu
   - ✅ Email admin reçu
   - ✅ Analytics trackés

---

## 🔒 Sécurité en Production

### Checklist de Sécurité

- [ ] **Variables d'environnement**: Toutes les clés sensibles sont en variables d'env
- [ ] **HTTPS**: Activé (automatique avec Vercel/Netlify)
- [ ] **Rate Limiting**: Configuré avec Upstash
- [ ] **CORS**: Configuré correctement
- [ ] **CSP Headers**: Ajoutés (voir ci-dessous)
- [ ] **Honeypot**: Activé dans le formulaire ✅
- [ ] **Validation**: Double validation client/serveur ✅
- [ ] **Sanitization**: Inputs nettoyés ✅

### Ajouter des Headers de Sécurité

Créez `public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://cdn.sanity.io https://api.resend.com;
```

Pour Netlify, renommez en `public/_headers`.
Pour Vercel, utilisez `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📈 Monitoring et Logs

### 1. Sanity Studio Logs

```bash
cd studio
npx sanity manage
```

### 2. Vercel Logs

```bash
vercel logs production
```

Ou via le dashboard: https://vercel.com/dashboard

### 3. Resend Logs

Dashboard: https://resend.com/emails

### 4. Upstash Metrics

Dashboard: https://console.upstash.com

### 5. Plausible Dashboard

https://plausible.io/neeoky.com

---

## 🐛 Troubleshooting

### Le formulaire ne s'affiche pas

**Cause**: Erreur de build
```bash
# Vérifier les logs de build
vercel logs --follow

# Tester localement
npm run build
npm run preview
```

### Les emails ne s'envoient pas

**Vérifications**:
1. `RESEND_API_KEY` est définie
2. Le domaine est vérifié sur Resend
3. Les logs Vercel pour voir les erreurs:
```bash
vercel logs --follow | grep -i email
```

### Rate limiting ne fonctionne pas

**Vérifications**:
1. `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` définis
2. Test de connexion:
```bash
curl -X GET ${UPSTASH_REDIS_REST_URL}/get/test \
  -H "Authorization: Bearer ${UPSTASH_REDIS_REST_TOKEN}"
```

### Les leads ne sont pas créés

**Vérifications**:
1. `SANITY_API_TOKEN` est valide
2. Le token a les permissions "Editor"
3. Test API:
```bash
curl -X POST https://votredomaine.com/api/leads/create \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 📊 Métriques à Surveiller

### Performance
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: > 95
- **API Response Time**: < 500ms

### Conversion
- **Form Start Rate**: % de visiteurs qui commencent
- **Completion Rate**: % qui terminent (objectif: > 60%)
- **Abandon Rate**: Par étape
- **Time to Complete**: Temps moyen (objectif: < 5 min)

### Technique
- **Error Rate**: < 0.1%
- **Spam Rate**: % de soumissions spam bloquées
- **Email Delivery Rate**: > 95%
- **Rate Limit Hits**: Nombre de requêtes bloquées

---

## 🔄 Mises à Jour

### Mettre à jour le Schema Sanity

```bash
cd studio
# Modifier schemaTypes/lead.js
npx sanity schema deploy
```

### Déployer une Nouvelle Version

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push

# Vercel déploie automatiquement
# Ou manuellement:
vercel --prod
```

---

## 🎯 Optimisations Post-Lancement

### 1. Activer le CDN de Sanity
```javascript
useCdn: true, // Déjà activé
```

### 2. Configurer le Cache
```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'sonner'],
            'form': ['zod', 'nanostores'],
          },
        },
      },
    },
  },
});
```

### 3. Ajouter un Service Worker (PWA)

```bash
npm install @vite-pwa/astro
```

---

## 📞 Support

- **Documentation Astro**: https://docs.astro.build
- **Documentation Sanity**: https://www.sanity.io/docs
- **Documentation Resend**: https://resend.com/docs
- **Support Vercel**: https://vercel.com/support

---

*Guide créé le: 2026-04-01*
*Dernière mise à jour: 2026-04-01*
