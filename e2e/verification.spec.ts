import { test, expect } from '@playwright/test';

test.describe('MCP Security Demo Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard with demo cards', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('MCP Security Demonstrations');

    // Check all demo cards are present
    await expect(page.locator('text=Safe Baseline').first()).toBeVisible();
    await expect(page.locator('text=Prompt Injection Attack')).toBeVisible();
    await expect(page.locator('text=Tool Shadowing Attack')).toBeVisible();
    await expect(page.locator('text=Data Poisoning Attack')).toBeVisible();

    // Check warning banner is present
    await expect(page.locator('text=Educational Demonstration Only')).toBeVisible();
  });

  test('should navigate to safe baseline demo', async ({ page }) => {
    await page.click('text=Safe Baseline');
    await expect(page).toHaveURL('/demos/safe-baseline');
    await expect(page.locator('h1')).toContainText('Safe Baseline Demo');
    
    // Check for chat interface
    await expect(page.locator('input[placeholder*="Type your message"]')).toBeVisible();
    
    // Check for suggested prompts
    await expect(page.locator('text=Suggested Prompts')).toBeVisible();
    
    // Check for risk explainer
    await expect(page.locator('text=Baseline Security')).toBeVisible();
  });

  test('should navigate to prompt injection demo', async ({ page }) => {
    await page.click('text=Prompt Injection Attack');
    await expect(page).toHaveURL('/demos/prompt-injection');
    await expect(page.locator('h1')).toContainText('Prompt Injection Attack');
    
    // Check for critical risk badge
    await expect(page.locator('text=CRITICAL')).toBeVisible();
    
    // Check for risk information
    await expect(page.locator('text=Potential Impacts')).toBeVisible();
    await expect(page.locator('text=How to Prevent')).toBeVisible();
  });

  test('should navigate to tool shadowing demo', async ({ page }) => {
    await page.click('text=Tool Shadowing Attack');
    await expect(page).toHaveURL('/demos/tool-shadowing');
    await expect(page.locator('h1')).toContainText('Tool Shadowing Attack');
  });

  test('should navigate to data poisoning demo', async ({ page }) => {
    await page.click('text=Data Poisoning Attack');
    await expect(page).toHaveURL('/demos/data-poisoning');
    await expect(page.locator('h1')).toContainText('Data Poisoning Attack');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.click('text=Learn more about MCP security');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About MCP Security');
    
    // Check for key sections
    await expect(page.locator('text=What is the Model Context Protocol?')).toBeVisible();
    await expect(page.locator('text=Key Security Vulnerabilities')).toBeVisible();
    await expect(page.locator('text=Security Best Practices')).toBeVisible();
  });

  test('should have working back navigation', async ({ page }) => {
    await page.click('text=Safe Baseline');
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/');
  });

  test('chat interface should have reset button', async ({ page }) => {
    await page.click('text=Safe Baseline');
    
    // Check for reset button
    const resetButton = page.locator('button[aria-label="Reset"], button:has-text("Reset")').or(
      page.locator('button').filter({ has: page.locator('svg') }).nth(1)
    );
    await expect(resetButton).toBeVisible();
  });

  test('suggested prompts should be clickable', async ({ page }) => {
    await page.click('text=Safe Baseline');
    
    // Check that suggested prompts section exists
    await expect(page.locator('text=Suggested Prompts')).toBeVisible();
    
    // Check that at least one prompt button exists
    const promptButtons = page.locator('button').filter({ hasText: /vacation|leave|letter/i });
    await expect(promptButtons.first()).toBeVisible();
  });

  test('all demo pages should have risk level badges', async ({ page }) => {
    const demos = [
      { link: 'Safe Baseline', badge: 'LOW' },
      { link: 'Prompt Injection Attack', badge: 'CRITICAL' },
      { link: 'Tool Shadowing Attack', badge: 'CRITICAL' },
      { link: 'Data Poisoning Attack', badge: 'CRITICAL' },
    ];

    for (const demo of demos) {
      await page.goto('/');
      await page.click(`text=${demo.link}`);
      await expect(page.locator(`text=${demo.badge}`).first()).toBeVisible();
    }
  });

  test('should display security indicators on dashboard cards', async ({ page }) => {
    // Check that risk badges are visible on dashboard
    await expect(page.locator('text=LOW')).toBeVisible();
    await expect(page.locator('text=CRITICAL').first()).toBeVisible();
  });
});
