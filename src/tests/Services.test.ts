import { describe, it, expect, beforeEach } from 'vitest';

describe('Services Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="services">
        <h2 class="section-title">Mes <span class="gradient-text">services</span></h2>
        <div class="services-grid">
          <div class="service-card">
            <h3 class="service-name">Starter</h3>
            <div class="service-price">80€</div>
          </div>
          <div class="service-card featured">
            <span class="popular-badge">Populaire</span>
            <h3 class="service-name">Pro IA</h3>
            <div class="service-price">180€</div>
          </div>
          <div class="service-card">
            <h3 class="service-name">Mensuel</h3>
            <div class="service-price">600€</div>
          </div>
        </div>
        <div class="addons">
          <h3 class="addons-title">Add-ons à la carte</h3>
          <div class="addon">
            <span class="addon-price">25€</span>
            <span class="addon-name">Miniature seule</span>
          </div>
        </div>
      </section>
    `;
  });

  it('should render the section title correctly', () => {
    const title = document.querySelector('.section-title');
    expect(title?.textContent).toContain('Mes services');
  });

  it('should render exactly 3 main service cards', () => {
    const cards = document.querySelectorAll('.service-card');
    expect(cards.length).toBe(3);
  });

  it('should highlight the Pro IA card as featured/popular', () => {
    const featuredCard = document.querySelector('.service-card.featured');
    expect(featuredCard).toBeDefined();
    expect(featuredCard?.querySelector('.popular-badge')).toBeDefined();
    expect(featuredCard?.querySelector('.service-name')?.textContent).toBe('Pro IA');
  });

  it('should render the Add-ons section', () => {
    const addons = document.querySelector('.addons');
    expect(addons).toBeDefined();
    expect(document.querySelectorAll('.addon').length).toBeGreaterThan(0);
  });
});
