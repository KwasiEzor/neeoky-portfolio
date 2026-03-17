# neeoky — Créatif Digital Augmenté par l'IA

Portfolio personnel de neeoky, créatif digital freelance : montage vidéo, sites vitrines sur mesure et services digitaux, le tout propulsé par des workflows IA.

## Structure du projet

```
neeoky-portfolio/
├── index.html       # Page d'accueil (services, process, portfolio, FAQ)
├── about.html       # Page À propos (parcours, skills, stats, valeurs, timeline)
├── contact.html     # Page Contact (formulaire Formspree + sidebar)
├── style.css        # Styles globaux (dark mode, glassmorphism, responsive)
├── script.js        # Interactions (cursor, animations, FAQ, formulaire)
├── robots.txt       # SEO
├── sitemap.xml      # SEO
└── assets/          # Images et médias
```

## Stack technique

- **HTML5 / CSS3 / Vanilla JS** — Aucun framework, aucun bundler
- **Fonts** — Syne (headings) + DM Sans (body) via Google Fonts
- **Icons** — Lucide Icons v0.453.0
- **Formulaire** — Formspree
- **Design** — Dark mode, gradient violet/rose, glassmorphism, animations scroll

## Pages

### Accueil (`index.html`)
Hero avec carte flottante, marquee d'outils, grille de services (Starter / Pro IA / Mensuel), process en 4 étapes, portfolio, niches, pourquoi moi, FAQ, CTA compact.

### À propos (`about.html`)
Hero avatar, storytelling en 3 étapes, compétences avec barres de progression animées (montage, IA, design, web & sites vitrines), stats avec counter animation, valeurs, timeline 2024-2026.

### Contact (`contact.html`)
Formulaire Formspree (nom, email, type de projet, message) avec sidebar (disponibilité, liens sociaux, notes info).

## Composants partagés

Chaque page inclut les mêmes éléments :
- Custom cursor (desktop uniquement, activé via JS)
- Progress bar de scroll
- Noise overlay + aurora blobs
- Navbar avec lien actif auto-détecté
- Footer premium 4 colonnes (brand, navigation, services, disponibilité)

Les blocs partagés sont marqués par des commentaires `<!-- SHARED: ... START/END -->`.

## Features

- Custom cursor avec effet hover (désactivé sur touch)
- Animations au scroll (IntersectionObserver)
- FAQ accordion avec `scrollHeight` dynamique
- Counter animation (ease-out cubic)
- Skill bars animées au scroll
- Nav link actif auto-détecté par page
- Marquee pause au hover
- Menu mobile avec overlay
- Focus visible pour navigation clavier
- `prefers-reduced-motion` respecté
- Progress bar throttlée avec `requestAnimationFrame`

## Configuration

### Liens sociaux
Mettre à jour les `href="#"` dans le footer et la sidebar contact avec les vraies URLs (Malt, Fiverr, LinkedIn, Instagram).

### OG Image
Placer une image `og-image.jpg` dans le dossier `assets/` (1200x630px recommandé).

## Développement

Aucune étape de build. Ouvrir `index.html` dans un navigateur ou utiliser un serveur local :

```bash
npx serve .
```

## Licence

Tous droits réservés.
