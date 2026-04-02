# 🚀 Guide d'Implémentation - Formulaire Multi-Étapes

## ✅ Ce qui a été implémenté

### Phase 1: Backend & Infrastructure ✅
- [x] Schemas Sanity pour les leads (avec groupes, validation, preview)
- [x] Client Sanity configuré (lecture et écriture)
- [x] Queries Sanity (getAllServices, getLeadById, etc.)
- [x] Mutations Sanity (createLead, updateLead, etc.)
- [x] Validation Zod complète pour tous les steps
- [x] Types TypeScript auto-générés

### Phase 2: State Management ✅
- [x] Nano Stores configuré
- [x] Store persistant pour les données du formulaire
- [x] Navigation entre étapes
- [x] Validation par étape
- [x] Auto-save dans localStorage

### Phase 3: API Routes ✅
- [x] `/api/leads/create` - Création de lead
- [x] `/api/services` - Récupération des services
- [x] Validation côté serveur avec Zod
- [x] Gestion d'erreurs robuste

### Phase 4: Composants UI ✅
- [x] MultiStepForm (container principal)
- [x] StepIndicator (progress bar + navigation)
- [x] FormField (composant réutilisable)
- [x] ServiceStep (étape 1)
- [x] PackStep (étape 2)
- [x] ProjectStep (étape 3)
- [x] ContactStep (étape 4)
- [x] RecapStep (étape 5)
- [x] Page `/demande-devis`

### Phase 5: Features UX ✅
- [x] Animations de transition entre étapes
- [x] Sauvegarde automatique
- [x] Indicateur de dernière sauvegarde
- [x] Messages de succès
- [x] Validation en temps réel
- [x] Navigation clavier

---

## 📝 Variables d'Environnement Requises

Créez un fichier `.env` à la racine du projet:

```env
# Sanity Configuration
SANITY_PROJECT_ID=cbdkq097
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-18
SANITY_API_TOKEN=votre_token_ici

# Pour obtenir votre token:
# 1. Allez sur https://www.sanity.io/manage
# 2. Sélectionnez votre projet
# 3. API > Tokens > Add API token
# 4. Donnez les permissions "Editor" ou "Admin"
```

---

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Déployer le schema Sanity
```bash
cd studio
npx sanity schema deploy
```

### 3. Lancer le projet
```bash
npm run dev
```

### 4. Accéder au formulaire
Ouvrez votre navigateur à: `http://localhost:4321/demande-devis`

### 5. Accéder au Sanity Studio
```bash
cd studio
npx sanity dev
```
Puis ouvrez: `http://localhost:3333`

---

## 📋 Prochaines Étapes (À Implémenter)

### 🔒 Sécurité & Anti-Spam (Important!)

```bash
# Installer les dépendances
npm install @upstash/ratelimit @upstash/redis
```

**Configuration Upstash:**
1. Créez un compte sur [upstash.com](https://upstash.com)
2. Créez une base Redis
3. Ajoutez dans `.env`:
```env
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

**Cloudflare Turnstile (CAPTCHA moderne):**
1. Allez sur [cloudflare.com/products/turnstile](https://www.cloudflare.com/products/turnstile/)
2. Créez un site
3. Ajoutez dans `.env`:
```env
TURNSTILE_SECRET_KEY=your_secret
PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

### 📧 Notifications Email

```bash
# Installer Resend (recommandé)
npm install resend @react-email/components
```

**Configuration Resend:**
1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre API key
3. Ajoutez dans `.env`:
```env
RESEND_API_KEY=your_key
ADMIN_EMAIL=votre@email.com
```

**Créer les templates:**
```typescript
// src/lib/email/templates/confirmation.tsx
import { Html, Button } from '@react-email/components';

export function ConfirmationEmail({ name, leadId }) {
  return (
    <Html>
      <h1>Merci {name}!</h1>
      <p>Nous avons bien reçu votre demande.</p>
      <Button href={`https://neeoky.com/suivi/${leadId}`}>
        Suivre ma demande
      </Button>
    </Html>
  );
}
```

**Mettre à jour l'API:**
```typescript
// src/pages/api/leads/create.ts
import { Resend } from 'resend';
import { ConfirmationEmail } from '../../lib/email/templates/confirmation';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Après création du lead:
await resend.emails.send({
  from: 'Neeoky <noreply@neeoky.com>',
  to: validatedData.email,
  subject: 'Confirmation de votre demande',
  react: ConfirmationEmail({
    name: validatedData.firstName,
    leadId: result.leadId
  }),
});
```

### 📊 Analytics

```bash
# Installer Plausible (RGPD-friendly)
npm install plausible-tracker
```

**Configuration:**
```typescript
// src/lib/utils/analytics.ts
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'neeoky.com',
});

export const trackEvent = (eventName: string, props?: any) => {
  plausible.trackEvent(eventName, { props });
};

