import { Page, Locator } from '@playwright/test';

/**
 * Page Object: tesleme
 * Elements: 1
 */
export class TeslemePage {
  constructor(private page: Page) {}

  get testelem(): Locator {
    return this.page.locator("(//span[text()=''Display Name']/../../../..//input[@type=\"text\"])[2]");
  }

}