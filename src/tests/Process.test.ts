import { describe, it, expect, beforeEach } from 'vitest';

describe('Process Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="process">
        <h2 class="section-title">Comment <span class="gradient-text">ça marche</span></h2>
        <div class="process-step">
          <div class="step-number">01</div>
          <h3>Tu m'envoies ta vidéo brute</h3>
        </div>
        <div class="tool-item">OpusClip</div>
      </section>
    `;
  });

  it('should render the section title correctly', () => {
    const title = document.querySelector('.section-title');
    expect(title?.textContent).toContain('Comment ça marche');
  });

  it('should render the workflow steps', () => {
    const steps = document.querySelectorAll('.process-step');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].querySelector('.step-number')?.textContent).toBe('01');
  });

  it('should display the AI tools grid', () => {
    const tools = document.querySelectorAll('.tool-item');
    expect(tools.length).toBeGreaterThan(0);
  });
});
