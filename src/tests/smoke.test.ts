import { describe, it, expect } from 'vitest';

describe('Astro Project Smoke Test', () => {
  it('should pass if the testing environment is correctly set up', () => {
    const message = 'Hello, neeoky!';
    expect(message).toBe('Hello, neeoky!');
  });

  it('should have access to the document via jsdom', () => {
    document.body.innerHTML = '<div id="test">Astro Migration</div>';
    const element = document.getElementById('test');
    expect(element?.textContent).toBe('Astro Migration');
  });
});
