import { Page, Locator } from '@playwright/test';

export async function waitForSpinnerToDisappear(page: Page, timeout = 120_000): Promise<void> {
  const spinner = page.locator('//div[contains(@class,"spinner")]');
  await spinner.waitFor({ state: 'hidden', timeout }).catch(() => {});
}

export async function waitForPageLoad(page: Page, timeout = 60_000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
}

export async function waitForElementVisible(locator: Locator, timeout = 30_000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
}

export async function waitForElementHidden(locator: Locator, timeout = 30_000): Promise<void> {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Sets up a download handler on the page that saves downloaded files
 * to test-results/downloads/ and stores the path in vars['_lastDownloadPath'].
 * Call this BEFORE triggering any download action.
 */
export function setupDownloadHandler(page: import('@playwright/test').Page, vars: Record<string, string>): void {
  const fs = require('fs');
  const path = require('path');
  page.on('download', async (download) => {
    const dlDir = path.join('test-results', 'downloads');
    if (!fs.existsSync(dlDir)) fs.mkdirSync(dlDir, { recursive: true });
    const filePath = path.join(dlDir, download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
  });
}
