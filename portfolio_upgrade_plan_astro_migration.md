# 🚀 Portfolio Evolution — Astro + Sanity + MCP (2026 Edition)

## 🎯 Goal
Transform the "neeoky" portfolio into a high-performance, AI-orchestrated content engine that is easy to manage via natural language (MCP) and offers a premium, app-like user experience.

---

## 🧠 The "Elite" Stack

- **Framework:** [Astro 5.x](https://astro.build/) (Static-first with View Transitions)
- **CMS:** [Sanity.io](https://www.sanity.io/) (Headless + Portable Text)
- **AI Sync:** [Sanity MCP Server](https://github.com/sanity-io/mcp-server-sanity) (For "Vibe-Coding" content)
- **Deployment:** [Vercel](https://vercel.com/) (Edge Config + Analytics)
- **Testing:** [Vitest](https://vitest.dev/) (Unit/Component) + [Playwright](https://playwright.dev/) (E2E)

---

## 🧱 Implementation Phases

### ✅ Phase 1: Environment & Tooling
- [x] Initialize Astro 5.x in the root.
- [x] Set up Vitest and Playwright configuration.
- [x] Configure Sanity Studio & Schema (Project, Service, Testimonial).

### ✅ Phase 2: Core Components (TDD)
- [x] **Test & Build:** `Navigation.astro` (Sticky Glassmorphism Navbar).
- [x] **Test & Build:** `Hero.astro` (Video Background + Floating Stats).
- [x] **Test & Build:** `Services.astro` (Sanity Connected with Fallbacks).
- [x] **Test & Build:** `Process.astro` (AI Workflow).
- [x] **Test & Build:** `Portfolio.astro` (Project Grid).
- [x] **Test & Build:** `Testimonials.astro` (Interactive Carousel).
- [x] **Test & Build:** `Expertises.astro`, `FAQ.astro`, `Showcase.astro`, `Footer.astro`.

### ✅ Phase 3: Page Migrations
- [x] Migrate `index.html` to `src/pages/index.astro`.
- [x] Migrate `about.html` to `src/pages/about.astro`.
- [x] Migrate `contact.html` to `src/pages/contact.astro`.
- [x] Implement `BaseLayout.astro` with View Transitions.

### ✅ Phase 4: Dynamic Data Integration
- [x] Connect Astro to Sanity API (`@sanity/client` + `astro-sanity`).
- [x] Implement graceful fallbacks for empty datasets.

### ⏳ Phase 5: AI & Automation (MCP) - Next Steps
- [ ] Deploy Sanity MCP Server locally or via Vercel.
- [ ] Create "Skills" for content generation (e.g., `generate-project-case-study`).
- [ ] Push to `main` to trigger Vercel deployment.

---

## 🧾 One-Line Summary
> Built a test-verified, AI-orchestrated Astro portfolio connected to Sanity, enabling effortless, high-quality content updates via natural language.
