import { type Page } from '@playwright/test';

export async function gotoPractice(page: Page, url: string) {
  // Deeplinks often 302/SPA-hop; wait for the page to settle.
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {
    // Some SPAs keep long-polling; don't fail on networkidle.
  });
}
