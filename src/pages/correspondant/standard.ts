import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Standard
 * Elements: 1
 */
export class StandardPage {
  constructor(private page: Page) {}

  get Standard_Execution_Checkbox(): Locator {
    return this.page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]");
  }

}