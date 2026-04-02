# 🎯 Plan d'Implémentation - Formulaire Multi-Étapes avec Sanity CMS

## 📊 Stack Technique Actuelle
- **Frontend**: Astro 5.0
- **CMS**: Sanity (projectId: cbdkq097)
- **Schemas existants**: services, projects, testimonials
- **Testing**: Vitest + Playwright

## 🏗️ Architecture Complète

### Étapes du Formulaire
1. **Service** - Choix des services
2. **Pack** - Sélection du pack/offre
3. **Projet** - Détails du projet (description, budget, délais)
4. **Contact** - Informations de contact
5. **Recap** - Récapitulatif et validation finale

---

## 📦 Dépendances à Installer

```json
{
  "dependencies": {
    "nanostores": "^0.10.0",
    "@nanostores/persistent": "^0.10.0",
    "zod": "^3.22.0",
    "motion": "^10.16.0",
    "sonner": "^1.3.0",
    "nanoid": "^5.0.0",
    "resend": "^3.0.0",
    "@react-email/components": "^0.0.14",
    "@upstash/ratelimit": "^1.0.0",
    "@upstash/redis": "^1.28.0",
    "plausible-tracker": "^0.3.9",
    "date-fns": "^3.0.0",
    "clsx": "^2.1.0"
  }
}
```

---

## 🗂️ Structure des Dossiers

```
src/
├── components/
│   └── multi-step-form/
│       ├── MultiStepForm.astro
│       ├── StepIndicator.astro
│       ├── steps/
│       │   ├── ServiceStep.astro
│       │   ├── PackStep.astro
│       │   ├── ProjectStep.astro
│       │   ├── ContactStep.astro
│       │   └── RecapStep.astro
│       ├── ui/
│       │   ├── FormField.astro
│       │   ├── RadioGroup.astro
│       │   ├── Checkbox.astro
│       │   └── FileUpload.astro
│       └── animations/
│           ├── SlideTransition.astro
│           └── LoadingSkeleton.astro
│
├── stores/
│   ├── formStore.ts
│   ├── navigationStore.ts
│   └── sessionStore.ts
│
├── lib/
│   ├── validations/
│   │   ├── schemas.ts
│   │   └── messages.ts
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── email/
│   │   ├── templates/
│   │   └── sender.ts
│   └── utils/
│       ├── analytics.ts
│       ├── security.ts
│       └── storage.ts
│
├── pages/
│   ├── demande-devis.astro
│   └── api/
│       ├── leads/
│       │   ├── create.ts
│       │   ├── draft.ts
│       │   └── [id].ts
│       ├── services.ts
│       ├── send-email.ts
│       └── verify-turnstile.ts
│
└── scripts/
    └── form-client.ts
```

---

## 📋 Schemas Sanity

### Lead Schema

