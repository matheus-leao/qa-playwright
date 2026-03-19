import { expect, type Locator, type Page } from '@playwright/test';

export class ExamRunnerPage {
  readonly page: Page;
  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly questionListButton: Locator;
  readonly infoButton: Locator;
  readonly acessibilityButton: Locator;
  readonly startRecordingButton: Locator;
  readonly finishRecordingButton: Locator;
  
  
  constructor(page: Page) {
    this.page = page;
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.submitButton = page.getByRole('button', { name: /submit|finish|end/i });
    this.questionListButton = page.locator('.menu-container button').first();
    this.infoButton = page.locator('.menu-container button').nth(1);
    this.acessibilityButton = page.locator('.menu-container button').nth(2);
    this.startRecordingButton = page.getByRole('button', { name: /Recording/i });
    this.finishRecordingButton = page.getByRole('button', { name: /Finish Recording/i });
  }

  async waitForLoaded() {
    await expect(this.page).toHaveURL(/\/web\/candidate/i);
  }

  async expectAllButtonsVisible() {
    // Verify all buttons are visible
    await this.verifyQuestionListIsVisible();
    await this.verifyInfoIsVisible();
    await this.verifyAccessibilityIsVisible();
  }

  writingResponseTextarea(): Locator {
    // Prefer accessible textbox; fallback to textarea
    const textbox = this.page.getByRole('textbox').first();
    return textbox;
  }

  writingResponseTextareas(): Locator {
    // Writing questions are expected to be represented by textboxes.
    // This locator intentionally returns *all* matching textboxes so tests can fill multiple questions.
    return this.page.locator('div.ql-editor');
  }

  writingResponseTextareaAt(index: number): Locator {
    return this.writingResponseTextareas().nth(index);
  }

  recordButton(): Locator {
    // Common labels in speaking UIs
    return this.page.getByRole('button', { name: /record|start recording|start|mic|microphone/i }).first();
  }

  stopButton(): Locator {
    return this.page.getByRole('button', { name: /stop|stop recording|pause/i }).first();
  }

  async answerWriting(text: string) {
    const box = this.writingResponseTextarea();
    await expect(box).toBeVisible();
    await box.fill(text);
    await expect(box).toHaveValue(text);
  }

  async answerSpeakingMinimal() {
    // Keep this minimal (stability + speed). Many apps won't allow real microphone
    // in CI/headless; we treat "record UI is present" as the critical validation.
    const record = this.recordButton();
    await expect(record).toBeVisible();
  }

  async awaitUntillNextButtonIsVisible(){
    await expect(this.nextButton, { message: 'Next button not visible' }).toBeVisible({ timeout: 60_000 });
  }

  async clickNextButton(){
    await this.nextButton.click();
  }

  async clickSubmitButton(){
    await this.submitButton.click();
  }

  async verifyQuestionListIsVisible(){
    await expect(this.questionListButton).toBeVisible();
  }

  async verifyInfoIsVisible(){
    await expect(this.infoButton).toBeVisible();
  }

  async verifyAccessibilityIsVisible(){
    await expect(this.acessibilityButton).toBeVisible();  
  }

  async awaitUntillRecordingStart(){
    await expect(this.startRecordingButton, { message: 'Recording button not visible' }).toBeVisible({ timeout: 60_000 });
  }

  async awaitUntillRecordingFinish(){
    await expect(this.finishRecordingButton, { message: 'Finish recording button not visible' }).toBeVisible({ timeout: 60_000 });
  }

}
