import { test } from '@playwright/test';
import { gotoPractice } from '../utils/navigation';
import { CandidatePreviewPage } from '../pages/CandidatePreviewPage';
import { ExamRunnerPage } from '../pages/ExamRunnerPage';

test('@candidate speaking exam: all buttons visible (click next)', async ({ page, context }) => {
  const url = process.env.PRACTICE_SPEAKING_URL!;

  await gotoPractice(page, url);

  // Some flows land on a preview screen first.
  const preview = new CandidatePreviewPage(page);
  await preview.waitForLoaded();
  await preview.startExam();
  

  const exam = new ExamRunnerPage(page);
  await exam.waitForLoaded();

  // Validation requested: every button on the page is visible.
  await exam.expectAllButtonsVisible();

  // Move forward once (speaking flow).
  await exam.clickNextButton();

  // Re-validate visibility on the next screen.
  await exam.expectAllButtonsVisible();
});

