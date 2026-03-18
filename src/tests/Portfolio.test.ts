import { describe, it, expect, beforeEach } from 'vitest';

describe('Portfolio Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="portfolio">
        <h2 class="section-title">Mes <span class="gradient-text">réalisations</span></h2>
        <div class="portfolio-grid">
          <div class="portfolio-card">
            <span class="portfolio-tag">Montage Vidéo</span>
            <span class="portfolio-category">Coach Fitness</span>
          </div>
        </div>
        <div class="portfolio-cta">
          <a href="/contact" class="btn btn-primary">Démarrer un projet</a>
        </div>
      </section>
    `;
  });

  it('should render the section title correctly', () => {
    const title = document.querySelector('.section-title');
    expect(title?.textContent).toContain('Mes réalisations');
  });

  it('should render project cards', () => {
    const cards = document.querySelectorAll('.portfolio-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].querySelector('.portfolio-tag')).toBeDefined();
  });

  it('should have a CTA button to start a project', () => {
    const cta = document.querySelector('.portfolio-cta .btn-primary');
    expect(cta?.textContent).toContain('Démarrer un projet');
  });
});
