import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Amortization Type
 * Elements: 6
 */
export class AmortizationTypePage {
  constructor(private page: Page) {}

  get Chase_Field_Name(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[13]");
  }

  get All_Header_Checkbox_In_Bid_Map(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[$|Count|]");
  }

  get Amortization_Type(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Amortization Type\"]])[1]");
  }

  get Chase_Field_Name_in_Header_Mapping(): Locator {
    return this.page.locator("(//option[@value=\"search.criteria.mortgageTypes\"])[1]/..");
  }

  get FTHB_Waiver(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"FTHB Waiver\"]])[1]");
  }

  get When_Bid_Field_in_ImportRule(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[2]");
  }

}