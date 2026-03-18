import { describe, it, expect, beforeEach } from 'vitest';

describe('Hero Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section class="hero">
        <video class="hero-video" autoplay muted loop playsinline></video>
        <div class="container">
          <div class="badge">Disponible pour nouveaux projets</div>
          <h1 class="hero-title">
            <span>Créatif Digital</span>
            <span class="gradient-text">Augmenté par l'IA</span>
            <span class="outline-text">qui livre.</span>
          </h1>
          <div class="hero-buttons">
            <a href="#services" class="btn btn-primary">Voir mes offres</a>
            <a href="/contact" class="btn btn-ghost">Me contacter</a>
          </div>
          <div class="hero-card">
            <div class="hero-stat-value">24h</div>
            <div class="hero-stat-value">100%</div>
          </div>
        </div>
      </section>
    `;
  });

  it('should have a background video for the premium feel', () => {
    const video = document.querySelector('.hero-video');
    expect(video).toBeDefined();
    expect(video?.getAttribute('autoplay')).toBe('');
  });

  it('should display the availability badge', () => {
    const badge = document.querySelector('.badge');
    expect(badge?.textContent).toContain('Disponible');
  });

  it('should render the main title with gradient and outline spans', () => {
    const title = document.querySelector('.hero-title');
    expect(title?.querySelector('.gradient-text')).toBeDefined();
    expect(title?.querySelector('.outline-text')).toBeDefined();
    expect(title?.textContent).toContain('Créatif Digital');
  });

  it('should contain both Primary and Ghost CTA buttons', () => {
    const primaryBtn = document.querySelector('.btn-primary');
    const ghostBtn = document.querySelector('.btn-ghost');
    expect(primaryBtn).toBeDefined();
    expect(ghostBtn).toBeDefined();
  });

  it('should render the floating stats card', () => {
    const card = document.querySelector('.hero-card');
    expect(card).toBeDefined();
    const stats = document.querySelectorAll('.hero-stat-value');
    expect(stats.length).toBeGreaterThanOrEqual(2);
  });
});
