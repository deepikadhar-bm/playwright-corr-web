import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Coorespondent
 * Elements: 1
 */
export class CoorespondentPage {
  constructor(private page: Page) {}

  get Last_Batch(): Locator {
    return this.page.locator("(//div[contains(@class,\"card rounded-3\")])[last()]");
  }

}