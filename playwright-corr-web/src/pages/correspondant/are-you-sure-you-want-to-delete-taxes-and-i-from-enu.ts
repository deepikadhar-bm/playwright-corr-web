import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Are you sure you want to delete Taxes and I from enu
 * Elements: 1
 */
export class AreYouSureYouWantToDeleteTaxesAndIFromEnuPage {
  constructor(private page: Page) {}

  get Are_you_sure_you_want_to_delete_Taxes_and_I_from_enu(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"This action cannot be undone\"]]/..");
  }

}