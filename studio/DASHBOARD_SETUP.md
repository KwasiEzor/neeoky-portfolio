# 🎨 Configuration du Dashboard Admin Sanity

## 📦 Installation

Le dashboard personnalisé nécessite le plugin dashboard de Sanity:

```bash
cd studio
npm install sanity-plugin-dashboard-widget-netlify @sanity/dashboard
```

## ⚙️ Configuration

### 1. Mettre à jour `sanity.config.js`

```javascript
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { dashboardTool } from '@sanity/dashboard'
import { schemaTypes } from './schemaTypes'

// Import custom widgets
import { LeadsOverview } from './widgets/LeadsOverview'
import { RecentLeads } from './widgets/RecentLeads'
import { ConversionStats } from './widgets/ConversionStats'

export default defineConfig({
  name: 'default',
  title: 'neeoky-portfolio',

  projectId: 'cbdkq097',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool(),
    dashboardTool({
      widgets: [
        {
          name: 'leads-overview',
          component: LeadsOverview,
          layout: { width: 'medium', height: 'auto' },
        },
        {
          name: 'conversion-stats',
          component: ConversionStats,
          layout: { width: 'medium', height: 'auto' },
        },
        {
          name: 'recent-leads',
          component: RecentLeads,
          layout: { width: 'full', height: 'auto' },
        },
      ],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

// Export client for widgets
export { client } from './sanity.client'
```

### 2. Créer `sanity.client.js`

```javascript
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'cbdkq097',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
})
```

### 3. Structure des Widgets

Les 3 widgets créés:

#### LeadsOverview.jsx
- Vue d'ensemble des statistiques
- Compteurs par statut
- Activité récente (aujourd'hui, semaine, mois)
- Taux de conversion

#### ConversionStats.jsx
- Services les plus populaires
- Distribution des packs
- Répartition des budgets
- Préférences de délais

#### RecentLeads.jsx
- 10 dernières demandes
- Badges de statut et priorité
- Navigation rapide vers les fiches
- Formatage des dates relatif

## 🎨 Personnalisation

### Modifier les Couleurs

Dans chaque widget, vous pouvez personnaliser:

```jsx
// Badges
<Badge tone="primary">Nouveau</Badge>
// Options: default, primary, positive, caution, critical

// Cards
<Card tone="positive">...</Card>
// Options: default, transparent, primary, positive, caution, critical
```

### Ajouter des Actions Rapides

Dans `RecentLeads.jsx`:

```jsx
<Button
  text="Contacter"
  tone="positive"
  onClick={() => {
    window.location.href = `mailto:${lead.email}`;
  }}
/>
```

### Ajouter des Graphiques

Installer chart.js:

```bash
npm install chart.js react-chartjs-2
```

Puis dans un widget:

```jsx
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai'],
  datasets: [{
    label: 'Leads',
    data: [12, 19, 3, 5, 2],
    borderColor: '#a855f7',
  }],
};

<Line data={data} />
```

## 🚀 Déploiement

```bash
cd studio
npx sanity deploy
```

Votre dashboard sera accessible à: `https://votre-projet.sanity.studio`

## 📊 Métriques Disponibles

### Via GROQ Queries

```javascript
// Leads par mois (12 derniers mois)
const query = `
  *[_type == "lead" && _createdAt > $startDate] {
    "month": dateTime(_createdAt).month,
    "year": dateTime(_createdAt).year
  } | order(year desc, month desc)
`;

// Taux de conversion par source
const query = `
  {
    "bySource": *[_type == "lead"] {
      source,
      status
    }
  }
`;

// Budget moyen par type de projet
const query = `
  *[_type == "lead"] {
    projectType,
    budget
  }
`;
```

## 🔧 Debugging

### Vérifier les Données

```bash
cd studio
npx sanity manage
```

Puis dans Vision (Query):

```groq
*[_type == "lead"] | order(_createdAt desc) [0...5]
```

### Logs des Widgets

Les widgets loggent automatiquement dans la console:

```javascript
console.log('Stats fetched:', stats);
```

Ouvrez DevTools (F12) dans Sanity Studio pour voir.

## 💡 Tips

1. **Performance**: Les widgets se rafraîchissent automatiquement
2. **Cache**: Utilisez `useCdn: false` pour les données temps réel
3. **Permissions**: Assurez-vous que l'API token a accès en lecture
4. **Responsive**: Les layouts s'adaptent automatiquement

## 📚 Ressources

- [Sanity Dashboard Plugin](https://www.sanity.io/plugins/sanity-plugin-dashboard)
- [Sanity UI Components](https://www.sanity.io/ui)
- [GROQ Query Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)

---

*Configuration créée le: 2026-04-02*
