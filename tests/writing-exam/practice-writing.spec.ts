import { test, expect } from '@playwright/test';
import { gotoPractice } from '../utils/navigation';
import { CandidatePreviewPage } from '../pages/CandidatePreviewPage';
import { ExamRunnerPage } from '../pages/ExamRunnerPage';

test.describe('@practice writing', () => {
  test.describe.configure({ mode: 'serial' });

  test('can open practice exam and enter writing response', async ({ page }) => {
    const url = process.env.PRACTICE_WRITING_URL ?? process.env.PRACTICE_PREVIEW_URL;

    await gotoPractice(page, url!);

    // The deeplink may land on preview first.
    if (/\/web\/candidate\/exam\/preview/i.test(page.url())) {
      const preview = new CandidatePreviewPage(page);
      await preview.waitForLoaded();
      await preview.startExam();
    }

    
    const exam = new ExamRunnerPage(page);
    await exam.clickNextButton();
    await exam.waitForLoaded();

    // Fill 4 writing questions and assert each was entered.
    const answers = Array.from({ length: 4 }, (_, i) => `E2E writing answer Q${i + 1}`);
    const writingTextareas = exam.writingResponseTextareas();
    await expect(writingTextareas.first()).toBeVisible();

    // Some SPAs render question inputs progressively; wait a bit for all 4.
    const deadline = Date.now() + 10_000;
    let writingCount = await writingTextareas.count();
    while (writingCount < 4 && Date.now() < deadline) {
      await page.waitForTimeout(250);
      writingCount = await writingTextareas.count();
    }

    if (writingCount >= 4) {
      for (let i = 0; i < 4; i++) {
        const box = writingTextareas.nth(i);
        await expect(box).toBeVisible();
        await box.fill(answers[i]);
      }
    } else {
      // Fallback: UI might be one question per step (single textbox that changes per "Next").
      for (let i = 0; i < 4; i++) {
        await exam.answerWriting(answers[i]);
        if (i < 3) {
          await exam.clickNextButton();
          await exam.awaitUntillNextButtonIsVisible();
        }
      }
    }

    await exam.awaitUntillNextButtonIsVisible();
  });
});