```javascript
// studio/schemaTypes/lead.js
export default {
  name: 'lead',
  title: 'Demande Client',
  type: 'document',
  groups: [
    { name: 'selection', title: 'Sélection' },
    { name: 'project', title: 'Projet' },
    { name: 'contact', title: 'Contact' },
    { name: 'tracking', title: 'Suivi' }
  ],
  fields: [
    // === SÉLECTION ===
    {
      name: 'selectedServices',
      title: 'Services Sélectionnés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'selection',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'selectedPack',
      title: 'Pack Choisi',
      type: 'string',
      options: {
        list: [
          { title: 'Starter', value: 'starter' },
          { title: 'Pro', value: 'pro' },
          { title: 'Premium', value: 'premium' },
          { title: 'Sur mesure', value: 'custom' }
        ]
      },
      group: 'selection'
    },

    // === PROJET ===
    {
      name: 'projectType',
      title: 'Type de Projet',
      type: 'string',
      options: {
        list: [
          'Site vitrine',
          'E-commerce',
          'Application web',
          'Mobile app',
          'Branding',
          'Vidéo',
          'Autre'
        ]
      },
      group: 'project',
      validation: Rule => Rule.required()
    },
    {
      name: 'projectDescription',
      title: 'Description du Projet',
      type: 'text',
      rows: 5,
      group: 'project',
      validation: Rule => Rule.required().min(50).max(1000)
    },
    {
      name: 'budget',
      title: 'Budget Estimé',
      type: 'string',
      options: {
        list: [
          '< 2 000€',
          '2 000€ - 5 000€',
          '5 000€ - 10 000€',
          '10 000€ - 20 000€',
          '> 20 000€'
        ]
      },
      group: 'project',
      validation: Rule => Rule.required()
    },
    {
      name: 'timeline',
      title: 'Délai Souhaité',
      type: 'string',
      options: {
        list: [
          'Urgent (< 1 mois)',
          '1-2 mois',
          '2-3 mois',
          '> 3 mois',
          'Flexible'
        ]
      },
      group: 'project',
      validation: Rule => Rule.required()
    },
    {
      name: 'attachments',
      title: 'Fichiers Joints',
      type: 'array',
      of: [{ type: 'file' }],
      group: 'project',
      options: {
        accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
      }
    },

    // === CONTACT ===
    {
      name: 'firstName',
      title: 'Prénom',
      type: 'string',
      validation: Rule => Rule.required(),
      group: 'contact'
    },
    {
      name: 'lastName',
      title: 'Nom',
      type: 'string',
      validation: Rule => Rule.required(),
      group: 'contact'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
      group: 'contact'
    },
    {
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'contact'
    },
    {
      name: 'company',
      title: 'Entreprise',
      type: 'string',
      group: 'contact'
    },
    {
      name: 'gdprConsent',
      title: 'Consentement RGPD',
      type: 'boolean',
      validation: Rule => Rule.required(),
      group: 'contact'
    },

    // === TRACKING & ADMIN ===
    {
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: '🆕 Nouveau', value: 'new' },
          { title: '👀 En cours', value: 'in_progress' },
          { title: '📞 Contacté', value: 'contacted' },
          { title: '💰 Devis envoyé', value: 'quoted' },
          { title: '✅ Converti', value: 'converted' },
          { title: '❌ Archivé', value: 'archived' }
        ]
      },
      initialValue: 'new',
      group: 'tracking'
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Page ou campagne d\'origine',
      group: 'tracking'
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      readOnly: true,
      group: 'tracking'
    },
    {
      name: 'utmParams',
      title: 'Paramètres UTM',
      type: 'object',
      fields: [
        { name: 'source', type: 'string', title: 'UTM Source' },
        { name: 'medium', type: 'string', title: 'UTM Medium' },
        { name: 'campaign', type: 'string', title: 'UTM Campaign' }
      ],
      group: 'tracking'
    },
    {
      name: 'notes',
      title: 'Notes Internes',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'tracking'
    },
    {
      name: 'assignedTo',
      title: 'Assigné à',
      type: 'string',
      group: 'tracking'
    }
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: 'status',
      createdAt: '_createdAt'
    },
    prepare({ firstName, lastName, email, status }) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${email} • ${status || 'nouveau'}`,
        media: null
      }
    }
  },

  orderings: [
    {
      title: 'Date (récent)',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }]
    }
  ]
}
```

---

## 🔐 Validation Schemas (Zod)

```typescript
// lib/validations/schemas.ts
import { z } from 'zod';

export const serviceStepSchema = z.object({
  selectedServices: z.array(z.string()).min(1, 'Sélectionnez au moins un service'),
});

export const packStepSchema = z.object({
  selectedPack: z.enum(['starter', 'pro', 'premium', 'custom'], {
    required_error: 'Sélectionnez un pack',
  }),
  customPackDetails: z.string().optional(),
});

export const projectStepSchema = z.object({
  projectType: z.string().min(1, 'Sélectionnez un type de projet'),
  projectDescription: z.string()
    .min(50, 'Décrivez votre projet en au moins 50 caractères')
    .max(1000, 'Maximum 1000 caractères'),
  budget: z.string().min(1, 'Sélectionnez une fourchette de budget'),
  timeline: z.string().min(1, 'Sélectionnez un délai'),
  attachments: z.array(z.instanceof(File)).max(5, 'Maximum 5 fichiers').optional(),
});

export const contactStepSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (minimum 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (minimum 2 caractères)'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro français invalide').optional().or(z.literal('')),
  company: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, 'Vous devez accepter la politique de confidentialité'),
});

export const completeFormSchema = serviceStepSchema
  .merge(packStepSchema)
  .merge(projectStepSchema)
  .merge(contactStepSchema);

export type ServiceStepData = z.infer<typeof serviceStepSchema>;
export type PackStepData = z.infer<typeof packStepSchema>;
export type ProjectStepData = z.infer<typeof projectStepSchema>;
export type ContactStepData = z.infer<typeof contactStepSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;
```

---

## 🗄️ State Management (Nano Stores)

```typescript
// stores/formStore.ts
import { atom, map, computed } from 'nanostores';
import { persistentMap } from '@nanostores/persistent';
import type { CompleteFormData } from '../lib/validations/schemas';

export const formData = persistentMap<Partial<CompleteFormData>>('form-data:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const currentStep = atom<number>(1);
export const totalSteps = atom<number>(5);

export const stepValidation = map<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
});

export const isSubmitting = atom<boolean>(false);
export const lastSaved = atom<Date | null>(null);

