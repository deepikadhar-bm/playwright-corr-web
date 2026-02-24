import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Bid Upload page
 * Elements: 2
 */
export class BidUploadPagePage {
  constructor(private page: Page) {}

  get Fifth_Option_Pricing_Dropdown(): Locator {
    return this.page.locator("(//*[@id=\"pricingReturnTimeDropdown\"]//option[not(contains(text(),\"Select\"))])[5]");
  }

  get Fourth_OptionPricing_Dropdown(): Locator {
    return this.page.locator("(//*[@id=\"pricingReturnTimeDropdown\"]//option[not(contains(text(),\"Select\"))])[4]");
  }

}