import { Page, Locator } from '@playwright/test';

/**
 * Page Object: email config
 * Elements: 3
 */
export class EmailConfigPage {
  constructor(private page: Page) {}

  get Last_Email_Record(): Locator {
    return this.page.locator("(//td[@data-title=\"Email\"])[last()]");
  }

  get Required_Delete_Email_Button(): Locator {
    return this.page.locator("(//td[@data-title=\"Email\" and contains(text(),\"$|ExpectedEmail|\")])/..//button[2]");
  }

  get Yes_Go_ahead_Button(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"Yes, Go ahead.\")]");
  }

}