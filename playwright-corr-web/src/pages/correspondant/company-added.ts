import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Company added.
 * Elements: 2
 */
export class CompanyAddedPage {
  constructor(private page: Page) {}

  get Company_added(): Locator {
    return this.page.locator("(//a[text()[normalize-space() = \"+2\"]])[1]");
  }

  get Disable_Company_Name(): Locator {
    return this.page.locator("(//span[@aria-label=\"$|CompanyName|\"])[1]");
  }

}