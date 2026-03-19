import { test, expect } from '@playwright/test';
import { gotoPractice } from '../utils/navigation';
import { CandidatePreviewPage } from '../pages/CandidatePreviewPage';
import { ExamRunnerPage } from '../pages/ExamRunnerPage';

test.describe('@practice speaking', () => {
  test.describe.configure({ mode: 'serial' });

  test('can open practice exam and see speaking recorder UI', async ({ page, context }) => {
    const url = 'https://admin.testreach.com/rest/auth-service/v1/deeplinks/987654789472/practice';
    expect(url, 'Set PRACTICE_SPEAKING_URL (or PRACTICE_PREVIEW_URL) in env').toBeTruthy();

    await gotoPractice(page, url!);

    const preview = new CandidatePreviewPage(page);
    await preview.waitForLoaded();
    await preview.startExam();

    await page.waitForLoadState('networkidle');

    const exam = new ExamRunnerPage(page);
    await exam.waitForLoaded();

    // Critical validation: speaking UI is present (record button visible).
    //await exam.answerSpeakingMinimal();

    await exam.awaitUntillNextButtonIsVisible();
    await exam.clickNextButton();

    await exam.awaitUntillRecordingStart();

    await exam.awaitUntillRecordingFinish();
  });
});
