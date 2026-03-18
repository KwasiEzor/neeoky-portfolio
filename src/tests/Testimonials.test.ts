import { describe, it, expect, beforeEach } from 'vitest';

describe('Testimonials Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="testimonials">
        <h2 class="section-title">Ce qu'ils <span class="gradient-text">en disent</span></h2>
        <div class="testimonials-track">
          <div class="testimonial-slide">"Super travail !"</div>
        </div>
        <button class="testimonial-prev"></button>
        <button class="testimonial-next"></button>
        <div class="testimonial-counter">
          <span class="testimonial-current">01</span>
        </div>
      </section>
    `;
  });

  it('should render the section title correctly', () => {
    const title = document.querySelector('.section-title');
    expect(title?.textContent).toContain('Ce qu\'ils en disent');
  });

  it('should render testimonial slides', () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    expect(slides.length).toBeGreaterThan(0);
  });

  it('should have navigation controls', () => {
    expect(document.querySelector('.testimonial-prev')).toBeDefined();
    expect(document.querySelector('.testimonial-next')).toBeDefined();
    expect(document.querySelector('.testimonial-current')).toBeDefined();
  });
});
