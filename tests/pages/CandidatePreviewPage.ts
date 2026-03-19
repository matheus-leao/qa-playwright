import { expect, type Locator, type Page } from '@playwright/test';

export class CandidatePreviewPage {
  readonly page: Page;
  readonly startOrResumeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startOrResumeButton = page.getByText(/Start Assessment/i);
  }

  async waitForLoaded() {
    await expect(this.startOrResumeButton).toBeVisible();
  }

  async startExam() {
    await this.startOrResumeButton.click();
  }
}
