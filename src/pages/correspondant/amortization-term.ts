import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Amortization Term
 * Elements: 2
 */
export class AmortizationTermPage {
  constructor(private page: Page) {}

  get Chase_Field_Name(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[3]");
  }

  get Bid_Sample_Field_in_Alert_Pop_Up(): Locator {
    return this.page.locator("//td[text()[normalize-space() = \"Appraised Value\"]]/following-sibling::td//div[text()[normalize-space() = \"Amortization Term\"]]");
  }

}