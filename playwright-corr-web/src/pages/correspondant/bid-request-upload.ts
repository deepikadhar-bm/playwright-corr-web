import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid request upload
 * Elements: 3
 */
export class BidRequestUploadPage {
  constructor(private page: Page) {}

  get First_Option_In_Pricing_Dropdown(): Locator {
    return this.page.locator("(//*[@id=\"pricingReturnTimeDropdown\"]//option[not(contains(text(),\"Select\"))])[1]");
  }

  get Second_Option_Pricing_Dropdown(): Locator {
    return this.page.locator("(//*[@id=\"pricingReturnTimeDropdown\"]//option[not(contains(text(),\"Select\"))])[2]");
  }

  get Third_Option_Pricing_Dropdown(): Locator {
    return this.page.locator("(//*[@id=\"pricingReturnTimeDropdown\"]//option[not(contains(text(),\"Select\"))])[3]");
  }

}