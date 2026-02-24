import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bidrequest creation
 * Elements: 1
 */
export class BidrequestCreationPage {
  constructor(private page: Page) {}

  get Pricing_ReturnTime_Dropdown(): Locator {
    return this.page.locator("//*[@id=\"pricingReturnTimeDropdown\"]//select[contains(@class,\"form-select\")]");
  }

}