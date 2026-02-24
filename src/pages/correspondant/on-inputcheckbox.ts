import { Page, Locator } from '@playwright/test';

/**
 * Page Object: on inputCheckbox
 * Elements: 2
 */
export class OnInputcheckboxPage {
  constructor(private page: Page) {}

  get on_inputCheckbox(): Locator {
    return this.page.locator("(//input[@class=\"text-primary pointer\"])[21]");
  }

  get on_inputCheckbox1(): Locator {
    return this.page.locator("(//input[@class=\"text-primary pointer\"])[22]");
  }

}