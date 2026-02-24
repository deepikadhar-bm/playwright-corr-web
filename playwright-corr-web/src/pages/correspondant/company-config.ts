import { Page, Locator } from '@playwright/test';

/**
 * Page Object: company config
 * Elements: 1
 */
export class CompanyConfigPage {
  constructor(private page: Page) {}

  get Company_Name_InputCompany_Config(): Locator {
    return this.page.locator("//input[@aria-label=\"Company Name\"]");
  }

}