# QA Playwright - TR

End-to-end test automation for TR candidate exam flows using Playwright.

## What this project covers

- Practice exam navigation through deeplink URLs
- Writing flow validation (filling responses)
- Speaking flow validation (recording UI availability)
- Cross-browser execution (`chromium` and `webkit`)

## Tech stack

- Node.js
- [Playwright Test](https://playwright.dev/)
- TypeScript
- `dotenv` for environment configuration

## Project structure

- `tests/pages/`: page objects used by specs (for example `ExamRunnerPage`)
- `tests/utils/`: shared helpers (for example navigation helpers)
- `tests/writing-exam/`: writing-related specs
- `tests/speaking-exam/`: speaking-related specs
- `playwright.config.ts`: global test configuration and projects

## Prerequisites

- Node.js 18+ (recommended LTS)
- npm
- Access to valid TR practice deeplinks

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file at the project root with your test URLs:

```env
BASE_URL=https://admin.testreach.com
PRACTICE_PREVIEW_URL=<your-practice-preview-deeplink>
PRACTICE_WRITING_URL=<your-practice-writing-deeplink>
PRACTICE_SPEAKING_URL=<your-practice-speaking-deeplink>
```

> Keep `.env` local only. It is already ignored by Git.

3. Install Playwright browser binaries (first run only):

```bash
npx playwright install
```

## Running tests

- Run all tests:

```bash
npm test
```

- Run only `@practice` tests on Chromium:

```bash
npm run test:practice
```

- Run a single spec:

```bash
npx playwright test tests/writing-exam/practice-writing.spec.ts --project=chromium
```

- Open HTML report after execution:

```bash
npx playwright show-report
```

## Configuration notes

Current `playwright.config.ts` behavior:

- `testDir` is `./tests`
- Artifacts are saved in `test-results`
- Screenshots/videos are kept on failure
- Trace is recorded on first retry
- CI uses retries and a single worker
- `baseURL` comes from `BASE_URL`

## Best practices for this project

### 1) Keep tests deterministic

- Avoid fixed sleeps (`waitForTimeout`) unless absolutely necessary
- Prefer waiting for visible/interactive states with Playwright `expect`
- Use stable URL/state assertions before acting on page elements

### 2) Keep page objects focused

- Put selectors and reusable actions in page objects under `tests/pages/`
- Keep assertions about business behavior in specs
- Expose semantic methods (`startExam`, `clickNextButton`) instead of raw selectors

### 3) Use environment variables for dynamic data

- Keep deeplinks and environment-specific values in `.env`
- Do not hardcode URLs in test files
- Fail early with clear messages when required env vars are missing

### 4) Tag and scope tests intentionally

- Keep tags like `@practice` on relevant suites for fast filtered runs
- Use targeted runs in local development to speed feedback
- Run full suites before merging changes

### 5) Make failures diagnosable

- Keep descriptive test names and assertion messages
- Leverage artifacts (`test-results`, `playwright-report`) during triage
- Prefer one clear behavioral check per step over over-broad assertions

### 6) Keep specs independent where possible

- Avoid hidden coupling across tests
- Use shared helpers for repeated setup (e.g. practice navigation)
- Use serial mode only when exam flow dependencies require it

### 7) Maintain locator resilience

- Prefer role-based, accessible locators (`getByRole`) when possible
- Avoid brittle CSS selectors tied to styling-only classes
- Centralize locator changes in page objects to minimize maintenance

## Recommended next improvements

- Replace any remaining hardcoded deeplink values with `process.env` usage
- Add CI workflow (GitHub Actions/Azure DevOps) for scheduled and PR runs
- Add lint/format scripts for consistent TypeScript and test style
- Consider separate scripts for speaking vs writing suites

## Troubleshooting

- **Tests fail on URL/navigation**
  - Check deeplink validity and `.env` values
  - Confirm network/VPN access to the target environment

- **Speaking test unstable in headless/CI**
  - Validate browser permissions and media constraints
  - Keep assertions focused on recorder UI presence unless full audio capture is required

- **No report found**
  - Run tests first, then `npx playwright show-report`

## Useful commands reference

```bash
npm test
npm run test:practice
npx playwright test --project=webkit
npx playwright test -g "@practice"
npx playwright show-report
```
