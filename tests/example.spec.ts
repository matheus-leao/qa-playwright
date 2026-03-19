import { test, expect } from '@playwright/test';

test('sanity: playwright runner works', async ({ page }) => {
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Playwright/);
});
