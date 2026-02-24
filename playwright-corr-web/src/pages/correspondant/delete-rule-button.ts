import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete Rule Button
 * Elements: 1
 */
export class DeleteRuleButtonPage {
  constructor(private page: Page) {}

  get Delete_Rule_Button(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[2]");
  }

}