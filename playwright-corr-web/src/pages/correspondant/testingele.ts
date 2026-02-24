import { Page, Locator } from '@playwright/test';

/**
 * Page Object: testingele
 * Elements: 1
 */
export class TestingelePage {
  constructor(private page: Page) {}

  get Testing_element(): Locator {
    return this.page.locator("(//span[text()=''Display Name']/../../../..//input[@type=\"text\"])[2]");
  }

}