// Utilisation:
trackEvent('form_step_completed', { step: 1 });
trackEvent('form_submitted', {
  services: data.selectedServices.length,
  budget: data.budget
});
```

### 🎨 Features UX Premium

**Toast Notifications:**
```bash
npm install sonner
```

```typescript
// src/scripts/form-client.ts
import { toast } from 'sonner';

toast.success('Brouillon sauvegardé');
toast.error('Erreur lors de l\'envoi');
```

**Animations:**
```bash
npm install motion
```

### 🎯 Dashboard Admin Sanity

**Créer un dashboard personnalisé:**
```javascript
// studio/dashboardConfig.js
export default {
  widgets: [
    {
      name: 'leads-stats',
      component: () => import('./widgets/LeadsStats'),
    },
  ],
};
```

**Widget d'exemple:**
```jsx
// studio/widgets/LeadsStats.jsx
import React, { useEffect, useState } from 'react';
import { client } from '../sanity.config';

export function LeadsStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.fetch(`{
      "total": count(*[_type == "lead"]),
      "new": count(*[_type == "lead" && status == "new"]),
      "converted": count(*[_type == "lead" && status == "converted"])
    }`).then(setStats);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Statistiques Leads</h2>
      {stats && (
        <div>
          <p>Total: {stats.total}</p>
          <p>Nouveaux: {stats.new}</p>
          <p>Convertis: {stats.converted}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 Personnalisation

### Modifier les couleurs
Éditez les gradients dans les fichiers `.astro`:
```css
/* Changer le violet/rose */
background: linear-gradient(135deg, #a855f7, #ec4899);

/* Par votre palette */
background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
```

### Ajouter un champ au formulaire

1. **Mettre à jour le schema Sanity:**
```javascript
// studio/schemaTypes/lead.js
{
  name: 'website',
  title: 'Site Web',
  type: 'url',
  group: 'contact'
}
```

2. **Mettre à jour la validation Zod:**
```typescript
// src/lib/validations/schemas.ts
export const contactStepSchema = z.object({
  // ... champs existants
  website: z.string().url().optional(),
});
```

3. **Ajouter le champ dans le composant:**
```astro
<!-- src/components/multi-step-form/steps/ContactStep.astro -->
<FormField
  label="Site Web"
  name="website"
  type="text"
  placeholder="https://example.com"
/>
```

### Modifier les options de budget/timeline

Éditez directement dans:
- `src/components/multi-step-form/steps/ProjectStep.astro`
- `studio/schemaTypes/lead.js`

---

## 🧪 Tests

### Tests unitaires
```bash
npm test
```

### Tests E2E
```bash
npm run test:e2e
```

**Créer un test E2E pour le formulaire:**
```typescript
// e2e/multi-step-form.spec.ts
import { test, expect } from '@playwright/test';

test('should complete multi-step form', async ({ page }) => {
  await page.goto('/demande-devis');

  // Step 1: Select service
  await page.click('[data-service-id="first-service"]');
  await page.click('#btn-next');

  // Step 2: Select pack
  await page.click('[data-pack="pro"]');
  await page.click('#btn-next');

  // Continue pour les autres steps...

  // Submit
  await page.click('#btn-submit');
  await expect(page.locator('#success-message')).toBeVisible();
});
```

---

## 📦 Déploiement

### Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

**Configuration:**
1. Ajoutez toutes les variables d'environnement dans Vercel
2. Le build se fera automatiquement

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Variables d'environnement de production
N'oubliez pas de configurer:
- `SANITY_API_TOKEN` avec les bonnes permissions
- `RESEND_API_KEY` (si emails)
- `UPSTASH_*` (si rate limiting)
- `TURNSTILE_SECRET_KEY` (si anti-spam)

---

## 🐛 Résolution de Problèmes

### Le formulaire ne se charge pas
1. Vérifiez que le projet est lancé: `npm run dev`
2. Vérifiez la console pour les erreurs
3. Vérifiez que Sanity est accessible

### Les services ne s'affichent pas
1. Vérifiez que `SANITY_PROJECT_ID` est correct
2. Vérifiez qu'il y a des services dans Sanity Studio
3. Testez l'API: `curl http://localhost:4321/api/services`

### Erreur lors de la soumission
1. Vérifiez que `SANITY_API_TOKEN` est défini
2. Vérifiez que le token a les bonnes permissions (Editor)
3. Regardez les logs serveur

### Le schema Sanity ne se déploie pas
```bash
cd studio
npx sanity schema deploy --force
```

---

## 📚 Ressources

- [Documentation Astro](https://docs.astro.build)
- [Documentation Sanity](https://www.sanity.io/docs)
- [Documentation Zod](https://zod.dev)
- [Nano Stores](https://github.com/nanostores/nanostores)
- [Resend](https://resend.com/docs)

---

## 🎉 Félicitations!

Vous avez maintenant un formulaire multi-étapes professionnel et moderne!

Pour toute question, consultez le plan complet dans `MULTI_STEP_FORM_PLAN.md`.

---

*Dernière mise à jour: 2026-04-01*
