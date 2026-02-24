import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Continue Editing Button
 * Elements: 3
 */
export class ContinueEditingButtonPage {
  constructor(private page: Page) {}

  get Continue_Editing_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Continue Editing\"]]");
  }

  get header_name(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"])[5]");
  }

  get select_field_for_Base_loan_amounts(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Select\"]])[1]");
  }

}