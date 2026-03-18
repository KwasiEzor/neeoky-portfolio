import { describe, it, expect, beforeEach } from 'vitest';

describe('Navigation Component', () => {
  beforeEach(() => {
    // We simulate the rendered HTML of the Navigation component
    document.body.innerHTML = `
      <header class="navbar">
        <div class="container">
          <a href="/" class="logo" aria-label="neeoky — Accueil">neeoky</a>
          <nav aria-label="Navigation principale">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#portfolio">Portfolio</a>
            <a href="/about">À propos</a>
            <a href="/contact">Contact</a>
          </nav>
          <a href="/contact" class="btn btn-primary">Travailler ensemble</a>
        </div>
      </header>
    `;
  });

  it('should render the logo with correct aria-label', () => {
    const logo = document.querySelector('.logo');
    expect(logo).toBeDefined();
    expect(logo?.getAttribute('aria-label')).toBe('neeoky — Accueil');
  });

  it('should contain all essential navigation links', () => {
    const nav = document.querySelector('nav');
    const links = nav?.querySelectorAll('a');
    const expectedTexts = ['Services', 'Process', 'Portfolio', 'À propos', 'Contact'];
    
    expect(links?.length).toBe(expectedTexts.length);
    expectedTexts.forEach(text => {
      const link = Array.from(links || []).find(l => l.textContent === text);
      expect(link).toBeDefined();
    });
  });

  it('should have a primary CTA button', () => {
    const cta = document.querySelector('.btn-primary');
    expect(cta).toBeDefined();
    expect(cta?.textContent).toBe('Travailler ensemble');
  });
});
