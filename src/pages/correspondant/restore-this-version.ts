import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Restore this version
 * Elements: 2
 */
export class RestoreThisVersionPage {
  constructor(private page: Page) {}

  get Restore_this_version(): Locator {
    return this.page.locator("//tr[contains(normalize-space(),\"3 02/28/2025 11:15 AM testsigma_internal Restore this version\")]//td[@data-title=\"Action\"]//a[text()[normalize-space() = \"Restore this version\"]]");
  }

  get Restore_this_version_2(): Locator {
    return this.page.locator("//td[@data-title=\"Action\"]/..//a[@class=\"disabled\"]");
  }

}