export const progress = computed([currentStep, totalSteps], (current, total) => {
  return (current / total) * 100;
});

export const nextStep = () => {
  const current = currentStep.get();
  if (current < totalSteps.get()) {
    currentStep.set(current + 1);
  }
};

export const previousStep = () => {
  const current = currentStep.get();
  if (current > 1) {
    currentStep.set(current - 1);
  }
};

export const updateFormData = (data: Partial<CompleteFormData>) => {
  formData.set({ ...formData.get(), ...data });
  lastSaved.set(new Date());
};

export const resetForm = () => {
  formData.set({});
  currentStep.set(1);
  stepValidation.set({
    1: false, 2: false, 3: false, 4: false, 5: false,
  });
};
```

---

## 🎨 Features UX Premium

### Auto-Save
- Sauvegarde automatique toutes les 30 secondes
- Persistance dans localStorage
- Indication visuelle de la dernière sauvegarde

### Animations
- Transitions fluides entre étapes
- Loading skeletons
- Micro-interactions sur les boutons

### Notifications
- Toast pour chaque action (sauvegarde, erreur, succès)
- Messages contextuels

### Accessibilité
- Navigation clavier complète
- ARIA labels
- Focus management
- Messages d'erreur annoncés

---

## 🔒 Sécurité

### Protection Spam
- Cloudflare Turnstile (CAPTCHA moderne)
- Honeypot fields invisibles
- Rate limiting (5 soumissions/heure/IP)

### Validation
- Validation côté client (Zod)
- Validation côté serveur (double check)
- Sanitization des inputs
- CSRF protection

### RGPD
- Consentement explicite
- Politique de confidentialité
- Droit à l'oubli
- Durée de conservation définie

---

## 📊 Analytics & Tracking

### Events à tracker
- `form_started` - Formulaire commencé
- `step_completed` - Étape validée
- `form_abandoned` - Formulaire abandonné
- `form_submitted` - Formulaire soumis
- `error_occurred` - Erreur rencontrée

### Funnel de conversion
- Taux de complétion par étape
- Temps moyen par étape
- Taux d'abandon
- Sources de trafic performantes

---

## ✅ Checklist d'Implémentation

### Phase 1: Backend & Schemas
- [ ] Créer schema Sanity `lead`
- [ ] Configurer validation Zod
- [ ] Créer API route `/api/leads/create`
- [ ] Créer API route `/api/leads/draft`
- [ ] Implémenter rate limiting

### Phase 2: State Management
- [ ] Installer Nano Stores
- [ ] Créer `formStore.ts`
- [ ] Créer `navigationStore.ts`
- [ ] Implémenter persistance localStorage

### Phase 3: UI Components
- [ ] Créer `MultiStepForm.astro`
- [ ] Créer `StepIndicator.astro`
- [ ] Créer tous les steps (5)
- [ ] Créer composants UI réutilisables
- [ ] Implémenter animations

### Phase 4: Email & Notifications
- [ ] Configurer Resend
- [ ] Créer templates email
- [ ] Email confirmation client
- [ ] Email notification admin

### Phase 5: Sécurité
- [ ] Implémenter Turnstile
- [ ] Configurer rate limiting
- [ ] Honeypot fields
- [ ] CSRF tokens

### Phase 6: Analytics
- [ ] Configurer Plausible
- [ ] Tracker events personnalisés
- [ ] Dashboard dans Sanity

### Phase 7: Tests & Optimisation
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Tests accessibilité
- [ ] Optimisation bundle
- [ ] Performance audit

---

## 🚀 Déploiement

### Variables d'environnement requises

```env
# Sanity
SANITY_PROJECT_ID=cbdkq097
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-18
SANITY_API_TOKEN=your_token_here

# Resend
RESEND_API_KEY=your_key_here

# Upstash (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your_key_here
PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here

# Analytics
PUBLIC_PLAUSIBLE_DOMAIN=neeoky.com
```

---

## 📈 Métriques de Succès

- **Performance**: Lighthouse score > 95
- **Conversion**: Taux de complétion > 60%
- **Accessibilité**: WCAG AA compliant
- **SEO**: Core Web Vitals optimisés
- **Sécurité**: 0 vulnérabilités critiques

---

## 🛠️ Maintenance

### Logs à surveiller
- Taux d'erreurs API
- Temps de réponse
- Taux d'abandon par étape
- Spam bloqué

### Optimisations futures
- A/B testing des variantes
- ML pour détection spam avancée
- Intégration CRM (HubSpot, Pipedrive)
- Chat en direct si questions

---

*Document créé le: 2026-04-01*
*Dernière mise à jour: 2026-04-01*
