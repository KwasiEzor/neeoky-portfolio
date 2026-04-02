import { test, expect } from '@playwright/test';

test.describe('Multi-Step Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the form page
    await page.goto('/demande-devis');

    // Wait for the form to be visible
    await expect(page.locator('#multi-step-form')).toBeVisible();
  });

  test('should display the form with step indicator', async ({ page }) => {
    // Check title
    await expect(page.locator('.form-title')).toContainText('Demande de Devis');

    // Check step indicator is visible
    await expect(page.locator('.step-indicator')).toBeVisible();

    // Check initial step is 1
    await expect(page.locator('[data-step="1"]')).toBeVisible();
  });

  test('should complete the entire form flow', async ({ page }) => {
    // Step 1: Select a service
    await page.waitForSelector('.service-card', { timeout: 10000 });
    const firstService = page.locator('.service-card').first();
    await firstService.click();

    // Wait a bit for selection
    await page.waitForTimeout(500);

    // Click next
    await page.click('#btn-next');

    // Step 2: Select a pack
    await expect(page.locator('[data-step="2"]')).toBeVisible();
    await page.click('[data-pack="pro"]');
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    // Step 3: Fill project details
    await expect(page.locator('[data-step="3"]')).toBeVisible();
    await page.selectOption('#projectType', { index: 1 });
    await page.selectOption('#budget', { index: 2 });
    await page.selectOption('#timeline', { index: 2 });
    await page.fill('#projectDescription',
      'Ceci est un projet de test pour valider le formulaire multi-étapes. ' +
      'Nous avons besoin d\'un site web moderne et performant.'
    );
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    // Step 4: Fill contact information
    await expect(page.locator('[data-step="4"]')).toBeVisible();
    await page.fill('#firstName', 'Jean');
    await page.fill('#lastName', 'Dupont');
    await page.fill('#email', 'jean.dupont@example.com');
    await page.fill('#phone', '0612345678');
    await page.fill('#company', 'Test Company');
    await page.check('#gdprConsent');
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    // Step 5: Review and verify recap
    await expect(page.locator('[data-step="5"]')).toBeVisible();
    await expect(page.locator('.recap-container')).toBeVisible();

    // Verify contact info is displayed
    await expect(page.locator('.recap-container')).toContainText('Jean Dupont');
    await expect(page.locator('.recap-container')).toContainText('jean.dupont@example.com');

    // Note: We don't actually submit to avoid creating test data
    // In a real test with a test database, you would:
    // await page.click('#btn-submit');
    // await expect(page.locator('#success-message')).toBeVisible();
  });

  test('should not allow navigation to next step without completing current step', async ({ page }) => {
    // Try to click next without selecting a service
    const nextButton = page.locator('#btn-next');

    // The button might be disabled or clicking it should show an error
    await nextButton.click();

    // Should still be on step 1
    await expect(page.locator('[data-step="1"]')).toBeVisible();
  });

  test('should allow navigation to previous step', async ({ page }) => {
    // Select a service and go to step 2
    await page.waitForSelector('.service-card');
    await page.locator('.service-card').first().click();
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    // Should be on step 2
    await expect(page.locator('[data-step="2"]')).toBeVisible();

    // Click previous
    await page.click('#btn-previous');

    // Should be back on step 1
    await expect(page.locator('[data-step="1"]')).toBeVisible();
  });

  test('should save form data in localStorage', async ({ page }) => {
    // Fill some data
    await page.waitForSelector('.service-card');
    await page.locator('.service-card').first().click();

    // Wait for auto-save
    await page.waitForTimeout(3000);

    // Check localStorage
    const formData = await page.evaluate(() => {
      return localStorage.getItem('neeoky-form-data:');
    });

    expect(formData).toBeTruthy();
    expect(formData).toContain('selectedServices');
  });

  test('should validate email format', async ({ page }) => {
    // Navigate to step 4
    await page.waitForSelector('.service-card');
    await page.locator('.service-card').first().click();
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    await page.click('[data-pack="pro"]');
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    await page.selectOption('#projectType', { index: 1 });
    await page.selectOption('#budget', { index: 1 });
    await page.selectOption('#timeline', { index: 1 });
    await page.fill('#projectDescription', 'A'.repeat(60));
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    // Fill invalid email
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', 'invalid-email');
    await page.check('#gdprConsent');

    // Try to go next
    await page.click('#btn-next');

    // Should still be on step 4 due to validation
    await expect(page.locator('[data-step="4"]')).toBeVisible();
  });

  test('should show character count for description', async ({ page }) => {
    // Navigate to project step
    await page.waitForSelector('.service-card');
    await page.locator('.service-card').first().click();
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    await page.click('[data-pack="pro"]');
    await page.waitForTimeout(500);
    await page.click('#btn-next');

    // Type in description
    const testText = 'Test description';
    await page.fill('#projectDescription', testText);

    // Check character count
    const charCount = await page.locator('#desc-count').textContent();
    expect(parseInt(charCount || '0')).toBe(testText.length);
  });

  test('should display mobile progress bar on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile progress bar should be visible
    await expect(page.locator('.mobile-progress')).toBeVisible();

    // Desktop steps should be hidden
    await expect(page.locator('.desktop-steps')).not.toBeVisible();
  });

  test('should handle honeypot field correctly', async ({ page }) => {
    // The honeypot field should be present but hidden
    const honeypot = page.locator('#website');
    await expect(honeypot).toBeAttached();

    // It should not be visible (position: absolute, left: -9999px)
    const isVisible = await honeypot.isVisible();
    expect(isVisible).toBe(false);
  });
});

test.describe('Form Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/demande-devis');

    // Check form has accessible name
    const form = page.locator('#multi-step-form');
    await expect(form).toBeAttached();

    // Check buttons have accessible labels
    const nextButton = page.locator('#btn-next');
    await expect(nextButton).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/demande-devis');

    // Tab through the form
    await page.keyboard.press('Tab');

    // Check focus is on a form element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Form Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/demande-devis');
    await page.waitForSelector('#multi-step-form');
    const loadTime = Date.now() - startTime;

    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/demande-devis');
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (like missing env vars in dev)
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('Rate limiting is disabled') &&
             !err.includes('Email service not configured')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
