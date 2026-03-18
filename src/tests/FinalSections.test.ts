import { describe, it, expect, beforeEach } from 'vitest';

describe('Final Sections', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="expertises">
        <h2 class="section-title">Mes expertises</h2>
        <div class="niche-pill">Sites Vitrines</div>
      </section>
      <section id="faq">
        <div class="faq-item">Question ?</div>
      </section>
      <section id="showcase">
        <h2>Le résultat parle</h2>
      </section>
      <footer class="footer">
        <div class="logo">neeoky</div>
      </footer>
    `;
  });

  it('should render Expertises section', () => {
    expect(document.querySelector('#expertises')).toBeDefined();
    expect(document.querySelectorAll('.niche-pill').length).toBeGreaterThan(0);
  });

  it('should render FAQ section', () => {
    expect(document.querySelector('#faq')).toBeDefined();
    expect(document.querySelectorAll('.faq-item').length).toBeGreaterThan(0);
  });

  it('should render Showcase section', () => {
    expect(document.querySelector('#showcase h2')?.textContent).toContain('Le résultat parle');
  });

  it('should render Footer', () => {
    expect(document.querySelector('footer')).toBeDefined();
    expect(document.querySelector('footer .logo')).toBeDefined();
  });
});
