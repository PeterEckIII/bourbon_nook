import type { Page } from '@playwright/test';

// Firefox intermittently aborts a page.goto() when several parallel workers
// navigate against the same local server at once (NS_BINDING_ABORTED /
// NS_ERROR_FAILURE). Chromium doesn't exhibit this; it's environmental
// flakiness in Firefox's navigation handling under concurrent load, not a
// sign of a broken page, so a retry is the appropriate mitigation.
const TRANSIENT_NAVIGATION_ERRORS = ['NS_BINDING_ABORTED', 'NS_ERROR_FAILURE'];

export async function gotoWithRetry(page: Page, url: string, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await page.goto(url);
      return;
    } catch (error) {
      const isTransient =
        error instanceof Error &&
        TRANSIENT_NAVIGATION_ERRORS.some((code) => error.message.includes(code));
      if (!isTransient || attempt === attempts) throw error;
    }
  }
}
