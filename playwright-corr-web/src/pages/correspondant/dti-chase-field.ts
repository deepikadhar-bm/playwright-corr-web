import { Page, Locator } from '@playwright/test';

/**
 * Page Object: DTI Chase Field
 * Elements: 1
 */
export class DtiChaseFieldPage {
  constructor(private page: Page) {}

  get DTI_Chase_Field(): Locator {
    return this.page.locator("(//table/tr/td)[1]");
  }

}